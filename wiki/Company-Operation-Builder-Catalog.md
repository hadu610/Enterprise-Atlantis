# Company Operation Builder Catalog

> **Type:** Reference · **Owner:** Product / Founders · **Status:** Approved · **Applies to:** Atlantis Manager · Humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

The **Company Operation Builder Catalog** is the canonical machine-readable matrix of every named operational playbook Atlantis supports out of the box, mapped to the industry and company-size combinations where each is auto-suggested. The [Company Operation Builder](../build.html) page renders from this catalog; the [Atlantis Manager](Atlantis-Manager-Playbook) reads it in onboarding mode.

The catalog itself is an **index**, not a spec. Each entry is a one-line registry record; the full operational details of each playbook live inside the owning department's [Agent Playbook](#agent-playbook-pages) `§ Operational Playbooks` section.

> **The reframe this page makes:** *customers do not know what playbooks they need until they see them.* Replacing the interview ("what does your business do?") with a structured catalog ("here are the operations a SaaS startup typically runs — uncheck what you don't need, add what you do") is recognition over recall, and it lets customers self-select with far less effort.

---

## 1. Why this page exists

The original onboarding model assumed a long structured interview would yield a configured tenant. In practice, customers cannot articulate their operations cleanly enough for an interview to converge — they invent answers, miss obvious operations, and over-state edge cases.

The Catalog-first onboarding flips the model:

- The customer picks an **industry** (10 options) and a **size** (3 tiers).
- The Builder shows a pre-checked default set drawn from this catalog.
- The customer adjusts the picks, customises the playbooks ([Playbook Customization Model](Playbook-Customization-Model)), picks an [Autonomy Mode](Autonomy-Modes), and activates.
- The [Atlantis Manager](Atlantis-Manager-Playbook) can walk this same conversation chat-side; the catalog is the script.

The Catalog is **deterministic** — the same (industry, size) pair always produces the same default selection. Customers who want narration get the Manager; customers who want speed click the Builder. Both surfaces read this one source.

---

## 2. The taxonomy

A **playbook** in the Catalog has exactly these fields:

| Field | Meaning |
|---|---|
| `id` | Unique slug, format `<dept>.<verb_phrase>`, e.g. `fin.stripe_reconciliation` |
| `name` | Human-readable name in verb-object form, e.g. "Reconcile Stripe payouts" |
| `owner_dept` | One of: `Sales`, `Marketing`, `HR`, `Finance`, `Operations`, `Legal`, `Dev`, or `Cross` (saga) |
| `agents_involved` | Department agents touched during execution |
| `trigger` | The event that starts the playbook |
| `risk_class` | One of: `Read`, `Write`, `External`, `Financial`, `Delete` per [Action Risk Classification](Action-Risk-Classification) |
| `baseline_time_saved` | Hours-per-month of human work the playbook replaces (used by the calculator + cost-estimate element of the Resolution Plan) |
| `industry_tags` | Industries where this playbook is auto-suggested |
| `size_tags` | Sizes where this playbook is auto-suggested |
| `spec_link` | Wiki link to the full spec in the owning department's Agent Playbook |

Granularity rule: one playbook = one repeatable named operation with one triggering event and one owner department. Operations that span departments are sagas, owned by the lead department with `agents_involved` listing the others.

---

## 3. The 10 industries

| Slug | Name | Distinguishing operations |
|---|---|---|
| `saas` | SaaS / B2B Software | Subscription rev-rec, MRR cohorts, free-trial conversion, churn save |
| `ecom` | E-commerce / D2C | Order fulfillment, RMA/returns, inventory restock, abandoned-cart recovery |
| `proserv` | Professional Services | Time → billing, project burn alerts, retainer reconciliation, scope-change orders |
| `health` | Healthcare / Medical Practice | Patient intake, insurance verification, HIPAA audit log, prior authorisation |
| `mfg` | Manufacturing & Logistics | Purchase orders, inventory variance, supplier scorecards, shipment tracking |
| `realestate` | Real Estate | Listing pipeline, tenant screening, lease renewals, maintenance tickets |
| `hosp` | Hospitality / Restaurants | Reservations, tip distribution, food-cost variance, staff scheduling |
| `edu` | Education / EdTech | Enrollment, transcript requests, instructor payroll, course renewals |
| `fin_svc` | Financial Services / FinTech | KYC/AML, transaction monitoring, dispute resolution, regulatory reporting |
| `trades` | Trades / Construction | Job estimates, change orders, subcontractor payments, lien releases |
| `other` | Other / Generic | Baseline set only |

