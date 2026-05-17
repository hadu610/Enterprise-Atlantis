# Atlantis Manager Playbook

> **Type:** Playbook · **Owner:** Product / CTO · **Status:** Approved · **Applies to:** Atlantis Manager · All humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

The **Atlantis Manager** is the platform's primary chat surface. Every potential customer who visits the marketing site, every customer admin signing up, and every employee inside an active tenant interacts with the same Atlantis Manager — an orchestrator agent that has mastered the platform so the human does not have to.

This page specifies what the Atlantis Manager is, how it differs from the seven department agents underneath it, the tools it can call, the identity and permission rules it operates under, and the conversational modes it serves (pre-sales, onboarding, day-to-day work, monitoring).

> **The reframe this page makes:** *most enterprise SaaS forces every user to master the UI. Atlantis flips it.* The default way to use Atlantis is to chat with an AI that has already mastered the platform. The Control Center UI is always available, but never required. See [Strategy Touchstone 12](Master-Blueprint-Index#k--strategy-touchstones).

---

## 1. What the Atlantis Manager is

The Atlantis Manager is an **orchestrator agent**. It sits above the seven department agents (HR, Finance, Marketing, Sales, Legal, Operations, Dev) and routes work to them. It is not the eighth department agent — it owns no department-specific operational playbooks. Its job is to:

- **Listen** in plain language (voice or text) to whoever is talking to it.
- **Disambiguate** intent — "hire a backend engineer" → an HR job-req playbook; "pay this invoice" → a Finance AP playbook; "tell me what happened yesterday" → a Live Activity query.
- **Plan** the work using the [Resolution Plan Specification](Resolution-Plan-Specification) — every action it surfaces carries the same 10-element Plan the department agents produce.
- **Route** the work to the right department agent, or execute directly when the operation is cross-cutting (e.g. "show me everything Finance Agent did yesterday").
- **Surface** the right Control Center view when a visual answer is faster than a textual one (e.g. fleet view, activity stream, approval queue, a specific ticket).
- **Carry context** across a conversation — knows which page the user is on, which playbooks the customer has activated, which tenant they belong to, which permissions they hold.

It is implemented as a thin layer over the same APIs the Control Center UI uses. The [Dual Surface Architecture](Dual-Surface-Architecture) page specifies the parity contract: every customer-facing capability must be reachable from both the Manager chat and the Control Center UI.

---

## 2. The personas the Manager serves

The Manager is the same agent across all four personas; only the prompt, scope, and tool set differ per session.

| Persona | Where | Default conversation | Permissions |
|---|---|---|---|
| **Anonymous visitor** | Marketing site (homepage, workflows, build) | Explain Atlantis, walk a demo workflow, answer pricing questions, route to Build flow | Read-only marketing content; no tenant access |
| **Onboarding customer** | First-time `build.html` session, then the activation handoff | Walk through Company Operation Builder conversationally — industry, size, playbook picks, customizations, autonomy mode | Provisional tenant scope until activation completes |
| **Customer admin** | Inside the active tenant | Configure autonomy, change playbooks, audit a sequence of actions, run emergency controls via chat | Full tenant scope; same Role bundle as the admin's identity |
| **Employee** | Inside the active tenant | Submit a ticket via chat ("hire a backend engineer"), check status of work in flight, ask for explanations | Employee Role scope (self + own tickets); never above the human's permissions |

Critically: **the Manager never holds permissions above the human it is talking to.** Each session inherits the human's Role bundle ([Identity and Access Control § 3](Identity-and-Access-Control#3-role-schema)). If the human cannot approve a payment, neither can the Manager — it will produce a Resolution Plan and route the approval to the correct approver per [Approval Workflow Framework](Approval-Workflow-Framework).

---

## 3. Conversational modes

The Manager runs in one of five **modes** at any given moment. The mode is set by context, not by the human picking it; the Manager announces the mode when it transitions.

| Mode | Triggered by | What the Manager does |
|---|---|---|
| **Pre-sales** | Anonymous visitor on marketing site | Answer questions about Atlantis, walk demos, route to relevant pages, never executes tenant work |
| **Onboarding** | Visitor on `build.html` or "Get started" click | Runs the Company Operation Builder conversationally; picks industry/size/playbooks/customizations/autonomy; ends with activation handoff |
| **Task execution** | Authenticated user describes a task | Produces a [Resolution Plan](Resolution-Plan-Specification); routes to the right department agent; surfaces the result |
| **Investigation** | Authenticated user asks "what / why / when / who" | Queries the Activity Log and Trust Score; renders the answer with citations; offers to open the relevant Control Center view |
| **Configuration** | Customer admin asks to change settings, playbooks, autonomy | Edits tenant config via the same APIs the Control Center UI calls; produces an audit event; confirms |

The Manager **never silently switches modes**. Every transition is verbalised: "I'll switch to investigation mode and check the activity log for yesterday — one second." This is part of the [Conversational UX Principles](Conversational-UX-Principles).

---

## 4. The Manager's tool catalogue

The Manager is implemented with a fixed set of tools (the standard agent-tool pattern). Each tool corresponds to a platform capability. The set is bounded — the Manager cannot do anything not in this list.

| Tool category | Examples | Scope check |
|---|---|---|
| **Read** | `crm.query`, `tickets.list`, `audit.search`, `trust_score.read` | Tenant + Role scoped |
| **Plan** | `plan.draft` (produce Resolution Plan), `playbook.lookup` | Read-only |
| **Route** | `ticket.create`, `ticket.assign_to_agent`, `ticket.escalate` | Subject to action risk class |
| **Surface** | `control_center.open`, `chart.render`, `live_stream.filter` | Read-only |
| **Configure** | `playbook.customize`, `autonomy.set`, `guardrail.adjust` | Admin Role only |
| **Onboarding** | `tenant.provision_draft`, `tenant.activate`, `builder.set_picks` | Onboarding mode only |
| **Marketing** | `page.navigate`, `calculator.set`, `demo.run` | Pre-sales mode only |

Tools that produce side effects always emit a [Resolution Plan](Resolution-Plan-Specification) first; the human approves the Plan; the Manager then calls the tool. In Silent mode ([Autonomy Modes](Autonomy-Modes)) the Plan is rendered retroactively after the tool runs.

The full tool registry, with parameters and authorisation rules, lives in `engine/atlantis-manager/tools.ts` (Phase 1 deliverable).

---

## 5. The system prompt model

The Manager's behaviour is governed by a structured system prompt assembled from these layers, in order:

1. **Identity layer** — who the Manager is, the touchstones it must respect, the tone (factual, concise, no upsell, no hallucination).
2. **Persona layer** — which of the four personas is speaking (visitor / onboarding / admin / employee).
3. **Mode layer** — which of the five modes is active (pre-sales / onboarding / task / investigation / config).
4. **Tenant context layer** — for authenticated sessions: tenant name, activated playbooks, autonomy modes per agent, guardrail thresholds, recent activity summary.
5. **Page context layer** — which page the user is on; what is currently visible on screen.
6. **Catalog layer** — for onboarding mode: the full [Company Operation Builder Catalog](Company-Operation-Builder-Catalog).
7. **Conversation history** — the last N turns of the current session.

Layers 1–6 are **prompt-cached** per the [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) — they change rarely and dominate token cost. The conversation history is the only uncached layer per turn. This is what makes Sonnet 4.6 fast and cheap enough to be the primary surface.

The default model for the Manager is **Sonnet 4.6**. Investigation queries that require deep reasoning over long audit logs may route to **Opus 4.7** with explicit cost approval (see [Runaway Prevention](Runaway-Prevention-and-Cost-Controls)).

---

## 6. Identity and permissions

The Manager is provisioned as an Atlantis Agent identity per [Identity and Access Control](Identity-and-Access-Control). Specifics:

- **Agent name:** `atlantis_manager`
- **Title:** *Atlantis Manager*
- **Department:** none (orchestrator)
- **Manager (human):** the tenant's Customer Admin by default; the Atlantis Founder for anonymous-visitor sessions on the marketing site
- **Session identity:** every conversation creates a *session-scoped* identity inheriting the human's Role bundle plus the Manager's own tool-call permissions; the session ends when the conversation ends
- **Permission ceiling:** the intersection of (a) the Manager's tool registry, (b) the human's Role bundle. The Manager cannot exceed either.
- **The asymmetry holds:** the Manager **cannot approve** an action it produced, even in Silent mode. Approvals always route to a human approver per [Approval Workflow Framework § 9](Approval-Workflow-Framework#9-approval-impersonation).

For anonymous marketing-site visitors, the session identity carries the role `anonymous_visitor` — read-only access to public marketing content, no tenant write capability, no PII collection without consent.

---

## 7. The Manager's relationship to the seven department agents

The Manager **delegates** to department agents; it does not duplicate their playbooks. The flow is:

```
Human ──chat──> Atlantis Manager
                      │
                      ├─ tool: plan.draft → Resolution Plan
                      │
                      ├─ tool: ticket.create → enters Unified Ticketing
                      │
                      └─ tool: ticket.assign_to_agent(HR Agent)
                                         │
                                         └─ HR Agent picks up ticket, executes
                                                 │
                                                 └─ audit events surface in Live Activity Stream
                                                         │
                                                         └─ Manager summarises back to human
```

Two important properties:

- **The Manager never short-circuits the substrate.** Every action becomes a ticket; every ticket runs through the [Approval Workflow Framework](Approval-Workflow-Framework); every result emits an audit event. The Manager is not a separate execution path — it is a separate *user interface* on top of the same execution path.
- **Department agents own their operational playbooks.** When the Manager needs to execute "Run monthly close", it does not contain the close procedure; it looks up the playbook in the Finance Agent's `§ Operational Playbooks` section ([Operational Playbook Index](Operational-Playbook-Index)) and routes the ticket.

This separation is what keeps the Manager small enough to be fast, and the department agents specialised enough to be accurate.

---

## 8. Onboarding mode in detail

When a visitor lands on the marketing site and engages the floating Manager pill (or clicks "Get started"), the conversation enters **onboarding mode**. The Manager runs the [Company Operation Builder](Company-Operation-Builder-Catalog) flow conversationally while `build.html` is the visual companion the visitor may or may not look at.

The onboarding script, by stage:

| Stage | Manager prompt (illustrative) | What gets set |
|---|---|---|
| 1 · Hook | "Tell me about your business in a sentence or two." | Free-text hint for industry/size detection |
| 2 · Industry | "Sounds like a SaaS company. Did I get that right?" | `industry` chip on `build.html` |
| 3 · Size | "Roughly how many people work there?" | `size` chip |
| 4 · Jurisdiction | "Where are you incorporated?" | Domain Knowledge pack to attach |
| 5 · Pick playbooks | Walks the catalog; suggests defaults for (industry × size); explains tradeoffs | Catalog checkboxes |
| 6 · Customize | Offers playbook customization where the default may not fit ("Most SaaS startups handle PTO by Slack approval — want me to wire that in?") | Per-playbook overrides |
| 7 · Autonomy | Explains Drafting / Approval / Silent; recommends per agent; respects customer choice | Per-agent autonomy mode |
| 8 · Guardrails | Reviews default thresholds; offers customization | Per-tenant guardrail config |
| 9 · Activate | Summarises the spin-up; one confirmation | `tenant.activate` call |

At any point the visitor can say "I'd rather click" → Manager surfaces `build.html` with the picks pre-loaded and steps back. At any point the visitor can say "what would you do?" → Manager produces a Resolution Plan for the picks it is recommending, with pros / cons / cost / risk.

---

## 9. Pre-sales mode in detail

For anonymous visitors who have not yet activated, the Manager runs in **pre-sales mode**. Constraints:

- **No PII collection** unless the visitor offers it; no email-capture pressure; no upsell pattern.
- **Honest answers** about competitor products, limitations, and what Atlantis cannot do yet (per [Wiki Conventions § 7](Wiki-Conventions#7-forbidden-in-operational-pages)).
- **Citations** when claiming numbers — every cost / time / accuracy figure links back to the relevant wiki page or the calculator.
- **Routing** — when the visitor asks a question best answered by a page, the Manager opens the page and continues the conversation, instead of paraphrasing the page poorly.

The pre-sales prompt explicitly prohibits hallucination of features. The Manager will say "I don't know — let me show you the wiki page that covers this" before inventing an answer.

---

## 10. Failure modes and degraded states

| Failure | Manager behaviour |
|---|---|
| Anthropic API unreachable | Renders a degraded chat that explains the outage and offers the UI alternative ("I'm offline. The Build page works without me.") |
| Tool call fails (CRM unreachable, ticket store error) | Surfaces the error truthfully; does not retry silently; offers the human the option to retry or escalate |
| Hallucination detected (output contradicts wiki) | Self-corrects in the next turn; logs a `hallucination_detected` audit event; notifies Engineering |
| Confidence too low | Refuses to produce a Plan; asks the human a clarifying question; does not guess |
| Out-of-scope request | Routes to the right surface ("That's a question for your domain expert. I can open a ticket to {{Council}} — want me to?") |
| Permission denied | Explains *which* permission is missing and *who* can grant it; opens the request ticket if the human asks |

No silent failure. No "I'm sorry, I can't help with that." No infinite retry. Every failure produces an audit event and a clear next step.

---

## 11. Forbidden

- **Acting above the human's permission ceiling.** The session identity is the intersection of Manager tools and human Role; never expanded.
- **Approving an action the Manager produced.** The asymmetry from [Identity and Access Control § 6](Identity-and-Access-Control#6-the-asymmetry-that-stays) is platform-wide.
- **Executing outside the substrates.** Every action must flow through a ticket. No direct CRM writes that skip the ticket store.
- **Hallucinating wiki content.** The Manager cites wiki pages with deep links; if it cannot find a citation, it says so.
- **Hidden mode transitions.** Every mode switch is verbalised in the conversation.
- **Marketing language in operational sessions.** Pre-sales mode is the only mode where persuasive tone is acceptable; all other modes are factual.
- **Persistent memory across tenants.** Session memory ends when the session ends; cross-session memory lives only in the tenant's wiki + CRM, never in the Manager's prompt.
- **Bypassing the Resolution Plan.** Every side-effecting action requires a Plan, even in Silent mode (the Plan is rendered retroactively in Silent).

---

## 12. Phasing

The Manager ships in three phases aligned with the [Build Roadmap](Build-Roadmap).

| Phase | What ships | Why |
|---|---|---|
| **Phase 1** (Core Infra) | Pre-sales + Onboarding modes on the marketing site, scripted-first then real-Claude API; tool set limited to read + plan + tenant.provision | Onboarding is the highest-leverage surface; we need it from day 1 to convert design partners |
| **Phase 2** (First two agents) | Task Execution + Investigation modes inside HR and Finance tenants; tool set expanded to ticket.create, ticket.assign, audit.search, trust_score.read | Live tenants need the Manager to be useful for daily work |
| **Phase 3** (Agent expansion) | Configuration mode for customer admins (autonomy, guardrails, playbook customization); voice input; tool set expanded to playbook.customize, autonomy.set, guardrail.adjust | Configuration is high-blast-radius; ships after the patterns are observable in production |

The floating Manager pill itself ships in Phase 1 across every marketing page and every Control Center view simultaneously — the UI surface area is the same in all phases; only the tool set changes.

---

## 13. When to revisit

- A class of visitor questions traces to a missing pre-sales answer — author the relevant wiki page so the Manager can cite it.
- Onboarding completion rate is below 70% — revisit the conversational stages; identify which stage drops users.
- Investigation mode is used more than Task Execution mode — likely indicates the Activity Log is hard to read; reconsider the visual fallback.
- Hallucination audit events exceed 1% of turns — recalibrate the system prompt; tighten the no-hallucination rules.
- The model spend per conversation exceeds the FinOps envelope ([FinOps Strategy](FinOps-Strategy)) — re-evaluate prompt caching, downsize the catalog layer for cached tokens, or batch-summarise audit log queries.
- A regulator or customer requests an export of every Manager conversation in a window — this must already be possible via the audit log; if it is not, treat as a Sev2 incident.

Product owns the Manager's UX and persona design. Engineering owns the tool registry and the prompt-assembly engine. The Founders own Touchstone 12 and decide when it is at risk.

---

## Cross-references

- [Master Blueprint Index § A.3 Platform Surfaces](Master-Blueprint-Index#a3--platform-surfaces--where-humans-supervise-the-fleet)
- [Conversational UX Principles](Conversational-UX-Principles) — how chat-first interactions are designed
- [Dual Surface Architecture](Dual-Surface-Architecture) — the chat/UI parity contract
- [Resolution Plan Specification](Resolution-Plan-Specification) — the 10-element artifact every action carries
- [Autonomy Modes](Autonomy-Modes) — Drafting / Approval / Silent
- [Live Activity Stream](Live-Activity-Stream) — the always-on spectator view
- [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) — the catalog the Manager walks in onboarding mode
- [Identity and Access Control](Identity-and-Access-Control) — the identity model the Manager operates under
- [Approval Workflow Framework](Approval-Workflow-Framework) — where Manager-routed actions go for approval
- [Control Center](Control-Center) — the visual surface that mirrors every Manager capability
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) — model choice, caching, routing
- [Runaway Prevention and Cost Controls](Runaway-Prevention-and-Cost-Controls) — cost envelope for Manager conversations
- [Master Blueprint Index](Master-Blueprint-Index)
