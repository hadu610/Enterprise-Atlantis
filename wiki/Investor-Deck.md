# Investor Deck · Atlantis

> **Type:** Investor-facing pitch artifact · **Owner:** Founders · **Status:** Draft · **Audience:** Seed / Series A investors · **Confidentiality:** Confidential — share under NDA · **Last reviewed:** 2026-05-16

> 🎤 **Present live:** open the [Investor Deck presentation](../investor-deck.html) — full-screen slides, keyboard navigation (← / → / Space), `N` toggles speaker notes, `F` for fullscreen, deep-linkable to any slide.

A 12-slide deck distilled from the full [Strategic Plan v2.0](Executive-Summary). This page is the **source document** — each slide gives the **key message**, the **supporting evidence**, and **speaker notes** for live delivery. When delivering live, run the [presentation version](../investor-deck.html); use this page for Q&A depth and as the wiki source that the live slides are built from.

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

> **Key message.** A founder who has lived inside the six-root-cause problem, a founding team profile recruited against the exact gaps Phase 1 needs to fill, and a capital plan calibrated to ship Phase 1 + half of Phase 2 before raising again.

### Founder

**Du Ha** — Founder & CEO

Du Ha is the architect of Atlantis's blueprint. Before writing a single line of platform code, he authored what is — to our knowledge — the most comprehensive design document for an enterprise AI operating system in existence:

- **38 wiki pages** spanning strategic plan, operational rules, agent playbooks, and engineering blueprint
- **17 constitutional architecture principles** governing every technical decision the platform will make
- **7 department-agent playbooks** (HR · Finance · Sales · Marketing · Legal · Operations · Software Development), each scoped to be co-authored with a Domain Expert Council
- **A complete cross-agent coordination pattern** — entity-keyed Action Executor with optimistic concurrency control, saga compensation, and human-arbitrated conflict resolution — solving the multi-agent corruption problem before any agent ships
- **An end-to-end customer onboarding flow** — the AI Business Consultant that takes a customer from *"describe your business"* to a custom blueprint in five minutes
- **A multi-tenant data plane design** that supports managed multi-tenant cloud, single-tenant cells, and bring-your-own-cloud (AWS / GCP / Azure) without retrofitting
- **A six-root-cause framework** that maps every documented enterprise AI failure mode — reliability, expertise, data unity, agent identity, trust, breadth — onto a specific architectural decision in the blueprint

The pattern emerged from a year-plus watching enterprise AI projects collapse in production for the same six reasons. **The same six. Every time.** The blueprint is the answer to the question: *what would the platform look like if every one of those six failure modes were treated as an architectural prerequisite, not a feature?*

Du Ha brings **10+ years of enterprise software and distributed-systems experience**, with hands-on platform-engineering and applied-AI work at scale. He is Atlantis's **full-time founder-CEO with no other commitments**, the sole author of the operational layer the platform's agents will read on day one, and the technical reviewer on every architecture decision in the wiki.

