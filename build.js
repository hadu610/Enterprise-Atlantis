/* build.js — Company Operation Builder
 *
 * Renders the playbook catalog from Company-Operation-Builder-Catalog.md as
 * a swipeable deck. State lives in BuilderState; the Atlantis Manager
 * widget reads and writes the same state via window.AtlantisBuilder.
 */

(function () {
  'use strict';

  // ---------- Industries ----------
  const INDUSTRIES = [
    { id: 'saas',       name: 'SaaS / B2B Software' },
    { id: 'ecom',       name: 'E-commerce / D2C' },
    { id: 'proserv',    name: 'Professional Services' },
    { id: 'health',     name: 'Healthcare / Medical' },
    { id: 'mfg',        name: 'Manufacturing & Logistics' },
    { id: 'realestate', name: 'Real Estate' },
    { id: 'hosp',       name: 'Hospitality / Restaurants' },
    { id: 'edu',        name: 'Education / EdTech' },
    { id: 'fin_svc',    name: 'Financial Services / FinTech' },
    { id: 'trades',     name: 'Trades / Construction' },
    { id: 'other',      name: 'Other / Generic' },
  ];

  // ---------- Sizes ----------
  const SIZES = [
    { id: 'startup',    name: 'Startup',    range: '1–49 people' },
    { id: 'medium',     name: 'Medium',     range: '50–249 people' },
    { id: 'enterprise', name: 'Enterprise', range: '250+ people' },
  ];

  // ---------- Departments (display order) ----------
  const DEPTS = [
    { id: 'Sales',      name: 'Sales',      icon: '◇', agent: 'sales_agent' },
    { id: 'Marketing',  name: 'Marketing',  icon: '◆', agent: 'marketing_agent' },
    { id: 'HR',         name: 'HR',         icon: '◯', agent: 'hr_agent' },
    { id: 'Finance',    name: 'Finance',    icon: '◉', agent: 'finance_agent' },
    { id: 'Operations', name: 'Operations', icon: '◧', agent: 'operations_agent' },
    { id: 'Legal',      name: 'Legal',      icon: '⬢', agent: 'legal_agent' },
    { id: 'Dev',        name: 'Dev',        icon: '▣', agent: 'dev_agent' },
  ];

  // ---------- Playbook Catalog ----------
  const ALL = ['saas','ecom','proserv','health','mfg','realestate','hosp','edu','fin_svc','trades','other'];
  const ALL_SIZES = ['startup','medium','enterprise'];
  const MED_ENT = ['medium','enterprise'];

  const PLAYBOOKS = [
    // ---- Baseline (universal across industries) ----
    { id:'sales.inbound_qualification', name:'Qualify inbound lead', dept:'Sales', trigger:'Form submission', risk:'Write', hrs:8, industries:ALL, sizes:ALL_SIZES, desc:'Score, enrich, and route inbound leads to the right rep.' },
    { id:'sales.outbound_prospecting',  name:'Run outbound prospecting cadence', dept:'Sales', trigger:'Weekly cadence', risk:'External', hrs:16, industries:ALL, sizes:MED_ENT, desc:'Source, personalize, and sequence outbound touches.' },
    { id:'sales.onboarding_kickoff',    name:'Kick off customer onboarding', dept:'Sales', trigger:'Contract signed', risk:'External', hrs:6, industries:ALL, sizes:ALL_SIZES, desc:'Hand off the new customer to onboarding with the full context.' },
    { id:'mkt.content_publishing',      name:'Publish content on editorial cadence', dept:'Marketing', trigger:'Editorial calendar', risk:'External', hrs:12, industries:ALL, sizes:ALL_SIZES, desc:'Draft, route for review, schedule, and distribute content.' },
    { id:'mkt.paid_reporting',          name:'Compile paid-acquisition report', dept:'Marketing', trigger:'Weekly', risk:'Read', hrs:4, industries:ALL, sizes:MED_ENT, desc:'Pull spend + performance across channels into one report.' },
    { id:'mkt.email_nurture',           name:'Run email nurture sequence', dept:'Marketing', trigger:'Lead enters segment', risk:'External', hrs:10, industries:ALL, sizes:ALL_SIZES, desc:'Segment leads, personalize, send, measure, and iterate.' },
    { id:'hr.hire_to_day1',             name:'Run hire (offer → day 1)', dept:'HR', trigger:'Offer accepted', risk:'External', hrs:8, industries:ALL, sizes:ALL_SIZES, desc:'Offer letter, background check, accounts, day-1 schedule.' },
    { id:'hr.pto_request',              name:'Process PTO request', dept:'HR', trigger:'Employee submits', risk:'Write', hrs:3, industries:ALL, sizes:ALL_SIZES, desc:'Validate balance, route to manager, update HRIS.' },
    { id:'hr.perf_review_cycle',        name:'Run performance review cycle', dept:'HR', trigger:'Quarterly', risk:'Write', hrs:6, industries:ALL, sizes:MED_ENT, desc:'Distribute forms, collect feedback, compile, route for calibration.' },
    { id:'hr.offboarding',              name:'Run offboarding (last day → archive)', dept:'HR', trigger:'Resignation accepted', risk:'External', hrs:5, industries:ALL, sizes:MED_ENT, desc:'Equipment return, account deprovision, exit interview, archive.' },
    { id:'fin.stripe_reconciliation',   name:'Reconcile Stripe payouts vs AR', dept:'Finance', trigger:'Daily', risk:'Financial', hrs:12, industries:ALL, sizes:ALL_SIZES, desc:'Match payouts to invoices; flag exceptions for human review.' },
    { id:'fin.ar_followup',             name:'Follow up on overdue AR', dept:'Finance', trigger:'Invoice 7d overdue', risk:'External', hrs:8, industries:ALL, sizes:ALL_SIZES, desc:'Tiered dunning emails; escalate to collections if needed.' },
    { id:'fin.ap_processing',           name:'Process AP invoice → payment', dept:'Finance', trigger:'Bill received', risk:'Financial', hrs:10, industries:ALL, sizes:ALL_SIZES, desc:'Validate, code, approve, pay; respect floors and dual-control.' },
    { id:'fin.expense_reimbursement',   name:'Approve and pay expense reimbursement', dept:'Finance', trigger:'Employee submits', risk:'Financial', hrs:6, industries:ALL, sizes:ALL_SIZES, desc:'Receipt check, policy validation, payout via payroll.' },
    { id:'fin.monthly_close',           name:'Run monthly close', dept:'Finance', trigger:'Month-end', risk:'Financial', hrs:20, industries:ALL, sizes:ALL_SIZES, desc:'Reconciliations, accruals, journal entries, package for review.' },
    { id:'ops.vendor_renewals',         name:'Review vendor renewal', dept:'Operations', trigger:'60d pre-renewal', risk:'External', hrs:4, industries:ALL, sizes:MED_ENT, desc:'Usage check, market comparison, draft negotiation position.' },
    { id:'ops.stack_audit',             name:'Audit software stack and seats', dept:'Operations', trigger:'Quarterly', risk:'Read', hrs:3, industries:ALL, sizes:MED_ENT, desc:'Inventory tools, identify dead seats, surface duplicates.' },
    { id:'ops.it_request',              name:'Process IT / equipment request', dept:'Operations', trigger:'Employee submits', risk:'Write', hrs:4, industries:ALL, sizes:ALL_SIZES, desc:'Validate, approve, procure, track, deliver.' },
    { id:'legal.msa_review',            name:'Review MSA / DPA', dept:'Legal', trigger:'Customer sends contract', risk:'Write', hrs:8, industries:ALL, sizes:ALL_SIZES, desc:'Compare against playbook, flag deviations, suggest redlines.' },
    { id:'legal.contractor_agreement',  name:'Issue contractor agreement', dept:'Legal', trigger:'New 1099 hire', risk:'External', hrs:3, industries:ALL, sizes:ALL_SIZES, desc:'Generate from template, route, sign, file.' },
    { id:'legal.data_subject_request',  name:'Handle GDPR / CCPA data subject request', dept:'Legal', trigger:'Request received', risk:'Delete', hrs:4, industries:ALL, sizes:MED_ENT, desc:'Identity verify, scope, fulfill within statutory window.' },
    { id:'dev.incident_response',       name:'Run incident response (Sev1/2)', dept:'Dev', trigger:'Pager fires', risk:'External', hrs:6, industries:ALL, sizes:MED_ENT, desc:'Triage, communicate, mitigate, post-mortem.' },
    { id:'dev.bug_triage',              name:'Triage incoming bug reports', dept:'Dev', trigger:'Bug filed', risk:'Write', hrs:8, industries:ALL, sizes:ALL_SIZES, desc:'Reproduce, prioritize, assign, route to fix queue.' },
    { id:'dev.deploy_to_prod',          name:'Deploy to production', dept:'Dev', trigger:'PR merged to main', risk:'Write', hrs:6, industries:ALL, sizes:ALL_SIZES, desc:'Run tests, gate, deploy, smoke check, rollback on failure.' },
    { id:'dev.access_request',          name:'Handle internal access request', dept:'Dev', trigger:'Employee submits', risk:'Write', hrs:3, industries:ALL, sizes:MED_ENT, desc:'Validate, provision time-boxed access, audit.' },

    // ---- SaaS pack ----
    { id:'saas.subscription_revrec',    name:'Run subscription revenue recognition', dept:'Finance', trigger:'Invoice issued', risk:'Financial', hrs:12, industries:['saas'], sizes:ALL_SIZES, desc:'Ratable rev-rec by contract term with audit trail.' },
    { id:'saas.trial_conversion',       name:'Run free-trial conversion outreach', dept:'Sales', trigger:'Trial expires in 3d', risk:'External', hrs:8, industries:['saas'], sizes:ALL_SIZES, desc:'Tailored conversion sequence based on trial usage signals.' },
    { id:'saas.churn_save',             name:'Run churn save / win-back motion', dept:'Sales', trigger:'Cancel request', risk:'External', hrs:6, industries:['saas'], sizes:MED_ENT, desc:'Detect, contact, offer, retain or graceful exit.' },
    { id:'saas.demo_to_close',          name:'Demo → close motion', dept:'Sales', trigger:'SQL stage reached', risk:'External', hrs:10, industries:['saas'], sizes:ALL_SIZES, desc:'Schedule, prep, run, follow up, contract.' },
    { id:'saas.usage_billing_recon',    name:'Reconcile usage-based billing', dept:'Finance', trigger:'Monthly', risk:'Financial', hrs:6, industries:['saas'], sizes:MED_ENT, desc:'Reconcile metered usage with billed amounts; resolve drifts.' },
    { id:'saas.soc2_evidence',          name:'Collect SOC 2 evidence', dept:'Operations', trigger:'Quarterly', risk:'Read', hrs:8, industries:['saas'], sizes:MED_ENT, desc:'Pull evidence per control; package for auditor.' },
    { id:'saas.mrr_cohort_report',      name:'Compile MRR cohort report', dept:'Finance', trigger:'Monthly', risk:'Read', hrs:4, industries:['saas'], sizes:MED_ENT, desc:'Track MRR by cohort; surface expansion and contraction.' },
    { id:'saas.customer_health_score',  name:'Recompute customer health scores', dept:'Operations', trigger:'Weekly', risk:'Read', hrs:4, industries:['saas'], sizes:MED_ENT, desc:'Roll up usage, support, NPS into a single health score.' },

    // ---- E-commerce pack ----
    { id:'ecom.order_fulfillment',      name:'Fulfill order (pick → ship)', dept:'Operations', trigger:'Order paid', risk:'External', hrs:30, industries:['ecom'], sizes:ALL_SIZES, desc:'Pick, pack, label, ship, send tracking.' },
    { id:'ecom.rma_processing',         name:'Process RMA / return', dept:'Operations', trigger:'Return request', risk:'Financial', hrs:12, industries:['ecom'], sizes:ALL_SIZES, desc:'Authorize, receive, inspect, restock or scrap, refund.' },
    { id:'ecom.inventory_restock',      name:'Reorder inventory at threshold', dept:'Operations', trigger:'Stock < min', risk:'Financial', hrs:8, industries:['ecom'], sizes:ALL_SIZES, desc:'Auto-PO from preferred supplier based on velocity.' },
    { id:'ecom.abandoned_cart',         name:'Recover abandoned cart', dept:'Marketing', trigger:'Cart idle 4h', risk:'External', hrs:10, industries:['ecom'], sizes:ALL_SIZES, desc:'Tiered email/SMS recovery with incentive escalation.' },
    { id:'ecom.refund_issued',          name:'Issue customer refund', dept:'Finance', trigger:'Support approves', risk:'Financial', hrs:8, industries:['ecom'], sizes:ALL_SIZES, desc:'Validate, refund via Stripe, update ledger.' },
    { id:'ecom.product_launch',         name:'Coordinate product launch', dept:'Marketing', trigger:'Launch date', risk:'External', hrs:6, industries:['ecom'], sizes:MED_ENT, desc:'Cross-channel launch sequence with QA gates.' },
    { id:'ecom.inventory_variance',     name:'Audit inventory variance', dept:'Operations', trigger:'Monthly', risk:'Write', hrs:6, industries:['ecom'], sizes:MED_ENT, desc:'Compare system vs physical counts; resolve drifts.' },
    { id:'ecom.shipping_recon',         name:'Reconcile shipping carrier invoices', dept:'Finance', trigger:'Monthly', risk:'Financial', hrs:4, industries:['ecom'], sizes:MED_ENT, desc:'Match shipments to invoiced charges; dispute overages.' },
    { id:'ecom.marketplace_sync',       name:'Sync marketplace listings', dept:'Operations', trigger:'Daily', risk:'Write', hrs:10, industries:['ecom'], sizes:MED_ENT, desc:'Push inventory, prices, listings to Amazon/Shopify/etc.' },
    { id:'ecom.sales_tax_remit',        name:'Remit sales tax per state', dept:'Finance', trigger:'Monthly / quarterly', risk:'Financial', hrs:6, industries:['ecom'], sizes:MED_ENT, desc:'Aggregate by jurisdiction, file, pay.' },

    // ---- Professional Services pack ----
    { id:'proserv.time_to_billing',     name:'Roll up timesheet → invoice', dept:'Finance', trigger:'Weekly / monthly', risk:'Financial', hrs:12, industries:['proserv'], sizes:ALL_SIZES, desc:'Aggregate billable hours, generate invoices, send.' },
    { id:'proserv.project_burn_alert',  name:'Alert on project burn / margin', dept:'Operations', trigger:'Daily', risk:'Read', hrs:6, industries:['proserv'], sizes:ALL_SIZES, desc:'Surface projects approaching budget or margin floor.' },
    { id:'proserv.retainer_recon',      name:'Reconcile retainer balance', dept:'Finance', trigger:'Monthly', risk:'Financial', hrs:4, industries:['proserv'], sizes:MED_ENT, desc:'Apply hours to retainer; surface remaining balance.' },
    { id:'proserv.scope_change',        name:'Issue scope-change order', dept:'Sales', trigger:'Change requested', risk:'External', hrs:4, industries:['proserv'], sizes:ALL_SIZES, desc:'Document change, price impact, route for client sign-off.' },
    { id:'proserv.client_onboarding',   name:'Run client onboarding', dept:'Operations', trigger:'Engagement signed', risk:'External', hrs:6, industries:['proserv'], sizes:ALL_SIZES, desc:'Kickoff, intake, access, schedule, first deliverable.' },
    { id:'proserv.engagement_renewal',  name:'Run engagement renewal', dept:'Sales', trigger:'60d pre-renewal', risk:'External', hrs:4, industries:['proserv'], sizes:MED_ENT, desc:'Performance recap, renewal pitch, contract.' },
    { id:'proserv.resource_alloc',      name:'Allocate consultants to engagements', dept:'Operations', trigger:'Weekly', risk:'Write', hrs:8, industries:['proserv'], sizes:MED_ENT, desc:'Match skills + availability to demand; surface conflicts.' },
    { id:'proserv.utilisation_report',  name:'Produce utilisation report', dept:'Operations', trigger:'Monthly', risk:'Read', hrs:4, industries:['proserv'], sizes:MED_ENT, desc:'Roll up billable vs available hours by consultant.' },

    // ---- Healthcare pack ----
    { id:'health.patient_intake',       name:'Run patient intake', dept:'Operations', trigger:'New patient', risk:'Write', hrs:30, industries:['health'], sizes:ALL_SIZES, desc:'Forms, history, consents, schedule first visit.' },
    { id:'health.insurance_verify',     name:'Verify insurance eligibility', dept:'Operations', trigger:'Pre-visit', risk:'Read', hrs:20, industries:['health'], sizes:ALL_SIZES, desc:'Confirm coverage, copay, prior-auth requirements.' },
    { id:'health.prior_auth',           name:'Submit prior authorisation', dept:'Operations', trigger:'Procedure scheduled', risk:'External', hrs:12, industries:['health'], sizes:ALL_SIZES, desc:'Compile clinical justification, submit, track.' },
    { id:'health.hipaa_audit',          name:'Compile HIPAA audit log', dept:'Legal', trigger:'Monthly / on-demand', risk:'Read', hrs:4, industries:['health'], sizes:MED_ENT, desc:'Aggregate access logs by patient and provider.' },
    { id:'health.claim_submit',         name:'Submit insurance claim', dept:'Finance', trigger:'Visit complete', risk:'External', hrs:16, industries:['health'], sizes:ALL_SIZES, desc:'Code visit, validate, submit via clearinghouse.' },
    { id:'health.claim_denial',         name:'Appeal denied claim', dept:'Finance', trigger:'Denial received', risk:'External', hrs:8, industries:['health'], sizes:MED_ENT, desc:'Analyze reason, gather evidence, submit appeal.' },
    { id:'health.appt_scheduling',      name:'Schedule / reschedule appointment', dept:'Operations', trigger:'Patient request', risk:'Write', hrs:24, industries:['health'], sizes:ALL_SIZES, desc:'Match availability, send confirmations, manage reminders.' },
    { id:'health.recall_outreach',      name:'Run patient recall outreach', dept:'Marketing', trigger:'Care interval elapsed', risk:'External', hrs:6, industries:['health'], sizes:MED_ENT, desc:'Identify due-for-care patients; outreach.' },
    { id:'health.record_request',       name:'Handle medical record request', dept:'Legal', trigger:'Request received', risk:'Read', hrs:4, industries:['health'], sizes:MED_ENT, desc:'Validate authorization, redact, deliver securely.' },
    { id:'health.compliance_training',  name:'Track compliance training', dept:'HR', trigger:'Annual / on hire', risk:'Read', hrs:3, industries:['health'], sizes:MED_ENT, desc:'Assign, remind, track completion, file evidence.' },

    // ---- Manufacturing pack ----
    { id:'mfg.purchase_order',          name:'Issue purchase order', dept:'Operations', trigger:'Demand signal', risk:'Financial', hrs:12, industries:['mfg'], sizes:ALL_SIZES, desc:'Generate, approve, send PO to supplier.' },
    { id:'mfg.inventory_variance',      name:'Reconcile inventory variance', dept:'Operations', trigger:'Monthly', risk:'Write', hrs:8, industries:['mfg'], sizes:MED_ENT, desc:'Compare system vs physical; investigate large gaps.' },
    { id:'mfg.supplier_scorecard',      name:'Compile supplier scorecards', dept:'Operations', trigger:'Quarterly', risk:'Read', hrs:4, industries:['mfg'], sizes:MED_ENT, desc:'Score on-time, quality, price; rank suppliers.' },
    { id:'mfg.shipment_tracking',       name:'Track inbound / outbound shipments', dept:'Operations', trigger:'Daily', risk:'Read', hrs:6, industries:['mfg'], sizes:ALL_SIZES, desc:'Aggregate carrier feeds; surface delays.' },
    { id:'mfg.quality_incident',        name:'Report quality incident', dept:'Operations', trigger:'QC failure', risk:'Write', hrs:4, industries:['mfg'], sizes:MED_ENT, desc:'Document, isolate, root-cause, corrective action.' },
    { id:'mfg.maintenance_schedule',    name:'Schedule preventive maintenance', dept:'Operations', trigger:'Per asset cadence', risk:'Write', hrs:6, industries:['mfg'], sizes:MED_ENT, desc:'Plan, schedule, assign, track downtime impact.' },
    { id:'mfg.production_run_recon',    name:'Reconcile production run', dept:'Operations', trigger:'Run complete', risk:'Write', hrs:8, industries:['mfg'], sizes:MED_ENT, desc:'Compare planned vs actual; allocate variance.' },
    { id:'mfg.customs_duties',          name:'Process customs / duties', dept:'Finance', trigger:'Shipment crosses border', risk:'Financial', hrs:6, industries:['mfg'], sizes:MED_ENT, desc:'Classify, calculate, file, pay.' },
    { id:'mfg.return_to_supplier',      name:'Return goods to supplier', dept:'Operations', trigger:'QC failure / overage', risk:'External', hrs:3, industries:['mfg'], sizes:MED_ENT, desc:'Authorize, ship, follow up on credit.' },

    // ---- Real Estate pack ----
    { id:'re.listing_pipeline',         name:'Move listings through pipeline', dept:'Sales', trigger:'New listing / status change', risk:'Write', hrs:10, industries:['realestate'], sizes:ALL_SIZES, desc:'List, market, show, offer, close.' },
    { id:'re.tenant_screening',         name:'Screen tenant applications', dept:'Operations', trigger:'Application submitted', risk:'Read', hrs:12, industries:['realestate'], sizes:ALL_SIZES, desc:'Background, credit, references; recommend.' },
    { id:'re.lease_renewal',            name:'Run lease renewal', dept:'Operations', trigger:'90d pre-end', risk:'External', hrs:6, industries:['realestate'], sizes:ALL_SIZES, desc:'Notify, propose terms, sign, file.' },
    { id:'re.maintenance_ticket',       name:'Handle maintenance ticket', dept:'Operations', trigger:'Tenant submits', risk:'External', hrs:16, industries:['realestate'], sizes:ALL_SIZES, desc:'Triage, dispatch, follow up, close.' },
    { id:'re.rent_collection',          name:'Collect rent / late notice', dept:'Finance', trigger:'Due date', risk:'External', hrs:10, industries:['realestate'], sizes:ALL_SIZES, desc:'Auto-reminder; escalate to late fee and notice.' },
    { id:'re.property_inspection',      name:'Schedule property inspection', dept:'Operations', trigger:'Annual / move-in / move-out', risk:'Write', hrs:4, industries:['realestate'], sizes:MED_ENT, desc:'Schedule, conduct, document, surface issues.' },
    { id:'re.showing_schedule',         name:'Schedule showings', dept:'Sales', trigger:'Prospect interest', risk:'External', hrs:8, industries:['realestate'], sizes:ALL_SIZES, desc:'Match prospect availability with agent + property.' },
    { id:'re.commission_recon',         name:'Reconcile commission payouts', dept:'Finance', trigger:'Deal closed', risk:'Financial', hrs:6, industries:['realestate'], sizes:MED_ENT, desc:'Compute split, validate, pay, file.' },

    // ---- Hospitality pack ----
    { id:'hosp.reservation_mgmt',       name:'Manage reservations', dept:'Operations', trigger:'Booking / cancellation', risk:'External', hrs:14, industries:['hosp'], sizes:ALL_SIZES, desc:'Confirm, remind, seat, handle cancellations.' },
    { id:'hosp.tip_distribution',       name:'Calculate and distribute tips', dept:'Finance', trigger:'End of shift', risk:'Financial', hrs:8, industries:['hosp'], sizes:ALL_SIZES, desc:'Pool, distribute per policy, payroll-record.' },
    { id:'hosp.food_cost_variance',     name:'Track food-cost variance', dept:'Operations', trigger:'Weekly', risk:'Read', hrs:4, industries:['hosp'], sizes:MED_ENT, desc:'Compare theoretical vs actual; flag drift.' },
    { id:'hosp.staff_scheduling',       name:'Build weekly staff schedule', dept:'HR', trigger:'Weekly', risk:'Write', hrs:10, industries:['hosp'], sizes:ALL_SIZES, desc:'Match demand forecast to availability and skills.' },
    { id:'hosp.no_show',                name:'Handle no-show / cancellation fee', dept:'Finance', trigger:'No-show recorded', risk:'External', hrs:3, industries:['hosp'], sizes:MED_ENT, desc:'Apply policy; charge or waive with rationale.' },
    { id:'hosp.inventory_order',        name:'Order inventory (food & bev)', dept:'Operations', trigger:'Daily / weekly', risk:'Financial', hrs:6, industries:['hosp'], sizes:ALL_SIZES, desc:'Forecast demand; order from preferred suppliers.' },
    { id:'hosp.health_inspection',      name:'Prep for health inspection', dept:'Operations', trigger:'Inspection scheduled', risk:'Write', hrs:4, industries:['hosp'], sizes:MED_ENT, desc:'Self-audit checklist; surface remediation items.' },
    { id:'hosp.loyalty_program',        name:'Run loyalty programme outreach', dept:'Marketing', trigger:'Per cadence', risk:'External', hrs:4, industries:['hosp'], sizes:MED_ENT, desc:'Identify, reward, retain.' },

    // ---- Education pack ----
    { id:'edu.enrollment',              name:'Process enrollment / registration', dept:'Operations', trigger:'Application', risk:'Write', hrs:24, industries:['edu'], sizes:ALL_SIZES, desc:'Validate, accept, register, communicate.' },
    { id:'edu.transcript_request',      name:'Issue transcript request', dept:'Operations', trigger:'Student request', risk:'Read', hrs:4, industries:['edu'], sizes:MED_ENT, desc:'Validate, compile, send via secure channel.' },
    { id:'edu.instructor_payroll',      name:'Run instructor payroll', dept:'Finance', trigger:'Per pay cycle', risk:'Financial', hrs:6, industries:['edu'], sizes:ALL_SIZES, desc:'Hours, rates, deductions; payout.' },
    { id:'edu.course_renewal',          name:'Run course renewal outreach', dept:'Marketing', trigger:'Term end', risk:'External', hrs:4, industries:['edu'], sizes:MED_ENT, desc:'Identify completers; pitch next-term enrollment.' },
    { id:'edu.grade_rollup',            name:'Roll up grades to transcripts', dept:'Operations', trigger:'Term end', risk:'Write', hrs:8, industries:['edu'], sizes:MED_ENT, desc:'Aggregate, validate, post to transcripts.' },
    { id:'edu.parent_comms',            name:'Run parent communications', dept:'Marketing', trigger:'Per cadence / per event', risk:'External', hrs:6, industries:['edu'], sizes:MED_ENT, desc:'Newsletters, alerts, individual updates.' },
    { id:'edu.ferpa_compliance',        name:'Track FERPA compliance', dept:'Legal', trigger:'Per request / audit', risk:'Read', hrs:3, industries:['edu'], sizes:MED_ENT, desc:'Log access, validate disclosures, file evidence.' },
    { id:'edu.cohort_progression',      name:'Track cohort progression', dept:'Operations', trigger:'Per term', risk:'Read', hrs:4, industries:['edu'], sizes:MED_ENT, desc:'Surface students off-track; suggest interventions.' },

    // ---- Financial Services pack ----
    { id:'finsvc.kyc',                  name:'Run KYC / identity verification', dept:'Operations', trigger:'New account', risk:'Read', hrs:20, industries:['fin_svc'], sizes:ALL_SIZES, desc:'Collect docs, verify, score risk, approve.' },
    { id:'finsvc.aml_monitoring',       name:'Monitor transactions for AML signals', dept:'Finance', trigger:'Continuous', risk:'Read', hrs:12, industries:['fin_svc'], sizes:MED_ENT, desc:'Surface suspicious patterns for review.' },
    { id:'finsvc.dispute_resolution',   name:'Resolve transaction dispute', dept:'Operations', trigger:'Dispute filed', risk:'Financial', hrs:10, industries:['fin_svc'], sizes:ALL_SIZES, desc:'Gather evidence, decide, refund or deny.' },
    { id:'finsvc.regulatory_reporting', name:'File regulatory report (CTR/SAR)', dept:'Legal', trigger:'Threshold / suspicion', risk:'External', hrs:6, industries:['fin_svc'], sizes:MED_ENT, desc:'Compile, validate, submit within statutory window.' },
    { id:'finsvc.account_opening',      name:'Open customer account', dept:'Operations', trigger:'Approved KYC', risk:'Write', hrs:12, industries:['fin_svc'], sizes:ALL_SIZES, desc:'Provision account, send welcome, fund.' },
    { id:'finsvc.fraud_alert',          name:'Triage fraud alert', dept:'Operations', trigger:'Alert fires', risk:'Financial', hrs:8, industries:['fin_svc'], sizes:MED_ENT, desc:'Investigate, freeze, contact customer, resolve.' },
    { id:'finsvc.risk_score',           name:'Recompute customer risk scores', dept:'Operations', trigger:'Daily / on event', risk:'Write', hrs:4, industries:['fin_svc'], sizes:MED_ENT, desc:'Refresh risk inputs; surface high-risk.' },
    { id:'finsvc.suitability_review',   name:'Periodic suitability review', dept:'Legal', trigger:'Annual / on event', risk:'Read', hrs:4, industries:['fin_svc'], sizes:['enterprise'], desc:'Confirm product fit per customer profile.' },
    { id:'finsvc.audit_compile',        name:'Compile audit evidence package', dept:'Operations', trigger:'Scheduled / on-demand', risk:'Read', hrs:6, industries:['fin_svc'], sizes:MED_ENT, desc:'Pull artifacts per audit scope.' },
    { id:'finsvc.wire_approval',        name:'Approve high-value wire', dept:'Finance', trigger:'Above threshold', risk:'Financial', hrs:4, industries:['fin_svc'], sizes:MED_ENT, desc:'Dual-control approval, audit, send.' },

    // ---- Trades / Construction pack ----
    { id:'trades.job_estimate',         name:'Produce job estimate', dept:'Sales', trigger:'Lead request', risk:'External', hrs:12, industries:['trades'], sizes:ALL_SIZES, desc:'Site survey, takeoff, price, deliver.' },
    { id:'trades.change_order',         name:'Issue change order', dept:'Sales', trigger:'Scope shift on site', risk:'External', hrs:8, industries:['trades'], sizes:ALL_SIZES, desc:'Document, price, sign-off, update budget.' },
    { id:'trades.sub_payment',          name:'Pay subcontractor', dept:'Finance', trigger:'Milestone complete', risk:'Financial', hrs:6, industries:['trades'], sizes:ALL_SIZES, desc:'Validate milestone, calculate, pay.' },
    { id:'trades.lien_release',         name:'Issue lien release', dept:'Legal', trigger:'Payment + completion', risk:'External', hrs:3, industries:['trades'], sizes:MED_ENT, desc:'Generate, sign, file with county.' },
    { id:'trades.permit_tracking',      name:'Track permits per job', dept:'Operations', trigger:'Per job', risk:'Read', hrs:4, industries:['trades'], sizes:MED_ENT, desc:'Apply, track inspections, close.' },
    { id:'trades.material_delivery',    name:'Schedule material deliveries', dept:'Operations', trigger:'Per job timeline', risk:'External', hrs:6, industries:['trades'], sizes:ALL_SIZES, desc:'Coordinate with suppliers; align to phase.' },
    { id:'trades.daily_progress',       name:'File daily progress report', dept:'Operations', trigger:'Daily on site', risk:'Write', hrs:8, industries:['trades'], sizes:MED_ENT, desc:'Capture progress, photos, manpower, weather.' },
    { id:'trades.punch_list',           name:'Manage punch list to closeout', dept:'Operations', trigger:'Substantial completion', risk:'Write', hrs:6, industries:['trades'], sizes:ALL_SIZES, desc:'Track items to resolution; close out.' },
  ];

  // ---------- State ----------
  const BuilderState = {
    industry: 'saas',
    size: 'startup',
    jurisdiction: 'us',
    selected: new Set(),
    customizations: {},
    autonomy: {},
    guardrails: { wire: 1000, comms: 50, rate: 50, spend: 500 },
    deckFilter: 'all',
    deckIndex: 0,
  };

  // ---------- Helpers ----------
  function industryMatches(p) {
    return p.industries.includes(BuilderState.industry)
      || p.industries === ALL
      || p.industries.length === ALL.length;
  }

  function visibleByIndustry() {
    return PLAYBOOKS.filter(industryMatches);
  }

  function visiblePlaybooks() {
    return visibleByIndustry().filter(p =>
      BuilderState.deckFilter === 'all' || p.dept === BuilderState.deckFilter
    );
  }

  function defaultsFor(industry, size) {
    const prevIndustry = BuilderState.industry;
    const prevSize = BuilderState.size;
    BuilderState.industry = industry;
    BuilderState.size = size;
    const ids = visibleByIndustry()
      .filter(p => p.sizes.includes(size))
      .map(p => p.id);
    BuilderState.industry = prevIndustry;
    BuilderState.size = prevSize;
    return ids;
  }

  function computeAgents() {
    const set = new Set();
    BuilderState.selected.forEach(id => {
      const pb = PLAYBOOKS.find(p => p.id === id);
      if (pb) set.add(pb.dept);
    });
    // Stable display order
    return DEPTS.map(d => d.id).filter(id => set.has(id));
  }

  function totalHours() {
    let h = 0;
    BuilderState.selected.forEach(id => {
      const pb = PLAYBOOKS.find(p => p.id === id);
      if (pb) h += pb.hrs;
    });
    return h;
  }

  function approvalCount() {
    let c = 0;
    BuilderState.selected.forEach(id => {
      const pb = PLAYBOOKS.find(p => p.id === id);
      if (pb && (pb.risk === 'Financial' || pb.risk === 'Delete')) c += 1;
    });
    return c;
  }

  function ensureAutonomyForSelected() {
    computeAgents().forEach(a => {
      if (!BuilderState.autonomy[a]) BuilderState.autonomy[a] = recommendedMode(a);
    });
  }

  // ---------- Pickers (dropdowns) ----------
  function renderPickers() {
    const ind = document.getElementById('picker-industry');
    if (ind) {
      if (!ind.dataset.wired) {
        ind.innerHTML = INDUSTRIES.map(i =>
          `<option value="${i.id}">${escape(i.name)}</option>`
        ).join('');
        ind.addEventListener('change', () => {
          BuilderState.industry = ind.value;
          BuilderState.deckFilter = 'all';
          BuilderState.deckIndex = 0;
          applyDefaults();
          renderAll();
        });
        ind.dataset.wired = '1';
      }
      ind.value = BuilderState.industry;
    }

    const sz = document.getElementById('picker-size');
    if (sz) {
      if (!sz.dataset.wired) {
        sz.innerHTML = SIZES.map(s =>
          `<option value="${s.id}">${escape(s.name)} · ${escape(s.range)}</option>`
        ).join('');
        sz.addEventListener('change', () => {
          BuilderState.size = sz.value;
          BuilderState.deckIndex = 0;
          applyDefaults();
          renderAll();
        });
        sz.dataset.wired = '1';
      }
      sz.value = BuilderState.size;
    }

    const ju = document.getElementById('picker-jurisdiction');
    if (ju && !ju.dataset.wired) {
      ju.addEventListener('change', () => {
        BuilderState.jurisdiction = ju.value;
      });
      ju.dataset.wired = '1';
      ju.value = BuilderState.jurisdiction;
    }
  }

  // ---------- Deck filters (department pills) ----------
  function renderDeckFilters() {
    const wrap = document.getElementById('deck-filters');
    if (!wrap) return;
    const all = visibleByIndustry();
    const totalSelected = all.filter(p => BuilderState.selected.has(p.id)).length;

    const items = [{ id: 'all', name: 'All', icon: '⊙', count: all.length, sel: totalSelected }];
    DEPTS.forEach(d => {
      const list = all.filter(p => p.dept === d.id);
      if (list.length === 0) return;
      items.push({
        id: d.id, name: d.name, icon: d.icon,
        count: list.length,
        sel: list.filter(p => BuilderState.selected.has(p.id)).length,
      });
    });

    wrap.innerHTML = items.map(it => `
      <button type="button" class="deck-filter ${BuilderState.deckFilter === it.id ? 'deck-filter-on' : ''}" data-deck-filter="${it.id}">
        <span class="deck-filter-icon">${it.icon}</span>
        <span>${escape(it.name)}</span>
        <span class="deck-filter-count">${it.sel}/${it.count}</span>
      </button>
    `).join('');

    wrap.querySelectorAll('[data-deck-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        BuilderState.deckFilter = btn.dataset.deckFilter;
        BuilderState.deckIndex = 0;
        renderDeckFilters();
        renderDeck();
      });
    });
  }

  // ---------- Deck (card stack) ----------
  function renderDeck() {
    const wrap = document.getElementById('deck');
    if (!wrap) return;
    const list = visiblePlaybooks();
    const prevBtn = document.getElementById('deck-prev');
    const nextBtn = document.getElementById('deck-next');
    const prog = document.getElementById('deck-progress');

    if (list.length === 0) {
      wrap.innerHTML = '<div class="deck-empty"><strong>Nothing in this slice.</strong>Pick another department, or switch industry above.</div>';
      if (prog) prog.innerHTML = '';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    if (BuilderState.deckIndex >= list.length) BuilderState.deckIndex = list.length - 1;
    if (BuilderState.deckIndex < 0) BuilderState.deckIndex = 0;
    const i = BuilderState.deckIndex;
    const visible = [list[i], list[i + 1], list[i + 2]].filter(Boolean);

    // Render back-to-front so the active card is last in DOM (top of stack)
    wrap.innerHTML = visible.slice().reverse().map((p, revIdx) => {
      const idx = visible.length - 1 - revIdx;
      return deckCardHTML(p, idx);
    }).join('');

    const activeEl = wrap.querySelector('.deck-card-active');
    if (activeEl) wireDragOnCard(activeEl, list[i]);

    wrap.querySelectorAll('[data-deck-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.deckAction;
        const id = btn.dataset.id;
        if (action === 'include') {
          BuilderState.selected.add(id);
          ensureAutonomyForSelected();
          advanceDeck(1, 'right');
        } else if (action === 'skip') {
          BuilderState.selected.delete(id);
          advanceDeck(1, 'left');
        }
      });
    });

    wrap.querySelectorAll('[data-deck-customize]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openCustomizer(btn.dataset.id);
      });
    });

    if (prog) prog.innerHTML = `<strong>${i + 1}</strong> / ${list.length}`;
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i >= list.length - 1;
  }

  function deckCardHTML(p, stackIdx) {
    const cls = stackIdx === 0 ? 'deck-card-active'
              : stackIdx === 1 ? 'deck-card-next'
              : 'deck-card-next-2';
    const included = BuilderState.selected.has(p.id);
    const dept = DEPTS.find(d => d.id === p.dept);
    const sizeMatch = p.sizes.includes(BuilderState.size);
    const isActive = stackIdx === 0;

    return `
      <article class="deck-card ${cls}" data-id="${p.id}">
        ${isActive ? `<button type="button" class="deck-card-customize" data-deck-customize data-id="${p.id}">Customize</button>` : ''}
        <div class="deck-card-stamp deck-card-stamp-include">Include</div>
        <div class="deck-card-stamp deck-card-stamp-skip">Skip</div>
        <header class="deck-card-head">
          <span class="deck-card-dept">
            <span class="deck-card-dept-icon">${dept ? dept.icon : '◇'}</span>
            ${escape(p.dept)}
          </span>
          <span class="deck-card-risk deck-card-risk-${p.risk.toLowerCase()}">${escape(p.risk)}</span>
        </header>
        <h3 class="deck-card-name">${escape(p.name)}</h3>
        <p class="deck-card-desc">${escape(p.desc)}</p>
        <div class="deck-card-meta">
          <span class="deck-card-meta-item">
            <span class="deck-card-meta-icon">⏵</span>
            <span>Trigger · <span class="deck-card-meta-strong">${escape(p.trigger)}</span></span>
          </span>
          <span class="deck-card-meta-item">
            <span class="deck-card-meta-icon">◷</span>
            <span><span class="deck-card-meta-strong">~${p.hrs} hrs</span> / mo saved</span>
          </span>
          ${sizeMatch ? `
            <span class="deck-card-meta-item">
              <span class="deck-card-meta-icon">★</span>
              <span>Common for ${escape(capitalize(BuilderState.size))}</span>
            </span>
          ` : ''}
        </div>
        ${isActive ? `
          <div class="deck-card-actions">
            <button type="button" class="deck-action deck-action-skip" data-deck-action="skip" data-id="${p.id}">${included ? '✕ Drop' : 'Skip'}</button>
            <button type="button" class="deck-action ${included ? 'deck-action-included' : 'deck-action-include'}" data-deck-action="include" data-id="${p.id}">${included ? '✓ Included' : 'Include →'}</button>
          </div>
        ` : ''}
      </article>
    `;
  }

  function advanceDeck(delta, dir) {
    const list = visiblePlaybooks();
    const next = Math.min(list.length - 1, Math.max(0, BuilderState.deckIndex + delta));
    const active = document.querySelector('.deck-card-active');
    const animate = active && dir && next !== BuilderState.deckIndex;

    if (animate) {
      active.classList.add(dir === 'right' ? 'deck-card-gone-right' : 'deck-card-gone-left');
    }

    const commit = () => {
      BuilderState.deckIndex = next;
      renderDeck();
      renderSummary();
      renderDeckFilters();
    };

    if (animate) {
      setTimeout(commit, 240);
    } else {
      commit();
    }
  }

  // ---------- Drag / swipe handling ----------
  function wireDragOnCard(card, playbook) {
    let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false, intent = null;
    const THRESH = 110;

    const setTransform = () => {
      const rot = dx / 24;
      card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
      if (dx > 40) {
        if (intent !== 'include') { intent = 'include'; card.dataset.intent = 'include'; }
      } else if (dx < -40) {
        if (intent !== 'skip') { intent = 'skip'; card.dataset.intent = 'skip'; }
      } else if (intent !== null) {
        intent = null;
        delete card.dataset.intent;
      }
    };

    const onDown = (e) => {
      if (e.target.closest('button')) return;
      dragging = true;
      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX; startY = pt.clientY; dx = 0; dy = 0;
      card.classList.add('is-dragging');
      if (e.pointerId !== undefined && card.setPointerCapture) {
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
      }
    };

    const onMove = (e) => {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      dx = pt.clientX - startX;
      dy = pt.clientY - startY;
      // If user is mostly scrolling vertically, bail
      if (Math.abs(dy) > Math.abs(dx) * 1.3 && Math.abs(dy) > 18) {
        cancel();
        return;
      }
      setTransform();
      if (e.cancelable) e.preventDefault();
    };

    const cancel = () => {
      dragging = false;
      card.classList.remove('is-dragging');
      card.style.transform = '';
      delete card.dataset.intent;
      dx = 0; dy = 0; intent = null;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      if (dx > THRESH) {
        BuilderState.selected.add(playbook.id);
        ensureAutonomyForSelected();
        advanceDeck(1, 'right');
      } else if (dx < -THRESH) {
        BuilderState.selected.delete(playbook.id);
        advanceDeck(1, 'left');
      } else {
        card.style.transform = '';
        delete card.dataset.intent;
      }
      dx = 0; dy = 0; intent = null;
    };

    card.addEventListener('pointerdown', onDown);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', cancel);
  }

  // ---------- Deck controls (arrows + keyboard + skip-to-end) ----------
  function wireDeckControls() {
    document.getElementById('deck-prev')?.addEventListener('click', () => advanceDeck(-1, null));
    document.getElementById('deck-next')?.addEventListener('click', () => advanceDeck(1, null));
    document.getElementById('deck-skip-end')?.addEventListener('click', () => {
      const card = document.getElementById('summary-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.target && e.target.isContentEditable) return;
      // Only intercept when the deck is roughly in view
      const deck = document.getElementById('deck');
      if (!deck) return;
      const r = deck.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowRight') { advanceDeck(1, null); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { advanceDeck(-1, null); e.preventDefault(); }
    });
  }

  // ---------- Summary card ----------
  function renderSummary() {
    setNum('sum-playbooks', BuilderState.selected.size);
    const agents = computeAgents();
    setNum('sum-agents', agents.length);
    setNum('sum-hours', totalHours());
    setNum('sum-approvals', approvalCount());

    const list = document.getElementById('sum-agents-list');
    if (list) {
      if (agents.length === 0) {
        list.innerHTML = '<span class="summary-card-agents-empty">No agents yet — swipe right on the deck to include playbooks.</span>';
      } else {
        list.innerHTML = agents.map(a => {
          const dept = DEPTS.find(d => d.id === a);
          return `<span class="agent-pill"><span class="agent-pill-icon">${dept ? dept.icon : '◇'}</span>${escape(a)} Agent</span>`;
        }).join('');
      }
    }
  }

  // ---------- Autonomy step ----------
  function renderAutonomy() {
    const wrap = document.getElementById('autonomy-grid');
    if (!wrap) return;
    const agents = computeAgents();
    if (agents.length === 0) {
      wrap.innerHTML = '<div class="autonomy-empty">Pick playbooks above to activate agents — then choose how much oversight each one gets.</div>';
      return;
    }
    wrap.innerHTML = agents.map(a => {
      const mode = BuilderState.autonomy[a] || recommendedMode(a);
      const dept = DEPTS.find(d => d.id === a);
      return `
        <div class="autonomy-row">
          <div class="autonomy-row-left">
            <span class="agent-icon" aria-hidden="true">${dept ? dept.icon : '◇'}</span>
            <div>
              <div class="autonomy-agent">${escape(a)} Agent</div>
              <div class="autonomy-help">Recommended: <strong>${recommendedMode(a)}</strong>. ${recommendedReason(a)}</div>
            </div>
          </div>
          <div class="autonomy-row-right">
            ${['Drafting','Approval','Silent'].map(m =>
              `<button type="button" class="mode-btn ${mode === m ? 'mode-btn-on' : ''}" data-agent="${a}" data-mode="${m}">${m}</button>`
            ).join('')}
          </div>
        </div>
      `;
    }).join('');

    wrap.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        BuilderState.autonomy[btn.dataset.agent] = btn.dataset.mode;
        renderAutonomy();
      });
    });
  }

  function recommendedMode(dept) {
    if (dept === 'Finance' || dept === 'Legal') return 'Approval';
    if (dept === 'Dev') return 'Approval';
    if (dept === 'Marketing' || dept === 'Sales' || dept === 'Operations' || dept === 'HR') return 'Approval';
    return 'Approval';
  }

  function recommendedReason(dept) {
    if (dept === 'Finance') return 'Financial actions get human sign-off until the Trust Score earns Silent eligibility.';
    if (dept === 'Legal') return 'Regulated-record work always benefits from human review.';
    if (dept === 'Dev') return 'Production deploys with breaking changes always require approval anyway.';
    return 'Conservative default. Drop to Silent once you have a few weeks of evidence.';
  }

  // ---------- Customizer (lightweight v1) ----------
  function openCustomizer(playbookId) {
    const pb = PLAYBOOKS.find(p => p.id === playbookId);
    if (!pb) return;
    const existing = BuilderState.customizations[playbookId] || {};
    const note = prompt(
      `Customize "${pb.name}"\n\nDefault trigger: ${pb.trigger}\nDefault risk: ${pb.risk}\n\nDescribe what you want changed (one line). This becomes the override note the Atlantis Manager will use. Leave blank to skip.`,
      existing.note || ''
    );
    if (note === null) return;
    if (note.trim() === '') {
      delete BuilderState.customizations[playbookId];
    } else {
      BuilderState.customizations[playbookId] = { note: note.trim(), at: new Date().toISOString() };
    }
  }

  // ---------- Defaults ----------
  function applyDefaults() {
    const defaults = defaultsFor(BuilderState.industry, BuilderState.size);
    BuilderState.selected = new Set(defaults);
    ensureAutonomyForSelected();
  }

  // ---------- Guardrails ----------
  function wireGuardrails() {
    const map = { 'gr-wire':'wire', 'gr-comms':'comms', 'gr-rate':'rate', 'gr-spend':'spend' };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = BuilderState.guardrails[key];
      el.addEventListener('change', () => {
        const v = parseInt(el.value, 10);
        if (!isNaN(v) && v >= 0) BuilderState.guardrails[key] = v;
      });
    });
  }

  // ---------- Activate handoff ----------
  function wireActivate() {
    const btn = document.getElementById('activate-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const snapshot = buildSnapshot();
      if (window.AtlantisManager && typeof window.AtlantisManager.openWithSnapshot === 'function') {
        window.AtlantisManager.openWithSnapshot(snapshot);
      } else {
        alert('Atlantis Manager not loaded yet. Reload and try again.');
      }
    });
  }

  function buildSnapshot() {
    const picks = Array.from(BuilderState.selected).map(id => {
      const pb = PLAYBOOKS.find(p => p.id === id);
      const c = BuilderState.customizations[id];
      return {
        id, name: pb?.name, dept: pb?.dept, risk: pb?.risk, hrs: pb?.hrs,
        customization: c ? c.note : null,
      };
    });
    return {
      industry: BuilderState.industry,
      industryName: (INDUSTRIES.find(i => i.id === BuilderState.industry) || {}).name,
      size: BuilderState.size,
      sizeName: (SIZES.find(s => s.id === BuilderState.size) || {}).name,
      jurisdiction: BuilderState.jurisdiction,
      agents: computeAgents().map(a => ({ dept: a, mode: BuilderState.autonomy[a] || recommendedMode(a) })),
      guardrails: { ...BuilderState.guardrails },
      hoursPerMonth: totalHours(),
      playbookCount: picks.length,
      approvalCount: approvalCount(),
      picks,
    };
  }

  function wireAskManager() {
    document.getElementById('ask-manager-summary')?.addEventListener('click', () => {
      const snap = buildSnapshot();
      if (window.AtlantisManager) {
        window.AtlantisManager.open();
        window.AtlantisManager.send(`Looking at my picks: ${snap.playbookCount} playbooks across ${snap.agents.length} agents for a ${snap.sizeName} ${snap.industryName} company. Any obvious gaps or risks?`);
      }
    });

    document.getElementById('open-manager-hero')?.addEventListener('click', () => {
      if (window.AtlantisManager) {
        window.AtlantisManager.open();
        window.AtlantisManager.send('Help me build my company on Atlantis. I want to walk through it conversationally.');
      }
    });

    document.getElementById('open-manager-nav')?.addEventListener('click', () => {
      if (window.AtlantisManager) window.AtlantisManager.open();
    });
  }

  // ---------- Render all ----------
  function renderAll() {
    renderPickers();
    renderDeckFilters();
    renderDeck();
    renderSummary();
    renderAutonomy();
  }

  // ---------- Utilities ----------
  function setNum(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v.toLocaleString();
  }
  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ---------- Expose ----------
  window.AtlantisBuilder = {
    state: BuilderState,
    playbooks: PLAYBOOKS,
    industries: INDUSTRIES,
    sizes: SIZES,
    depts: DEPTS,
    snapshot: buildSnapshot,
    setIndustry(id) {
      BuilderState.industry = id;
      BuilderState.deckFilter = 'all';
      BuilderState.deckIndex = 0;
      applyDefaults();
      renderAll();
    },
    setSize(id) {
      BuilderState.size = id;
      BuilderState.deckIndex = 0;
      applyDefaults();
      renderAll();
    },
    select(id) {
      BuilderState.selected.add(id);
      ensureAutonomyForSelected();
      renderDeck();
      renderDeckFilters();
      renderSummary();
      renderAutonomy();
    },
    deselect(id) {
      BuilderState.selected.delete(id);
      renderDeck();
      renderDeckFilters();
      renderSummary();
      renderAutonomy();
    },
  };

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    applyDefaults();
    renderAll();
    wireDeckControls();
    wireGuardrails();
    wireActivate();
    wireAskManager();
  });
})();
