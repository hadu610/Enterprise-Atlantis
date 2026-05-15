# Hiring Plan and Team Structure

> **Type:** Reference · **Owner:** Founders · **Status:** Approved · **Applies to:** Humans only · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the company's hiring blueprint by phase. It exists to answer two questions: **who do we hire next**, and **what is the org we are building toward**. Hiring decisions made outside this plan must update this page — there is no separate hiring strategy.

The principle: **hire to unblock, not to optimise.** Phase 1 is a small team with deep ownership; later phases add roles only when an unfilled need is materially slowing the platform.

---

## 1. Hiring philosophy

- **Quality over speed.** A wrong senior hire in Phase 1 sets us back six months. A delayed hire sets us back two. We optimise for hit rate, not time-to-fill.
- **Generalists in Phase 1; specialists thereafter.** Founding engineers must be able to span infra, AI, and product. Specialisation comes as the surface grows.
- **Remote-first, hub-aware.** Distributed by default; in-person quarterly offsites mandatory through Phase 3.
- **Equity-rich for the first 20.** Cash compensation is competitive but not market-leading; equity is where founding employees participate in the upside.
- **Slow to hire, fast to part.** A 90-day mutual evaluation window is normalised. We do not carry low performers — the cost to teammates exceeds the cost to backfill.
- **No siloed AI vs. non-AI roles.** Every engineer learns to work with the Dev Agent. We are not a "humans on one side, AI on the other" company; we are an AI-native company where every human collaborates with agents.

## 2. The phases (aligned to Build Roadmap)

### Phase 1 — Core Infrastructure (Months 1–6)

**Target headcount end of phase: 9** (2 founders + 7 hires)

The team that builds the foundation that solves B1, B3, B4, B6 before any visible agent ships.

| Role | Count | Why now | Profile |
|---|---|---|---|
| **Co-founder / CEO** | 1 | Founding | Sets direction, sells design partners, owns capital |
| **Co-founder / CTO** | 1 | Founding | Owns architecture, hiring bar, technical decisions |
| **Platform Architect** | 1 | Builds Orchestration Engine + Validation Gate runtime | Distributed systems, 8+ years, has shipped a production multi-agent or workflow orchestration system |
| **Security Engineer** | 1 | Builds Zero-Trust Agent Identity from Day 1 | App-sec + IAM, has implemented OAuth scopes / agent-style identity, comfortable with SOC 2 prep |
| **Data Engineer** | 1 | Builds Universal Data Bridge + semantic normalisation | Strong Postgres, has built integration pipelines across heterogeneous source systems |
| **AI/ML Engineer (Senior)** | 2 | Model routing, prompt versioning, eval suites | LLM production experience, eval rigor, not just notebook prototyping |
| **Product Designer** | 1 | Onboarding interview, Trust Score Dashboard, customer console | Enterprise SaaS, has designed approval workflows and admin consoles |

**Plus Domain Expert Councils (founding members) — not employees, retained advisors:**

- **HR / Employment Law specialist** — drafts HR Agent jurisdiction playbooks
- **CPA / accounting standards expert** — drafts Finance Agent playbooks
- **Compliance attorney** — drafts Legal Agent playbooks + governs Security Policy review

Council members receive an equity allocation (0.1–0.5%) plus an hourly retainer; engagement is monthly, expanding as the platform matures.

### Phase 2 — First Two Agents (Months 7–12)

**Target headcount end of phase: 18**

Phase 1 team holds; commercial-readiness team is built around them.

