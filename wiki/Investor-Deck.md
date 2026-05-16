# Investor Deck · Atlantis

> **Type:** Investor-facing pitch artifact · **Owner:** Founders · **Status:** Draft · **Audience:** Seed / Series A investors · **Confidentiality:** Confidential — share under NDA · **Last reviewed:** 2026-05-16

A 12-slide deck distilled from the full [Strategic Plan v2.0](Executive-Summary). Each slide here gives the **key message**, the **supporting evidence**, and **speaker notes** for live delivery. When delivering, lean on the wiki pages linked at the end of each slide for depth in Q&A.

---

## Slide 1 · Cover

**Atlantis**
*The operating system of the AI-native enterprise.*

A coordinated team of specialised AI agents — HR, Finance, Sales, Marketing, Legal, Operations, and Software Development — inside one governance, identity, and data layer.

> Strategic Plan v2.0 · Confidential · 2026

**Speaker notes.** Anchor the meeting: *We are building the first platform that has solved the six root causes of enterprise AI failure. Today I want to walk you through the problem, our architecture, and why the window to win is now.*

---

## Slide 2 · The Problem

> **Key message.** 80% of enterprise AI projects fail in production — and they all fail for the same six reasons.

| Root cause | What goes wrong |
|---|---|
| **Reliability** | 95% per-step accuracy collapses to 60% across 10 chained steps. Confident, well-formatted output that is operationally wrong passes human review. |
| **Expertise** | Generic LLMs improvise where they should execute validated procedures. HR law, finance compliance, security engineering — each takes years of specialist judgment. |
| **Data unity** | CRM, ERP, HRIS, codebase — separate systems with no shared schema. 72–80% of RAG implementations underperform or fail within their first year. |
| **Agent security** | Teams share human credentials with agents because there is no standard for agent identity or scoped permissions. *(An AI agent deleted a production database in July 2025.)* |
| **Trust** | 55% of enterprises cite trust as the #1 blocker. Gartner projects 40% of agentic AI projects cancelled by 2027. |
| **Breadth** | Each new department adds a new data model, compliance surface, and failure mode. Cross-department orchestration is the hardest problem in enterprise AI. |

**Speaker notes.** Spend 90 seconds. *Every credible competitor solves one or two of these. Nobody has solved all six. That's our wedge.*

Backed by [The Six Barriers](The-Six-Barriers).

---

## Slide 3 · Market

> **Key message.** The market is rotating to buyers. Demand is supply-blocked, not demand-blocked.

- **$7B → $93B** — enterprise AI agent market, 2025 → 2032 (44.6% CAGR)
- **48%** — enterprises already deploying agentic AI
- **76%** — enterprises now **buy** rather than **build** AI
- **$37B** spent on generative AI in 2025 alone
- **80%** of those deployments fail in production today

**Speaker notes.** *Demand exists. The gap is supply-side — no one has built the right thing. We sell to buyers who have already failed at building it themselves.*

---

## Slide 4 · Our Solution

> **Key message.** Six architectural decisions built into the platform's core — not bolted on as features.

| Root cause | Our architectural decision |
|---|---|
| Reliability | **Validation Gates** between every agent — schema, business logic, confidence, contradiction checks |
| Expertise | **Domain Expert Councils** — lawyers, CPAs, compliance officers write the playbooks |
| Data unity | **Universal Data Bridge** — semantic normalisation across every connected system |
| Agent security | **Zero-Trust Agent Identity** — every agent has its own scoped OAuth keys |
| Trust | **Phased Autonomy** + **Change Management Module** — trust is earned, not assumed |
| Breadth | **Modular core** — shared orchestration; isolated department services |

**Speaker notes.** *This is the moat. None of these are individually impossible. Together they take a focused, well-funded competitor 24+ months to replicate — and that is our window.*

Backed by [Product Concept](Product-Concept), [Architecture Principles](Architecture-Principles).

---

## Slide 5 · Demo — Five Minutes to a Working AI Company

> **Key message.** Onboarding is the wedge. We collapse a six-month enterprise AI rollout into five minutes.

```
1. Customer describes their business (60 sec, plain English)
2. AI Business Consultant researches similar companies, pulls
   matching wiki playbooks, generates a custom blueprint (2–5 min)
3. Custom blueprint produced — ranked departments, integrations,
   30/60/90 day plan, every recommendation cited
4. Customer picks which departments to activate first
5. Agents spin up on our managed cloud — no infra setup
```

**Speaker notes.** *This is what Durable.ai pioneered for automation; we are doing it for an entire AI organisation. Show the live demo if available; if not, walk through this flow on the screen.*

Backed by [AI Business Consultant Onboarding](AI-Business-Consultant-Onboarding).

---

## Slide 6 · Product — Seven Departments on One Platform

> **Key message.** All-department coverage with software engineering inside the same governance fabric.

