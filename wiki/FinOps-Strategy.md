# FinOps Strategy

> **Type:** Rule · **Owner:** Engineering + CFO · **Status:** Approved · **Applies to:** All humans contributing code · Dev Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

The unit economics of an AI-native enterprise platform are dominated by two cost lines: **cloud infrastructure** and **LLM inference**. Either, mismanaged, can destroy gross margins faster than revenue can fix them. This page is our discipline for keeping costs visible, attributable, and aligned with the [Pricing and Packaging](Pricing-and-Packaging) tiers we sell.

The principle: **cost is a feature, not a footnote.** A service that doubles cost without a corresponding capability change is a regression, even if it ships.

We follow the [FinOps Foundation](https://www.finops.org/) framework — Inform → Optimise → Operate.

---

## 1. The two cost lines that define us

| Cost line | Why it matters | Phase 1 monthly budget (illustrative) | Phase 4 trajectory |
|---|---|---|---|
| **LLM inference** | Variable with usage; can spike with prompt regressions; concentration risk on providers | $5–15K | Largest single line; > 40% of COGS at maturity |
| **Cloud infrastructure** | Mostly fixed + per-tenant variable; multi-region cost scales rapidly | $8–20K | Second largest line; 25–35% of COGS |

All other costs (SaaS tooling, observability backend, security tooling) are managed but are not the unit-economics levers.

## 2. Unit economics framework

Every customer has a **gross margin** defined by:

```
gross_margin% = (ARR_per_customer − COGS_per_customer) / ARR_per_customer

COGS_per_customer = 
  + LLM_inference_per_customer
  + cloud_infra_attributable_to_customer
  + tenant-scoped third-party services
  + observability + security tooling allocation
  + customer success direct labour (if dedicated CSM)
```

Targets:

| Customer tier | Target gross margin (Phase 2–3) | Steady-state (Phase 4+) |
|---|---|---|
| Mid-market | 65% | 75% |
| Enterprise | 70% | 80% |
| Enterprise — regulated tenant (self-hosted models) | 55% | 65% |

Margin below target is a Trust Score input for sales — under-margin contracts require executive approval before signing.

## 3. LLM cost discipline

The largest single variable, and the one most easily wrecked by prompt drift.

### Token budgets per task class

Hard budgets enforced by the [AI Model and Prompt Standards § 12](AI-Model-and-Prompt-Standards#12-token-budgets). Exceeding budget triggers a `wiki-update` ticket — the prompt is structurally inefficient.

### Model routing for cost

The routing layer ([AI Model and Prompt Standards § 1](AI-Model-and-Prompt-Standards#1-model-selection-per-task-type)) chooses the cheapest model that meets task quality:

- `lookup_fast` → Haiku (most tasks)
- `reasoning_standard` → Sonnet (most agent work)
- `reasoning_premium` → Opus (sparingly; reasoning-heavy only)
- `analysis_heavy` → Opus with batch/cache discounts where eligible

A task running on `reasoning_premium` when `reasoning_standard` would suffice is a cost regression. The routing layer logs these for weekly review.

### Prompt caching

- Provider prompt caching (Anthropic, OpenAI, Bedrock cache support) is enabled for all stable prompt prefixes (system message, retrieved Wiki content for the task).
- Cache hit rate per task class is a tracked metric. Hit rate < 60% on stable prefixes is investigated.
- We target ≥ 70% input-token cost savings via caching for `reasoning_standard` and `reasoning_premium` paths.

### Batch and async

- Non-time-critical tasks (Marketing batch content, Finance month-end reports, Ops daily summaries) use batch API endpoints where providers offer 40–50% discounts.
- Routing automatically batches when latency budget exceeds threshold.

### Cost-aware prompting

- Prompts are reviewed for token efficiency at promotion. A 30% longer prompt that produces 5% better output is **net negative** at scale; we don't promote it.
- Retrieval is preferred over context-stuffing. We retrieve the 3 most-relevant Wiki pages, not all 5.

### Per-tenant attribution

Every LLM call carries a `tenant_id` and a `task_class`. Aggregated per tenant per day. Customer admins see their own cost in the console.

### Cost circuit breakers

A tenant whose daily LLM spend exceeds 3× their 30-day rolling average triggers an alert to the customer admin + a soft cap pending review. This catches both runaway agent loops and customer-introduced abuse.

## 4. Cloud cost discipline

### Tagging

- **Every resource is tagged** with: `environment`, `service`, `owner`, `cost_center`, `tenant_id` (where applicable). Untagged resources are deleted on a weekly sweep.
- AWS Cost Allocation Tags activated; reports pivot on these dimensions.

### Reserved capacity

- Compute baseline (always-on) covered by 1-year Savings Plans (no longer than 1-year commits until Phase 3 traffic is predictable).
- Spot instances for batch/CI workloads where interruption is acceptable.
- RI / Savings Plan utilisation reviewed monthly; under-utilisation is a remediation item.

### Storage

- Lifecycle policies on S3 — hot → infrequent access → glacier per data retention rules.
- Database storage growth is monitored per service; sustained > 20% MoM growth triggers a review.
- Audit log archival to glacier after 90 days hot retention.

### Networking

- VPC peering and PrivateLink over public internet where possible — both for security and to avoid egress charges.
- Cross-AZ transfer is monitored; chatty services in separate AZs are a P2 cost finding.
- CDN (CloudFront) in front of static assets and customer console — origin egress is the expensive lane.

### Multi-region

- Phase 1–2: single region (us-east-1 or eu-west-1, customer-driven).
- Phase 3+: multi-region for HA, with budget-aware replication (not everything replicates).
- Customer-mandated residency is a per-tenant cost-load; this is reflected in pricing for regulated tiers.

## 5. Observability and tooling cost

Observability is necessary; observability is also expensive. We hold this line carefully.

- Self-host Grafana LGTM stack in Phase 1–2; reconsider Grafana Cloud at Phase 3 if operational overhead crosses ~3 SRE-weeks/month.
- Sample tracing at 10% (1% for very high-traffic services). 100% for errors.
- Log retention: 90 days hot, 1 year cold. Audit log retention is separately governed by data class.
- Quarterly review of SaaS tooling — cancel what no team is using.

## 6. Cost-as-a-feature decisions

Some product decisions are explicitly cost-driven:

| Decision | Cost rationale |
|---|---|
| Multi-provider LLM strategy | Hedges against provider price increase; ~10% baseline traffic on alternate provider keeps the path warm |
| Per-tenant key encryption (BYOK) only at Enterprise tier | KMS key proliferation has real cost; tiered offering matches it to pricing |
| Multi-region replication only for tenants who pay for HA | Replication cost is meaningful; not every customer needs it |
| Batch processing for non-real-time agent tasks | 40–50% LLM cost reduction for tasks that can tolerate minutes of delay |
| Domain Playbook Marketplace as Phase 3+ | Marketplace creates per-install LLM cost across all customers — we wait until margin baseline is established |

## 7. Cost attribution model

The platform maintains a cost ledger keyed by:

- Tenant
- Service / cost line
- Task class (for LLM)
- Time bucket (daily)

Reports:

- **Per-tenant gross margin** — weekly to Finance + CSM
- **Per-service spend** — weekly to engineering leads
- **Per-task-class LLM spend** — weekly to AI/ML Engineering
- **Forecast vs. actuals** — monthly to Finance + Founders
- **Top 10 cost movers** — monthly; investigated and explained

Customers see their own usage and (where pricing allows) their own cost in the console.

## 8. Review cadence

| Forum | Cadence | Output |
|---|---|---|
| Service-level cost review | Weekly | Tickets for anomalies |
| Per-tenant margin review | Weekly | Sales / CS escalations |
| Provider negotiation review | Quarterly | Discount tier renewals, capacity commits |
| FinOps strategy review | Quarterly | This page is reviewed |
| Annual budget plan | Annually | Multi-year cost forecast, pricing tier adjustments |

## 9. Cost forecasting at 10× / 100× / 1000×

Every new technology added has a documented cost trajectory at 10×, 100×, 1000× current usage. If 100× is catastrophic (>10× the cost of an obvious alternative), we choose the alternative even if 1× is more painful today.

Examples already settled:

- We chose ClickHouse over Snowflake explicitly because Snowflake's 100× cost trajectory was untenable.
- We chose pgvector over a dedicated vector DB in Phase 1–3 because at 1×–10× the cost difference is small and operational overhead is large; we re-evaluate at 100×.
- We chose to self-host the Grafana stack because Datadog at 100× becomes the dominant cost line.

## 10. Cost anti-patterns we explicitly avoid

- "Just turn on autoscaling and we'll figure it out later." → Autoscaling without a cost ceiling is unbounded.
- "It's only $X/month per customer, doesn't matter at our size." → It matters when X compounds across 50 customers, 100, 1000.
- "Reserved capacity is a long-term commit, we'll do it later." → Reserved capacity decisions delayed beyond 3 months of stable traffic cost meaningful money.
- "We'll renegotiate when we're bigger." → Yes, but the baseline contract terms set the negotiation floor; negotiate early too.
- "Engineers don't need to see costs." → Engineers who don't see costs build expensive systems. Cost is in the engineer's dashboard.

## 11. Forbidden

- Resources created without tags (deleted on weekly sweep)
- LLM calls without `tenant_id` attribution (rejected at the SDK boundary)
- Disabling cost alerts without a Founder-signed exception
- "Optimisation freeze" exceeding two weeks during scale events without explicit review
- New tooling onboarded without a cost section in the proposal
- Customer contracts signed below the published gross-margin floor without executive approval

---

## When to revisit

- LLM provider pricing changes materially in either direction.
- Gross margin trends below target for two consecutive months on any tier.
- Cloud cost growth outpaces ARR growth by > 20% over two quarters.
- New cost class emerges (e.g. specialised inference hardware, new compliance-driven infrastructure) — re-baseline.
- Customer mix shifts (e.g. heavy regulated-tenant growth) — re-baseline tier margins.

CFO (when hired) is accountable. Until then, CTO + CEO are joint accountable.

---

## Cross-references

- [Pricing and Packaging](Pricing-and-Packaging)
- [Technology Stack](Technology-Stack)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Observability Standards](Observability-Standards)
- [Architecture Principles](Architecture-Principles)
- [Master Blueprint Index](Master-Blueprint-Index)
