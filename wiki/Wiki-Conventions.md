# Wiki Conventions

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · All humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines the conventions every page in this Wiki must follow. **All agents read and respect these conventions when consuming Wiki content.** All humans must follow them when authoring or editing pages.

These conventions exist so that (a) agents can deterministically parse pages, (b) humans can navigate predictably, and (c) the Wiki can scale to thousands of pages without losing structure.

---

## 1. Every page begins with a metadata block

Every page (except `Home`, `_Sidebar`, and `_Footer`) starts with a single-line metadata blockquote immediately after the H1 title.

**Format:**

```markdown
# Page Title

> **Type:** <type> · **Owner:** <owner> · **Status:** <status> · **Applies to:** <agents> · **Jurisdiction:** <jurisdiction> · **Last reviewed:** <YYYY-MM-DD>
```

Agents parse this block before consuming the page body to decide whether the page applies to their current task.

## 2. Field values

### Type

| Value | Meaning |
|---|---|
| `Rule` | Binding constraint. Agents MUST follow. Violations block execution. |
| `Playbook` | Procedural instruction for a specific agent or task type. Agents MUST follow when their context matches. |
| `Reference` | Factual lookup data (e.g. tax rates, jurisdiction tables). Agents MAY consult; no behavioural mandate. |
| `Context` | Background / strategic information. Humans read; agents typically do not consult during execution. |
| `Template` | Copy-paste skeleton for new pages or artefacts. Not consumed by agents directly. |

### Owner

The team or council accountable for the page's correctness. Common values:

- `Engineering` — platform technical decisions
- `Founders` — strategic, business-model decisions
- `HR Domain Council` / `Finance Domain Council` / `Legal Domain Council` / etc. — domain-specific expertise
- `Customer Success` — adoption and change management
- `Security` — security policy and incident response

### Status

| Value | Meaning |
|---|---|
| `Approved` | Reviewed by Owner, in force. Agents respect. |
| `Draft` | Authored but not yet approved. Agents IGNORE in execution; humans may review. |
| `WIP` | Skeleton in progress. Not authoritative. |
| `Deprecated` | No longer in force. Kept for audit. Agents IGNORE. |

### Applies to

A comma-separated list of agents and/or audiences. Special values:

- `All agents` — every agent must respect the page
- `Humans only` — agents do not consume
- Specific agent names: `HR Agent`, `Finance Agent`, `Dev Agent`, etc.

### Jurisdiction

- `Global` — applies regardless of customer geography
- `US`, `UK`, `EU`, `CA`, etc. — applies only when the customer or workflow context matches this jurisdiction. Agents check the customer's jurisdiction set (captured in onboarding) before applying.

### Last reviewed

ISO date (`YYYY-MM-DD`) of the most recent Owner review. Pages not reviewed in **180 days** are flagged for the Owner; pages not reviewed in **365 days** auto-downgrade to `Draft` status.

---

## 3. Page filename naming

- Use **Title-Case-With-Hyphens** matching the page title as closely as possible.
- Filenames map directly to GitHub Wiki URLs.
- Examples: `HR-Agent-Playbook.md`, `Action-Risk-Classification.md`.
- Special pages: `Home.md`, `_Sidebar.md`, `_Footer.md` (underscores are GitHub Wiki convention).

## 4. Section structure within a page

Every page (except `Home` and special pages) has these sections, in order:

1. **Title** (H1)
2. **Metadata block** (blockquote)
3. **Summary** (H2) — 1 to 3 sentences answering "what is this and why does it exist"
4. **Body** — page-specific content, organised under H2/H3 headings
5. **Cross-references** (H2, optional but recommended) — bullet list of related pages

Agents stop parsing after the cross-references section.

## 5. Cross-references

Link to other pages using GitHub Wiki link syntax:

```markdown
[Action Risk Classification](Action-Risk-Classification)
```

Agents follow links during their context-gathering phase if the linked page's metadata indicates relevance.

## 6. Tone and style

- **Imperative voice** for rules and playbooks. ("Agents must…", "Do not…", "Always…")
- **Declarative voice** for references and context.
- **No marketing language** in operational pages — leave that to the [pitch site](https://hadu610.github.io/Enterprise-Atlantis/) and strategic plan pages.
- Use bullet lists and tables over paragraphs wherever the content is structurally regular.

## 7. Forbidden in operational pages

These pages **must not** contain:

- Unbounded narrative ("we believe", "we hope")
- Speculative claims without an Owner attestation
- TODO markers in `Approved` pages (use `Draft` or `WIP` status instead)
- Customer-identifying information

---

## Cross-references

- [How Agents Use This Wiki](How-Agents-Use-This-Wiki) — agent-side protocol
- [Page Template](Page-Template) — copy-paste skeleton for new pages
- [Wiki Governance](Wiki-Governance) — edit approval and version control