| Agent | What it does |
|---|---|
| **HR** | Hiring, onboarding, policy, compliance — jurisdiction-aware |
| **Finance** | Bookkeeping, close, AR/AP, forecasting — GAAP/IFRS validated |
| **Sales** | Pipeline hygiene, outreach, qualification, follow-up |
| **Marketing** | Campaigns, content, attribution, briefs |
| **Legal** | Contract review, jurisdiction-aware compliance, e-signing workflow |
| **Operations** | Vendor management, procurement, internal ticketing |
| **Software Development** | Tickets → spec → code → PR with validation gates |

All read from the same Wiki, share data through the same Universal Data Bridge, and coordinate through the same Action Executor.

**Speaker notes.** *Dev Agent is the category-defining differentiator. No business-OS competitor has it. No coding-agent competitor has the business operations. We are the only platform that closes the loop.*

Backed by the agent playbooks: [HR](HR-Agent-Playbook) · [Finance](Finance-Agent-Playbook) · [Sales](Sales-Agent-Playbook) · [Marketing](Marketing-Agent-Playbook) · [Legal](Legal-Agent-Playbook) · [Operations](Operations-Agent-Playbook) · [Dev](Dev-Agent-Playbook).

---

## Slide 7 · How Trust Ramps

> **Key message.** Trust is a product problem, not a sales problem. No customer is ever asked to trust an agent before they have witnessed its performance at lower autonomy.

```
01 Draft     →  Agents draft, you approve every action
02 Read      →  Agents read & summarise; humans still write
03 Approve   →  Agents act with your approval queue
04 Auto      →  Agents act within policy; humans handle exceptions
```

Every customer starts in **Draft**. The Trust Score Dashboard accumulates evidence. Movement between stages is **evidence-based**, never contractual. Delete and financial actions always require a human — hard rule, never configurable.

**Speaker notes.** *This is why our customers do not cancel. The pilot starts in Draft mode where there is literally no risk. By the time we ask them to go to Approve mode, they have months of trust-score evidence.*

Backed by [Phased Autonomy Reference](Phased-Autonomy-Reference).

---

## Slide 8 · Competitive Landscape

> **Key message.** The empty upper-right quadrant is the platform we are building. Every credible competitor sits in one of the other three.

```
                  Production-grade governance →
        ┌──────────────────────────┬──────────────────────────┐
        │  Governed but narrow     │  All-department +        │
   High │  · IBM watsonx           │  production governance   │
        │  · ServiceNow            │                          │
        │                          │  ★ Atlantis              │
        ├──────────────────────────┼──────────────────────────┤
        │  Point tools             │  Broad reach,            │
    Low │  · Devin / Cognition     │  weak governance         │
        │  · SAP Joule             │  · Microsoft Copilot     │
        │                          │  · Salesforce Agentforce │
        │                          │  · Workday / Sana        │
        └──────────────────────────┴──────────────────────────┘
                    Cross-department coverage →
```

Closest adjacent: **Durable.ai** — workflow-automation generator, $26.5M Series A. Strong on managed onboarding; not a business OS, no department agents, no BYOC. See [Competitor Deep Dive · Durable.ai](Competitor-Deep-Dive-Durable).

**Speaker notes.** *Microsoft, Salesforce, Workday will eventually attempt this. The gap is 3–5 years. Fifty enterprise customers with strong NPS before they catch up — that is the plan.*

Backed by [Competitor Analysis](Competitor-Analysis).

---

## Slide 9 · Business Model

> **Key message.** We price the outcome, not the input. Customers buy department capacity, not LLM credits.

| Tier | Annual fee | Best fit | Agents included |
|---|---|---|---|
| **Starter** | from **$30K** | Startups / SMB · 1–49 employees | 2 of 7 |
| **Growth** | from **$90K** | Medium business · 50–249 employees | 4 of 7 |
| **Enterprise** | from **$250K** | Enterprise · 250+ employees | All 7 + Dev Agent |
| **Enterprise Regulated** | from **$400K** | Healthcare · FS · defence | All + self-hosted LLMs |

**Expansion mechanics:** every customer adds departments as the Trust Score earns the next autonomy phase. **Net retention target: 125%** at steady state. Time-to-second-agent: 4 months.

Backed by [Pricing and Packaging](Pricing-and-Packaging), [FinOps Strategy](FinOps-Strategy).

**Speaker notes.** *Expansion is the unit-economics engine. Phase 1 customers start with two agents and grow into four. Phase 3 customers add Dev Agent. Every department earned is a multiplier.*

---

## Slide 10 · Go-to-Market

> **Key message.** Land-and-expand via the department that hurts most. Cross-sell the rest after Trust Score earns it.

**Sequence:**

1. **Months 1–6 — Design partners.** 3–5 design partners onboarded against Core Infrastructure + HR Agent in Draft mode. Free for 6 months in exchange for logo + 2 reference calls/quarter post-GA.
2. **Months 7–12 — First commercial customers.** HR + Finance reach Approval Mode in beta. First paying tier (Starter / Growth).
3. **Months 13–24 — Agent expansion.** Sales, Marketing, Ops, Dev agents ship. 20+ enterprise customers; Domain Playbook Marketplace beta.
4. **Months 25–36 — Full autonomy + scale.** 50+ enterprise customers; BYOC for regulated industries; mid-market self-serve tier.

