# Action Risk Classification

> **Type:** Rule · **Owner:** Security · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the authoritative classification of every action type an agent can attempt. The classification determines: (a) what OAuth scope is required, (b) whether human approval is needed in each [autonomy phase](Phased-Autonomy-Reference), and (c) what audit detail is captured.

Classification is enforced at the API gateway, not by agent instruction. An agent attempting an action outside its scope is **blocked**, not slowed.

---

## The five action classes

| Class | Definition | Reversible? | Always requires human confirmation? |
|---|---|---|---|
| **Read** | Retrieves data without modification | Yes (no state change) | No |
| **Write** | Modifies data in any system of record | Sometimes (depends on rollback availability) | No (varies by autonomy phase and risk tier) |
| **Delete** | Removes data or destroys state | Often No | **Yes — every phase, hard rule** |
| **External** | Sends a communication or trigger outside the customer org (email, webhook, public post) | Usually No | Varies |
| **Financial** | Moves money, changes billing, or issues invoices | Often No | **Yes — every phase, hard rule** |

## Class detail

### Read

- Examples: querying a CRM record, listing files, reading a wiki page, retrieving a transaction history.
- Required scope: source-system read scope.
- Confidence threshold: ≥ 0.60.
- Audit detail: source system, query, agent identity, timestamp.

### Write

Sub-tiers within `Write`:

| Tier | Examples | Approval default |
|---|---|---|
| `low` | Adding a note to a ticket, tagging a record, updating a non-critical field (e.g. "industry") | Phase 3+ autonomous |
| `medium` | Creating a new record, updating customer-facing data, changing an internal status | Phase 3+ queued |
| `high` | Changing employment status, modifying a contract, updating compliance-tagged data | All phases queued |

Required scope: source-system write scope for the specific entity type.
Confidence threshold: ≥ 0.85.
Audit detail: source system, before/after diff, rationale, confidence score.

### Delete

- Examples: removing a record, archiving an employee, voiding an invoice (but not refunding — that's `Financial`).
- Required scope: source-system delete scope **plus** a delete-class enabling flag on the agent identity (separate from write).
- **Approval: human confirmation per action, every phase, no exceptions.**
- Confidence threshold: not applicable (gate is human approval, not confidence).
- Audit detail: full record snapshot pre-deletion, human approver identity, justification text.

### External

Sub-tiers:

| Tier | Examples | Approval default |
|---|---|---|
| `templated` | Sending an email from a pre-approved template, posting to a customer-managed Slack channel | Phase 3+ autonomous |
| `free_form` | Generating new email body text, posting to public social, contacting a new external party | Phase 3+ queued; Phase 4 by policy |

- Required scope: external-comms scope for the specific channel (email, Slack, etc.).
- Confidence threshold: ≥ 0.85 for templated; ≥ 0.92 for free-form.
- Audit detail: channel, recipient(s), full content, template (if used), agent identity.

### Financial

- Examples: issuing a payment, processing a refund, modifying a billing plan, sending an invoice, changing a subscription.
- Required scope: financial scope **plus** explicit delegation from a human finance approver.
- **Approval: human confirmation per action, every phase, no exceptions.**
- Confidence threshold: not applicable.
- Audit detail: amount, currency, source/destination, GL coding, human approver identity, justification text. Retained for seven years minimum.

---

## Scope assignment

Every agent identity has a permissions document defining:

```
agent: hr-agent-v2
scopes:
  - source: hris.bamboohr
    classes: [read, write_low, write_medium]
  - source: hris.bamboohr
    classes: [write_high]
    constraints: { entity_types: ["employee.profile"] }
  - source: comms.email
    classes: [external_templated]
```

The HR Agent in this example **cannot**:

- Delete employee records (no `delete` class anywhere)
- Move money (no `financial` scope anywhere)
- Modify compensation fields (no `write_high` constraint covers `employee.compensation`)
- Send free-form emails (`external_free_form` not granted)

## Time-bounded scope grants

A scope can be granted for the duration of a single task only:

```
agent: dev-agent-v1
scopes:
  - source: github
    classes: [read]
  - source: github
    classes: [write_medium]
    constraints:
      branch_pattern: "agent/*"
      ttl_seconds: 3600
```

After the TTL expires, the agent cannot use the scope until it is re-issued by the Orchestration Engine for a new task.

## Forbidden combinations

Independent of phase or customer config, these combinations are **always blocked** at the API gateway:

| Agent | Forbidden scope |
|---|---|
| HR Agent | `financial` (any) |
| Finance Agent | `delete` on HR entities |
| Marketing Agent | Any HR or Finance scope |
| Sales Agent | `delete` (any) |
| Legal Agent | `write_high` on operational systems |
| Operations Agent | `financial` (any) |
| Dev Agent | Any HR, Finance, Legal scope |

This list is non-configurable. To change it, both this page and the gateway code must be updated together (see [Wiki Governance § 8](Wiki-Governance)).

---

## Cross-references

- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [The Six Barriers](The-Six-Barriers#b4--identity--security-crisis)
