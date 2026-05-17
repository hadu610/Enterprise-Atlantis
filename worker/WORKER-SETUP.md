# Atlantis Manager — Worker setup (5 min)

The floating chat widget on the site talks to a tiny Cloudflare Worker
that holds your Anthropic API key and forwards requests. The key never
reaches the browser. This is the only safe way to call the Anthropic
API directly from a static GitHub Pages site.

## What you'll need

- A Cloudflare account (free tier is fine — workers.dev domain included).
- Your Anthropic API key (`sk-ant-...`).
- Node.js installed locally (for `npx wrangler`).

## Steps

```bash
# 1. From the repo root
cd worker

# 2. One-time: log into Cloudflare via Wrangler
npx wrangler login

# 3. Store your Anthropic key as a Cloudflare secret
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your sk-ant-... when prompted; it's stored encrypted, not in the repo.

# 4. Deploy
npx wrangler deploy
```

The output of the last command shows a URL like:

```
https://atlantis-manager.YOUR-SUBDOMAIN.workers.dev
```

Copy that URL.

## Wire the URL into the site

Two options — pick one.

### Option A — Inline `<meta>` tag on every page (recommended)

Add this line inside the `<head>` of every page that uses the widget
(`index.html`, `build.html`, `workflows.html`, `wiki.html`,
`investor-deck.html`, `customer-deck.html`):

```html
<meta name="atlantis-manager-worker" content="https://atlantis-manager.YOUR-SUBDOMAIN.workers.dev">
```

### Option B — Inline script

Before the `<script src="manager-widget.js">` tag, add:

```html
<script>
  window.ATLANTIS_MANAGER_CONFIG = {
    workerUrl: 'https://atlantis-manager.YOUR-SUBDOMAIN.workers.dev',
    model: 'claude-sonnet-4-6',      // optional; default
    maxTokens: 1024,                  // optional; default
  };
</script>
```

Reload the site. The chat pill should now respond to messages. If it
still says "Atlantis Manager is offline", check the browser console for
the worker URL it found.

## Allowed origins (CORS)

The worker only accepts requests from a known list of origins, set at
the top of `atlantis-manager-worker.js`:

```js
const ALLOWED_ORIGINS = [
  'https://hadu610.github.io',
  'http://localhost:8000',
  'http://localhost:5500',
];
```

If you serve the site from another origin (a custom domain, a different
local dev port), add it to this list and re-deploy:

```bash
npx wrangler deploy
```

## Cost expectations

- The worker itself is free up to 100k requests/day on the Cloudflare
  free tier.
- Anthropic charges per token. With prompt caching enabled (the widget
  caches the system prompt by default), a typical 5-turn conversation
  on Sonnet 4.6 costs around $0.01–$0.03. A heavy demo day with 100
  conversations is roughly $1–$3.
- The worker caps `max_tokens` at 4096 to prevent runaway responses.

## Updating the worker later

If you edit `atlantis-manager-worker.js`, re-deploy:

```bash
cd worker
npx wrangler deploy
```

The worker URL stays the same; no changes needed in the site.

## Removing or pausing

To take the chat offline temporarily:

```bash
npx wrangler delete
```

The widget will detect the missing URL and render its offline banner.
Re-deploy to bring it back.

## Troubleshooting

- **"Couldn't reach the Manager" with HTTP 4xx**: the API key is
  invalid or the model name is wrong. Re-run
  `npx wrangler secret put ANTHROPIC_API_KEY` to update.
- **HTTP 5xx**: Anthropic is having an outage, or the worker code has
  a bug. Check `npx wrangler tail` for live logs.
- **CORS error in the browser console**: your origin isn't in
  `ALLOWED_ORIGINS`. Edit the worker and re-deploy.
- **Slow first response**: cold-start the first time after deploy;
  subsequent responses are fast.

## Spec

See [wiki/Atlantis-Manager-Playbook.md](../wiki/Atlantis-Manager-Playbook.md)
for the full Manager specification, including the conversational modes,
identity model, tool registry, and forbidden behaviours.
