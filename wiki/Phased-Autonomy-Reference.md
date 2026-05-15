# Phased Autonomy Reference

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the **authoritative definition** of the four autonomy phases. The customer's current phase is set per agent and stored in the customer config. Agents read this page to interpret what they may and may not do in their current phase.

The model exists to solve [Barrier B5](The-Six-Barriers#b5--trust--change-management): trust is engineered by accumulating evidence at each level before progressing to the next.

---

## Phase 1 · Drafting

**Default for newly activated agents.**

| Aspect | Behaviour |
|---|---|
| `Read` actions | Drafted only — no autonomous execution. Output sent to human queue for review. |
| `Write` actions | Drafted only. Human must explicitly execute. |
| `Delete` actions | Drafted only. Hard rule: never auto-executed in any phase. |
| `External` actions | Drafted only. Human signs every outbound message. |
| `Financial` actions | Drafted only. Hard rule: never auto-executed in any phase. |
| Validation gates | All open for human review. |
| Trust Score | Begins accumulating from Day 1 of this phase. |

**Exit criteria to Phase 2:**

- Minimum 30 days in phase
- Trust Score ≥ 0.80
- Human override rate < 25%
- Zero `Delete` or `Financial` action attempts that bypassed the hard rule
- Customer admin explicit approval

---

## Phase 2 · Startup

| Aspect | Behaviour |
|---|---|
| `Read` actions | Autonomous, subject to confidence threshold (`≥ 0.60`). |
| `Write` actions | Drafted, requires human sign-off. |
| `Delete` actions | Drafted. Hard rule: never auto-executed. |
| `External` actions | Drafted, requires human sign-off. |
| `Financial` actions | Drafted. Hard rule: never auto-executed. |
| Validation gates | Active. Failed gates route to human queue. |
| Trust Score | Visible to customer admin via Dashboard. |

**Exit criteria to Phase 3:**

- Minimum 60 days in phase
- Trust Score ≥ 0.90
- Human override rate < 15%
- Zero validation gate failures classified as critical
- Customer CIO or equivalent explicit approval

---

## Phase 3 · Approval

| Aspect | Behaviour |
|---|---|
| `Read` actions | Autonomous. |
| `Write` actions | Autonomous for risk-tier `low`; queued approval for `medium`/`high`. |
| `Delete` actions | Always queued approval. Hard rule: human must confirm each. |
| `External` actions | Autonomous for templated communications; queued approval for free-form. |
| `Financial` actions | Always queued approval. Hard rule: human must confirm each. |
| Validation gates | Active. Failed gates route to human queue with full context. |
| Trust Score | Recalculated daily; downgrade triggers automatic phase rollback. |

**Exit criteria to Phase 4:**

- Minimum 90 days in phase
- Trust Score ≥ 0.95 sustained for 30 consecutive days
- Human override rate < 5%
- Customer success manager attestation
- Customer board or executive sponsor explicit approval

---

## Phase 4 · Enterprise

| Aspect | Behaviour |
|---|---|
| `Read` actions | Autonomous. |
| `Write` actions | Policy-based auto-approval for pre-approved task categories. Exceptions queue to humans. |
| `Delete` actions | **Always queued approval. Hard rule, never bypassed.** |
| `External` actions | Auto-approval for pre-approved categories. |
| `Financial` actions | **Always queued approval. Hard rule, never bypassed.** |
| Validation gates | Run silently. Failed gates route to human queue. |
| Trust Score | Continuous; drop below 0.92 triggers automatic phase rollback to Phase 3. |

This is the steady-state operating mode. There is no Phase 5.

---

## Phase rollback

If at any point in any phase:

- Trust Score drops below the phase floor for **48 consecutive hours**, OR
- A critical incident occurs (data leak, unauthorised action, repeated `Delete`/`Financial` override attempts), OR
- The customer admin requests rollback,

the agent is automatically downgraded one phase. The platform notifies the customer admin and the Customer Success Manager. The agent must satisfy the original exit criteria of the lower phase before re-promotion.

## Per-agent vs per-customer

Phase is set **per agent per customer**, not globally. A customer's HR Agent may be in Phase 3 while the Finance Agent is in Phase 1. Independence is intentional — failures or low trust in one department do not penalise another.

## Hard rules — never configurable

These rules apply in **every** phase and **cannot be disabled** by customer config or platform admin:

1. `Delete` actions on any data require human confirmation per action.
2. `Financial` actions (outbound payments, billing changes, invoice issuance) require human confirmation per action.
3. Agents cannot modify pages in this Wiki marked `Approved`.
4. Agents cannot grant themselves additional OAuth scopes.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [The Six Barriers](The-Six-Barriers#b5--trust--change-management)
