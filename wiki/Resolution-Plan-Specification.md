# Resolution Plan Specification

> **Type:** Rule · **Owner:** Product / CTO · **Status:** Approved · **Applies to:** All agents · All humans approving actions · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

The **Resolution Plan** is the structured artifact every agent must produce before (or alongside) a side-effecting action. It is the reviewer's executive briefing, the auditor's reasoning trail, and the spectator's "why did that happen" answer — all the same document, surfaced at three different times depending on the [Autonomy Mode](Autonomy-Modes).

Every Plan contains the same 10 elements. No approval button renders in any Atlantis UI without a Plan present.

> **The reframe this page makes:** *the platform never asks a human to approve an opaque action.* If we cannot explain what the agent will do, why, and what could go wrong, we have no business asking for approval. The Plan is the contract that makes approvals informed and audits intelligible.

---

## 1. Why this page exists

[Approval Workflow Framework](Approval-Workflow-Framework) tells us *that* high-risk actions route to a reviewer. It did not, until this page, specify *what the reviewer sees*. Without the agent's reasoning, the reviewer is either rubber-stamping (signal-free approvals) or making decisions blind (unsafe). Both failures show up in audit reviews as the same artifact: an approval signature next to an action the approver could not have understood.

The Resolution Plan closes that gap. It is required in every [Autonomy Mode](Autonomy-Modes):

- In **Drafting** mode, the Plan is rendered with the draft so the human knows what the agent intends.
- In **Approval** mode, the Plan is rendered before the approval decision; no approve button without it.
- In **Silent** mode, the Plan is rendered retroactively in the [Live Activity Stream](Live-Activity-Stream) so spectators can audit reasoning after the fact.

Same artifact. Same 10 elements. Three different surface times.

---

## 2. The 10 elements

Every Plan has exactly these elements, in this order. Missing elements fail validation and cannot be surfaced for approval.

| # | Element | What it contains | Length |
|---|---|---|---|
| 1 | **Summary** | One sentence describing what the agent intends to do | ≤ 200 chars |
| 2 | **Inputs used** | The wiki pages, CRM records, prior tickets, and external data that informed the decision, each as a citation link | 3–15 citations |
| 3 | **Proposed steps** | Ordered list of concrete actions, each with the underlying API call / artifact it would produce | 1–20 steps |
| 4 | **Pros** | Why this approach was chosen — what it accomplishes | 2–6 bullets |
| 5 | **Cons / risks** | What could go wrong, including the "I could be wrong about X" cases | 2–6 bullets |
| 6 | **Complexity** | One of `simple` / `moderate` / `complex`, with the single factor that drives the rating | label + 1 sentence |
| 7 | **Cost estimate** | Dollar cost (LLM, infra, external service fees) and human-time cost saved, both with confidence intervals | structured numbers |
| 8 | **Reversibility** | `fully_reversible` / `partially_reversible` / `irreversible`, with the rollback procedure if applicable | label + procedure |
| 9 | **Confidence** | Agent self-rated `0–100`, broken down by signal (data completeness, precedent in wiki, schema match, model self-rating) | structured score |
| 10 | **Alternatives considered and rejected** | At least one alternative the agent considered, with why it was rejected | 1–3 bullets |

These elements are not optional and not customizable per agent. Every agent — including the [Atlantis Manager](Atlantis-Manager-Playbook), the seven department agents, and any future agents — produces Plans in this shape.

---

## 3. Element details

### 3.1 Summary

One sentence in active voice describing the action. The summary is what surfaces in the [Live Activity Stream](Live-Activity-Stream) ticker, in the approval queue card, and in the daily digest.

**Good:** "Reconcile 47 Stripe payouts from 2026-05-16 against the AR ledger."
**Bad:** "Run reconciliation." (no scope), "I will work on reconciling some payments." (passive, vague)

Agents that cannot produce a one-sentence summary do not understand their own intent and must escalate instead.

### 3.2 Inputs used

Every fact the agent relied on, with a citation. Citations are typed:

