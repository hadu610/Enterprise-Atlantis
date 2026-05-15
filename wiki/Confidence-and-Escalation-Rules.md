# Confidence and Escalation Rules

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

Every agent output that involves judgment is accompanied by a confidence score `0.0–1.0`. This page defines how confidence is calculated, how it interacts with autonomy phases, and the deterministic escalation policy when confidence is insufficient.

The rule: **an agent never proceeds with low confidence on its own authority.** Low confidence routes to humans, with the agent's reasoning attached so the human can act quickly.

---

## 1. How agents compute confidence

Confidence is a single scalar `c ∈ [0.0, 1.0]` produced by the agent for each output. It is a composite signal — agents combine these inputs:

| Input | Weight (typical) | Notes |
|---|---|---|
| Model-reported probability over the output (token-level or self-eval) | 0.30 | Use a calibrated rather than raw probability where available |
| Data quality score of consulted source(s) | 0.25 | From the Universal Data Bridge — fresh, complete data → higher |
| Wiki coverage score | 0.20 | Did the agent find a directly applicable `Rule` or `Playbook`? Or was reasoning extended from a related page? |
| Precedent strength | 0.15 | Has the platform executed similar actions successfully before? |
| Self-check pass rate | 0.10 | Agent-internal sanity checks (consistency, unit checks, sign checks) |

The weights are agent-specific and tuned over time. The platform exposes the breakdown in the audit log — humans can see *why* an agent was confident, not just *how* confident.

Agents do not pad confidence. A confidence floor for any reason other than the formula above is a logged anomaly.

## 2. Minimum confidence to act autonomously

These thresholds apply only when an agent's [Phased Autonomy](Phased-Autonomy-Reference) and [Action Risk Class](Action-Risk-Classification) already permit autonomous execution. Confidence is the **final** check.

| Action class | Threshold |
|---|---|
| `Read` | 0.60 |
| `Write` low | 0.80 |
| `Write` medium | 0.85 |
| `Write` high | 0.92 |
| `External` templated | 0.85 |
| `External` free-form | 0.92 |
| `Delete` / `Financial` | n/a — always queued |

Confidence at or above threshold → execute (subject to all other gates).
Confidence below threshold → route to human approval with explanation.

## 3. Escalation paths

When an agent escalates (low confidence, conflict, or business rule failure), the destination is determined by this lookup:

| Trigger | First-line escalation |
|---|---|
| Low confidence on a task with an explicit ticket owner | Ticket owner |
| Low confidence with no ticket owner | Department lead per customer routing config |
| Wiki conflict (see [How Agents Use This Wiki § 5](How-Agents-Use-This-Wiki#5-conflict-resolution)) | Owner of the conflicting pages, plus Engineering |
| Validation Gate 2 failure (business logic) | Owner of the affected playbook |
| Validation Gate 4 failure (contradiction) | Both prior agent's escalation contact and current agent's |
| `Delete` or `Financial` action | Per Approval Workflow Framework |
| Repeated identical low-confidence escalations (>3 in 7 days) | Triggers a `wiki-update` ticket — likely a Wiki gap |

## 4. Escalation packet — what the human sees

Every escalation produces an escalation packet, shown to the human approver:

- **Task description** — what the agent was asked to do
- **Proposed action** — what the agent recommends (if any)
- **Confidence score** — overall + breakdown by input (model, data quality, wiki, precedent, self-check)
- **Top uncertainty factor** — plain-English description of the largest single source of doubt
- **Sources consulted** — Wiki pages, data sources, prior task references
- **Recommended human next step** — agent's suggested follow-up question or check

The packet is rendered consistently across all agents — humans should not need to learn department-specific UIs to act on escalations.

## 5. The escalation budget

To prevent escalation flooding, every agent has a per-customer **escalation budget** measured per hour. Exceeding the budget triggers a circuit breaker: the agent halts new tasks until the queue is drained or the customer admin lifts the breaker.

Default budgets:

| Customer phase | Per-agent escalation budget |
|---|---|
| Phase 1 (Drafting) | Unlimited (drafting is escalation by nature) |
| Phase 2 (Startup) | 30 / hour |
| Phase 3 (Approval) | 12 / hour |
| Phase 4 (Enterprise) | 4 / hour |

Sustained budget pressure indicates either (a) under-trained agent, (b) Wiki gaps, or (c) phase set too high for current data quality. All three are diagnosable from the audit log.

## 6. Do not pretend to be confident

An agent producing a high confidence score that is later contradicted (by human override or downstream gate failure) damages the platform's calibration. The platform tracks a per-agent **calibration error**:

```
calibration_error = | confidence_avg - accuracy_avg |
```

A persistent calibration error > 0.10 across 30 days flags the agent for re-tuning by Engineering. Agents that systematically over-claim confidence are temporarily downgraded one phase until calibration normalises.

## 7. Confidence in code (Dev Agent specific)

For Dev Agent code outputs, confidence integrates additional signals:

- Test coverage of new code (gate-checked)
- SAST result clean / not clean (gate-checked)
- Prior agent commits to the same module that landed successfully
- Reviewer (human) override history for similar changes

The Dev Agent's confidence threshold for autonomous PR creation is **0.90** regardless of action tier — code merges are high-blast-radius and trusted slowly.

---

## Cross-references

- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [How Agents Use This Wiki](How-Agents-Use-This-Wiki)
