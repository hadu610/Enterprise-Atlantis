# Rollback Procedures

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

Every state-changing action that any agent executes captures a rollback snapshot before the action runs. This page defines the snapshot contents, retention, and the one-click rollback procedure.

The rule: **if it changed state, it can be rolled back.** Where genuine irreversibility exists (an email is sent, a payment clears), the platform makes it as recoverable as possible (issue retraction, refund) and clearly labels the limit.

> **How a non-engineering user actually performs a rollback.** Rollback is a **ticket operation**, not a department-specific procedure. Every state-changing action in Atlantis is a [ticket](Unified-Ticketing-Blueprint#1-what-ticket-means-in-atlantis); every ticket carries its inverse spec; the [Control Center](Control-Center#4-rollback-as-a-ticket-operation) exposes the five rollback verbs (cancel, reject, roll back, supersede, saga rollback) with one consistent UI across all departments. A department manager who saw the wrong thing happen does not need to understand HR vs. Finance semantics — they open the Activity Log, find the action, click `Roll back`, and the inverse runs through the same approval workflow the original would have. This page specifies what the platform does under the hood when that button is pressed.

---

## 1. What gets snapshotted

For each `Write`, `Delete`, `External`, or `Financial` action, the Deterministic Execution Wrapper captures, **before** the action runs:

| Action | Snapshot contents |
|---|---|
| Database row update | Pre-update row state (full), table name, primary key, agent ID, timestamp |
| Database row delete | Full row state at deletion, table name, primary key, agent ID, timestamp |
| File write/replace | Previous file content hash + content blob (or pointer to immutable storage), path, agent ID |
| File delete | File content blob (or pointer), path, agent ID |
| External API write | Request payload, response, reverse-call spec (e.g. created resource ID) |
| Outbound email | Recipient(s), subject, body, attachments, sender identity, channel — retained for retraction request (cannot un-send but can issue retraction) |
| Stripe charge / refund | Charge ID, amount, idempotency key, reverse-call spec |
| Code deployment | Git SHA before deploy, deployed SHA, build artefact ID, environment, agent ID |

Snapshots are stored in an append-only audit store with immutable retention.

## 2. Retention

| Snapshot class | Retention |
|---|---|
| `Write` low / medium | 30 days |
| `Write` high | 1 year |
| `Delete` | 7 years |
| `External` | 30 days for templated; 1 year for free-form to external parties |
| `Financial` | 7 years (compliance minimum) |
| Code deployment | Retained as long as the git history exists |

Retention is a **floor**, not a ceiling. Customers may configure longer retention; never shorter.

## 3. Triggering a rollback

Rollback is triggered by one of:

1. **Human via Console** — any user with the `rollback` permission can revert any eligible action from the Activity Log within the snapshot's retention window. One click; confirmation modal; rationale required.
2. **Automatic on validation failure** — if a multi-step workflow fails midway through, the orchestration engine automatically rolls back successfully-executed prior steps in reverse order.
3. **Customer admin emergency** — a customer admin can issue an "emergency revert" command that rolls back all actions by a specific agent identity within a specified window. Used for incident response.
4. **Scheduled compliance hold** — if Legal places a hold on a record, any agent action against that record within the hold window is auto-rolled back when the hold is detected.

## 4. The rollback execution path

A rollback request runs through these steps:

1. **Locate snapshot** — by action ID. If the snapshot is past retention, rollback is refused with reason.
2. **Validate inverse action** — compute the inverse action (UPDATE back, DELETE the created row, refund the charge). Validate it against the current state — if the target has been modified since the original action, request human confirmation.
3. **Require approval** — rollback is itself an action subject to [Approval Workflow](Approval-Workflow-Framework). Default routing:
   - `Write` rollback → same approver as the original action would have required
   - `Delete` rollback (i.e. restore deleted record) → ticket owner + HR/Finance manager (depending on entity type)
   - `Financial` rollback → CFO or delegate
4. **Execute inverse** — by the Deterministic Execution Wrapper, with its own snapshot (rollbacks of rollbacks must be possible)
5. **Audit log** — both original and rollback are linked; the entity's history shows the full chain

## 5. Irreversibility — what we honestly cannot rollback

Some actions cannot be technically reversed. The platform is explicit about these:

| Action | Reality | Mitigation |
|---|---|---|
| Email sent | Cannot un-send | Retraction email auto-generated and queued for approval |
| Public social post | Cannot un-post (cached, archived) | Deletion attempted; retraction post drafted |
| Webhook fired to external service | Cannot un-fire | Compensating webhook drafted if the service supports one |
| Payment cleared | Cannot un-charge | Refund issued (Financial action, separate approval) |
| Communication to a third party | Cannot un-say | Documented in audit log; legal escalation path |

For these classes, the snapshot captures full context to enable forensic reconstruction even when reversal is impossible.

## 6. Workflow-level rollback

When an orchestrated workflow fails partway, the orchestration engine performs a **transactional rollback**:

1. The workflow's `pending` and `awaiting_approval` steps are cancelled.
2. Completed steps are rolled back in reverse order using their snapshots.
3. Each step's rollback runs its own gates.
4. If any step's rollback fails, the workflow halts with status `partial_rollback`. A human must complete reconciliation manually.

`partial_rollback` is a P0 alert. Customer Success Manager is paged.

## 7. Forbidden rollback behaviours

- A rollback **must not** be auto-approved past its retention window. Out-of-window restoration requires an explicit data-recovery process.
- A rollback **must not** override an active legal hold. The hold dictates the state.
- An agent **must not** initiate a rollback on its own — only humans (via the Console) and the orchestration engine (transactional failure) can.

---

## Cross-references

- [Control Center § 4](Control-Center#4-rollback-as-a-ticket-operation) — the manager-facing surface that exposes rollback
- [Unified Ticketing Blueprint](Unified-Ticketing-Blueprint) — the ticket lifecycle that ends with `rolled_back`
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Action Risk Classification](Action-Risk-Classification)
- [The Six Barriers](The-Six-Barriers#b1--compound-failure)