| New role | Count | Why now |
|---|---|---|
| **VP Engineering** | 1 | Phase 1 was founder-led engineering; scaling beyond ~10 needs a manager dedicated to hiring, processes, and unblock |
| **Engineer (full-stack)** | 3 | Customer console, Change Management Module, ticketing, activity tracking |
| **Engineer (backend)** | 2 | HR Agent + Finance Agent runtime, scoping integrations beyond the initial four |
| **AI/ML Engineer** | 1 | Eval suite expansion, domain-specific evaluations as new playbooks land |
| **SRE / DevOps Engineer** | 1 | Phase 2 introduces commercial customers; on-call rotation needs more than two engineers |
| **Customer Success Manager** | 1 | Each enterprise customer gets a CSM (per [Strategic Considerations § 3](Strategic-Considerations#3-the-trust-score-is-the-sales-tool)) |
| **Founding Account Executive** | 1 | The CEO sells until ~5 customers; AE picks up by customer 6 |

### Phase 3 — Agent Expansion (Months 13–24)

**Target headcount end of phase: 38**

Sales, Marketing, Ops, Legal, Dev agents land. SOC 2 + ISO 27001 push. 20+ enterprise customers.

| New role | Count | Why now |
|---|---|---|
| **Department Tech Lead** | 5 | One per new agent (Sales, Marketing, Ops, Legal, Dev). They are the engineering owner of an agent's quality. |
| **Engineers** | 8 | Distributed across new agent teams |
| **AI/ML Engineer** | 2 | Domain Playbook Marketplace, fine-tuning eval (Phase 3 is when we re-evaluate fine-tuning) |
| **SRE** | 2 | Multi-region, multi-tenant cells begin scoping |
| **Security Engineer** | 1 | SOC 2 Type II + ISO 27001 audit support, vuln management at scale |
| **Customer Success Manager** | 4 | Scales with customer count; 5 CSMs by Phase 3 end |
| **Account Executive** | 2 | Second and third AE; territory split begins |
| **Sales Engineer** | 1 | Technical pre-sales for enterprise procurement processes |
| **Product Manager** | 1 | Beyond founder-led product; PM for the customer-facing surface |
| **Marketing Lead** | 1 | Beyond founder-led marketing; demand generation + content + analyst relations |
| **People / Talent Lead** | 1 | Hiring at the rate of ~2/month requires a dedicated function |
| **Finance / Controller** | 1 | Real revenue + complex contracts + capitalised software accounting |
| **General Counsel (Fractional → FTE)** | 1 | Fractional in Phase 2; FTE in Phase 3 as customer contracts and regulatory exposure grow |
| **Designer** | 1 | Second designer; can no longer be one person across product + marketing |

### Phase 4 — Full Autonomy & Scale (Months 25–36)

**Target headcount end of phase: ~75**

50+ enterprise customers; mid-market tier; marketplace; international.

Hiring shifts from "build new agents" to "scale what we have":

- Engineering: ~30 total (cells, multi-region SRE, marketplace partner integrations)
- Customer Success: ~10 CSMs (one per ~5 enterprise accounts)
- Sales: 5–7 AEs across territories, 2 SEs, 1 VP Sales
- Marketing: 4 (content, demand gen, product marketing, brand)
- People: HRBPs, recruiter team, L&D
- Finance: CFO upgrade, FP&A, AR/AP
- Legal: GC + commercial counsel + compliance officer

## 3. Role profiles — what we hire for

### Engineering hires (any role)

- Has shipped production code at scale (not just side projects).
- Strong written communication — we are remote-first; writing is the medium.
- Skeptical of LLM hype while comfortable building on it. Equally allergic to "AI will fix it" and "AI is a toy."
- Wiki-first contributor — comfortable writing rules and playbooks, not just code.
- Track record of working alongside AI tooling (Copilot, Cursor, agentic coding) — we are an AI-native dev shop and want engineers who think of agents as collaborators.

### AI/ML Engineering hires

- Production LLM experience required, not notebook research.
- Eval rigor — has built or operated regression / adversarial eval suites.
- Comfortable with prompt engineering as a versioned, reviewed discipline (not "vibes").
- Understands cost and latency as first-order constraints, not afterthoughts.

### Security hires

- Have implemented identity (not just consumed it).
- Have lived through a SOC 2 Type II — preferred.
- AppSec + cloud sec generalist in Phase 1; specialists emerge by Phase 3.

### Customer Success hires

- Have managed enterprise B2B accounts > $250K ARR.
- Strong technical literacy — can read API docs and reason about integration friction.
- Coach-mindset for change management. We push customers through autonomy phases; CSM coaches them through the trust journey.

### Sales hires (AE)

- Enterprise SaaS background, mid-six-figure deals.
- Comfortable selling against unknown competitive landscape — we are a new category.
- Long-cycle stamina — sales cycles are 6–12 months for enterprise AI; we need AEs who pace accordingly.

## 4. Compensation philosophy

### Bands

We publish bands internally. Bands are reviewed semi-annually against compensation data (Pave / Compa / Carta benchmarks for our funding stage and headcount).

| Level | Indicative cash range (USD; Phase 1–2) | Indicative equity range |
|---|---|---|
| L3 — IC, Senior | $160K–$200K | 0.10%–0.25% |
| L4 — IC, Staff | $200K–$260K | 0.20%–0.50% |
| L5 — IC, Principal / People Manager | $240K–$320K | 0.30%–0.75% |
| L6 — Director | $280K–$360K | 0.40%–1.00% |
| L7 — VP / Founding Exec | Cash deferred to round close; founding equity 1.0%–4.0% | — |

Bands are jurisdiction-adjusted (local market rates) but the **role's level is the same globally**. We do not under-level remote hires.

### Refresh cycles

- Annual equity refresh starting Year 3; performance-based.
- Salary review semi-annually; promotion-driven jumps are out-of-cycle.

### Variable comp

- Sales: 50/50 base/variable, capped at 200% of OTE for AE; CSM is 80/20.
- Engineering, Product, Design: no variable comp. We have seen the failure modes; we avoid them.

## 5. Performance framework

- Quarterly check-ins, not annual reviews.
- Two-axis: **outcome** (did you ship?) and **how** (did you raise the team's bar?).
- Calibration across managers semi-annually.
- Performance Improvement Plans are 30 days, transparent, with explicit exit terms. We do not let PIPs linger.

## 6. Diversity, equity, inclusion

- Slate diversity for every senior hire — we will not interview a final-round panel that is entirely homogeneous on visible dimensions.
- Calibration of compensation against demographic data each cycle; gaps are corrected, not explained.
- Self-ID is optional and confidential; we do not target headcount quotas; we target a pipeline that does not exclude.
- This is not a separate program. It is part of how every team operates.

## 7. Org chart trajectory (high-level)

**End of Phase 1 (Month 6):**

```
CEO ─── CTO
        ├── Platform Architect
        ├── Security Engineer
        ├── Data Engineer
        ├── AI/ML Engineer × 2
        └── Product Designer
```

**End of Phase 3 (Month 24):**

```
CEO ─┬─ CTO ─── VP Engineering
     │              ├── Tech Lead (HR/Finance)
     │              ├── Tech Lead (Sales/Marketing/Ops)
     │              ├── Tech Lead (Legal)
     │              ├── Tech Lead (Dev Agent)
     │              ├── Platform Architect
     │              ├── SRE Lead
     │              ├── Security Lead
     │              └── AI/ML Lead
     ├── VP Sales (forming)
     │   ├── Account Executive × 3
     │   └── Sales Engineer
     ├── VP Customer Success
     │   └── CSM × 5
     ├── Head of Marketing
     ├── Head of People
     ├── Controller / Head of Finance
     ├── General Counsel
     └── PM (reports to CEO; product council with CTO)
```

## 8. When to hire vs. when to wait

A role is hired when one or more of these is true:

- The work is currently being done by someone whose primary job is not this — and is suffering.
- A specific customer commitment requires it.
- A regulatory requirement requires it.
- An on-call rotation cannot maintain healthy SLAs without it.

A role is **not** hired because:

- "We should have someone for X."
- A peer company at our stage has it.
- We have budget.
- A candidate is available who would be great "to grab while we can." (Reverse the question: would we open this role today? If no, do not hire.)

## 9. Founding equity reserve

- 10% option pool reserved at incorporation; refreshed at each priced round to maintain 10% post-money.
- New-hire equity drawn from the pool.
- Performance refreshes drawn from a separate annual top-up.

## 10. Forbidden

- Hiring a senior role through a referral without a slate.
- Hiring outside the published bands without a documented Board-noted exception.
- Misclassifying employees as contractors.
- Title inflation to close a candidate — once a Senior, always at least a Senior.
- Promising equity outside the option-pool refresh cycle.

---

## When to revisit

- Headcount tracks > 20% above plan at end of any phase — we are over-hiring; pause and recalibrate.
- Headcount tracks > 20% below plan and SLOs / customer health are degrading — we are under-hiring.
- Funding event changes runway envelope materially — replan phases.
- Department-level org chart deviates from the trajectory above without explicit founder sign-off — review the deviation.

CEO is the accountable owner. Head of People (when hired) executes.

---

## Cross-references

- [Build Roadmap](Build-Roadmap)
- [Strategic Considerations](Strategic-Considerations)
- [FinOps Strategy](FinOps-Strategy)
- [Pricing and Packaging](Pricing-and-Packaging)
- [Master Blueprint Index](Master-Blueprint-Index)
