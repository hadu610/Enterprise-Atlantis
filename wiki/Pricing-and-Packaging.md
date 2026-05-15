# Pricing and Packaging

> **Type:** Reference · **Owner:** Founders · **Status:** Approved · **Applies to:** Humans only · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines how Atlantis is sold: tiers, per-tier inclusions, usage-based components, contract terms, discount governance, and pilot programmes. Pricing aligns with **value delivered**, not seats or raw token consumption — the platform replaces and augments work across departments, and pricing must reflect that.

The principle: **price the outcome, not the input.** Customers buy AI-powered department capacity, not "LLM credits."

---

## 1. The pricing model

We sell **department capacity** with a per-agent platform fee plus a usage component for high-volume action types.

```
Customer monthly bill = 
    Platform fee (tier-based)
  + Per-active-agent fee × number of active department agents
  + Usage overage (only when usage exceeds tier-included quotas)
  + Optional add-ons (BYOK, dedicated cell, custom playbooks)
```

This structure:

- Anchors the customer relationship in **what they activate**, not what they consume token-by-token.
- Gives predictable budgeting (most months are flat) with **fair-use overages** for power users.
- Avoids the "every API call costs you" trap that creates customer hostility against the platform's success.

## 2. Tiers

| Tier | Annual platform fee | Active agents included | Tenants | Best fit |
|---|---|---|---|---|
| **Starter** | $30K | Up to 2 agents (HR + one of Finance/Sales/Ops) | 1 | SMB (50–250 employees) testing the model |
| **Growth** | $90K | Up to 4 agents | 1 | Mid-market (250–2,000 employees) |
| **Enterprise** | $250K+ | All 7 agents + Dev Agent | 1, with cell isolation options | Enterprise (2,000+ employees) |
| **Enterprise Regulated** | $400K+ | All agents + self-hosted models for sensitive data | Dedicated cell | Regulated industries (healthcare, financial services, defence) |

Annual contracts. Monthly contracts available at 25% premium and only for pilot/conversion paths.

## 3. What's included per tier

| Feature | Starter | Growth | Enterprise | Regulated |
|---|---|---|---|---|
| Department agents | 2 of 7 | 4 of 7 | All 7 + Dev | All 7 + Dev |
| Phased Autonomy Model | ✓ | ✓ | ✓ | ✓ |
| Validation Gate Architecture | ✓ | ✓ | ✓ | ✓ |
| Universal Data Bridge connectors | 5 sources | 15 sources | Unlimited | Unlimited |
| Trust Score Dashboard | ✓ | ✓ | ✓ | ✓ |
| Change Management Module | Self-serve | Self-serve | CSM-led | CSM-led |
| Domain Playbook Marketplace | Read-only | Install certified | Install + custom | Install + custom |
| Customer-managed keys (BYOK) | — | Add-on | ✓ | ✓ |
| Dedicated cell (single-tenant infra) | — | — | Add-on | ✓ |
| Self-hosted / sovereign LLMs | — | — | Add-on | ✓ |
| Data residency choice | US-East default | US or EU | Any AWS region | Customer-specified |
| Audit log retention | 1 year | 3 years | 7 years | 7+ years |
| SLA | 99.5% | 99.9% | 99.95% | 99.99% |
| Support response | Business hours | 24×5 | 24×7 | 24×7 + dedicated SRE pager |
| Customer Success Manager | Shared pool | Named CSM | Named CSM + TAM | Named CSM + TAM + GC contact |
| Annual customer onsite | — | — | 1 included | 2 included |

## 4. Per-active-agent fee (above tier-included)

Some customers want more than the tier-included agents without jumping tiers.

| Tier | Per-additional-agent fee (annual) |
|---|---|
| Starter | Not offered (must upgrade tier) |
| Growth | $18K per agent above 4 |
| Enterprise | Included up to all 7 + Dev |

## 5. Usage-included quotas and overages

Tier inclusions cover the **vast majority** of customers. Overages exist to keep the model fair without surprising customers.

| Metric | Starter | Growth | Enterprise | Overage |
|---|---|---|---|---|
| Agent task executions per month | 50K | 250K | 2M | $0.02 per task above quota |
| Universal Data Bridge sync events per month | 5M | 25M | unlimited | $0.50 per 100K events |
| Validation gate evaluations | included | included | included | (component of agent task) |
| Audit event storage (hot retention) | included | included | included | $200/month per additional 100GB |
| Outbound communications (templated emails, etc.) | 100K | 500K | 2M | $0.005 per message above quota |

Overages are **soft** — the customer is alerted at 80% of quota and the customer admin can buy more before the overage rate kicks in. Sustained overage suggests a tier upgrade conversation.

## 6. Add-ons

| Add-on | Price (Phase 2–3 list) |
|---|---|
| Customer-managed keys (BYOK) | $25K/year |
| Dedicated cell (single-tenant infra) | $100K/year + infra pass-through |
| Self-hosted / VPC-isolated LLMs | $150K/year (from Phase 3) |
| Custom Domain Playbook authoring (per agent) | $40K one-time per playbook |
| Additional data residency region | $50K/year per region |
| Premium Customer Success (TAM + dedicated SRE) | $75K/year |
| Enhanced SLA (99.99%) | 15% uplift on platform fee |
| Quarterly executive business reviews onsite | $30K/year |
| Implementation services / migration | Statement of work, T&M |

