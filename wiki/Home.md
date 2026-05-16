# Atlantis Wiki

**The single source of truth for every agent in the Atlantis Enterprise AI Operating System.**

Every agent reads this Wiki before acting. Every human contributing to the platform follows the conventions here. This is not documentation about the platform — this is the platform's brain.

> **Status:** Active · **Version:** Strategic Plan v2.0 + Operational Layer v1 + Engineering Blueprint v1 · **Updated:** 2026-05-15

---

## 📋 Start here

→ **[Master Blueprint Index](Master-Blueprint-Index)** — the complete table of contents, including everything authored, in progress, and proposed.

→ **[Business Workflows](Business-Workflows)** — every workflow Atlantis supports, across the customer journey (lead → renewal) and the employee journey (interview → offboarding). Also browseable interactively at [/workflows.html](https://hadu610.github.io/Enterprise-Atlantis/workflows.html).

→ **[Customer Journeys — Startup / Medium / Enterprise](Customer-Journeys)** — how a 5-person startup, a 500-person mid-market company, and a 50,000-person enterprise each get started, build, and operate their AI company on Atlantis.

If you are new to the Wiki, read these four foundation pages **in order**:

1. **[Wiki Conventions](Wiki-Conventions)** — page structure and metadata block
2. **[How Agents Use This Wiki](How-Agents-Use-This-Wiki)** — the agent reading protocol
3. **[Wiki Governance](Wiki-Governance)** — edit approval, version control
4. **[Page Template](Page-Template)** — skeleton for authoring new pages

---

## The three halves of the Wiki

### A · Strategic Plan v2.0 — the *why*

Why we are building this, what we are building, and how it differs from every competitor.

- [Executive Summary](Executive-Summary)
- [The Six Barriers](The-Six-Barriers)
- [Product Concept](Product-Concept)
- [Competitor Analysis](Competitor-Analysis)
- [Advantages and Risks](Advantages-and-Risks)
- [Product Requirements](Product-Requirements)
- [Build Roadmap](Build-Roadmap)
- [Strategic Considerations](Strategic-Considerations)
- [Next Steps](Next-Steps)

### B · Operational Layer — the rules every agent follows

#### Wiki Foundation

- [Wiki Conventions](Wiki-Conventions) · [How Agents Use This Wiki](How-Agents-Use-This-Wiki) · [Wiki Governance](Wiki-Governance) · [Page Template](Page-Template)

#### Platform Rules

- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
- [Rollback Procedures](Rollback-Procedures)

#### Shared Vocabulary

- [Unified Entity Model](Unified-Entity-Model)
- [Glossary](Glossary)

#### Agent Playbooks

- [HR Agent](HR-Agent-Playbook) · [Finance Agent](Finance-Agent-Playbook) · [Marketing Agent](Marketing-Agent-Playbook) · [Sales Agent](Sales-Agent-Playbook) · [Legal Agent](Legal-Agent-Playbook) · [Operations Agent](Operations-Agent-Playbook) · [Dev Agent](Dev-Agent-Playbook)

### C · Engineering Blueprint — the *how* for code

Decisions, rationale, alternatives considered, and revisit conditions. Every page in this section follows the same structure so the blueprint stays maintainable when strategy changes.

- [Coding Standards](Coding-Standards) — what we draw from (Google, Airbnb, PEP 8, Effective Go, OWASP), and our additions
- [Technology Stack](Technology-Stack) — languages, frameworks, databases, infra, AI providers, with rationale and alternatives
- [Architecture Principles](Architecture-Principles) — the 17 constitutional rules of the platform's architecture (incl. multi-tenancy by design and managed-first / BYOC)
- [Cross-Agent Coordination](Cross-Agent-Coordination) — how agents work on the same entity without conflict: entity-keyed action queue, Action Executor, OCC, sagas, leases, conflict arbitration
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) — model routing, prompt versioning, eval gates, safety
- [Security and Data Policy](Security-and-Data-Policy) — classification, encryption, IAM, vuln management, compliance, IR
- [Observability Standards](Observability-Standards) — golden signals, SLOs, logging, metrics, tracing, on-call
- [API Design Standards](API-Design-Standards) — REST/gRPC, versioning, error model, idempotency, OpenAPI
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering) — trunk-based, deploys, rollback, feature flags
- [Testing Strategy](Testing-Strategy) — the test pyramid + AI eval suites
- [Documentation Standards](Documentation-Standards) — where each kind of docs lives
- [Agent Skills Strategy](Agent-Skills-Strategy) — adopt Anthropic's published skills (PPTX, DOCX, XLSX, PDF); build the moat (validation gates, Domain Playbooks); registry, governance, tier-access
- [Runaway Prevention and Cost Controls](Runaway-Prevention-and-Cost-Controls) — hard limits on loops, token explosions, cascade workflows; per-task / per-agent / per-tenant / platform circuit breakers and kill switches
- [Prompt Injection Defence and Secret Protection](Prompt-Injection-Defence-and-Secret-Protection) — seven-layer defence: untrusted-content boundary, system prompt isolation, tool schema enforcement, capability scopes, secret-isolation architecture, output filtering, detection
- [Coding Agent Skills](Coding-Agent-Skills) — day-1 adoption list for frontend + backend coding skills; Anthropic-published `review` / `security-review` / `simplify` / `init` / `skill-creator` mandatory from commit #1; Tailwind / Vitest / Playwright / Semgrep / Snyk / Trivy / OpenAPI 3.1 are the standard tooling stack

