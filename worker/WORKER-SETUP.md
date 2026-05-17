# Atlantis Manager — Production setup (~10 min)

The floating chat widget on the site talks to a Cloudflare Worker that
holds your Anthropic API key and forwards requests. The key never reaches
the browser. This worker is **hardened for public production use** —
follow every step below before going live.

## ⚠ STEP 0 — Set an Anthropic-side monthly spending cap (MANDATORY)

This is the **only absolute** ceiling on your spend. Every other layer in
this worker is best-effort defense. The Anthropic cap is the hard one.

1. Open [console.anthropic.com](https://console.anthropic.com/)
2. Settings → Limits → Monthly usage limit
3. Set to a value you can afford to lose (recommended: **$25–50/month**
   for a planning-phase site)
4. Save

If anything goes wrong, your spend stops at that number. **Do not skip
this step.**

## STEP 1 — Deploy the Worker

```bash
# From the repo root
cd worker

# One-time: log into Cloudflare via Wrangler
npx wrangler login

# Store your Anthropic key as a Cloudflare secret (encrypted, not in the repo)
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your sk-ant-... when prompted

# Deploy
npx wrangler deploy
```

Output shows a URL like:

```
https://atlantis-manager.YOUR-SUBDOMAIN.workers.dev
```

Copy it.

## STEP 2 — Wire the worker URL into the site

In every HTML page that uses the widget (`index.html`, `build.html`,
`workflows.html`, `wiki.html`), add this line inside `<head>`:

```html
<meta name="atlantis-manager-worker" content="https://atlantis-manager.YOUR-SUBDOMAIN.workers.dev">
```

Reload the site. The chat pill should now respond.

## STEP 3 — Verify the safety rails are active

Open the live site and try these from the widget:

| Test | Expected response |
|---|---|
| Send 1 normal message | Reply within a few seconds |
| Send 5 messages in 10 seconds | After 3, you get "Rate limit exceeded. Slow down…" |
| Try to send a 5,000-character message | "messages[…].content too long" error |
| Keep chatting past 20 messages | "Conversation too long. Start a new conversation." |

If any of these don't work, the worker isn't fully deployed or the
rate-limit binding isn't bound — re-run `npx wrangler deploy` and check
`npx wrangler tail` for errors.

---

# How to pause the Manager instantly

If you ever see abuse, or just want to take the chat offline:

```bash
cd worker
npx wrangler secret put MANAGER_DISABLED
# Paste: true

npx wrangler deploy
```

The worker now returns 503 to every request and **makes zero Anthropic
calls**. Spend stops immediately. The widget on every page renders a
"Manager is paused" banner; the rest of the site continues working.

To resume:

```bash
# Delete the secret (or set it to anything other than "true")
npx wrangler secret delete MANAGER_DISABLED
npx wrangler deploy
```

To take the worker offline entirely:

```bash
npx wrangler delete
```

To rotate a leaked or burning-too-fast API key:

```bash
# Generate a new key in console.anthropic.com, then:
npx wrangler secret put ANTHROPIC_API_KEY
# Paste the new key
npx wrangler deploy
# Old key revoke happens in console.anthropic.com
```

---

# The defense layers (top to bottom)

These are all active when the worker is deployed with the config in
`wrangler.toml` and the secrets above.

| Layer | What it does | Where it's configured |
|---|---|---|
| **0. Anthropic monthly cap** | Absolute spend ceiling — nothing can exceed it | console.anthropic.com (Step 0 above) |
| **1. KILL_SWITCH (`MANAGER_DISABLED`)** | Worker returns 503 immediately; zero upstream calls | `wrangler secret put MANAGER_DISABLED` |
| **2. Per-IP rate limit** | 3 requests per 10 seconds per IP (Cloudflare binding, free) | `wrangler.toml` `[[ratelimits]]` |
| **3. Origin allowlist** | Server-side check against `ALLOWED_ORIGINS` | top of `atlantis-manager-worker.js` |
| **4. Body size cap** | 8 KB per request | `LIMITS.maxBodyBytes` |
| **5. Per-message size cap** | 2,000 characters per message | `LIMITS.maxPerMessageChars` |
| **6. Conversation length cap** | 20 messages max per request | `LIMITS.maxMessages` |
| **7. Output token cap** | 1,024 tokens max per response | `LIMITS.hardCapMaxTokens` |
| **8. Model allowlist** | Only Sonnet 4.6 + Haiku 4.5; Opus is blocked by default | `ALLOWED_MODELS` |
| **9. Role validation** | Only `user`/`assistant` in messages — no smuggled `system` | message loop |
| **10. CORS** | Browser enforcement against the allowlist | `corsHeaders` |

## Cost ceiling math

Worst-case attacker, abusing the rate limit:
- 3 requests / 10 sec = 18 / min = 1,080 / hour
- Each request: ~1,024 output tokens + ~2 KB input
- On Sonnet 4.6 with prompt caching: ~**$0.005–0.01 per request**
- Worst case: ~**$5–10 / hour** per IP
- After ~3–5 hours of sustained attack: Anthropic monthly cap trips → spend stops

Combined with the Anthropic-side cap (Step 0), your total monthly exposure
is whatever you set there — typically $25–50.

## Cost ceiling math (legitimate use)

Normal visitor having a 10-message conversation:
- 10 requests × ~$0.008 each = **$0.08 per conversation**
- 100 conversations/month = **~$8/month**

You can afford a lot of legitimate use before the cap matters.

---

# Tuning the limits

Edit `atlantis-manager-worker.js` (`LIMITS` object) for tighter or looser
caps, then re-deploy. Common adjustments:

- **More restrictive** for a high-traffic launch:
  ```js
  maxMessages: 10,
  hardCapMaxTokens: 512,
  ```
- **Looser** for an internal demo with trusted users:
  ```js
  maxMessages: 40,
  hardCapMaxTokens: 2048,
  ```
- **Add Opus 4.7** to the model allowlist (warning: ~5x cost):
  ```js
  const ALLOWED_MODELS = [
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
    'claude-opus-4-7',
  ];
  ```

For per-minute or per-hour limits, edit the `[[ratelimits]]` block in
`wrangler.toml`. The Cloudflare binding supports `period` values of
`10` or `60` seconds.

---

# Monitoring

```bash
# Live logs (status codes, upstream bytes, errors — no request bodies)
npx wrangler tail

# Dashboard analytics
# https://dash.cloudflare.com/ → Workers & Pages → atlantis-manager
```

Anthropic-side usage:
- [console.anthropic.com](https://console.anthropic.com/) → Usage

---

# Allowed origins (CORS)

The worker only accepts requests from a known list, set at the top of
`atlantis-manager-worker.js`:

```js
const ALLOWED_ORIGINS = [
  'https://hadu610.github.io',
  'http://localhost:8000',
  'http://localhost:5500',
  'http://127.0.0.1:8000',
];
```

If you add a custom domain, append it and re-deploy:

```bash
npx wrangler deploy
```

---

# Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Widget says "offline" | Worker URL not in the page `<meta>` tag | Add it; reload |
| 503 from worker | KILL_SWITCH (`MANAGER_DISABLED`) is set | `wrangler secret delete MANAGER_DISABLED` + redeploy |
| 429 from worker | Rate limit hit | Wait 10 sec; reduce traffic |
| 400 "Model not allowed" | Widget sent a model not in `ALLOWED_MODELS` | Either add the model or update the widget config |
| 4xx with key error | API key invalid or revoked | Generate a new key; `wrangler secret put ANTHROPIC_API_KEY`; redeploy |
| CORS error in browser | Origin not in allowlist | Add the origin; redeploy |
| Slow first response | Cold start | Subsequent requests are fast |

---

# Spec

See [wiki/Atlantis-Manager-Playbook.md](../wiki/Atlantis-Manager-Playbook.md)
for the full Manager specification — modes, identity, tool catalogue,
failure behaviour, forbidden actions.

# Incident response

If you see abuse in real-time:

1. **Pause first, investigate after.** `wrangler secret put MANAGER_DISABLED` → `true` → deploy. Total elapsed: 30 seconds.
2. **Check Cloudflare logs.** `npx wrangler tail` shows the IP, status codes, and message counts (no bodies).
3. **Rotate the key if you suspect leakage.** Anthropic console → revoke → new key → `wrangler secret put ANTHROPIC_API_KEY`.
4. **Tighten if it recurs.** Drop `maxMessages` to 10 and `hardCapMaxTokens` to 512. Tighten the rate limit to 1 request / 10 sec.
5. **Last resort: delete.** `npx wrangler delete` removes the worker entirely.
