/*
 * Atlantis Manager — Cloudflare Worker proxy (production-hardened).
 *
 * Holds ANTHROPIC_API_KEY as a Cloudflare secret. Browser widget POSTs a
 * Claude Messages API payload; this worker validates, rate-limits, and
 * forwards. The API key never reaches the browser.
 *
 * Defense in depth (top to bottom):
 *   0. Anthropic-side monthly spending cap        ← MUST set in Anthropic console
 *   1. KILL_SWITCH (env var, instant on/off)
 *   2. Cloudflare rate limit binding (per-IP burst protection)
 *   3. Origin allowlist (defense in depth; CORS-aware)
 *   4. Body size cap (rejects large prompts)
 *   5. Per-message size cap
 *   6. Message count cap per conversation
 *   7. Output token cap
 *   8. Model allowlist
 *   9. Role validation (no smuggled system messages)
 *
 * To pause instantly: set the MANAGER_DISABLED env var to "true" in the
 * Cloudflare dashboard, OR run:
 *   npx wrangler secret put MANAGER_DISABLED
 *   (paste "true")
 * The worker returns 503 immediately and makes ZERO Anthropic calls.
 */

// === CONFIGURE THESE ===
const ALLOWED_ORIGINS = [
  'https://hadu610.github.io',
  'http://localhost:8000',
  'http://localhost:5500',
  'http://127.0.0.1:8000',
];

const ALLOWED_MODELS = [
  'claude-sonnet-4-6',
  'claude-haiku-4-5-20251001',
  // 'claude-opus-4-7' is intentionally NOT in this list — Opus tokens
  // are ~5x Sonnet. Add only if you accept the cost risk.
];

const LIMITS = {
  // Body / payload
  maxBodyBytes: 8 * 1024,          // 8 KB total request body
  maxPerMessageChars: 2000,         // each user/assistant message
  // Conversation
  maxMessages: 20,                  // total messages in a single request
  // Tokens (output)
  defaultMaxTokens: 1024,
  hardCapMaxTokens: 1024,           // cap regardless of client request
  // Costs we *want* to see in logs
  warnAtCachedSystemBytes: 16 * 1024,
};

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_VERSION = '2023-06-01';
// ========================

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return errJson('Method not allowed. Use POST.', 405, cors);
    }

    // ---------- 1. Kill switch ----------
    if (env.MANAGER_DISABLED === 'true' || env.MANAGER_DISABLED === true) {
      return errJson(
        'The Atlantis Manager is paused by the operator. The rest of the site is available; please come back later.',
        503,
        cors
      );
    }

    // ---------- 2. API key required ----------
    if (!env.ANTHROPIC_API_KEY) {
      return errJson('Server misconfigured: ANTHROPIC_API_KEY secret is not set.', 500, cors);
    }

    // ---------- 3. Origin allowlist (defense in depth) ----------
    // CORS already blocks browsers from foreign origins, but Origin can be
    // spoofed by non-browser clients — so we enforce server-side too.
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return errJson('Origin not allowed.', 403, cors);
    }
    // Empty Origin is allowed only for same-origin POSTs (no browser preflight).
    // If you want to require Origin, uncomment:
    // if (!origin) return errJson('Origin header required.', 403, cors);

    // ---------- 4. Per-IP rate limit (burst protection) ----------
    if (env.RATE_LIMITER && typeof env.RATE_LIMITER.limit === 'function') {
      const ip = request.headers.get('CF-Connecting-IP')
        || request.headers.get('X-Forwarded-For')
        || 'unknown';
      try {
        const rl = await env.RATE_LIMITER.limit({ key: ip });
        if (!rl.success) {
          return errJson(
            'Rate limit exceeded. Slow down — the Manager handles a few questions, not a flood. Wait a few seconds.',
            429,
            cors
          );
        }
      } catch (e) {
        // If the rate limiter itself errors, fail open so legit users still work.
        console.error('rate_limiter_error', String(e && e.message || e));
      }
    }

    // ---------- 5. Body size cap (cheap pre-check) ----------
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > LIMITS.maxBodyBytes) {
      return errJson(`Request too large. Max ${LIMITS.maxBodyBytes} bytes.`, 413, cors);
    }

    // ---------- 6. Parse + validate body ----------
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errJson('Invalid JSON body.', 400, cors);
    }

    if (!body || typeof body !== 'object') {
      return errJson('Body must be a JSON object.', 400, cors);
    }
    if (!body.model || typeof body.model !== 'string') {
      return errJson('Body must include "model" (string).', 400, cors);
    }
    if (!Array.isArray(body.messages)) {
      return errJson('Body must include "messages" (array).', 400, cors);
    }

    // ---------- 7. Model allowlist ----------
    if (!ALLOWED_MODELS.includes(body.model)) {
      return errJson(
        `Model not allowed. Use one of: ${ALLOWED_MODELS.join(', ')}.`,
        400,
        cors
      );
    }

    // ---------- 8. Message count + per-message size ----------
    if (body.messages.length === 0) {
      return errJson('"messages" cannot be empty.', 400, cors);
    }
    if (body.messages.length > LIMITS.maxMessages) {
      return errJson(
        `Conversation too long (>${LIMITS.maxMessages} messages). Start a new conversation.`,
        400,
        cors
      );
    }
    for (let i = 0; i < body.messages.length; i++) {
      const m = body.messages[i];
      if (!m || typeof m !== 'object') {
        return errJson(`messages[${i}] must be an object.`, 400, cors);
      }
      // 9. Role validation — only user/assistant allowed in messages array
      if (m.role !== 'user' && m.role !== 'assistant') {
        return errJson(
          `messages[${i}].role must be "user" or "assistant" (no system messages here).`,
          400,
          cors
        );
      }
      // Content is either a string or an array (per Anthropic API). Validate length.
      if (typeof m.content === 'string') {
        if (m.content.length > LIMITS.maxPerMessageChars) {
          return errJson(
            `messages[${i}].content too long (>${LIMITS.maxPerMessageChars} chars).`,
            400,
            cors
          );
        }
      } else if (Array.isArray(m.content)) {
        // Reject content blocks for now — only plain text from this widget.
        return errJson(`messages[${i}].content must be a string.`, 400, cors);
      } else {
        return errJson(`messages[${i}].content must be a string.`, 400, cors);
      }
    }

    // ---------- 10. Token cap ----------
    body.max_tokens = Math.min(
      typeof body.max_tokens === 'number' ? body.max_tokens : LIMITS.defaultMaxTokens,
      LIMITS.hardCapMaxTokens
    );

    // ---------- 11. Forward to Anthropic ----------
    try {
      const upstream = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_API_VERSION,
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify(body),
      });
      const upstreamText = await upstream.text();

      // Log only status + bytes, never bodies (PII / abuse vector).
      console.log('upstream', {
        status: upstream.status,
        bytes: upstreamText.length,
        model: body.model,
        messages: body.messages.length,
      });

      return new Response(upstreamText, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    } catch (err) {
      console.error('upstream_error', String(err && err.message || err));
      return errJson('Upstream API unavailable. Try again in a moment.', 502, cors);
    }
  },
};

// ---------- helpers ----------
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
function errJson(message, status, extra) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extra || {}) },
  });
}