| Citation type | Format |
|---|---|
| Wiki page | `wiki:Page-Name#section-anchor` |
| CRM record | `crm:entity_type/entity_id` |
| Prior ticket | `ticket:ticket_id` |
| Audit event | `audit:event_id` |
| External source | URL with retrieval timestamp |
| Customer-supplied | "user-input on 2026-05-17T14:23Z" |

The citation list is what makes the Plan auditable. A claim without a citation is a hallucination risk; the agent must cite or remove the claim.

### 3.3 Proposed steps

Each step is one concrete action with one underlying tool call. Steps are ordered; the human reads them top-to-bottom to understand the action sequence.

**Format per step:**
```
N. <verb-object summary>
   tool: <tool_name>(<parameters>)
   produces: <artifact or state change>
   rollback: <inverse call or "n/a">
```

Example:
```
3. Post journal entry for refund
   tool: ledger.post_entry(account=4001, debit=125.00, credit=125.00, ref=ticket-9817)
   produces: ledger entry LE-2026-05-17-0083
   rollback: ledger.reverse_entry(LE-2026-05-17-0083)
```

Steps that cannot be expressed in this format are too abstract; the agent must decompose them or escalate.

### 3.4 Pros

Why *this* approach. Not generic ("it saves time"); specific to the action and context.

**Good:** "Reconciling on the 16th aligns the AR close with the bank statement that lands on the 17th, eliminating a recurring cross-period adjustment we made every month for Q1."
**Bad:** "Saves time and reduces errors."

### 3.5 Cons / risks

What could go wrong. This is where the agent must be honest, not optimistic. Include the cases where the agent itself could be wrong about its own assumptions.

**Good examples:**
- "I'm using the Stripe export from 14:00 UTC; any payouts settled after that timestamp will roll into tomorrow's run."
- "I matched 3 payouts to AR records using customer email; if a customer has multiple accounts under the same email, the match is ambiguous and the audit flags it."
- "The exchange rate I used (EUR→USD 1.0834) is from 09:00 UTC; if treasury locked a different rate later today, the variance will show in next month's close."

**Bad examples:**
- "May fail." (no specifics)
- "All risks have been mitigated." (untrue and not useful)

### 3.6 Complexity

Three labels:

| Label | Definition |
|---|---|
| `simple` | One tool call, one entity affected, fully reversible, no cross-system dependency |
| `moderate` | 2–5 tool calls, ≤10 entities affected, mostly reversible, single-system or well-known cross-system dependency |
| `complex` | 6+ tool calls or 10+ entities or partial-reversibility or novel cross-system dependency or novel entity-type creation |

The label is accompanied by **one sentence identifying the single factor that drives it** — not a paragraph. The factor tells the reviewer what to scrutinise first.

### 3.7 Cost estimate

Two numbers, both with confidence intervals:

- **Dollar cost** to execute: LLM tokens, infra cost, external service fees (Stripe processing, email delivery, etc.). Format: `$X.XX ±$Y.YY`.
- **Human-time saved**: the equivalent hours of human work the action replaces, derived from the playbook's baseline-time field. Format: `N hours ±M`.

If the agent cannot estimate either number, it produces `unknown` rather than guessing. An `unknown` cost in a Plan blocks approval for `Financial` action class per [Action Risk Classification](Action-Risk-Classification).

### 3.8 Reversibility

| Label | Definition |
|---|---|
| `fully_reversible` | Inverse call exists and will restore the prior state exactly |
| `partially_reversible` | Inverse call exists but leaves traces (notification withdrawn, ledger has both entries, etc.) |
| `irreversible` | No inverse call; the action permanently changes state visible to external parties |

