# 3 · Product Concept & Core Differentiators

## Platform architecture overview

The platform is built in three horizontal layers. This architecture directly addresses **B6 (breadth complexity)** while enabling **B4 (agent identity)** and **B3 (data silos)** to be solved once at the Core level rather than rebuilt for each department.

| Layer | Components & barrier addressed |
|---|---|
| **Layer 1: Core Infrastructure** | Orchestration Engine, Zero-Trust Agent Identity (B4), Universal Data Bridge (B3), Knowledge Wiki, Ticketing System, Audit Engine — built once, shared by all departments |
| **Layer 2: Department Agents** | HR, Finance, Marketing, Sales, Legal, Operations, Dev — each a modular plugin to the Core; Domain Expert Councils own each module (B2); Validation Gates at every handoff (B1) |
| **Layer 3: Customer Interface** | Console, Onboarding Interview, Trust Dashboard (B5), Change Management Module (B5), Activity Tracking, Integration Marketplace |

## Four core pillars

- **AI Department Agents** — Dedicated autonomous agents for HR, Finance, Marketing/Sales, Legal, Operations, and Software Development — each with domain-expert-validated knowledge, jurisdiction awareness, and confidence-bounded decision-making.
- **AI Development Team Agent** — The category-defining differentiator. An autonomous software engineering agent that receives feature requests via the ticketing system, writes production code per wiki standards, and deploys through a governed pipeline — with validation gates at every step.
- **Unified Governance Core** — Orchestration Engine, Zero-Trust Agent Identity, Validation Gate Architecture, complete audit trail, and the Phased Autonomy Model — the infrastructure layer that makes cross-department agents safe and auditable.
- **Centralized Knowledge Wiki** — All domain playbooks, compliance rules, coding standards, company context, and agent instructions stored in a version-controlled wiki that every agent reads before acting.

---

## The onboarding experience

New customers are guided through a structured business interview that simultaneously collects the information needed to configure agents AND begins the Data Readiness Assessment required before any agent can act autonomously.

- **Company profile** — industry, size, geography, regulatory environment, operating jurisdictions (drives jurisdiction-aware agents — B2)
- **Business strategy** — revenue model, growth goals, competitive positioning
- **Existing operations** — current tools, processes, team structure, existing data systems (drives Universal Data Bridge configuration — B3)
- **Data quality assessment** — completeness and freshness of key data sources per department (B3)
- **Risk tolerance** — which action types require approval at which autonomy phases (drives Phased Autonomy Model setup — B5)
- **Priority pain points** — where automation is most urgent

Based on the interview, the platform auto-configures agent teams, pre-populates the wiki with relevant enterprise blueprints from our playbook library, and presents a Department Activation Checklist showing data readiness status for each department.

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
