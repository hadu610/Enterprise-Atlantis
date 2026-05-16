# 3 · Product Concept & Core Differentiators

## Platform architecture overview

The platform is built in three horizontal layers. This architecture directly addresses **B6 (breadth complexity)** while enabling **B4 (agent identity)** and **B3 (data silos)** to be solved once at the Core level rather than rebuilt for each department.

| Layer | Components & barrier addressed |
|---|---|
| **Layer 1: Core Infrastructure** | Orchestration Engine, Zero-Trust Agent Identity (B4), Universal Data Bridge (B3), Knowledge Wiki, Ticketing System, Audit Engine — built once, shared by every agent above |
| **Layer 2: Dev Agent Foundation** | The Dev Agent sits directly on top of Core Infrastructure and **below** the department agents. Every customer-specific connector, playbook extension, and feature is shipped by the Dev Agent. Validation Gates at every step (B1). This is the loop no business-OS competitor has closed. |
| **Layer 3: Department Agents** | HR, Finance, Marketing, Sales, Legal, Operations — each a modular plugin to the Core; Domain Expert Councils own each playbook (B2); Validation Gates at every handoff (B1); customisations to each are shipped by the Dev Agent (Layer 2) |
| **Layer 4: Customer Interface** | Console, AI Business Consultant onboarding, Trust Dashboard (B5), Change Management Module (B5), Activity Tracking, Integration Marketplace |

## Four core pillars

- **Six AI Department Agents** — Dedicated autonomous agents for HR, Finance, Marketing, Sales, Legal, and Operations — each with domain-expert-validated knowledge, jurisdiction awareness, and confidence-bounded decision-making.
- **Software Development Agent — the foundation underneath the other six.** The Dev Agent is not a peer department; it is the foundation that makes every other department customisable to each customer's business. **Every customer-specific extension** — a new connector for a system we don't yet support, a workflow tuned to the customer's industry, a feature request from the customer's console — **is shipped by the Dev Agent.** Tickets → spec → code → reviewed PR, with validation gates at every step. Without it, every customer engagement would require a human platform team. With it, the platform builds itself.
- **Unified Governance Core** — Orchestration Engine, Zero-Trust Agent Identity, Validation Gate Architecture, complete audit trail, and the Phased Autonomy Model — the infrastructure layer that makes cross-department agents safe and auditable.
- **Centralized Knowledge Wiki** — All domain playbooks, compliance rules, coding standards, company context, and agent instructions stored in a version-controlled wiki that every agent reads before acting.

---

## The onboarding experience — *AI Business Consultant, five minutes to value*

Day one is the most important day of the customer relationship. We do not ask the customer to set up a cloud, fill in a procurement form, or navigate an integration wizard. We ask them to **describe their business** — and an AI Business Consultant produces a complete, citable, custom-fit blueprint in minutes.

The flow:

1. **Describe the business** *(60 seconds)* — industry, what you do, team size, jurisdictions, the painful work you wish would just happen. Free text; no taxonomies.
2. **The Consultant researches** *(2–5 minutes, live activity feed)* — public information about similar businesses of similar size; matching playbooks pulled from our Wiki; tool-stack and integration suggestions; jurisdiction-aware compliance match. Every recommendation is cited.
3. **Custom blueprint produced** — recommended department lineup ranked by impact, per-department starting playbooks, recommended integrations, Phased Autonomy starting point (Drafting Mode by default), and a 30 / 60 / 90 day plan.
4. **Customer reviews and chooses** — accept as-is, click any line to edit in plain English, **pick which departments to activate first**. Most customers start with two (e.g. Sales + Marketing for revenue-stage; HR + Finance for compliance-stage; Dev for engineering-led teams). Others can be turned on later from the same console.
5. **Activation** — agents spin up on our managed cloud immediately. Integrations are connected via OAuth as the active agents need them, not all up-front.

**No cloud account on the customer's side. No SRE on call. No environment setup.** This is the design promise — and the path of least friction that wins SMB and mid-market deals, and lands enterprise *business units* before central IT brings them into the corporate envelope.

For customers who need their own cloud — regulated industries, large enterprises, sovereignty constraints — [bring-your-own-cloud](Architecture-Principles) is available as an upmarket path. **Managed quick-start is the default; BYOC is the option.**

See [AI Business Consultant · Quick-Start Onboarding](AI-Business-Consultant-Onboarding) for the full design, what the Consultant must never do, and how this maps to the six-barrier moat.

---

## Phased Autonomy Model

| Phase | Name | Key activities | Milestone & barrier solved |
|---|---|---|---|
| **1** | **Drafting Mode** | Agents draft plans, requirements, and specs. No autonomous execution. All validation gates open for review. Human approves every action. | Establishes trust baseline. **B5:** employees see agent outputs without risk. |
| **2** | **Startup Mode** | Agents execute low-risk Read actions autonomously. All Write/Delete/Financial actions require sign-off. Validation gates active. Trust Score Dashboard visible. | **B1:** compound errors caught early. **B5:** trust score begins accumulating evidence. |
| **3** | **Approval Mode** | Agents operate with broader Write autonomy. Financial transactions, code deployments, HR decisions go through approval queue. Risk-tiered auto-approval for Read+low-Write. | **B4:** scoped OAuth tokens activated. **B6:** second department can be added once Phase 3 is stable. |
| **4** | **Enterprise Mode** | Policy-based auto-approval for pre-approved task categories. Delete and Financial actions always require human confirmation (hard rule). Human oversight at exception level. | **B1:** validation gates run silently. All 6 barriers fully operational. Full SLA active. |

---

## AI coding best practices (built-in)

- **File Size Limits** — Maximum lines of code per file enforced at agent level (configurable, default 300 lines). Files exceeding limits trigger automatic refactoring ticket.
- **Agent Skills Registry** — Reusable, versioned agent capabilities — wiki entries that define how to perform specific task types. Dev agents consult the registry before writing new code to prevent duplication.
- **Autonomous Operation** — Dev agent plans, scaffolds, writes, tests, and submits PRs autonomously for approved task types. Validation gates check test coverage, lint scores, and security scan results before the PR is raised.
- **Wiki-First** — All coding standards, architecture decisions, naming conventions, and team patterns live in the wiki. Dev agents read the relevant wiki pages before writing a single line. Human engineers can update wiki rules and all future agent output immediately reflects them.
- **Version Control** — Every component in its own repo with semantic versioning. Native GitHub/GitLab integration. All dev agent PRs are attributed to the agent's identity, not to a human user — maintaining accurate contribution tracking.
- **Activity Tracking** — Full per-agent and per-employee activity logs. Dev agent actions (commits, PRs, deployments, rollbacks) are visible alongside human engineer actions in a unified timeline.

---

→ Next: [Competitor Analysis](Competitor-Analysis)
