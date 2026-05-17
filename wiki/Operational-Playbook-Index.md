# Operational Playbook Index

> **Type:** Reference · **Owner:** Product / Engineering · **Status:** Approved · **Applies to:** All agents · Humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

This page is the unified flat index of every operational playbook in the platform, aggregated across all seven department [Agent Playbooks](#by-department) plus the [Company Operational Basics](Company-Operational-Basics). It is the lookup table the [Atlantis Manager](Atlantis-Manager-Playbook), the [Company Operation Builder](Company-Operation-Builder-Catalog), the Action Executor, and the FinOps calculator all consult.

> **The reframe this page makes:** *one canonical id per operation, with one canonical spec.* The Index is a flat directory; the spec for each playbook lives in exactly one place — the owning department's page. No duplication, no ambiguity, no drift.

---

## 1. How this page works

For every playbook in the platform there is exactly one entry below with:

- The **canonical id** (e.g. `fin.stripe_reconciliation`)
- The **name** (e.g. "Reconcile Stripe payouts vs AR")
- A **deep link** to the spec section in the owning department's page (e.g. `Finance-Agent-Playbook#operational-playbooks-stripe-reconciliation`)
- The **risk class** for quick scanning

This page is generated from the per-department `§ Operational Playbooks` sections plus the [Company Operational Basics](Company-Operational-Basics). When a new playbook is added to any department, this Index gets a new row.

The corresponding machine-readable view is `engine/catalog/playbooks.json` per [Company Operation Builder Catalog § 9](Company-Operation-Builder-Catalog#9-the-catalog-file-format).

---

## 2. By department

### Sales

| id | Name | Risk | Spec |
|---|---|---|---|
| `sales.inbound_qualification` | Qualify inbound lead | Write | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `sales.outbound_prospecting` | Run outbound prospecting cadence | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `sales.onboarding_kickoff` | Kick off customer onboarding | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `saas.demo_to_close` | Demo → close motion | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `saas.trial_conversion` | Run free-trial conversion outreach | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `saas.churn_save` | Run churn save / win-back motion | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `proserv.scope_change` | Issue scope-change order | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `proserv.engagement_renewal` | Run engagement renewal | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `re.listing_pipeline` | Move listings through pipeline | Write | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `re.showing_schedule` | Schedule property showings | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `trades.job_estimate` | Produce job estimate | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |
| `trades.change_order` | Issue change order | External | [Sales-Agent-Playbook § Operational Playbooks](Sales-Agent-Playbook#operational-playbooks) |

### Marketing

| id | Name | Risk | Spec |
|---|---|---|---|
| `mkt.content_publishing` | Publish content on editorial cadence | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `mkt.paid_reporting` | Compile paid-acquisition report | Read | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `mkt.email_nurture` | Run email nurture sequence | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `ecom.abandoned_cart` | Recover abandoned cart | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `ecom.product_launch` | Coordinate product launch | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `health.recall_outreach` | Run patient recall outreach | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `hosp.loyalty_program` | Run loyalty programme outreach | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `edu.course_renewal` | Run course renewal outreach | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |
| `edu.parent_comms` | Run parent communications | External | [Marketing-Agent-Playbook § Operational Playbooks](Marketing-Agent-Playbook#operational-playbooks) |

### HR

| id | Name | Risk | Spec |
|---|---|---|---|
| `hr.hire_to_day1` | Run hire (offer → day 1) | External | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |
| `hr.pto_request` | Process PTO request | Write | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |
| `hr.perf_review_cycle` | Run performance review cycle | Write | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |
| `hr.offboarding` | Run offboarding (last day → archive) | External | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |
| `hosp.staff_scheduling` | Build weekly staff schedule | Write | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |
| `health.compliance_training` | Track compliance training | Read | [HR-Agent-Playbook § Operational Playbooks](HR-Agent-Playbook#operational-playbooks) |

### Finance

| id | Name | Risk | Spec |
|---|---|---|---|
| `fin.stripe_reconciliation` | Reconcile Stripe payouts vs AR | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `fin.ar_followup` | Follow up on overdue AR | External | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `fin.ap_processing` | Process AP invoice → payment | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `fin.expense_reimbursement` | Approve and pay expense reimbursement | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `fin.monthly_close` | Run monthly close | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `saas.subscription_revrec` | Run subscription revenue recognition | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `saas.usage_billing_recon` | Reconcile usage-based billing | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `saas.mrr_cohort_report` | Compile MRR cohort report | Read | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `ecom.refund_issued` | Issue customer refund | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `ecom.shipping_recon` | Reconcile shipping carrier invoices | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `ecom.sales_tax_remit` | Remit sales tax per state | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `proserv.time_to_billing` | Roll up timesheet → invoice | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `proserv.retainer_recon` | Reconcile retainer balance | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `health.claim_submit` | Submit insurance claim | External | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `health.claim_denial` | Appeal denied claim | External | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `mfg.customs_duties` | Process customs / duties | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `re.rent_collection` | Collect rent / late notice | External | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `re.commission_recon` | Reconcile commission payouts | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `hosp.tip_distribution` | Calculate and distribute tips | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `hosp.no_show` | Handle no-show / cancellation fee | External | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `edu.instructor_payroll` | Run instructor payroll | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `finsvc.aml_monitoring` | Monitor transactions for AML signals | Read | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `finsvc.wire_approval` | Approve high-value wire | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |
| `trades.sub_payment` | Pay subcontractor | Financial | [Finance-Agent-Playbook § Operational Playbooks](Finance-Agent-Playbook#operational-playbooks) |

### Operations

| id | Name | Risk | Spec |
|---|---|---|---|
| `ops.vendor_renewals` | Review vendor renewal | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ops.stack_audit` | Audit software stack and seats | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ops.it_request` | Process IT / equipment request | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `saas.soc2_evidence` | Collect SOC 2 evidence | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `saas.customer_health_score` | Recompute customer health scores | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ecom.order_fulfillment` | Fulfill order (pick → ship) | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ecom.rma_processing` | Process RMA / return | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ecom.inventory_restock` | Reorder inventory at threshold | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ecom.inventory_variance` | Audit inventory variance | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `ecom.marketplace_sync` | Sync marketplace listings | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `proserv.project_burn_alert` | Alert on project burn / margin | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `proserv.client_onboarding` | Run client onboarding | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `proserv.resource_alloc` | Allocate consultants to engagements | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `proserv.utilisation_report` | Produce utilisation report | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `health.patient_intake` | Run patient intake (forms → record) | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `health.insurance_verify` | Verify insurance eligibility | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `health.prior_auth` | Submit prior authorisation | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `health.appt_scheduling` | Schedule / reschedule appointment | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.purchase_order` | Issue purchase order | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.inventory_variance` | Reconcile inventory variance | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.supplier_scorecard` | Compile supplier scorecards | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.shipment_tracking` | Track inbound / outbound shipments | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.quality_incident` | Report quality incident | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.maintenance_schedule` | Schedule preventive maintenance | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.production_run_recon` | Reconcile production run | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `mfg.return_to_supplier` | Return goods to supplier | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `re.tenant_screening` | Screen tenant applications | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `re.lease_renewal` | Run lease renewal | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `re.maintenance_ticket` | Handle maintenance ticket | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `re.property_inspection` | Schedule property inspection | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `hosp.reservation_mgmt` | Manage reservations | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `hosp.food_cost_variance` | Track food-cost variance | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `hosp.inventory_order` | Order inventory (food & bev) | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `hosp.health_inspection` | Prep for health inspection | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `edu.enrollment` | Process enrollment / registration | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `edu.transcript_request` | Issue transcript request | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `edu.grade_rollup` | Roll up grades to transcripts | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `edu.cohort_progression` | Track cohort progression | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.kyc` | Run KYC / identity verification | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.dispute_resolution` | Resolve transaction dispute | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.account_opening` | Open customer account | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.fraud_alert` | Triage fraud alert | Financial | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.risk_score` | Recompute customer risk scores | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `finsvc.audit_compile` | Compile audit evidence package | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `trades.permit_tracking` | Track permits per job | Read | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `trades.material_delivery` | Schedule material deliveries | External | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `trades.daily_progress` | File daily progress report | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |
| `trades.punch_list` | Manage punch list to closeout | Write | [Operations-Agent-Playbook § Operational Playbooks](Operations-Agent-Playbook#operational-playbooks) |

### Legal

| id | Name | Risk | Spec |
|---|---|---|---|
| `legal.msa_review` | Review MSA / DPA | Write | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `legal.contractor_agreement` | Issue contractor agreement | External | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `legal.data_subject_request` | Handle GDPR / CCPA data subject request | Delete | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `health.hipaa_audit` | Compile HIPAA audit log | Read | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `health.record_request` | Handle medical record request | Read | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `edu.ferpa_compliance` | Track FERPA compliance | Read | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `finsvc.regulatory_reporting` | File regulatory report (CTR/SAR) | External | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `finsvc.suitability_review` | Periodic suitability review | Read | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |
| `trades.lien_release` | Issue lien release | External | [Legal-Agent-Playbook § Operational Playbooks](Legal-Agent-Playbook#operational-playbooks) |

### Dev

| id | Name | Risk | Spec |
|---|---|---|---|
| `dev.incident_response` | Run incident response (Sev1/2) | External | [Dev-Agent-Playbook § Operational Playbooks](Dev-Agent-Playbook#operational-playbooks) |
| `dev.bug_triage` | Triage incoming bug reports | Write | [Dev-Agent-Playbook § Operational Playbooks](Dev-Agent-Playbook#operational-playbooks) |
| `dev.deploy_to_prod` | Deploy to production | Write | [Dev-Agent-Playbook § Operational Playbooks](Dev-Agent-Playbook#operational-playbooks) |
| `dev.access_request` | Handle internal access request | Write | [Dev-Agent-Playbook § Operational Playbooks](Dev-Agent-Playbook#operational-playbooks) |

### Cross-cutting basics

| id | Name | Risk | Spec |
|---|---|---|---|
| `basics.general_request` | Submit a general internal request | Read | [Company Operational Basics § 2.1](Company-Operational-Basics#21-general-request-intake) |
| `basics.access_request` | Request access to a system or document | Write | [Company Operational Basics § 2.2](Company-Operational-Basics#22-system-access-request) |
| `basics.feedback` | Submit feedback or suggestion | Read | [Company Operational Basics § 2.3](Company-Operational-Basics#23-feedback--suggestion-intake) |
| `basics.company_announcement` | Distribute a company-wide announcement | External | [Company Operational Basics § 2.4](Company-Operational-Basics#24-announce-a-company-wide-change) |
| `basics.activate_department` | Activate a new department in the tenant | Write | [Company Operational Basics § 2.5](Company-Operational-Basics#25-activate-a-new-department) |
| `basics.reorganise` | Reorganise reporting lines, departments, or roles | Write | [Company Operational Basics § 2.6](Company-Operational-Basics#26-reorganise-the-tenant) |
| `basics.platform_support` | Escalate a platform issue to Atlantis support | External | [Company Operational Basics § 2.7](Company-Operational-Basics#27-platform-support-escalation) |

---

## 3. Total count

As of `2026-05-17`:

| Group | Count |
|---|---|
| Sales | 12 |
| Marketing | 9 |
| HR | 6 |
| Finance | 24 |
| Operations | 47 |
| Legal | 9 |
| Dev | 4 |
| Basics | 7 |
| **Total** | **118 unique playbook ids** |

Note that some playbook ids appear across multiple industries (e.g. `mfg.inventory_variance` and `ecom.inventory_variance` are distinct ids with different specs); each unique id counts once. The Catalog ([Company Operation Builder Catalog](Company-Operation-Builder-Catalog)) tells the customer which subset to pre-check based on industry × size.

---

## 4. Lookup by id

The id is the universal handle. Wherever you see `fin.stripe_reconciliation` — in a Resolution Plan citation, in an audit event, in a customer's customisation file, in a regulator's export — it resolves to exactly one spec via this Index.

The Atlantis Manager uses the Index in two ways:

- **Forward lookup**: user describes an intent → Manager classifies → resolves to a playbook id → opens the spec
- **Reverse lookup**: ticket emits an event referencing playbook id → Manager renders the spec in conversation as context

The Action Executor uses the Index to validate that a ticket's claimed playbook id exists and the agent it routes to owns the playbook.

---

## 5. Forbidden

- **Duplicate ids.** One id, one entry, one spec.
- **Specs that diverge from the owning department's page.** This Index is a directory of links; the link is the source of truth.
- **Soft-deletes.** A playbook can be deprecated but not removed; deprecated entries are marked `Status: Deprecated` and remain in the Index for audit-trail consistency with old tickets.
- **Manual edits to the count in § 3 without a corresponding entry.** The count is derived; the entries are the truth.

---

## 6. When to revisit

- Quarterly: regenerate this Index from the source-of-truth pages; catch any drift.
- When a new department is added: add its `§ Operational Playbooks` rows in this Index.
- When a playbook is moved between departments: update the spec link; the id does not change.
- When a playbook is deprecated: mark the row `Status: Deprecated`; do not delete.

Engineering owns the regeneration script. Product owns the per-department classification. Operations owns the residual Basics rows.

---

## Cross-references

- [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) — the matrix view that selects from this Index
- [Company Operational Basics](Company-Operational-Basics) — the residual cross-cutting playbooks
- [Playbook Customization Model](Playbook-Customization-Model) — how customer overrides reference these ids
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the consumer of this Index in onboarding and task modes
- [HR Agent Playbook](HR-Agent-Playbook) · [Finance Agent Playbook](Finance-Agent-Playbook) · [Sales Agent Playbook](Sales-Agent-Playbook) · [Marketing Agent Playbook](Marketing-Agent-Playbook) · [Operations Agent Playbook](Operations-Agent-Playbook) · [Legal Agent Playbook](Legal-Agent-Playbook) · [Dev Agent Playbook](Dev-Agent-Playbook) — the seven department spec sources
- [Master Blueprint Index](Master-Blueprint-Index)