Each industry inherits the [§ 4 Baseline](#4-the-baseline-25-playbooks-every-industry-inherits) and adds its own pack (§ 5).

---

## 4. The baseline — 25 playbooks every industry inherits

These run in every business regardless of industry. The Builder pre-checks the subset appropriate for the chosen size.

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes pre-checked |
|---|---|---|---|---|---|---|
| `sales.inbound_qualification` | Qualify inbound lead | Sales | Form submission | Write | 8 | Startup, Medium, Ent |
| `sales.outbound_prospecting` | Run outbound prospecting cadence | Sales | Weekly | External | 16 | Medium, Ent |
| `sales.onboarding_kickoff` | Kick off customer onboarding | Sales | Contract signed | External | 6 | Startup, Medium, Ent |
| `mkt.content_publishing` | Publish content on editorial cadence | Marketing | Editorial calendar | External | 12 | Startup, Medium, Ent |
| `mkt.paid_reporting` | Compile paid-acquisition report | Marketing | Weekly | Read | 4 | Medium, Ent |
| `mkt.email_nurture` | Run email nurture sequence | Marketing | Lead enters segment | External | 10 | Startup, Medium, Ent |
| `hr.hire_to_day1` | Run hire (offer → day 1) | HR | Offer accepted | External | 8 | Startup, Medium, Ent |
| `hr.pto_request` | Process PTO request | HR | Employee submits | Write | 3 | Startup, Medium, Ent |
| `hr.perf_review_cycle` | Run performance review cycle | HR | Quarterly | Write | 6 | Medium, Ent |
| `hr.offboarding` | Run offboarding (last day → archive) | HR | Resignation accepted | External | 5 | Medium, Ent |
| `fin.stripe_reconciliation` | Reconcile Stripe payouts vs AR | Finance | Daily | Financial | 12 | Startup, Medium, Ent |
| `fin.ar_followup` | Follow up on overdue AR | Finance | Invoice 7d overdue | External | 8 | Startup, Medium, Ent |
| `fin.ap_processing` | Process AP invoice → payment | Finance | Bill received | Financial | 10 | Startup, Medium, Ent |
| `fin.expense_reimbursement` | Approve and pay expense reimbursement | Finance | Employee submits | Financial | 6 | Startup, Medium, Ent |
| `fin.monthly_close` | Run monthly close | Finance | Month-end | Financial | 20 | Startup, Medium, Ent |
| `ops.vendor_renewals` | Review vendor renewal | Operations | 60d pre-renewal | External | 4 | Medium, Ent |
| `ops.stack_audit` | Audit software stack and seats | Operations | Quarterly | Read | 3 | Medium, Ent |
| `ops.it_request` | Process IT / equipment request | Operations | Employee submits | Write | 4 | Startup, Medium, Ent |
| `legal.msa_review` | Review MSA / DPA | Legal | Customer sends contract | Write | 8 | Startup, Medium, Ent |
| `legal.contractor_agreement` | Issue contractor agreement | Legal | New 1099 hire | External | 3 | Startup, Medium, Ent |
| `legal.data_subject_request` | Handle GDPR / CCPA data subject request | Legal | Request received | Delete | 4 | Medium, Ent |
| `dev.incident_response` | Run incident response (Sev1/2) | Dev | Pager fires | External | 6 | Medium, Ent |
| `dev.bug_triage` | Triage incoming bug reports | Dev | Bug filed | Write | 8 | Startup, Medium, Ent |
| `dev.deploy_to_prod` | Deploy to production | Dev | PR merged to main | Write | 6 | Startup, Medium, Ent |
| `dev.access_request` | Handle internal access request | Dev | Employee submits | Write | 3 | Medium, Ent |

Full specs for each appear in the owning department's [Agent Playbook](#agent-playbook-pages) `§ Operational Playbooks` section. The id is the canonical reference everywhere else.

---

## 5. Industry packs

Each industry adds 6–12 industry-specific playbooks on top of the baseline. The packs.

### 5.1 SaaS / B2B Software (`saas`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `saas.subscription_revrec` | Run subscription revenue recognition | Finance | Invoice issued | Financial | 12 | Startup, Medium, Ent |
| `saas.trial_conversion` | Run free-trial conversion outreach | Sales | Trial expires in 3d | External | 8 | Startup, Medium, Ent |
| `saas.churn_save` | Run churn save / win-back motion | Sales | Cancel request | External | 6 | Medium, Ent |
| `saas.demo_to_close` | Demo → close motion | Sales | SQL stage reached | External | 10 | Startup, Medium, Ent |
| `saas.usage_billing_recon` | Reconcile usage-based billing | Finance | Monthly | Financial | 6 | Medium, Ent |
| `saas.soc2_evidence` | Collect SOC 2 evidence | Operations | Quarterly | Read | 8 | Medium, Ent |
| `saas.mrr_cohort_report` | Compile MRR cohort report | Finance | Monthly | Read | 4 | Medium, Ent |
| `saas.customer_health_score` | Recompute customer health scores | Sales | Weekly | Read | 4 | Medium, Ent |

### 5.2 E-commerce / D2C (`ecom`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `ecom.order_fulfillment` | Fulfill order (pick → ship) | Operations | Order paid | External | 30 | Startup, Medium, Ent |
| `ecom.rma_processing` | Process RMA / return | Operations | Return request | Financial | 12 | Startup, Medium, Ent |
| `ecom.inventory_restock` | Reorder inventory at threshold | Operations | Stock < min | Financial | 8 | Startup, Medium, Ent |
| `ecom.abandoned_cart` | Recover abandoned cart | Marketing | Cart idle 4h | External | 10 | Startup, Medium, Ent |
| `ecom.refund_issued` | Issue customer refund | Finance | Support approves | Financial | 8 | Startup, Medium, Ent |
| `ecom.product_launch` | Coordinate product launch | Marketing | Launch date | External | 6 | Medium, Ent |
| `ecom.inventory_variance` | Audit inventory variance | Operations | Monthly | Write | 6 | Medium, Ent |
| `ecom.shipping_recon` | Reconcile shipping carrier invoices | Finance | Monthly | Financial | 4 | Medium, Ent |
| `ecom.marketplace_sync` | Sync marketplace listings (Amazon/Shopify) | Operations | Daily | Write | 10 | Medium, Ent |
| `ecom.sales_tax_remit` | Remit sales tax per state | Finance | Monthly / quarterly | Financial | 6 | Medium, Ent |

### 5.3 Professional Services (`proserv`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `proserv.time_to_billing` | Roll up timesheet → invoice | Finance | Weekly / monthly | Financial | 12 | Startup, Medium, Ent |
| `proserv.project_burn_alert` | Alert on project burn / margin | Operations | Daily | Read | 6 | Startup, Medium, Ent |
| `proserv.retainer_recon` | Reconcile retainer balance | Finance | Monthly | Financial | 4 | Medium, Ent |
| `proserv.scope_change` | Issue scope-change order | Sales | Change requested | External | 4 | Startup, Medium, Ent |
| `proserv.client_onboarding` | Run client onboarding | Operations | Engagement signed | External | 6 | Startup, Medium, Ent |
| `proserv.engagement_renewal` | Run engagement renewal | Sales | 60d pre-renewal | External | 4 | Medium, Ent |
| `proserv.resource_alloc` | Allocate consultants to engagements | Operations | Weekly | Write | 8 | Medium, Ent |
| `proserv.utilisation_report` | Produce utilisation report | Operations | Monthly | Read | 4 | Medium, Ent |

### 5.4 Healthcare / Medical Practice (`health`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `health.patient_intake` | Run patient intake (forms → record) | Operations | New patient | Write | 30 | Startup, Medium, Ent |
| `health.insurance_verify` | Verify insurance eligibility | Operations | Pre-visit | Read | 20 | Startup, Medium, Ent |
| `health.prior_auth` | Submit prior authorisation | Operations | Procedure scheduled | External | 12 | Startup, Medium, Ent |
| `health.hipaa_audit` | Compile HIPAA audit log | Legal | Monthly / on-demand | Read | 4 | Medium, Ent |
| `health.claim_submit` | Submit insurance claim | Finance | Visit complete | External | 16 | Startup, Medium, Ent |
| `health.claim_denial` | Appeal denied claim | Finance | Denial received | External | 8 | Medium, Ent |
| `health.appt_scheduling` | Schedule / reschedule appointment | Operations | Patient request | Write | 24 | Startup, Medium, Ent |
| `health.recall_outreach` | Run patient recall outreach | Marketing | Care interval elapsed | External | 6 | Medium, Ent |
| `health.record_request` | Handle medical record request | Legal | Patient or provider request | Read | 4 | Medium, Ent |
| `health.compliance_training` | Track compliance training | HR | Annual / on hire | Read | 3 | Medium, Ent |

### 5.5 Manufacturing & Logistics (`mfg`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `mfg.purchase_order` | Issue purchase order | Operations | Demand signal | Financial | 12 | Startup, Medium, Ent |
| `mfg.inventory_variance` | Reconcile inventory variance | Operations | Monthly | Write | 8 | Medium, Ent |
| `mfg.supplier_scorecard` | Compile supplier scorecards | Operations | Quarterly | Read | 4 | Medium, Ent |
| `mfg.shipment_tracking` | Track inbound / outbound shipments | Operations | Daily | Read | 6 | Startup, Medium, Ent |
| `mfg.quality_incident` | Report quality incident | Operations | QC failure | Write | 4 | Medium, Ent |
| `mfg.maintenance_schedule` | Schedule preventive maintenance | Operations | Per asset cadence | Write | 6 | Medium, Ent |
| `mfg.production_run_recon` | Reconcile production run | Operations | Run complete | Write | 8 | Medium, Ent |
| `mfg.customs_duties` | Process customs / duties | Finance | Shipment crosses border | Financial | 6 | Medium, Ent |
| `mfg.return_to_supplier` | Return goods to supplier | Operations | QC failure / overage | External | 3 | Medium, Ent |

### 5.6 Real Estate (`realestate`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `re.listing_pipeline` | Move listings through pipeline | Sales | New listing / status change | Write | 10 | Startup, Medium, Ent |
| `re.tenant_screening` | Screen tenant applications | Operations | Application submitted | Read | 12 | Startup, Medium, Ent |
| `re.lease_renewal` | Run lease renewal | Operations | 90d pre-end | External | 6 | Startup, Medium, Ent |
| `re.maintenance_ticket` | Handle maintenance ticket | Operations | Tenant submits | External | 16 | Startup, Medium, Ent |
| `re.rent_collection` | Collect rent / late notice | Finance | Due date | External | 10 | Startup, Medium, Ent |
| `re.property_inspection` | Schedule property inspection | Operations | Annual / move-in / move-out | Write | 4 | Medium, Ent |
| `re.showing_schedule` | Schedule showings | Sales | Prospect interest | External | 8 | Startup, Medium, Ent |
| `re.commission_recon` | Reconcile commission payouts | Finance | Deal closed | Financial | 6 | Medium, Ent |

### 5.7 Hospitality / Restaurants (`hosp`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `hosp.reservation_mgmt` | Manage reservations | Operations | Booking / cancellation | External | 14 | Startup, Medium, Ent |
| `hosp.tip_distribution` | Calculate and distribute tips | Finance | End of shift | Financial | 8 | Startup, Medium, Ent |
| `hosp.food_cost_variance` | Track food-cost variance | Operations | Weekly | Read | 4 | Medium, Ent |
| `hosp.staff_scheduling` | Build weekly staff schedule | HR | Weekly | Write | 10 | Startup, Medium, Ent |
| `hosp.no_show` | Handle no-show / cancellation fee | Finance | No-show recorded | External | 3 | Medium, Ent |
| `hosp.inventory_order` | Order inventory (food & bev) | Operations | Daily / weekly | Financial | 6 | Startup, Medium, Ent |
| `hosp.health_inspection` | Prep for health inspection | Operations | Inspection scheduled | Write | 4 | Medium, Ent |
| `hosp.loyalty_program` | Run loyalty programme outreach | Marketing | Per cadence | External | 4 | Medium, Ent |

### 5.8 Education / EdTech (`edu`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `edu.enrollment` | Process enrollment / registration | Operations | Application | Write | 24 | Startup, Medium, Ent |
| `edu.transcript_request` | Issue transcript request | Operations | Student request | Read | 4 | Medium, Ent |
| `edu.instructor_payroll` | Run instructor payroll | Finance | Per pay cycle | Financial | 6 | Startup, Medium, Ent |
| `edu.course_renewal` | Run course renewal outreach | Marketing | Term end | External | 4 | Medium, Ent |
| `edu.grade_rollup` | Roll up grades to transcripts | Operations | Term end | Write | 8 | Medium, Ent |
| `edu.parent_comms` | Run parent communications | Marketing | Per cadence / per event | External | 6 | Medium, Ent |
| `edu.ferpa_compliance` | Track FERPA compliance | Legal | Per request / audit | Read | 3 | Medium, Ent |
| `edu.cohort_progression` | Track cohort progression | Operations | Per term | Read | 4 | Medium, Ent |

### 5.9 Financial Services / FinTech (`fin_svc`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `finsvc.kyc` | Run KYC / identity verification | Operations | New account | Read | 20 | Startup, Medium, Ent |
| `finsvc.aml_monitoring` | Monitor transactions for AML signals | Finance | Continuous | Read | 12 | Medium, Ent |
| `finsvc.dispute_resolution` | Resolve transaction dispute | Operations | Dispute filed | Financial | 10 | Startup, Medium, Ent |
| `finsvc.regulatory_reporting` | File regulatory report (CTR/SAR) | Legal | Threshold / suspicion | External | 6 | Medium, Ent |
| `finsvc.account_opening` | Open customer account | Operations | Approved KYC | Write | 12 | Startup, Medium, Ent |
| `finsvc.fraud_alert` | Triage fraud alert | Operations | Alert fires | Financial | 8 | Medium, Ent |
| `finsvc.risk_score` | Recompute customer risk scores | Operations | Daily / on event | Write | 4 | Medium, Ent |
| `finsvc.suitability_review` | Periodic suitability review | Legal | Annual / on event | Read | 4 | Ent |
| `finsvc.audit_compile` | Compile audit evidence package | Operations | Scheduled / on-demand | Read | 6 | Medium, Ent |
| `finsvc.wire_approval` | Approve high-value wire | Finance | Above threshold | Financial | 4 | Medium, Ent |

### 5.10 Trades / Construction (`trades`)

| id | Name | Dept | Trigger | Risk | Hrs/mo | Sizes |
|---|---|---|---|---|---|---|
| `trades.job_estimate` | Produce job estimate | Sales | Lead request | External | 12 | Startup, Medium, Ent |
| `trades.change_order` | Issue change order | Sales | Scope shift on site | External | 8 | Startup, Medium, Ent |
| `trades.sub_payment` | Pay subcontractor | Finance | Milestone complete | Financial | 6 | Startup, Medium, Ent |
| `trades.lien_release` | Issue lien release | Legal | Payment + completion | External | 3 | Medium, Ent |
| `trades.permit_tracking` | Track permits per job | Operations | Per job | Read | 4 | Medium, Ent |
| `trades.material_delivery` | Schedule material deliveries | Operations | Per job timeline | External | 6 | Startup, Medium, Ent |
| `trades.daily_progress` | File daily progress report | Operations | Daily on site | Write | 8 | Medium, Ent |
| `trades.punch_list` | Manage punch list to closeout | Operations | Substantial completion | Write | 6 | Startup, Medium, Ent |

### 5.11 Other / Generic (`other`)

Baseline (§ 4) only. The customer can add any playbook from any pack manually.

---

## 6. The defaults logic

Given a chosen `(industry, size)`, the Builder computes the pre-checked set as:

```
defaults(industry, size) = filter(
    baseline_playbooks ∪ industry_pack(industry),
    size ∈ playbook.size_tags
)
```

The customer sees the full Catalog (all 25 baseline + all 10 packs) regardless of `(industry, size)` — defaults are visual pre-checks, not filters. The customer can check any playbook from any pack at any time. The phrase "show all playbooks" is not a special mode; the catalog is always all visible.

This is what gives the customer the "I didn't know I needed that" experience: discovering operations they wouldn't have prompted for in an interview.

---

## 7. Sizes

The three sizes are inherited from [Customer Journeys](Customer-Journeys):

| Size | Employees | Typical revenue band | Pre-check density |
|---|---|---|---|
| **Startup** | 1–49 | Pre-seed → Series A | ~12 playbooks (focused) |
| **Medium** | 50–249 | Series B → public-private boundary | ~18 playbooks |
| **Enterprise** | 250+ | Mid-market and up | ~24 playbooks (most operations relevant) |

The density target is what tells us if the catalog has the right granularity — < 8 pre-checks means the Builder feels empty; > 30 means it feels overwhelming.

---

## 8. The Builder UI contract

The [Build your company](../build.html) page renders this catalog with these guarantees:

1. **Every playbook in this Catalog appears as a card.** No filtering; only pre-check state changes.
2. **Cards are grouped by `owner_dept`** in seven (or more) columns / sections.
3. **Each card shows:** name, one-line description (synthesised from `trigger` + `risk_class`), hours-saved badge, "Customize" affordance.
4. **Pre-checked cards have a "Common in [Industry · Size]" tag.** Cards added by the customer manually do not.
5. **Card hover / expand** shows the full spec from the `spec_link` (department's `§ Operational Playbooks` section), the agents involved, and a "what could go wrong" mini-section from the Resolution Plan template.
6. **The live summary panel** at the right (or bottom on mobile) shows: count of selected playbooks, agents that will be activated, sum of `baseline_time_saved`, count of `Financial`/`Delete` risk-class playbooks (the ones that will trigger guardrails by default).
7. **No client-side validation reorders or hides cards.** The Catalog is the source; the UI is the renderer.

The same catalog file backs the [Atlantis Manager](Atlantis-Manager-Playbook) onboarding-mode conversation. The Manager's prompt receives the catalog (cached per [Atlantis Manager § 5](Atlantis-Manager-Playbook#5-the-system-prompt-model)) and produces recommendations from it.

---

## 9. The catalog file format

The machine-readable catalog lives at `engine/catalog/playbooks.json` (Phase 1 deliverable). Schema:

```json
{
  "version": "2026-05-17",
  "industries": [
    { "id": "saas", "name": "SaaS / B2B Software", "summary": "..." }
  ],
  "sizes": [
    { "id": "startup", "name": "Startup", "employee_range": "1-49" }
  ],
  "playbooks": [
    {
      "id": "fin.stripe_reconciliation",
      "name": "Reconcile Stripe payouts vs AR",
      "owner_dept": "Finance",
      "agents_involved": ["finance_agent"],
      "trigger": "Daily at end-of-day tenant timezone",
      "risk_class": "Financial",
      "baseline_time_saved": 12,
      "industry_tags": ["saas", "ecom", "proserv", "other"],
      "size_tags": ["startup", "medium", "enterprise"],
      "spec_link": "Finance-Agent-Playbook#operational-playbooks-stripe-reconciliation"
    }
  ]
}
```

The JSON file is the single source the Builder UI, the Atlantis Manager, the FinOps calculator, and the Operational Playbook Index all read from. Adding a playbook = appending one entry to this file plus writing its spec in the owning department's page. No other code changes required.

---

## 10. Agent Playbook pages

Per the **single home for playbooks** rule, every operational playbook's full spec lives in the owning department's Agent Playbook page, in a `§ Operational Playbooks` section. The Catalog references via `spec_link`.

| Department | Page |
|---|---|
| Sales | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook) |
| Marketing | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook) |
| HR | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook) |
| Finance | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook) |
| Operations | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook) |
| Legal | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook) |
| Dev | [Dev-Agent-Playbook § Operational Playbooks](Dev-Agent-Playbook) |
| Cross-cutting basics | [Company Operational Basics](Company-Operational-Basics) |

