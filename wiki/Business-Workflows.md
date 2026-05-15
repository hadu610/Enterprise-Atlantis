# Business Workflows

> **Type:** Reference · **Owner:** Product + Founders · **Status:** Approved · **Applies to:** All agents · All humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the **canonical enumeration of every business workflow** Atlantis supports, organised by the two journeys every enterprise platform serves: the **customer journey** (from first lead through renewal) and the **employee journey** (from interview through offboarding).

Each workflow names: its trigger, the primary agent and human role involved, the step-by-step sequence, and how the steps change across the four [Phased Autonomy](Phased-Autonomy-Reference) modes. This is the same data rendered interactively on the public Workflows page (`/workflows.html`).

The principle: **a workflow that is not on this page is not a supported workflow.** Adding a new workflow means adding it here first, then to agent playbooks, then to code.

---

## How to use this page

- **Customers and prospects** — read the [Customer Journey](#part-1--customer-journey) to understand what working with Atlantis looks like end-to-end.
- **Customer employees** (HR, finance, ops, etc. at a customer company) — read the [Employee Journey](#part-2--employee-journey) to see how the platform supports your daily work.
- **Engineers and product** — this is the master list against which agent playbooks, validation gates, and skill assignments are sized.
- **Domain Expert Councils** — workflows your council owns should appear here with the right detail; if they don't, file a `wiki-update` ticket.

Actor legend used below:

| Symbol | Meaning |
|---|---|
| 🤖 | An AI agent acts (Sales / HR / Finance / Marketing / Legal / Ops / Dev) |
| 👤 | A human acts (customer admin, employee, manager, AE, CSM, approver) |
| 🤖+👤 | Agent proposes, human approves — typical for `Write` high / `Delete` / `Financial` actions |
| 🛡 | A platform-level safety gate runs (Validation Gate / Approval Queue / Action Executor) |

---

# Part 1 — Customer Journey

The complete arc from first lead through long-term customer.

## Stage 1 · Lead Capture & Qualification

### 1.1 Inbound lead capture

- **Trigger.** Form submission, demo request, event scan, partner referral.
- **Primary actors.** 🤖 Sales Agent · 👤 SDR (Phase 1–2) / autonomous (Phase 3+)
- **Steps.**
  1. 🤖 Sales Agent receives the lead payload via webhook.
  2. 🛡 PII redaction layer applied; lead validated against schema.
  3. 🤖 Creates a `Lead` record in CRM with source attribution.
  4. 🤖 Acknowledges receipt to the lead (templated email) — Phase 3+ autonomous.
  5. 👤 SDR notified (Phase 1–2); autonomous next-step routing (Phase 3+).

### 1.2 Lead enrichment

- 🤖 Sales Agent calls enrichment API (Clearbit, ZoomInfo) for firmographic data.
- 🤖 Updates `Lead` and associated `Organisation` records.
- 🛡 Action Executor serialises updates via entity queue.

### 1.3 Lead scoring against ICP

- 🤖 Computes ICP fit score using customer's tenant-configured ICP definition.
- 🤖 Categorises as `mql`, `sql`, `disqualified`, or `nurture`.
- 🤖 Logs reasoning + confidence for audit.

### 1.4 Lead routing

- 🤖 Identifies AE owner by territory rules in CRM.
- 🤖 Notifies AE via Slack/email with full enrichment + scoring rationale.
- 👤 AE acknowledges within SLA (24h business hours).

### 1.5 Nurture sequence (for non-qualified leads)

- 🤖 Marketing Agent enrols the lead in a tenant-configured nurture sequence.
- 🤖 Sends templated emails on schedule (Phase 3+ autonomous; Phase 1–2 each requires human approval).
- 🤖 Tracks engagement signals; re-scores on signal change.

---

## Stage 2 · Discovery & Demo

### 2.1 Discovery call scheduling

- 👤 Lead expresses interest in a call.
- 🤖 Sales Agent reads AE's calendar availability.
- 🤖 Proposes 3 time slots to the lead via templated email.
- 🤖 Books the meeting on confirmation; updates CRM.

### 2.2 Discovery prep materials

- 🤖 Generates a pre-call brief: company background, role, recent news, relevant case studies.
- 🤖 Delivers brief to AE 24 hours before the call.
- 👤 AE reviews and personalises.

### 2.3 Discovery call (human-led)

- 👤 AE conducts the call (Atlantis is not a meeting-bot company).
- 🤖 Ops Agent transcribes (consent-gated per [Operations Agent Playbook § 4](Operations-Agent-Playbook)).

### 2.4 Discovery summary & action items

- 🤖 Ops Agent extracts summary and action items from the transcript.
- 🤖 Updates CRM with discovery notes, pain points, decision-maker map.
- 🤖 Routes action items to the relevant agent (e.g., compliance question → Legal Agent for follow-up).

### 2.5 Demo customisation

- 🤖 Sales Agent + Marketing Agent compose a demo flow targeting the prospect's stated pain points.
- 🤖 Generates a demo script and slide deck via `anthropic-skills:pptx`.
- 👤 SE reviews and adapts.

### 2.6 Demo delivery (human-led)

- 👤 SE + AE deliver the demo.
- 🤖 Ops Agent transcribes (with consent); flags moments of objection or strong interest.

### 2.7 Demo follow-up

- 🤖 Sales Agent drafts a personalised follow-up summarising what was shown, what was discussed, and next steps.
- 👤 AE reviews and sends.
- 🤖 Schedules follow-up touchpoints.

---

## Stage 3 · Proposal & Negotiation

### 3.1 Custom proposal generation

- 👤 AE indicates "ready for proposal."
- 🤖 Sales Agent assembles a proposal from the tenant's pricing/packaging Wiki page + the prospect's stated requirements.
- 🤖 Recommends a tier and any add-ons; flags any required discount approval.
- 🛡 Brand gate applied to the proposal document via `anthropic-skills:docx`.

### 3.2 Discount approval (when applicable)

- 🤖 Identifies the appropriate approver from the [Pricing and Packaging § 8](Pricing-and-Packaging) discount matrix.
- 🛡 Routes to approval queue.
- 👤 Approver (AE / Sales Lead / VP Sales / CEO depending on size).
- 🤖 Updates the proposal with approved terms once green-lit.

### 3.3 Contract drafting

- 🤖 Legal Agent generates a contract from the tenant's MSA template.
- 🤖 Adds DPA, BAA (if applicable), and any tier-specific clauses.
- 👤 General Counsel reviews substantive changes.

### 3.4 Contract redlines

- 🤖 Legal Agent compares counterparty redlines against playbook clauses.
- 🤖 Categorises each redline (standard / acceptable / risky / unacceptable).
- 🤖+👤 Suggests responses; human attorney signs the response.

### 3.5 Internal pre-sign approvals

- 🛡 Approval Workflow routes to Sales Lead (commercial), Legal (legal), Finance (revenue recognition implications).
- 👤 Each approver signs off in the approval queue.

### 3.6 Signature collection

- 🤖 Sales Agent sends the contract via DocuSign (Phase 3+ templated; queued in earlier phases).
- 🤖 Tracks signature status; notifies AE on completion.
- 👤 Final signature by an authorised signatory on our side.

### 3.7 Deal closure

- 🤖 Updates CRM opportunity to `Closed Won`.
- 🤖 Triggers the onboarding handoff workflow (see Stage 4).
- 🤖 Updates revenue forecasts; emits event to Finance Agent for billing setup.

---

## Stage 4 · Onboarding

### 4.1 Welcome kickoff

- 🤖 Customer Success workflow auto-initiated on `Closed Won`.
- 👤 CSM assigned per tier ([Pricing § 3](Pricing-and-Packaging)).
- 🤖 Sends welcome email with kickoff scheduling link.
- 👤 CSM holds kickoff call with customer admin.

### 4.2 Onboarding interview

The structured intake from [Product Concept § 3.3](Product-Concept).

- 🤖 Onboarding Agent guides the customer admin through the conversational interview.
- Topics: company profile, operating jurisdictions, current tools, team structure, risk tolerance, priority pain points.
- 🤖 Captures the answers as tenant-scoped Wiki pages (customer's profile, ICP, brand voice, etc.).

### 4.3 Data Readiness Assessment

- 🤖 Scores each department's source data for completeness, freshness, consistency.
- 🤖 Produces a Department Activation Checklist with red/yellow/green status per source.
- 👤 Customer admin sees the checklist; must remediate red items before activation.

### 4.4 Universal Data Bridge configuration

- 🤖 Connects to source systems per checklist (Salesforce, HubSpot, QuickBooks, HRIS, etc.).
- 🤖 Ingests historical data into the normalised entity model.
- 🛡 Audit log entries created for every ingest batch.

### 4.5 Customer admin training

- 👤 CSM walks customer admin through the console, Trust Score Dashboard, Approval Queue, and Phased Autonomy controls.
- 🤖 Generates personalised training materials based on customer's chosen first agents.

### 4.6 Domain Playbook installation

- 🤖 Suggests relevant Domain Playbooks from the Marketplace (e.g., "UK Employment Law Pack" for UK-operating customers).
- 👤 Customer admin reviews and installs.
- 🛡 Each playbook passes the [Agent Skills Strategy § 7](Agent-Skills-Strategy#7-skill-governance--how-skills-are-admitted) governance gate before activation.

### 4.7 Phase 1 (Drafting) activation

- 🤖 Selected agents activate in Drafting Mode.
- 🛡 Trust Score Dashboard starts accumulating evidence from Day 1.
- 👤 Customer admin reviews every drafted action; nothing autonomous yet.

### 4.8 Change Management deployment

- 🤖 Change Management Module generates employee-facing communications announcing agent deployment.
- 🤖 Role-evolution guides personalised per affected team.
- 👤 Customer HR team reviews and distributes.

---

## Stage 5 · Active Use & Phase Progression

### 5.1 Daily agent operations

The day-in, day-out of active agents — covered in detail under the [Employee Journey](#part-2--employee-journey) for HR/Finance/etc. workflows and the agent-specific playbooks.

### 5.2 Approval queue management

- 🤖 Agents propose actions requiring approval (per [Action Risk Classification](Action-Risk-Classification)).
- 🤖 Each entry includes plain-English `Explain-Before-Execute` rationale.
- 👤 Customer admin or designated approver reviews in the console.
- 🛡 Action Executor commits or rolls back based on decision.

### 5.3 Trust Score monitoring

- 🤖 Trust Score recomputed daily per agent.
- 🤖 Dashboard surfaces accuracy, override rate, gate failures, time-to-resolution.
- 👤 Customer admin uses this to evaluate phase progression.

### 5.4 Phase progression — Drafting → Startup

- 🛡 Platform checks exit criteria ([Phased Autonomy Reference](Phased-Autonomy-Reference)): ≥ 30 days, Trust Score ≥ 0.80, override rate < 25%, zero hard-rule violations.
- 👤 Customer admin approves promotion.
- 🤖 Agent reconfigures to Phase 2 behaviour.

### 5.5 Quarterly Business Review

- 🤖 CS Agent assembles QBR materials: usage, Trust Score trends, cost analysis, ROI signals.
- 👤 CSM presents to customer's executive sponsor.
- 🛡 QBR action items captured and assigned.

### 5.6 Phase progression — Startup → Approval

- 🛡 Exit criteria: ≥ 60 days, Trust Score ≥ 0.90, override rate < 15%, zero critical gate failures.
- 👤 Customer CIO or equivalent approves.

### 5.7 Phase progression — Approval → Enterprise

- 🛡 Exit criteria: ≥ 90 days, Trust Score ≥ 0.95 sustained 30 days, override rate < 5%.
- 👤 Customer board or executive sponsor approves.

### 5.8 Expansion conversations

- 🤖 CS Agent identifies expansion opportunity (high Trust Score on existing agents → additional agent ready).
- 👤 CSM holds expansion conversation with customer admin.
- 🤖 Generates expansion proposal; routes back through Sales workflow.

### 5.9 Phase rollback (when triggered)

- 🛡 Automatic if Trust Score drops below floor for 48h, or critical incident.
- 🤖 Agent reconfigures to lower phase.
- 👤 Customer admin + CSM notified; remediation plan agreed.

---

## Stage 6 · Support & Incidents

### 6.1 Customer-initiated ticket

- 👤 Customer admin creates a ticket via console or email.
- 🤖 Ops Agent triages by kind, priority, and risk tier.
- 🤖 Routes to the appropriate internal owner.

### 6.2 Self-serve resolution

- 🤖 If the issue matches a known pattern with documented resolution, the agent proposes the fix.
- 👤 Customer admin reviews and accepts; or escalates.

### 6.3 Escalation to engineering

- 🤖 If unresolved at L1, the ticket escalates to L2 with full context.
- 👤 Engineering on-call investigates.
- 🤖 Status updates pushed to the customer admin automatically.

### 6.4 Incident notification (Sev1/Sev2)

Per [Incident Response Playbook § 4](Incident-Response-Playbook#4-communication-templates).

- 🛡 Severity declared by IC.
- 🤖 Comms Lead drafts customer communication.
- 👤 IC + Legal (data-involving incidents) approve before send.
- 🤖 Sends to affected tenants within SLA.

### 6.5 Postmortem sharing (Sev1)

- 🤖 Postmortem auto-drafted from incident timeline.
- 👤 CTO + Comms Lead review and approve.
- 🤖 Sends to affected customers within 30 days.

---

## Stage 7 · Renewal & Expansion (or Churn)

### 7.1 Renewal forecasting

- 🤖 At 90 days before renewal, CS Agent generates renewal health report.
- Inputs: Trust Score trends, expansion signals, ticket volume, NPS.
- 👤 CSM reviews; intervenes if amber/red.

### 7.2 Renewal proposal

- 🤖 Sales Agent + CS Agent assemble renewal proposal with any tier changes, expansion add-ons, or multi-year incentives.
- 👤 AE / CSM presents.

### 7.3 Renewal contract

- 🤖 Legal Agent generates renewal contract with carry-over terms; flags any clauses requiring update (e.g., new compliance regimes).
- 👤 Counterparty + our signatory sign.

### 7.4 Multi-year upsell

- 🤖 Proposes 24- or 36-month commitment with discount per the [discount matrix](Pricing-and-Packaging#discounts).
- 👤 Customer admin + CFO consider; require executive approval on our side beyond AE band.

### 7.5 Churn signal detected

- 🤖 Health indicators turn red (Trust Score drops, override rate rises, ticket volume rises, NPS falls).
- 🤖 Surfaces signal to CSM with reasoning.
- 👤 CSM activates save play.

### 7.6 Save play

- 👤 CSM holds executive-level conversation with customer.
- 🤖 Generates analysis of root causes (what changed, where Trust Score regressed).
- 👤 Negotiation: contract adjustment, additional CS support, or graceful exit.

### 7.7 Off-boarding (when churn confirmed)

- 🛡 Customer admin requests data export and tenant deletion.
- 🤖 Export generated in portable JSON (per [Security and Data Policy § 9](Security-and-Data-Policy#9-data-subject-rights-gdpr--ccpa)).
- 🛡 Audit log entries pseudonymised on the configured deletion grace.
- 🤖 Account closed; CRM updated; alumni-customer entry created.

### 7.8 Win-back (optional)

- 🤖 6 / 12 months post-churn, Marketing Agent enrols the alumni-customer in a low-touch awareness sequence.
- 🤖 New product releases shared.
- 👤 Customer can opt out at any time (consent-respecting).

---

# Part 2 — Employee Journey

The complete arc from candidate through active employment to departure. These workflows describe what Atlantis does on behalf of customer companies for *their* employees.

## Stage 1 · Recruitment

### 1.1 Job requisition creation

- 👤 Hiring manager opens a requisition in the ATS.
- 🤖 HR Agent reads the requisition, suggests JD improvements based on past successful hires.
- 👤 Hiring manager + recruiter finalise.

### 1.2 Job description generation

- 🤖 HR Agent drafts a JD from role title + level + team context using `anthropic-skills:docx`.
- 🛡 Jurisdiction-aware gate: required disclosures per region (e.g. salary range in US-CA).
- 👤 Recruiter reviews and posts.

### 1.3 Job posting

- 🤖 Syndicates the posting to configured job boards (LinkedIn, Indeed, Greenhouse).
- 🤖 Tracks application volume; flags low-volume requisitions for sourcing intervention.

### 1.4 Candidate sourcing

- 🤖 HR Agent searches connected sourcing tools for candidates matching the requisition.
- 🤖 Scores candidates against the role profile.
- 🛡 Anti-bias filter: protected-class signals removed before LLM reasoning.
- 👤 Recruiter reviews shortlist.

### 1.5 Resume screening

- 🤖 HR Agent screens incoming applications against required + preferred criteria.
- 🤖 Categorises as `to_interview`, `reject`, or `nurture`.
- 🛡 Reject decisions always queued for human review; never autonomous in any phase for protected-class implications.

### 1.6 Initial outreach to candidates

- 🤖 Sends templated outreach to `to_interview` candidates.
- 🤖 Tracks responses; auto-reschedules on no-response after defined intervals.

### 1.7 Phone screen scheduling

- 🤖 Reads recruiter calendar + candidate availability; proposes slots.
- 🤖 Books the meeting on confirmation.

### 1.8 Phone screen feedback capture

- 👤 Recruiter conducts the screen.
- 🤖 Ops Agent extracts notes from the recruiter's submitted feedback form.
- 🤖 Updates ATS with structured outcome.

### 1.9 Interview loop scheduling

- 🤖 Coordinates interviewer availability + candidate availability across multiple panel members.
- 🤖 Books interviews in sequence; sends calendar invites.

### 1.10 Interview prep materials

- 🤖 Generates a personalised prep packet for the candidate (company, role, team).
- 🤖 Generates interview kits for each interviewer (questions calibrated to candidate's background).

### 1.11 Interview feedback aggregation

- 🤖 Collects structured feedback from each interviewer.
- 🤖 Aggregates into a hiring committee summary; flags conflicting signals.
- 🤖 Recommends `hire` / `no_hire` with confidence, NEVER acts on it.

### 1.12 Hiring committee meeting

- 👤 Human hiring committee meets.
- 🤖 Ops Agent transcribes (consent-gated).
- 🛡 Final decision is always human.

### 1.13 Reference checks

- 🤖 HR Agent contacts references provided by candidate.
- 🤖 Conducts structured questionnaire (templated).
- 🤖 Summarises responses for recruiter.

### 1.14 Background check

- 🤖 Initiates background check via integrated provider (Checkr, etc.) after candidate consent.
- 🤖 Tracks status; surfaces results to recruiter.
- 🛡 Adverse-action workflow per jurisdiction triggers if applicable.

### 1.15 Offer generation

- 🤖 HR Agent + Finance Agent generate offer per role, level, jurisdiction.
- 🛡 Jurisdiction check: required statutory disclosures, pay-equity check.
- 👤 Hiring manager + recruiter + Head of People approve.

### 1.16 Offer extension

- 🤖 Sends the offer letter via DocuSign or equivalent.
- 🛡 Action class: `Write` high — always queued for approval.
- 👤 Recruiter delivers via call; system follows up with formal letter.

### 1.17 Offer negotiation

- 🤖 Tracks negotiation thread; surfaces key counter-asks to recruiter.
- 🛡 Compensation modifications require Head of People + Finance approval.

### 1.18 Offer acceptance

- 👤 Candidate signs.
- 🤖 Triggers the onboarding workflow (Stage 2).

---

## Stage 2 · Onboarding

### 2.1 Pre-start paperwork

- 🤖 HR Agent generates jurisdiction-appropriate forms (I-9, W-4, equivalents elsewhere).
- 🤖 Sends to new hire for signature with deadline tracking.
- 🛡 Sensitive fields encrypted at rest immediately; never visible in agent logs.

### 2.2 IT provisioning

- 🤖 Creates IT tickets for laptop, email, SSO, role-based application access.
- 🤖 Tracks completion; alerts manager if anything missing 3 business days before start.
- 👤 IT team executes.

### 2.3 Office logistics (where applicable)

- 🤖 Reserves desk, orders badge, books welcome lunch.

### 2.4 Welcome communications

- 🤖 Sends welcome email to new hire with first-day logistics.
- 🤖 Announces new hire to team (with opt-in from new hire on Day 0 announcement).

### 2.5 Manager & buddy assignment

- 👤 Manager already assigned at requisition.
- 🤖 Suggests buddy candidates from team based on tenure + workload.
- 👤 Manager confirms.

### 2.6 First-day checklist

- 🤖 Personalised first-day plan generated.
- 🤖 Calendar invites for all Day-1 events.
- 👤 New hire works through the checklist.

### 2.7 30/60/90 day plan

- 🤖 HR Agent + manager co-generate a 30/60/90-day plan.
- 🤖 Schedules check-in cadence.
- 👤 New hire + manager iterate.

### 2.8 First payroll setup

- 🤖 Finance Agent registers new hire in payroll system.
- 🛡 Action class: `Financial` — always queued for human approval.
- 👤 Finance Approver signs.

### 2.9 Benefits enrollment

- 🤖 Sends benefits enrollment links with deadline.
- 🤖 Reminders at 7 / 3 / 1 days before deadline.
- 👤 New hire enrols via the benefits portal.

### 2.10 30-day check-in

- 🤖 Schedules; provides manager with a structured agenda.
- 🤖 Captures outcomes; flags any flight risks.

---

## Stage 3 · Active Employment

### 3.1 Time tracking

- 🤖 Operations Agent ingests time entries from the time system.
- 🤖 Flags anomalies (missed weeks, overtime patterns).

### 3.2 PTO request

- 👤 Employee submits request via portal.
- 🤖 HR Agent checks balance, blackout periods, team coverage.
- 🛡 If approved by rules → manager notified; if exceptions → queued for manager.
- 👤 Manager approves.

### 3.3 Goal setting / OKRs

- 🤖 At the start of each cycle, surfaces last cycle's outcomes to manager + employee.
- 🤖 Suggests new OKRs based on team objectives.
- 👤 Employee + manager finalise.

### 3.4 1:1 scheduling

- 🤖 Maintains recurring 1:1 cadence; reschedules on conflicts.
- 🤖 Optional: pre-1:1 agenda template populated.

### 3.5 Performance reviews

- 🤖 At review cycle, aggregates accomplishments, 360 feedback, OKR completion.
- 🤖+👤 Drafts review summary; manager reviews and personalises.
- 🛡 Performance change actions (PIP, promotion) always require Head of People sign-off.

### 3.6 Career development

- 🤖 Suggests training, certifications, internal opportunities based on stated career goals.
- 👤 Employee + manager discuss in 1:1.

### 3.7 Compensation review

- 🤖 At annual cycle, Finance + HR Agents compile market data + internal calibration data.
- 🛡 Action class: `Financial` — every comp change queued for approval.
- 👤 Manager → Head of People → CFO approval chain.

### 3.8 Promotion

- 👤 Manager nominates.
- 🤖 Compiles promotion case from performance history, 360, role-fit signals.
- 👤 Promotion committee decides.
- 🤖 On approval, generates: new offer letter, comp change, announcement, role update.
- 🛡 Each downstream action passes its own gate.

### 3.9 Role change / transfer

- 👤 Employee + receiving manager + current manager agree.
- 🤖 Coordinates the transition: role updates, OKR transfer, access changes.
- 🛡 Saga workflow per [Cross-Agent Coordination § 9](Cross-Agent-Coordination#9-saga-pattern--for-cross-entity-workflows): role + comp + comms in one transaction.

### 3.10 Internal mobility posting

- 🤖 Internal job board syncs with external requisitions.
- 🤖 Suggests roles to employees based on skill profile.
- 👤 Employee opts in to be considered.

---

## Stage 4 · Life Events & Compliance

### 4.1 Address change

- 👤 Employee updates via self-service.
- 🤖 Propagates to payroll, benefits, tax jurisdictions.
- 🛡 Tax jurisdiction change triggers HR + Finance review (state/country tax implications).

### 4.2 Beneficiary update

- 👤 Employee submits.
- 🤖 Updates benefits provider.
- 🛡 Sensitive PII (SSN of beneficiary) field-encrypted; never visible in agent logs.

### 4.3 Marriage / dependents change

- 👤 Employee submits.
- 🤖 Triggers benefits qualifying-event window (typically 30-60 days).
- 🤖 Reminds employee of enrolment deadline.

### 4.4 Parental leave

- 👤 Employee notifies manager + HR.
- 🤖 HR Agent applies the correct jurisdictional leave rules (UK SMP, US FMLA, etc.).
- 🤖 Generates leave plan: dates, pay continuation, handover plan template.
- 👤 Manager + employee finalise handover.
- 🛡 Plan reviewed by HR Domain Council for jurisdiction-specific compliance.

### 4.5 Medical leave

- 👤 Employee notifies.
- 🤖 Triggers jurisdiction-appropriate workflow (FMLA, statutory sick pay, etc.).
- 🛡 Health information NEVER exposed to non-HR agents; field-encrypted.

### 4.6 Return from leave

- 🤖 Pre-return: re-onboarding checklist generated.
- 🤖 Catches employee up: org changes, project changes, meeting recap.
- 👤 Manager holds welcome-back 1:1.

### 4.7 Visa / work permit tracking

- 🤖 HR Agent tracks expiry dates of all work-permit documents.
- 🤖 Reminders at 180 / 90 / 60 / 30 days.
- 👤 Immigration counsel handles renewal applications; agent supports document gathering.

### 4.8 Required compliance training

- 🤖 Assigns required training per role + jurisdiction (anti-harassment, security awareness, GDPR, etc.).
- 🤖 Tracks completion; escalates overdue to manager.
- 🛡 Non-completion past grace period flagged to People Lead.

### 4.9 Document expiration management

- 🤖 Tracks expiry of certifications, professional licenses, government IDs.
- 🤖 Reminds employee.

### 4.10 Anonymous concern / whistleblowing

- 👤 Employee submits via a separate confidential channel.
- 🛡 **NO AGENT reads this content.** Routes directly to designated humans per the company's policy.
- 🛡 Cannot be edited or rolled back from the agent layer.

---

## Stage 5 · Offboarding

### 5.1 Resignation

- 👤 Employee submits resignation; manager + HR notified.
- 🤖 Starts the offboarding workflow with the employee's last day.

### 5.2 Termination (involuntary)

- 👤 Manager + HR + Legal agree.
- 🛡 NO AGENT initiates or executes a termination. Agents support logistics only.
- 🤖 Generates jurisdiction-appropriate termination paperwork (notice periods, severance per local law).
- 👤 Termination meeting held by manager + HR.

### 5.3 Notice period management

- 🤖 Schedules knowledge-transfer sessions.
- 🤖 Tracks handover-document completion.
- 🤖 Reminds employee + manager of remaining tasks.

### 5.4 Knowledge transfer

- 🤖 Suggests knowledge artefacts to document based on departing employee's work history.
- 👤 Departing employee + manager prioritise.
- 🤖+👤 Drafts knowledge documents from interviews / existing artefacts.

### 5.5 Exit interview

- 🤖 Schedules with HR (not direct manager).
- 👤 Conducted by HR business partner.
- 🤖 Aggregates trends across exit interviews for the People Lead.

### 5.6 IT deprovisioning

- 🤖 Schedules access revocation for the employee's last working hour, per role.
- 🛡 Final account closure NEVER autonomous: human IT confirms.

### 5.7 Final payroll

- 🤖 Finance Agent computes final paycheck including PTO payout, severance (if applicable), per-jurisdiction rules.
- 🛡 Action class: `Financial` — always queued for human approval.
- 👤 Finance Approver + Head of People sign.

### 5.8 Benefits termination / COBRA

- 🤖 Initiates benefits termination effective the last day.
- 🤖 Sends COBRA election materials (US) or equivalent.
- 👤 Employee elects within statutory window.

### 5.9 Equipment return

- 🤖 Generates return checklist; sends prepaid shipping if remote.
- 🤖 Tracks return; escalates if items unreturned.

### 5.10 Alumni entry

- 🤖 With employee's opt-in, adds them to the alumni network.
- 🤖 Future re-hire profile retained per data retention policy.

### 5.11 Reference policy

- 🤖 On future reference requests, routes per company policy (manager / HR / no-reference).
- 🛡 Reference-giving is governed; agents do not provide unvetted references.

---

## Cross-references

- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Cross-Agent Coordination](Cross-Agent-Coordination)
- [HR Agent Playbook](HR-Agent-Playbook)
- [Finance Agent Playbook](Finance-Agent-Playbook)
- [Sales Agent Playbook](Sales-Agent-Playbook)
- [Marketing Agent Playbook](Marketing-Agent-Playbook)
- [Legal Agent Playbook](Legal-Agent-Playbook)
- [Operations Agent Playbook](Operations-Agent-Playbook)
- [Pricing and Packaging](Pricing-and-Packaging)
- [Incident Response Playbook](Incident-Response-Playbook)
- [Master Blueprint Index](Master-Blueprint-Index)

---

## When to revisit

- A new agent or department is added — its workflows are added here.
- A workflow needs to change per regulation change or customer demand — update here first, then code.
- A new tier or pricing model changes the customer journey — update Stage 4 / 5 / 7.
- Workflows page (`/workflows.html`) deviates from this canonical list — re-sync.
