# Autonomy Modes

> **Type:** Rule · **Owner:** Product / Security · **Status:** Approved · **Applies to:** All agents · All customer admins · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

The **Autonomy Mode** is the customer-controlled dial that determines how much human gating an agent receives before executing. It is independent from the system-controlled [Phased Autonomy](Phased-Autonomy-Reference) trust phases. The Phase tells the platform what the agent has *earned*; the Mode tells the platform what the customer is *willing to delegate*.

Three modes ship: **Drafting**, **Approval**, **Silent**. Customers set the mode per agent. Platform-floor guardrails apply in every mode and cannot be relaxed.

> **The reframe this page makes:** *trust phases are advisory; the customer decides.* If a customer is willing to let agents run unattended from day 1, the platform honours that — within hard floors that protect them from catastrophic mistakes. See [Strategy Touchstone 13](Master-Blueprint-Index#k--strategy-touchstones).

---

## 1. Why this page exists

Earlier versions of the platform model conflated two ideas:

- *How much has this agent proven it can be trusted?* (a system question, answered by evidence)
- *How much does this customer want to gate the agent?* (a customer question, answered by preference)

[Phased Autonomy Reference](Phased-Autonomy-Reference) answered the first question. It did not answer the second. As a result, every customer was forced through the same evidence-driven ramp regardless of their risk appetite — which is wrong both ways: cautious customers got pressured to advance, and confident customers were trapped in approval queues they did not need.

This page introduces the **Autonomy Mode** as a separable, customer-controlled dial. The two stay decoupled:

| Concept | Who decides | What it controls |
|---|---|---|
| **Trust Phase** | System (evidence-based) | The phase recommended for the agent based on [Trust Score](Control-Center#5-trust-score-specification) |
| **Autonomy Mode** | Customer (preference-based) | The actual gating behaviour applied to every action |

The Phase produces a **recommendation** ("we'd recommend Approval mode based on 47 hours of evidence"). The customer can accept the recommendation or override it. The Phase never gates the customer's choice.

---

## 2. The three modes

### 2.1 Drafting

The agent **produces output and never executes**. Every result is a draft the human reviews, applies, or discards.

| Property | Value |
|---|---|
| Side effects | None — the agent never writes to the CRM, never sends external comms, never creates tickets that execute |
| Human gating | 100% — every output is reviewed before any state changes |
| Resolution Plan | Required, rendered with the draft |
| Live Activity Stream | Shows the agent producing drafts in real time |
| Audit | Drafts are audited with the same event schema as executions |

**When customers choose Drafting:** new tenants in the first 30 days; tenants in regulated industries during their first quarter; any agent the customer has not yet built confidence in.

### 2.2 Approval

The agent **produces a Resolution Plan and waits**. The Plan routes to a human approver per [Approval Workflow Framework](Approval-Workflow-Framework). On approval, the agent executes. On rejection, the agent revises or escalates.

| Property | Value |
|---|---|
| Side effects | Only after approval |
| Human gating | Per-action — every Plan reaches an approver before execution |
| Resolution Plan | Required, rendered before approval; must contain all 10 elements per [Resolution Plan Specification](Resolution-Plan-Specification) |
| Live Activity Stream | Shows the Plan landing in the approval queue in real time; shows execution when approved |
| Audit | Plan, approval decision, and execution are three linked audit events |

**When customers choose Approval:** the default for most production tenants. Provides full reviewer-grade oversight with reasoned plans, without the friction of drafting-then-reapplying.

### 2.3 Silent

The agent **executes immediately**. The Resolution Plan is rendered retroactively in the Live Activity Stream and in the daily digest. Reversible actions display a 30-second undo affordance in the Stream. Irreversible actions execute without undo but always within the platform-floor guardrails (§ 4).

| Property | Value |
|---|---|
| Side effects | Immediate |
| Human gating | None per-action; daily digest review |
| Resolution Plan | Required, rendered after execution alongside the action's result |
| Live Activity Stream | Always on (per [Live Activity Stream](Live-Activity-Stream)); each action surfaces with its Plan |
| Audit | Identical to Approval mode; no audit signal is dropped |

**When customers choose Silent:** AI-native teams who want to spectate execution rather than gate it; tenants who have observed an agent through Approval mode and accumulated their own trust; demo / sandbox tenants.

---

## 3. Mode is set per agent, optionally per playbook

The customer sets the Mode at three levels of granularity:

| Level | Granularity | Default |
|---|---|---|
| Tenant default | Applies to every agent | `Approval` |
| Per agent | Overrides tenant default for one agent | inherits tenant default |
| Per playbook | Overrides agent default for one playbook | inherits agent default |

This means a customer can set the tenant default to `Silent`, override `Finance Agent` to `Approval`, then override the specific playbook `Approve refunds > $500` to `Drafting` — all in the same tenant.

Per-playbook overrides are stored in the tenant's playbook configuration ([Playbook Customization Model](Playbook-Customization-Model)). Per-agent and tenant defaults are stored in the autonomy configuration table.

---

## 4. Platform-floor guardrails — what no mode can bypass

Some actions never auto-execute regardless of Mode. The Action Executor refuses to run them without a human approval, even in Silent mode. The customer cannot unlock these. The list is enforced at the substrate level, not the UI.

| Class | Examples | Floor |
|---|---|---|
| **High-value financial** | Wire transfers, ACH out, vendor payments | Customer-configurable threshold; default **$1,000**; floor cannot be set below $0 (i.e. cannot be disabled) |
| **Mass external comms** | Email/SMS sends, social posts | Customer-configurable cap; default **50 recipients per send**; floor cannot be disabled |
| **Customer data deletion** | GDPR right-to-erasure, CRM record deletion | Always requires admin approval; no customer override |
| **Regulated filings** | Tax returns, employment terminations, legal notices | Always requires admin approval |
| **Production deploys with breaking changes** | Schema migrations, breaking API changes | Always requires Dev manager approval per [Dev Agent Playbook](Dev-Agent-Playbook) |
| **Identity-class actions** | Provisioning new admins, scope expansions, credential rotations | Always requires admin approval per [Identity and Access Control](Identity-and-Access-Control) |

The full enumeration lives in [Action Risk Classification § Platform Floors](Action-Risk-Classification). Each floor is described as "always requires approval" — meaning it requires a human in the approval queue, regardless of the customer's Autonomy Mode choice.

Customer-configurable thresholds (financial cap, comms cap, rate limit, daily spend cap) are surfaced in the autonomy step of [Company Operation Builder](Company-Operation-Builder-Catalog) and editable in the Control Center.

---

## 5. Safety rails active in Silent mode (and Approval mode)

In Silent mode the human is not gating per-action, so additional automatic safety machinery kicks in:

| Rail | Default | What it does |
|---|---|---|
| **Rate limit** | 50 actions / hour / agent | Excess actions queue for human review until the next hour |
| **Daily spend cap** | $500 / day / agent of irreversible commitments | Excess actions queue; cap reset at midnight tenant-local |
| **Anomaly detection** | 2σ deviation from agent's 30-day baseline | Auto-pauses the agent; pages the customer admin |
| **Live Activity Stream** | always on per [Live Activity Stream](Live-Activity-Stream) | Surfaces every action with its Plan; provides 30-sec undo for reversibles |
| **Daily digest** | end-of-day per tenant timezone | Summarises every action with its Plan; flags anything that triggered a guardrail |
| **Trust Score continues** | always running | If accuracy drops, the recommended Phase falls — the customer sees a notification, decides whether to switch back to Approval |

All thresholds are customer-customizable inside the floors. Defaults are conservative; tightening is always allowed; loosening is allowed up to (but never past) the platform floor.

---

## 6. How the customer sets the Mode

Three entry points, same configuration store:

| Entry | When | How |
|---|---|---|
| [Company Operation Builder](Company-Operation-Builder-Catalog) — Autonomy step | At activation | Per-agent selector with recommendation rationale |
| [Control Center](Control-Center) — Settings → Autonomy | Anytime after activation | Same selector, with audit-logged changes |
| [Atlantis Manager](Atlantis-Manager-Playbook) — Configuration mode | Anytime via chat | "Set Finance Agent to Approval mode" → Plan + confirmation |

Every Mode change produces an audit event with: previous mode, new mode, who changed it, why (typed rationale required for any move toward less gating), and which agent(s)/playbook(s) it applies to.

---

## 7. How the Mode interacts with the Resolution Plan

The Resolution Plan is required in **every Mode**. The Plan's *timing* differs:

| Mode | Plan rendered |
|---|---|
| Drafting | With the draft, before any human applies it |
| Approval | Before approval; the approver reads the Plan to decide |
| Silent | After execution; the human reads the Plan to audit |

The Plan's *structure* is identical across modes — the same 10 elements ([Resolution Plan Specification § 2](Resolution-Plan-Specification)). This is what makes Silent mode acceptable risk: the spectator can always see *why* the agent did what it did, with the same depth a reviewer would have seen before approval.

---

## 8. How the Mode interacts with the Trust Phase

The Phase and Mode are decoupled but related:

- **The Phase recommends a Mode.** A Phase 4 agent (Enterprise) is recommended `Silent`. A Phase 1 agent (Drafting per [Phased Autonomy Reference](Phased-Autonomy-Reference#1-overview)) is recommended `Drafting`. The Control Center shows the recommendation, the rationale, and an "accept recommendation" button.
- **The customer overrides freely.** Going *toward more gating* than the Phase recommends is always allowed and never warned. Going *toward less gating* than the Phase recommends requires a typed rationale and produces a `customer_override_above_phase` audit event.
- **The Phase still auto-rolls back the recommendation.** If the Trust Score drops below the Phase's floor, the Phase demotes and the recommendation changes. The customer's Mode does not automatically change; they receive a notification and decide.
- **Phase floors are never platform floors.** The Phase is advisory. The platform floors in § 4 are absolute and apply regardless of Phase.

The reverse-naming convention to avoid confusion in the UI:

| In the wiki and engineering | In the customer UI |
|---|---|
| Trust Phase: Drafting / Startup / Approval / Enterprise | "Recommended autonomy level" |
| Autonomy Mode: Drafting / Approval / Silent | "Your autonomy choice" |

---

## 9. Edge cases

- **Mode change mid-flight.** A ticket already in `awaiting_approval` does not retroactively switch when the customer changes the Mode. The ticket completes under the Mode that was active when it was created. New tickets use the new Mode.
- **Per-playbook Mode for cross-department sagas.** When a saga ticket has children in multiple departments, each child uses *its own agent's Mode*. The parent saga ticket itself uses the *originating department's Mode*. If a customer wants a saga gated end-to-end, they set the originator to Approval; per-child overrides still apply.
- **Mode for the Atlantis Manager.** The Manager is an orchestrator, not a side-effecting agent. It executes via the department agents, each of which uses its own Mode. The Manager's own Mode is fixed at `Approval` for configuration changes (per § 4 — identity-class actions) and `Silent` for read-only queries.
- **Mode during incidents.** A customer admin can issue an emergency `pause_agent` per [Control Center § 6](Control-Center#6-emergency-controls-customer-admin-only), which suspends the agent regardless of Mode. Resuming returns to the configured Mode.

---

## 10. Forbidden

- **Bypassing platform floors.** No Mode, no customer setting, no admin override can disable the floors in § 4. They are enforced at the Action Executor.
- **Silent mode for identity-class actions.** Provisioning a new admin, expanding a Role, rotating production credentials — these always require human approval.
- **Hidden Mode changes.** Every Mode change is audited with a typed rationale (for changes toward less gating).
- **Mode changes by an agent.** Only humans can change the Mode. An agent suggesting a Mode change must route through the same `Configuration` Plan and approval flow as any other admin action.
- **Different Modes for the same agent across two simultaneous sessions.** The Mode is a property of the agent within the tenant, not the session. Two admins viewing the same agent see the same Mode.

---

## 11. When to revisit

- Customers persistently override the Phase recommendation in the same direction — the Phase formula may need recalibration ([Control Center § 5.2](Control-Center#52-inputs)).
- Silent mode produces customer-impacting incidents — tighten the floors or the rate limits; review the anomaly detection thresholds.
- A class of actions is consistently classified `Approval` but always approved — promote the action class to Silent-eligible; revisit [Action Risk Classification](Action-Risk-Classification).
- Mode-change audit events spike for a tenant — possible churn signal; the Customer Success Manager should engage.
- A regulator requires "no auto-execute" for a class of customers — make the Mode override-able by a Domain Knowledge pack (regulated industries get forced-to-Approval until human override).

Product owns the Mode UX. Security owns the floor enforcement. Engineering owns the safety rails. Founders own the Touchstone 13 framing that makes spectating a first-class experience.

---

## Cross-references

- [Phased Autonomy Reference](Phased-Autonomy-Reference) — the system-tracked Trust Phase that recommends a Mode
- [Resolution Plan Specification](Resolution-Plan-Specification) — the artifact rendered in every Mode
- [Live Activity Stream](Live-Activity-Stream) — the always-on spectator surface
- [Approval Workflow Framework](Approval-Workflow-Framework) — what Approval mode routes through
- [Action Risk Classification](Action-Risk-Classification) — the platform floors that override every Mode
- [Control Center](Control-Center) — where Mode is configured, audited, and exercised
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — sets Mode for itself and routes Mode-change requests
- [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) — the Autonomy step at activation
- [Playbook Customization Model](Playbook-Customization-Model) — per-playbook Mode overrides
- [Runaway Prevention and Cost Controls](Runaway-Prevention-and-Cost-Controls) — the safety rails detail
- [Master Blueprint Index](Master-Blueprint-Index)
