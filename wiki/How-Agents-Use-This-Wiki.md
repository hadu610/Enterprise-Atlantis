# How Agents Use This Wiki

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This is the **meta-instruction** every agent loads at the start of every task. It defines: (a) which pages an agent reads, (b) in what order, (c) how it handles conflicts and ambiguity, and (d) how it requests updates to the Wiki when it discovers a gap.

If an agent cannot resolve a task using the Wiki, it does not improvise — it escalates to a human via the [ticketing system](Product-Requirements).

---

## 1. The agent reading protocol

Every agent task follows this six-step protocol before any action is taken:

### Step 1 — Identify task context

The agent extracts from the inbound ticket:

- **Department** (HR, Finance, Sales, Dev, etc.)
- **Action class** (Read, Write, Delete, External, Financial — see [Action Risk Classification](Action-Risk-Classification))
- **Customer jurisdiction set** (from the customer profile)
- **Phased autonomy mode** of the customer (from customer config)

### Step 2 — Load the rule layer

The agent loads, in order:

1. [Wiki Conventions](Wiki-Conventions) (this layer is implicit and pre-cached)
2. [Action Risk Classification](Action-Risk-Classification)
3. [Approval Workflow Framework](Approval-Workflow-Framework)
4. [Phased Autonomy Reference](Phased-Autonomy-Reference)
5. [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)

These five pages establish the rules of engagement and **always apply**.

### Step 3 — Load the playbook layer

The agent loads its own playbook (e.g. [HR Agent Playbook](HR-Agent-Playbook)). The playbook defines:

- The agent's allowed actions
- The agent's data scope
- Decision trees for common task types
- Escalation criteria specific to the department

### Step 4 — Load the domain knowledge layer

The agent loads domain knowledge pages whose `Jurisdiction` matches the task context. The [Domain Knowledge Index](Domain-Knowledge-Index) is the entry point.

If multiple jurisdiction pages apply, the agent loads all of them and resolves conflicts via the rules in [Conflict resolution](#5-conflict-resolution) below.

### Step 5 — Load the vocabulary layer

The agent ensures it has the current [Unified Entity Model](Unified-Entity-Model) and [Glossary](Glossary). Any unfamiliar term in the task description must be resolved through the glossary before proceeding.

### Step 6 — Execute

Only after layers 1–5 are loaded does the agent begin task execution. Every action is gated by the Validation Gate Architecture defined in [Validation Gate Specifications](Validation-Gate-Specifications).

---

## 2. Which pages an agent must NOT consume

- Pages with `Status: Draft`, `Status: WIP`, or `Status: Deprecated` are **ignored during execution**.
- Pages with `Applies to: Humans only` are ignored.
- Pages with `Jurisdiction` that does not match the task context are ignored.
- Pages with `Type: Context` (strategic content) are **not** consulted during execution. They inform humans, not agents.

## 3. Page metadata is authoritative

When an agent parses a page, the metadata block is **the single source of truth** for whether the page applies. The body of the page is consumed only if the metadata permits.

If a page lacks a valid metadata block, the agent treats the page as `Status: Draft` and ignores it during execution.

## 4. Caching and freshness

- Agents cache page content for the duration of a single task.
- Between tasks, agents re-fetch pages whose `Last reviewed` date has changed.
- The Wiki publishes a change feed (`/_changes`); agents subscribe and invalidate caches accordingly.
- Maximum cache lifetime: **15 minutes**, regardless of change feed.

## 5. Conflict resolution

When two pages provide conflicting instructions, agents resolve in this priority order:

1. **Specificity wins** — a jurisdiction-specific rule beats a `Global` rule.
2. **Newer wins** — between two equally specific rules, the one with the more recent `Last reviewed` date wins.
3. **Lower autonomy wins** — when uncertain, the rule that requires more human approval is preferred.
4. **Escalate** — if a deterministic resolution is not possible, the agent escalates to a human via the ticketing system rather than guessing.

Agents log every conflict resolution decision to the step-level audit log.

## 6. Confidence thresholds

Agents declare a confidence score `0.0`–`1.0` for every output that involves judgment. Defaults:

| Action class | Minimum confidence to act |
|---|---|
| `Read` | 0.60 |
| `Write` | 0.85 |
| `External` | 0.85 |
| `Delete` | n/a — always requires human confirmation |
| `Financial` | n/a — always requires human confirmation |

If confidence falls below the threshold, the agent routes to the human approval queue with full reasoning attached. See [Confidence and Escalation Rules](Confidence-and-Escalation-Rules).

## 7. How agents request Wiki updates

When an agent encounters a gap (no page exists for a domain question, an existing page is contradictory, or a rule appears outdated):

1. Agent does **not** improvise an answer.
2. Agent files a `wiki-update` ticket via the [ticketing system](Product-Requirements). The ticket includes:
   - The task that triggered the discovery
   - The page (or absence of page) involved
   - The agent's proposed update, as a `Draft` markdown
   - The agent's identity and confidence
3. The Owner of the affected page (or the relevant Domain Expert Council) reviews the draft.
4. If approved, the page is updated and the change feed publishes the new version.
5. The agent retries the original task once the Wiki update lands.

This is the **only** path by which agent-discovered changes enter the Wiki. Direct edits by agents are not permitted in `Approved` pages.

## 8. How agents auto-update the Wiki (limited)

Agents have permission to **author** new pages under `Status: Draft` for the following content types:

- New customer onboarding outputs (industry blueprint instantiations)
- New playbook drafts based on observed patterns (must be reviewed by Owner before promotion)
- Audit summaries (e.g. weekly trust score reports)

All agent-authored pages:

- Are tagged with the agent's identity in the `Owner` field initially
- Are reassigned to a human Owner upon promotion to `Approved`
- Trigger an immediate notification to the relevant Domain Expert Council

Agents cannot modify pages they did not author, nor promote their own drafts to `Approved`.

---

## Cross-references

- [Wiki Conventions](Wiki-Conventions) — page structure and metadata format
- [Wiki Governance](Wiki-Governance) — edit approval workflow
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
