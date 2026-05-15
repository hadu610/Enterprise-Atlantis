# Wiki Governance

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · All humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines who can edit the Wiki, how changes are reviewed, how versions are tracked, and how the Wiki stays accurate at scale. The Wiki is the single source of truth for every agent's behaviour — its governance must therefore match the rigour of production code.

---

## 1. Who can edit

| Editor | Can author | Can promote to `Approved` | Can edit existing `Approved` pages |
|---|---|---|---|
| **Page Owner** | Yes | Yes (their own pages) | Yes |
| **Domain Expert Council member** | Yes (in their domain) | Yes (after peer review by another council member) | Yes (with audit log entry) |
| **Engineering** | Yes (platform pages) | Yes (after peer review) | Yes (platform pages only) |
| **Founders** | Yes (strategy pages) | Yes | Yes (strategy pages) |
| **Customer admin** (within their tenant) | Yes (their tenant's customisation pages only) | Yes (their tenant's pages) | Yes (their tenant's pages) |
| **Agent** | Yes (as `Draft` only) | No | No |

## 2. The edit lifecycle

Every Wiki change moves through these states:

```
Draft  →  Review  →  Approved  →  (eventually) Deprecated
```

- **Draft** — Authored but not consumed by agents. May be edited freely by the author.
- **Review** — Pull request opened against the Wiki source. At least one peer reviewer (in the same Owner group) must approve. Diff is published to the change feed.
- **Approved** — Live. Agents consume on next cache refresh.
- **Deprecated** — Retained for audit. Agents ignore.

Promotion from `Draft` to `Review` requires the [authoring checklist](Page-Template#authoring-checklist) to pass.

## 3. Version control

The Wiki is backed by a git repository. Every change is a commit with:

- Author identity (human or agent)
- Commit message following the format: `[<page-name>] <short description>`
- Timestamp
- Diff against previous version

Agents consult the **`Last reviewed`** metadata field, **not** the git commit date, when deciding whether to refresh their cache. Owners must update `Last reviewed` whenever they make a substantive change.

Trivial edits (typos, formatting) do not require updating `Last reviewed`.

## 4. Mandatory review cadences

| Page type | Review cadence | Owner action |
|---|---|---|
| `Rule` pages | Quarterly | Owner re-attests `Last reviewed` even if no change |
| `Playbook` pages | Semi-annually | Owner re-attests |
| Jurisdiction-tagged pages (HR/Legal/Finance) | At every regulation change AND quarterly | Domain Council re-attests |
| `Reference` pages | Annually | Owner re-attests |
| `Context` pages (strategic) | No fixed cadence | Founders update when strategy changes |

Pages overdue for review auto-downgrade:

- **180 days overdue:** Owner notified daily; page flagged in the change feed.
- **365 days overdue:** Page status auto-changes to `Draft`. Agents stop consuming.

## 5. Audit trail

Every Wiki action is logged with:

- Actor identity (human or agent identity)
- Page affected
- Action (`create`, `edit`, `promote`, `deprecate`, `attest`)
- Before/after diff (for edits)
- Timestamp

The audit log is **immutable**, exportable, and retained for at least seven years for compliance discovery.

## 6. Agent-authored pages

Agents may create pages with `Status: Draft` and their own identity in the `Owner` field. Within 72 hours, a human Owner must either:

1. Promote (assigning themselves as the new Owner), or
2. Reject (page is moved to `Status: Deprecated` with reviewer comments).

Drafts that are neither promoted nor rejected within 14 days are auto-deprecated.

## 7. Customer tenancy

Each customer has its own tenant-scoped portion of the Wiki at `customers/<tenant-id>/`. Tenant pages:

- Are visible only to the customer's agents and authorised admins
- Inherit from global pages but can override jurisdiction-specific rules
- Are not shared across tenants except via the [Domain Playbook Marketplace](Product-Requirements) (with explicit publishing consent)

The global Wiki (this Wiki) contains no customer-identifying content.

## 8. Conflict between Wiki and code

If an agent's code-level configuration conflicts with the Wiki, **the Wiki wins**. Engineering changes must update the Wiki page first; agent code reads the Wiki on every task. This is the inverse of the typical engineering convention — it exists because the Wiki must be the human-owned source of truth.

Exceptions: hard-coded rules (e.g. "Delete and Financial actions always require human confirmation") are encoded in both code and Wiki. The code enforces; the Wiki documents. These cannot be changed by editing the Wiki alone — they require both an engineering change and a Wiki update.

---

## Cross-references

- [Wiki Conventions](Wiki-Conventions)
- [How Agents Use This Wiki](How-Agents-Use-This-Wiki)
- [Page Template](Page-Template)
- [Action Risk Classification](Action-Risk-Classification)
