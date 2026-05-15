# Approval Workflow Framework

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines how every agent-initiated action that requires human approval is routed, queued, escalated, and audited. The framework is uniform across all departments — the Sales Agent and the Dev Agent use the same machinery, only the routing rules differ.

---

## 1. The approval queue object

Every action that requires approval creates an entry in the customer's `approval_queue` with these fields:

| Field | Type | Description |
|---|---|---|
| `ticket_id` | string | Originating ticket from the [ticketing system](Product-Requirements) |
| `agent_id` | string | Agent identity that proposed the action |
| `action_class` | enum | `Read` \| `Write` \| `Delete` \| `External` \| `Financial` |
| `action_tier` | enum | `low` \| `medium` \| `high` \| `templated` \| `free_form` (where applicable) |
| `proposed_action` | object | Structured representation of the action |
| `explanation` | string | Plain-English `Explain-Before-Execute` rationale, from the agent |
| `confidence` | float | Agent's confidence score `0.0–1.0` |
| `created_at` | ISO datetime | When the entry was created |
| `expires_at` | ISO datetime | Auto-expiry (action is dropped, ticket marked stale) |
| `routing` | object | Approver(s), escalation policy |
| `status` | enum | `pending` \| `approved` \| `rejected` \| `expired` \| `executed` \| `rolled_back` |

## 2. Routing rules

Routing is determined by a deterministic lookup against the customer's approval policy, configured during onboarding:

```
match: action_class == Financial
  → route_to: any member of role "Finance Approver"
  → escalation_after: 4 hours → role "CFO" or delegate
  → expires_after: 24 hours

match: action_class == Delete AND entity_type in (employee.*)
  → route_to: ticket owner AND any "HR Manager"
  → escalation_after: 8 hours → role "Head of People"
  → expires_after: 72 hours

match: action_class == Write AND action_tier == high
  → route_to: ticket owner
  → escalation_after: 24 hours → ticket owner's manager
  → expires_after: 72 hours

match: action_class == External AND action_tier == free_form
  → route_to: any "Communications Approver"
  → expires_after: 24 hours
```

Routing rules are stored in the Wiki under the customer's tenant pages. Global defaults live at [Customer Approval Defaults](Customer-Approval-Defaults) *(WIP)*.

## 3. Explain-before-execute

Every approval queue entry must include an `explanation` written by the agent. The explanation:

- Is plain English (no JSON, no jargon)
- Names the intended action and its expected outcome
- Lists the data sources consulted
- States the confidence score and the top reason for uncertainty (if any)
- Is shown verbatim to the approver

An action without a parsable explanation is rejected at gate time, **before** reaching the approval queue.

Example:

> The HR Agent proposes to update Sarah Chen's role from "Senior Engineer" to "Staff Engineer", effective 2026-06-01. Source: promotion approval workflow PR-2026-0414, signed by Hiring Manager and Head of Engineering. Confidence: 0.94. The remaining 6% uncertainty is from a missing pay-band override; this update covers role only, not compensation.

## 4. Approval actions

The approver can take one of four actions:

| Action | Effect |
|---|---|
| `approve` | Action moves to executor; status → `executed` once complete |
| `approve_with_edits` | Approver modifies the proposed action; agent re-runs validation gates on the edited action; if gates pass, executes |
| `reject` | Action is discarded; agent receives reason; ticket may be reassigned or closed |
| `defer` | Approver postpones; action remains `pending`; auto-escalates at configured interval |

`approve_with_edits` and `reject` always require a free-text rationale, captured in the audit log.

## 5. Auto-escalation

Approval queue entries that exceed their `escalation_after` interval without a decision are automatically routed to the next approver tier. Escalation policies are department-specific but follow this pattern:

```
Level 0 (initial)   → Department peer / direct manager
Level 1 (4–24h)     → Department head
Level 2 (24–72h)    → Functional executive (CFO, CHRO, CTO, etc.)
Level 3 (>72h)      → CEO / board delegate
```

At each escalation, the **previous approver is not removed**; they remain notified and may still approve. The action executes the moment any authorised approver signs off.

## 6. Expiry

If no approver acts before `expires_at`:

- The action is discarded
- The originating ticket is marked `stale`
- A `wiki-update` is triggered if the same expiry has occurred 3+ times in 30 days — this signals that the approval routing may be miscalibrated and needs Wiki review

## 7. Bulk approvals

For low-risk, high-volume actions (e.g. tagging 200 leads), the agent may submit a `bulk_action` queue entry containing:

- An action template
- A list of target entity IDs
- A sample of 5 randomly-selected concrete actions

The approver reviews the sample. Approving the bulk approves all entities; rejecting any one returns the entire batch for individual review.

Bulk approvals are **never** allowed for `Delete` or `Financial` classes.

## 8. Audit trail

Every approval queue lifecycle event is logged:

- Created (with full proposed action)
- Routed (with approver identity)
- Escalated (with new approver and reason)
- Decided (with approver identity, action, rationale)
- Executed (with result)
- Rolled back (if applicable — see [Rollback Procedures](Rollback-Procedures))

The audit log is immutable and retained per the compliance retention policy of the action class.

## 9. Approval impersonation

An approver **may not** approve an action that they themselves originated as a human ticket creator. The orchestration engine enforces this — the approver list excludes the ticket creator automatically.

The CEO cannot waive this rule. Compliance reviewers can audit and override only via a dual-control workflow with a second executive co-signing.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Rollback Procedures](Rollback-Procedures)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