For `fully_reversible` and `partially_reversible`, the Plan includes the rollback procedure per [Rollback Procedures § 1](Rollback-Procedures#1-what-gets-snapshotted). For `irreversible`, the Plan includes a short justification for why the action must be irreversible (e.g. "Stripe payment captures clear; cannot un-capture").

In Silent mode, reversible actions display a 30-second undo affordance in the [Live Activity Stream](Live-Activity-Stream); irreversible actions do not.

### 3.9 Confidence

A `0–100` score, broken down by four signals:

| Signal | What it measures |
|---|---|
| **Data completeness** (0–100) | Did the agent have the inputs it needed? Missing inputs lower this. |
| **Precedent** (0–100) | Has this exact action been performed before? Frequency of precedent raises this. |
| **Schema match** (0–100) | Does the action map cleanly to a known playbook? Custom one-offs lower this. |
| **Model self-rating** (0–100) | The LLM's own calibrated confidence after seeing the full Plan it just generated |

Composite: `confidence = round(0.30·data + 0.25·precedent + 0.25·schema + 0.20·self)`.

Confidence does not gate execution by itself — that is the [Approval Workflow Framework](Approval-Workflow-Framework) and [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)'s job. Confidence is a *signal* the reviewer reads. A confident-but-wrong Plan and an unconfident-but-correct Plan both happen; the score is necessary, not sufficient.

### 3.10 Alternatives considered and rejected

At least one alternative approach the agent evaluated, with the reason it was rejected.

**Good:** "Could have batched all 47 payouts into one ledger entry; rejected because audit prefers one entry per payout for SOC 2 reconciliation evidence."
**Bad:** "No alternatives considered." — this is never acceptable; if the agent cannot articulate an alternative, the action is either trivial (in which case the alternative is "do nothing — manual handling next month") or the agent has not thought through the action.

The alternatives element is what protects against narrow-thinking agents that find one path and execute it without considering options.

---

## 4. Where the Plan renders

The Plan is rendered identically in three surfaces:

| Surface | When | Audience |
|---|---|---|
| **Approval queue card** ([Control Center § 3.4](Control-Center#34-approval-queue)) | Before approval (Approval mode) | Reviewer |
| **Live Activity Stream row** ([Live Activity Stream](Live-Activity-Stream)) | At-execution (Silent mode) and at-creation (every mode) | Spectator / Auditor |
| **Atlantis Manager chat** ([Atlantis-Manager-Playbook § 4](Atlantis-Manager-Playbook#4-the-managers-tool-catalogue)) | Inline in conversation when the Manager produces an action | User |

The rendering format is consistent across surfaces — same element order, same labels, same styling. A reviewer reading a Plan in the Approval Queue, then re-reading it in the daily digest, sees the same document.

---

## 5. Reviewer actions on a Plan

In Approval mode, the reviewer takes one of four actions on a rendered Plan:

| Action | What it does | Audit consequence |
|---|---|---|
| **Approve** | Execution proceeds with the Plan as-is | Plan + approval signature linked to execution audit event |
| **Approve with modification** | Reviewer edits one or more steps (text edits, parameter changes); agent executes the modified Plan | Audit event records the diff between original and modified Plan |
| **Reject with reason** | Routes back to the agent with a typed rejection rationale; agent revises and produces a new Plan | Audit event records both Plans (rejected + revised) |
| **Ask a question** | Comment on the ticket; agent answers; reviewer can then approve / reject / re-modify | Comments are audited as part of the ticket's conversation |

A reviewer cannot approve a Plan they themselves originated as a human (per [Approval Workflow Framework § 9](Approval-Workflow-Framework#9-approval-impersonation)).

---

## 6. Plan generation by agents

Every Atlantis agent implementation includes a Plan-generation function that produces a Plan from a prompt + tool catalogue + tenant context. The function returns either a valid Plan (all 10 elements present and validated) or an `insufficient_context` refusal — never a partial Plan.

**The agent must refuse to generate a Plan when:**

- Confidence (composite) is below 40
- A required input cannot be cited (the agent doesn't know where its facts come from)
- The action class is `Financial` or `Delete` and any single Confidence signal is below 30
- The action is not represented in any known playbook *and* the agent has no precedent for similar actions

On refusal, the agent emits an `insufficient_context` event with the reason and escalates to a human via [Confidence and Escalation Rules](Confidence-and-Escalation-Rules).

The Plan-generation function is part of [Cross-Agent Coordination § Action Executor](Cross-Agent-Coordination#3-the-action-executor) tooling and is shared across all seven department agents — there is one implementation, not seven.

---

## 7. Plan storage and retention

Every Plan is persisted as an Audit Event with type `plan_generated`. The event is immutable. The execution audit event (`action_committed`) links back to the Plan's event id.

| Property | Value |
|---|---|
| Storage | Audit Event store (append-only); see [Observability Standards § 10](Observability-Standards) |
| Retention | Same retention as the underlying action's audit events; never shorter than the action retention |
| Searchability | Full-text searchable in the Activity Log; structured-query on every element |
| Export | Includes Plans in compliance exports per [Unified Ticketing § 12](Unified-Ticketing-Blueprint#12-audit-trail) |

A regulator or customer auditor can always retrieve the Plan that preceded any past action.

---

## 8. Validation rules (enforced by the Plan generator)

Plans that fail any of these rules are rejected by the generator and never surfaced for approval:

- All 10 elements present and non-empty
- Summary ≤ 200 characters
- At least 3 citations in Inputs
- At least 1 step in Proposed steps; each step has tool, parameters, produces, rollback
- Pros and Cons each have 2–6 bullets; bullets are specific (length > 12 words on average)
- Complexity label is one of the three enumerated values; factor sentence present
- Cost estimate has dollar and human-time numbers, both with confidence intervals OR `unknown` justified
- Reversibility label is one of the three enumerated values; rollback procedure present for reversibles
- Confidence has all four signal scores; composite computed correctly
- At least 1 alternative considered with rejection rationale

Validation is server-side; client-side rendering cannot bypass it. A Plan that fails validation is treated as if no Plan was generated.

---

## 9. Forbidden

- **Approving without a Plan.** Every approval requires a Plan; no exceptions; the UI does not render the button.
- **Approving a Plan that fails validation.** Validation failures must be remediated by the agent before approval.
- **Editing a Plan after approval.** Approved Plans are immutable. To change the action, reject and revise.
- **Splitting one action across multiple Plans.** Sagas split *across tickets*, but one ticket's action has exactly one Plan. The agent cannot piecemeal-approve.
- **Generic Pros / Cons.** Bullets that could apply to any action ("saves time", "reduces errors") fail validation.
- **Skipping the alternatives element.** Always required; "no alternatives" is not a valid value.
- **Confidence above 95 without explicit precedent evidence.** A 95+ composite requires precedent ≥ 90; otherwise the model is overconfident and the score is clamped.

---

## 10. When to revisit

- Approval times in the queue exceed a target — reviewers may be struggling to parse the Plan; revisit element ordering or element wording.
- Reviewers consistently `approve_with_modification` for a class of actions — the agent's Plan is wrong in a predictable way; update the agent's planning prompt.
- Plans with high confidence are rolled back at high rates — the confidence calibration is broken; recompute weights using actual outcomes.
- Compliance auditors flag Plans as insufficient evidence — add elements (signed timestamps, approver identity inside the Plan, etc.).
- A new agent type is added — its Plan generator must conform to this spec; if it cannot, this spec is wrong, not the agent.
- Customer feedback indicates Plans are too long for daily-digest scanning — consider an "executive summary" view that surfaces elements 1, 6, 8, 9 only.

CTO owns the Plan spec. Engineering owns the generator implementation. Product owns the rendering across all three surfaces. Security owns the validation rules.

---

## Cross-references

- [Autonomy Modes](Autonomy-Modes) — Drafting / Approval / Silent; the Plan renders in each at a different time
- [Approval Workflow Framework](Approval-Workflow-Framework) — the routing the Plan flows through in Approval mode
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules) — per-action confidence (an element inside the Plan)
- [Action Risk Classification](Action-Risk-Classification) — the action classes Plans cover
- [Live Activity Stream](Live-Activity-Stream) — the always-on surface where Plans render in Silent mode
- [Control Center § 3.4 Approval Queue](Control-Center#34-approval-queue) — the reviewer surface
- [Cross-Agent Coordination § Action Executor](Cross-Agent-Coordination#3-the-action-executor) — the shared Plan-generation tooling
- [Rollback Procedures](Rollback-Procedures) — what the rollback element references
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the Manager produces Plans for its own actions
- [Observability Standards § 10](Observability-Standards) — the audit event store
- [Master Blueprint Index](Master-Blueprint-Index)