**Buyer:** CHRO / CFO / CTO / COO with a departmental P&L. Business-unit-level land; central IT comes in once value is proven.

Backed by [Build Roadmap](Build-Roadmap), [Customer Journeys](Customer-Journeys), [Sales Agent Playbook](Sales-Agent-Playbook).

---

## Slide 11 · Roadmap

> **Key message.** Infrastructure before agents — always. We build the foundation that solves reliability, identity, data unity, and breadth *before* any agent goes live.

| Phase | Months | What ships | Milestone |
|---|---|---|---|
| **Phase 1** | 1–6 | Orchestration · Validation Gates · Zero-Trust Identity · Universal Data Bridge · Wiki · Ticketing | SOC 2 Type II readiness; 3–5 design partners |
| **Phase 2** | 7–12 | HR Agent · Finance Agent in Draft → Read mode | Trust Score Dashboard live; first commercial customers |
| **Phase 3** | 13–24 | Sales · Marketing · Ops agents · Dev Agent · Domain Playbook Marketplace | SOC 2 Type II certified; 20+ enterprise customers |
| **Phase 4** | 25–36 | Dev Agent in Approve + Auto · Legal Agent · BYOC · ISO 27001 · HIPAA | 50+ enterprise customers; mid-market tier |

**Why this order:** every competitor who skipped Phase 1 is now stuck in production-reliability hell. We are building the foundation first, on purpose.

Backed by [Build Roadmap](Build-Roadmap).

---

## Slide 12 · Team & The Ask

> **Key message.** [To be filled by founders before the meeting.]

### Founder
*Insert founder bio: prior experience, why this problem, why this team to solve it. One paragraph.*

### Founding hires (next 90 days)
- Platform Architect (orchestration specialist)
- Security Engineer (agent identity)
- Data Engineer (Universal Data Bridge)
- AI / ML Engineers ×2
- Product Designer

### Domain Expert Council seats
- Employment law specialist
- CPA / accounting expert
- Compliance attorney (named board advisor)

### The ask
- **Raising:** *[$X seed / Series A]*
- **Use of funds:** 50% engineering hires · 25% Domain Expert Councils + GTM · 15% SOC 2 + compliance · 10% operating runway
- **Milestone for next round:** Phase 2 complete · 3 paying commercial customers · Trust Score evidence at 90%+

Backed by [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure), [FinOps Strategy](FinOps-Strategy).

**Speaker notes.** *Close with: what we need to make Phase 1 happen, what evidence the next round will see, and what the win looks like — fifty enterprise customers and the empty upper-right quadrant filled before the incumbents wake up.*

---

## Speaker delivery — 20-minute version

| Slide | Minutes | Notes |
|---|---|---|
| 1 Cover | 0.5 | Anchor + ask permission to walk through |
| 2 Problem | 2.0 | Six root causes — name them in plain English, no jargon |
| 3 Market | 1.5 | TAM, demand-supply gap |
| 4 Solution | 2.0 | One platform, six architectural decisions |
| 5 Demo | 3.0 | Live demo if possible — biggest impact slide |
| 6 Product | 1.5 | Seven departments + Dev Agent |
| 7 Trust ramp | 1.5 | Why customers don't cancel |
| 8 Competition | 1.5 | The empty quadrant |
| 9 Business model | 1.5 | Tiers + expansion mechanics |
| 10 GTM | 1.5 | Land-expand via department pain |
| 11 Roadmap | 1.5 | Infrastructure-first sequencing |
| 12 Team & ask | 2.0 | Founder bio + raise + use of funds |
| Q&A | 5+ | Stay anchored to the wiki for depth |

---

## Cross-references — for Q&A depth

- [Executive Summary](Executive-Summary) — full strategic plan
- [The Six Barriers](The-Six-Barriers) — full problem framing
- [Product Concept](Product-Concept) — full solution architecture
- [Build Roadmap](Build-Roadmap) — full 36-month plan
- [Architecture Principles](Architecture-Principles) — the 17 constitutional rules
- [Competitor Analysis](Competitor-Analysis) + [Competitor Deep Dive · Durable.ai](Competitor-Deep-Dive-Durable)
- [Customer Journeys](Customer-Journeys) — Startup / Medium / Enterprise
- [Pricing and Packaging](Pricing-and-Packaging) — tier mechanics
- [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure) — team build-out
- [FinOps Strategy](FinOps-Strategy) — unit economics and capital efficiency
- [Strategic Considerations](Strategic-Considerations) — risks and mitigations
- [Advantages and Risks](Advantages-and-Risks) — investor risk register

---

*Confidential · Share under NDA · Atlantis Strategic Plan v2.0 · 2026-05-16*
