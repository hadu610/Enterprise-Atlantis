# Atlantis — The Enterprise AI Operating System

Pitch site and strategic planning repo for **Atlantis**, the AI operating system that deploys a coordinated team of specialised AI agents across every business function — HR, Finance, Marketing, Sales, Legal, Operations, and Software Development — inside a single governance, identity, and data layer.

> The first platform designed to solve all six structural barriers that have caused 80% of enterprise AI projects to fail in production.

---

## What's in this repo

| File / folder | Purpose |
|---|---|
| `index.html` | Single-page pitch site for investors and enterprise buyers |
| `wiki.html` | In-site Wiki viewer (same content humans + AI agents read) |
| `wiki.js` / `wiki.css` | Markdown renderer and viewer styles |
| `styles.css` / `script.js` | Shared design system and landing-page interactions |
| `wiki/` | Source markdown — 33 pages, the single source of truth for agents and humans |

## Viewing the site

**Recommended** — run a small local server so the Wiki viewer's `fetch()` calls work:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

The pitch site is at `/index.html`; the Wiki viewer is at `/wiki.html`.

> Opening `index.html` directly with `file://` works for the landing page but the Wiki viewer cannot
> load markdown files from a `file://` origin (browser CORS). Use the local server above, or deploy
> to GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## The Wiki — single source for humans and AI

The [`wiki/`](wiki) folder is the operational knowledge base every AI agent in Atlantis reads
before acting. Humans (developers, managers, HR, finance, legal, ops) read the same files via the
in-site viewer at `/wiki.html`. There is no parallel "for AI" vs "for humans" documentation.

The Wiki is also mirrored to the [GitHub Wiki](../../wiki) for browsing on github.com.

## Status

Strategic Plan v2.0 · May 2026 · Confidential — for internal planning and partner conversations.