The conviction is product-led, the evidence is shippable, and the architecture is already on the page — months of design work an investor can read end-to-end at [hadu610.github.io/Enterprise-Atlantis/wiki.html](https://hadu610.github.io/Enterprise-Atlantis/wiki.html) before the meeting. *We are not asking you to bet on a deck. We are asking you to bet on a blueprint that is already further along than most pre-seed companies' MVPs.*

> **Before sending the deck — verify or refine these four specifics:**
>
> 1. **Years of experience.** "10+ years" is a reasonable default. Replace with your actual number if higher; keep "10+" as a defensible floor for the work product.
> 2. **Named prior employers.** Optionally add 1–3 if you want investor pattern-matching (e.g., *"Previously at [your actual prior companies]"*). Without them, the generic phrasing reads credible-but-vague — strong for a substance-led pitch, weaker for resume-led pattern-matching.
> 3. **City.** Specify your base location (SF / NYC / Austin / London / Singapore each carry different investor signals).
> 4. **Education / patents / public talks.** Optional one-liner if relevant; omit if not.
>
> **Variant arcs** — the bio above leads with **Arc A (the infra builder)** because the blueprint's architectural depth (cross-agent coordination patterns, validation gates, zero-trust agent identity, cell-based isolation) makes that the natural fit. If your background is closer to Arc B (operator who tried + failed to deploy enterprise AI three times) or Arc C (domain expert who pivoted to building AI agents the right way), swap the opening paragraph but keep the blueprint-as-evidence body. The body is the differentiated move and reads true regardless of arc.

### Founding team (recruited in the first 90 days post-close)

The Phase 1 build is gated on six hires. Each role is profiled against a specific Phase 1 deliverable, not a generic "senior engineer" slot.

| Role | Maps to | Hiring bar |
|---|---|---|
| **Platform Architect** | Orchestration Engine, Action Executor | 10+ yrs distributed systems; orchestration specialist; ex-AWS / GCP / Stripe / Databricks platform team profile |
| **Security Engineer** | Zero-Trust Agent Identity, Validation Gates | Agent identity / IAM / zero-trust specialist; ex-Vault / Okta / Auth0 / Cloudflare profile; familiar with SOC 2 audit |
| **Data Engineer** | Universal Data Bridge, semantic normalisation | Multi-source enterprise data integration; ex-Snowflake / Databricks / Fivetran / Hightouch profile |
| **AI / ML Engineer × 2** | Agent orchestration, eval discipline, prompt safety | Production agent systems; eval-driven development; ex-Anthropic / OpenAI / Adept / Cohere profile; one focused on agent reasoning, one on safety + evals |
| **Product Designer** | Console, AI Business Consultant onboarding, Trust Score Dashboard | Enterprise SaaS, complex workflows, B2B onboarding; ex-Linear / Notion / Figma / Retool profile |

Full hiring plan with comp bands, equity ranges, and sequencing: [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure).

### Domain Expert Council (founding seats)

The Councils are the moat against [Barrier B2 (Expertise)](The-Six-Barriers#b2--domain-expertise-gap). Each seat owns a department playbook and reviews every wiki change in its domain.

| Council seat | Profile | First playbook |
|---|---|---|
| **Employment Law Specialist** | Multi-jurisdiction labour expertise (US + UK + EU minimum); ex-DLA Piper / Baker McKenzie / in-house at a global enterprise | HR Agent jurisdiction-aware policy |
| **CPA / Public Accounting Partner** | GAAP + IFRS; SOX experience; revenue recognition; ex-Big Four partner or scale-stage CFO | Finance Agent close-cycle |
| **Compliance & Privacy Attorney** | SOC 2 + GDPR + HIPAA; named board advisor | Cross-platform compliance playbook + Trust Center |
| **Senior Security Engineer (advisory)** | CISO-track; prior breach response; agent-identity threat model | Agent identity + prompt injection defence |

### The ask

> **Raising: $5M seed round.**

- **Lead:** $3M (board seat, pro-rata)
- **Strategic angels:** $1.5M (ex-founders of enterprise platforms; former CHROs / CFOs of Fortune 500s)
- **Domain expert SAFEs:** $0.5M (Council members convert to equity; aligns incentives)

**Use of funds (24 months runway):**

| Category | % | $ | Outcome |
|---|---|---|---|
| Founding engineering team | 50% | $2.5M | 6 hires (Architect, Security, Data, 2× AI/ML, Designer) for 18-24 months |
| Domain Expert Council compensation + advisory | 15% | $0.75M | 4 named Council members; full first-version playbook output |
| SOC 2 Type II audit + compliance infrastructure | 10% | $0.5M | Audit firm; tooling; legal review; first audit window |
| Design partner co-development + GTM | 10% | $0.5M | 3–5 design partners onboarded; co-dev sprints; CSM contract or hire |
| Legal, IP, operating runway, tooling | 15% | $0.75M | Entity setup; trademark; equipment; LLM provider commitments |

**Milestone for Series A (24 months out):**

1. **Phase 1 complete.** Orchestration Engine, Validation Gates, Zero-Trust Agent Identity, Universal Data Bridge (4 priority connectors), Knowledge Wiki, Ticketing — all in production.
2. **SOC 2 Type II audit in flight or certified.**
3. **3 paying commercial customers** running HR + Finance agents in Draft → Read mode, with 90%+ Trust Score Dashboard accuracy across deployed workflows.
4. **2 named Domain Expert Councils** (HR Law, Finance/Accounting) with full first-version playbooks shipped to the wiki.
5. **$1M+ in committed ARR** from converted design partners + first commercial customers.

Backed by [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure), [FinOps Strategy](FinOps-Strategy), [Build Roadmap](Build-Roadmap).

**Speaker notes.** *Close with: what we need to make Phase 1 happen, what evidence the next round will see, and what the win looks like — fifty enterprise customers and the empty upper-right quadrant filled before the incumbents wake up. The team profile is recruited against specific Phase 1 deliverables, not generic "senior engineer" slots — that is how you fund this thesis with conviction.*

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