When an eighth department is added, this page gains a row and the new department's playbook ids appear in the Catalog. No other plumbing required.

---

## 11. Forbidden

- **Duplicate playbook ids.** Ids are globally unique. Adding a playbook with an existing id fails validation.
- **Detail duplication.** The Catalog records *that* a playbook exists and where to find it; it does not duplicate the spec. The owning department's page is the single source of truth for the spec.
- **Industry-pack divergence from the baseline.** An industry pack adds playbooks; it does not modify baseline playbook ids or behaviour. If a baseline playbook needs an industry-specific variant, the variant becomes a new playbook id with `industry_tags` set narrowly.
- **Silent catalog edits.** Every change to this page (and the underlying JSON) produces a versioned commit reviewed by the Owner. Customers who activated under a prior version see their version frozen; updates roll forward only when the customer accepts (per [Playbook Customization Model](Playbook-Customization-Model)).
- **Adding a playbook that maps to no agent.** Every playbook has an owning department; if no department fits, the gap is real and a new department is being recognised — escalate before adding.
- **Marketing copy in playbook names.** Names are operational ("Reconcile Stripe payouts vs AR"), not aspirational ("Make AR easy"). Per [Wiki Conventions § 6](Wiki-Conventions#6-tone-and-style).

---

## 12. When to revisit

- A customer adds a non-catalog operation often (via [Playbook Customization Model](Playbook-Customization-Model)) — promote the operation to the Catalog if the pattern recurs across ≥ 3 tenants.
- A baseline playbook is unchecked in > 50% of tenants — it is not actually baseline; demote to an industry pack.
- An industry pack's pre-check density drops below 4 or above 12 — re-balance the pack.
- A new industry emerges in design-partner conversations (the user mentioned biotech, agritech, etc.) — propose a new pack with the same field shape; bring to Founders + relevant Domain Council.
- Baseline-time-saved numbers drift from observed reality — the calculator output is wrong; re-baseline against real tenant data.

Product owns this Catalog. Founders own the industry list and the baseline-vs-pack boundary. The Domain Expert Councils own the per-industry pack contents (the HR Domain Council reviews the HR-flavored variants, etc.).

---

## Cross-references

- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the onboarding-mode conversation that walks this catalog
- [Playbook Customization Model](Playbook-Customization-Model) — how customers override the defaults
- [Operational Playbook Index](Operational-Playbook-Index) — the generated index aggregating playbook ids across all department pages
- [Company Operational Basics](Company-Operational-Basics) — the thin page for cross-cutting operations not owned by one department
- [Customer Journeys](Customer-Journeys) — the three sizes (Startup / Medium / Enterprise)
- [Business Workflows](Business-Workflows) — the descriptive taxonomy this Catalog selects from
- [Action Risk Classification](Action-Risk-Classification) — the risk-class column values
- [Autonomy Modes](Autonomy-Modes) — the customer's autonomy choice at activation
- [Resolution Plan Specification](Resolution-Plan-Specification) — the artifact every playbook produces when invoked
- [Master Blueprint Index § A.1](Master-Blueprint-Index#a1--customer-facing-artifacts-the-what-in-practice) — the customer-facing-artifacts catalogue
- [Master Blueprint Index](Master-Blueprint-Index)