## 7. Pilot and design partner pricing

### Design partner programme (Phase 1)

- 3–5 design partners receive **6 months free** in exchange for:
  - Weekly product feedback sessions
  - Logo + case study rights upon GA
  - Up to 2 named reference calls per quarter post-GA
- After 6 months, they convert to a 50% discount on a 24-month Growth or Enterprise contract.

### Pilot programme (Phase 2+)

- 60-day paid pilot: $15K flat fee, fully creditable to a Year-1 annual contract upon conversion.
- One department, one agent, in Drafting → Startup mode.
- Pilot conversion rate is a tracked metric; below 50% means our qualification is off.

## 8. Contract terms

### Annual contracts (default)

- 12-month or 24-month terms; multi-year preferred with discount.
- Net 30 payment terms.
- Auto-renew with 60-day non-renewal notice from either party.
- Annual pricing increase capped at CPI + 3% for renewals.

### Discounts

| Reason | Maximum discount | Approver |
|---|---|---|
| Multi-year (24 months) | 10% | AE |
| Multi-year (36 months) | 15% | Sales Lead |
| Logo / lighthouse (referenceability + case study) | up to 25% | VP Sales |
| Strategic / non-standard | > 25% | CEO |

Discounts beyond AE authority require written justification in CRM. The Sales Agent (when active) drafts; humans approve — see [Sales Agent Playbook § 8](Sales-Agent-Playbook#8-forbidden-sales-agent-behaviours).

### Contractual safeguards (in MSA template)

- Data Processing Addendum (GDPR Article 28)
- BAA (HIPAA) for relevant tiers
- Audit rights for customers above $250K ARR
- Customer-side termination for SLA breach (refund pro-rated)
- AI-specific clauses: model substitution rights, prompt evolution policy, agent action audit access

## 9. Currency and international

- USD primary.
- EUR and GBP supported by Phase 2 (for EU/UK customers).
- Tax handling: per [Domain Knowledge Index § Tax Jurisdictions](Domain-Knowledge-Index).
- Localised pricing in non-USD regions is **list × current FX**, not market-rate adjusted. We do not under-price by geography for the same enterprise tier.

## 10. Renewal and expansion strategy

The unit-economics math depends heavily on **expansion** (additional agents, additional add-ons, tier upgrades). Targets:

| Metric | Year-1 target | Steady-state |
|---|---|---|
| Gross retention (% of ARR retained) | 90% | 95% |
| Net retention (incl. expansion) | 110% | 125% |
| Time-to-second-agent | 6 months from initial contract | 4 months |

The Customer Success Manager owns expansion. The [Phased Autonomy Model](Phased-Autonomy-Reference) is the natural expansion vector: once HR Agent reaches Approval Mode with sustained Trust Score > 0.9, the conversation about activating Finance Agent is evidence-based and easy.

## 11. Pricing transparency policy

- Starter tier pricing is **published** on our website.
- Growth and Enterprise tier pricing is **available on request** (gated by SDR conversation) — this is enterprise norm and protects negotiation room.
- We do not have hidden fees, surprise overages, or per-API-call retail billing. The published list and overage rates are the contract.

## 12. Anti-patterns we avoid

- **Per-seat pricing.** Misaligned — an agent is not a seat, and customers gaming seat counts disadvantage everyone.
- **Pure consumption pricing.** Creates customer hostility every time the platform succeeds (more usage = more bill).
- **Mid-cycle price increases for existing customers.** Customer trust is destroyed; legal action follows. Annual renewal is the only price-change window.
- **Surprise overages.** Soft alerts at 80% of quota; never billed without a chance to upgrade.
- **Discounts as the closing tool.** Discounts are for strategic value (logo, multi-year), not for desperate AEs at quarter-end.
- **Free tier in Phase 1–3.** We are not a self-serve product; a free tier without product-led-growth motion is fixed cost without lead generation.

## 13. When to revisit

- Provider pricing change (LLM, cloud) materially affects unit economics.
- Win/loss data shows pricing as a > 30% loss reason for our ICP.
- A new tier need emerges from market feedback (e.g. small-team product if we go PLG in Phase 4).
- Competitive landscape shifts pricing meaningfully (the Microsoft / Salesforce / Workday landscape).
- Annual pricing review by Founders + VP Sales + CFO.

## 14. Forbidden

- Quoting prices outside the published list without approver sign-off
- Signing a customer below the published gross-margin floor (see [FinOps Strategy § 2](FinOps-Strategy#2-unit-economics-framework)) without executive approval
- Customising the MSA without Legal review
- Promising a feature or roadmap item as a contractual commitment without CTO sign-off
- Allowing the Sales Agent to negotiate price autonomously (always queued — see [Sales Agent Playbook § 8](Sales-Agent-Playbook#8-forbidden-sales-agent-behaviours))

---

## Cross-references

- [FinOps Strategy](FinOps-Strategy)
- [Hiring Plan and Team Structure](Hiring-Plan-and-Team-Structure)
- [Build Roadmap](Build-Roadmap)
- [Product Requirements](Product-Requirements)
- [Sales Agent Playbook](Sales-Agent-Playbook)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Master Blueprint Index](Master-Blueprint-Index)
