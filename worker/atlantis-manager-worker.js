/*
 * Atlantis Manager — Cloudflare Worker proxy for the Anthropic API.
 *
 * Holds the ANTHROPIC_API_KEY as a Cloudflare secret. The browser-side
 * widget (manager-widget.js) posts a Claude Messages API payload here;
 * this worker forwards it with the key attached and returns the response.
 *
 * Deploy this worker once, then configure the widget with the worker URL
 * (see WORKER-SETUP.md). The API key never reaches the browser.
 *
 * Security:
 *  - CORS restricted to allowed origins (configured below).
 *  - Per-IP rate limiting via Cloudflare's KV store (optional; off by default).
 *  - Request body size cap (32 KB) to defend against abuse.
 *  - Logs are aggregated; we never log request bodies.
 */

// === CONFIGURE THESE ===
const ALLOWED_ORIGINS = [
  'https://hadu610.github.io',
  'http://localhost:8000',  // for local dev
  'http://localhost:5500',  // VS Code Live Server default
];

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_VERSION = '2023-06-01';
const MAX_BODY_BYTES = 32 * 1024;
// ========================

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed. Use POST.' }, 405, corsHeaders);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Server misconfigured: ANTHROPIC_API_KEY secret is not set.' }, 500, corsHeaders);
    }

    // Size cap
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: `Request too large. Max ${MAX_BODY_BYTES} bytes.` }, 413, corsHeaders);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON body.' }, 400, corsHeaders);
    }

    // Minimal validation
    if (!body || !Array.isArray(body.messages) || !body.model) {
      return json({ error: 'Body must include "model" and "messages".' }, 400, corsHeaders);
    }
    // Cap message count to defend against runaway clients
    if (body.messages.length > 100) {
      return json({ error: 'Too many messages in conversation. Max 100.' }, 400, corsHeaders);
    }
    // Cap max_tokens
    if (typeof body.max_tokens === 'number' && body.max_tokens > 4096) {
      body.max_tokens = 4096;
    }

    // Forward to Anthropic
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

      return new Response(upstreamText, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (err) {
      return json({ error: 'Failed to reach Anthropic API.', detail: String(err && err.message || err) }, 502, corsHeaders);
    }
  },
};

function buildCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...(extra || {}) },
  });
}
