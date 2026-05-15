# Validation Gate Specifications

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines every validation gate the platform interposes between agent steps. Gates exist to solve [Barrier B1 (Compound Failure)](The-Six-Barriers#b1--compound-failure): convert exponentially compounding probability failure into a bounded, catchable error.

A gate is a deterministic checkpoint. It either passes (the next agent step proceeds) or fails (the action is blocked and routed to a human). Gates are not probabilistic — their decisions are reproducible from the same inputs.

---

## 1. The four core gates

Every agent hand-off — including the final hand-off from agent reasoning to the executor — passes through these four gates in order. **All must pass; any failure blocks.**

### Gate 1 — Schema Validation

Confirms the agent's output conforms to the expected output schema for the step.

- Defined by JSON Schema per task type
- Schemas are versioned and stored in `schemas/<task_type>/v<n>.json`
- Failure mode: route to a "schema repair" sub-agent (one retry only); on second failure, escalate to human

### Gate 2 — Business Logic Check

Confirms the output satisfies the business rules encoded in the relevant Wiki playbooks.

- Rules are extracted from playbook `Rule` pages at task start and compiled into a check set
- Each rule is one boolean predicate against the output
- Failure mode: never auto-retry; route to human queue with the failing rule name(s) and the output

### Gate 3 — Confidence Threshold

Confirms the agent's confidence score meets the minimum for the action class. Thresholds:

| Action class | Minimum confidence |
|---|---|
| `Read` | 0.60 |
| `Write` low | 0.80 |
| `Write` medium | 0.85 |
| `Write` high | 0.92 |
| `External` templated | 0.85 |
| `External` free-form | 0.92 |
| `Delete` / `Financial` | n/a (always queued for human) |

Failure mode: route to human queue. Never auto-retry — low confidence is information, not noise.

### Gate 4 — Contradiction Detection

Confirms the output does not contradict any prior agent output in the [Shared Context Object](Unified-Entity-Model) for the same workflow.

- Compares the output to all prior step outputs by entity ID + field
- A contradiction is: same entity, same field, different value, no intervening state-change event
- Failure mode: invoke an arbitration sub-agent that reads both outputs and the workflow history; if arbitration cannot resolve deterministically, escalate to human

## 2. Gate ordering and short-circuit

Gates run in the listed order. The first failure halts evaluation — subsequent gates are not run. This is intentional: gate output should be diagnostically pure ("Gate 2 failed because rule X is violated") not a list of cascading failures.

## 3. Per-task additional gates

Certain task types add domain-specific gates after the core four. Examples:

| Task type | Additional gate | Rule |
|---|---|---|
| Code PR creation (Dev Agent) | Test coverage gate | New PR must show coverage ≥ baseline |
| Code PR creation (Dev Agent) | Security scan gate | No new critical or high SAST findings |
| Outbound email (any agent) | Tone & PII gate | No PII visible to unauthorised channel; tone matches template register |
| Financial reporting (Finance Agent) | Reconciliation gate | Totals reconcile to source ledger within tolerance |
| Employee change (HR Agent) | Jurisdiction conflict gate | Action does not violate any rule for the employee's work jurisdiction |

Per-task gate definitions live in each agent's playbook.

## 4. Deterministic Execution Wrapper

After all gates pass, the action is executed by a **deterministic executor**, not the LLM. The executor:

- Takes the validated output as a structured payload
- Executes the literal action (API call, database write, message send)
- Captures the result
- Returns the result to the orchestration engine for the next step

The LLM never directly calls a write API, financial API, or destructive API. This is enforced by the API gateway — agent identities have no scope to call writeable APIs directly; only the executor's identity does.

## 5. Rollback snapshot

Before any state-changing action executes, the executor captures a rollback snapshot:

- For database writes: the pre-write row state
- For file operations: the file content hash and content blob
- For external API calls with reversible semantics: the parameters and a reverse-call spec (e.g. for a created Stripe charge, the snapshot includes the charge ID enabling a refund)
- For email or external comms: not reversible, but the full payload is retained for incident review

Snapshots are retained for **30 days** by default; financial action snapshots for **seven years**.

See [Rollback Procedures](Rollback-Procedures) for the rollback execution path.

## 6. Gate metrics

Every gate evaluation is logged. The platform computes per agent per phase:

- Gate pass rate (per gate)
- Most common failure cause (per gate)
- Time-to-resolution for human-escalated failures

These feed the Trust Score. Sustained Gate 2 (business logic) or Gate 4 (contradiction) failures indicate Wiki gaps — they trigger a `wiki-review` ticket against the Owner of the involved playbook.

## 7. Forbidden gate behaviours

- A gate **must not** be skipped for performance reasons. If gate evaluation is too slow, optimise the gate; never bypass it.
- A gate **must not** be made probabilistic. If a check cannot be expressed deterministically, it does not belong in a gate.
- A gate failure **must not** be silently suppressed — every failure is logged and either auto-retried (where permitted) or escalated.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
- [Rollback Procedures](Rollback-Procedures)
- [The Six Barriers](The-Six-Barriers#b1--compound-failure)