### Operations playbooks

- [Incident Response Playbook](Incident-Response-Playbook) — Sev1–Sev4 response with comms templates and regulatory notification windows

### Business blueprint

- [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure) — phase-by-phase team growth, role profiles, compensation philosophy
- [FinOps Strategy](FinOps-Strategy) — unit economics, LLM cost discipline, cloud cost governance
- [Pricing and Packaging](Pricing-and-Packaging) — tiers, included quotas, overages, add-ons, discount governance

### Domain Knowledge — authored by Domain Expert Councils

- [Domain Knowledge Index](Domain-Knowledge-Index) — entry point to jurisdiction-specific pages

---

## The six barriers (one-line reminders)

This Wiki is the operational answer to the [six structural barriers](The-Six-Barriers):

| # | Barrier | Pages that solve it |
|---|---|---|
| **B1** | Compound failure | [Validation Gate Specifications](Validation-Gate-Specifications) · [Rollback Procedures](Rollback-Procedures) · [Testing Strategy](Testing-Strategy) |
| **B2** | Domain expertise gap | [Domain Knowledge Index](Domain-Knowledge-Index) · all [Agent Playbooks](HR-Agent-Playbook) |
| **B3** | Enterprise data silos | [Unified Entity Model](Unified-Entity-Model) · [Technology Stack § Data layer](Technology-Stack#data-layer) |
| **B4** | Agent identity & security | [Action Risk Classification](Action-Risk-Classification) · [Security and Data Policy](Security-and-Data-Policy) |
| **B5** | Trust & change management | [Phased Autonomy Reference](Phased-Autonomy-Reference) · [Approval Workflow Framework](Approval-Workflow-Framework) |
| **B6** | Breadth complexity | [Architecture Principles](Architecture-Principles) · [How Agents Use This Wiki](How-Agents-Use-This-Wiki) |

---

## How this Wiki updates itself

Agents can author **draft** pages when they discover a gap (a missing jurisdiction page, a new task type, a recurring escalation pattern). Drafts route to the relevant Domain Expert Council for promotion to `Approved`.

Humans author and maintain `Approved` pages. The Wiki's `git` history is the source of truth; every change is reviewed.

**The Wiki always wins** — if code disagrees with the Wiki, the code is wrong. See [Wiki Governance § 8](Wiki-Governance#8-conflict-between-wiki-and-code).

---

## Pitch site and in-site Wiki viewer

- Public pitch site: [hadu610.github.io/Enterprise-Atlantis](https://hadu610.github.io/Enterprise-Atlantis/) (when GitHub Pages is enabled)
- In-site Wiki viewer (same content, brand-styled): [hadu610.github.io/Enterprise-Atlantis/wiki.html](https://hadu610.github.io/Enterprise-Atlantis/wiki.html)
- Source repo: [github.com/hadu610/Enterprise-Atlantis](https://github.com/hadu610/Enterprise-Atlantis)

*Confidential — For internal use and authorised partner review only · Strategic Plan v2.0 + Operational Layer v1 + Engineering Blueprint v1 · 2026-05-15*
