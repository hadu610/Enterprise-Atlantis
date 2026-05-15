// Atlantis Workflows — interactive journey demonstration
// All workflow data mirrors the canonical Business-Workflows wiki page.

(() => {
  // ====== DATA ======================================================
  const DATA = {
    customer: {
      title: 'Customer Journey',
      subtitle: 'From first inbound to long-term partner',
      stages: [
        {
          id: 'lead',
          num: '01',
          icon: '🌱',
          name: 'Lead Capture & Qualification',
          description: 'A prospect signals interest. We qualify, route, and start the conversation. Most of this is autonomous from Phase 3 onward.',
          workflows: [
            {
              name: 'Inbound lead capture',
              trigger: 'Form submission, demo request, event scan, partner referral',
              primaryAgent: 'Sales Agent',
              humanRole: 'SDR (Phase 1–2) → autonomous (Phase 3+)',
              duration: '~30 seconds',
              steps: [
                { actor: 'agent', text: 'Sales Agent receives the lead payload via webhook.' },
                { actor: 'gate', text: 'PII redaction layer applied; lead validated against schema.' },
                { actor: 'agent', text: 'Creates a Lead record in CRM with source attribution.' },
                { actor: 'agent', text: 'Sends templated acknowledgement to the lead.' },
                { actor: 'human', text: 'SDR notified to begin qualification (Phase 1–2).' },
              ],
              phaseNote: 'In Drafting Mode, the agent only drafts the CRM entry and the acknowledgement; a human approves both. By Enterprise Mode, the full sequence is autonomous within minutes.',
            },
            {
              name: 'Lead enrichment & scoring',
              trigger: 'New Lead record created',
              primaryAgent: 'Sales Agent',
              humanRole: 'Sales Operations (oversight)',
              duration: '~2 minutes',
              steps: [
                { actor: 'agent', text: 'Calls enrichment APIs (Clearbit, ZoomInfo) for firmographic data.' },
                { actor: 'gate', text: 'Universal Data Bridge updates the Lead + Organisation entities via Action Executor.' },
                { actor: 'agent', text: 'Computes ICP fit score against tenant-configured ICP definition.' },
                { actor: 'agent', text: 'Categorises as MQL / SQL / disqualified / nurture; logs reasoning + confidence.' },
              ],
            },
            {
              name: 'Lead routing to AE',
              trigger: 'Lead categorised as MQL or SQL',
              primaryAgent: 'Sales Agent',
              humanRole: 'Account Executive',
              steps: [
                { actor: 'agent', text: 'Identifies AE owner by CRM territory rules.' },
                { actor: 'agent', text: 'Sends Slack + email notification with full enrichment + scoring rationale.' },
                { actor: 'human', text: 'AE acknowledges within 24h business-hours SLA.' },
                { actor: 'agent', text: 'Tracks AE response time as a Trust Score signal.' },
              ],
            },
            {
              name: 'Nurture sequence (non-qualified leads)',
              trigger: 'Lead categorised as nurture',
              primaryAgent: 'Marketing Agent',
              humanRole: 'Marketing Lead (review)',
              steps: [
                { actor: 'agent', text: 'Enrols lead in tenant-configured nurture sequence.' },
                { actor: 'both', text: 'Sends templated emails on schedule (Phase 3+ autonomous; earlier phases approved per send).' },
                { actor: 'gate', text: 'Brand gate + anti-spam compliance check on every send.' },
                { actor: 'agent', text: 'Re-scores lead on engagement signals; flips back to MQL on positive response.' },
              ],
            },
          ],
        },
        {
          id: 'discovery',
          num: '02',
          icon: '🔍',
          name: 'Discovery & Demo',
          description: 'The conversation begins. Humans lead the calls; agents handle scheduling, prep, transcription, and follow-up.',
          workflows: [
            {
              name: 'Discovery call scheduling',
              trigger: 'Lead expresses interest in a call',
              primaryAgent: 'Sales Agent',
              humanRole: 'AE',
              steps: [
                { actor: 'agent', text: 'Reads AE calendar availability via Google Workspace / M365 integration.' },
                { actor: 'agent', text: 'Proposes three time slots to the lead via templated email.' },
                { actor: 'agent', text: 'Books the meeting on confirmation; sends calendar invite.' },
                { actor: 'agent', text: 'Updates CRM with the scheduled meeting.' },
              ],
            },
            {
              name: 'Discovery prep & summary',
              trigger: '24h before the discovery call',
              primaryAgent: 'Sales Agent + Ops Agent',
              humanRole: 'AE',
              steps: [
                { actor: 'agent', text: 'Generates pre-call brief: company background, role, recent news, relevant case studies.' },
                { actor: 'human', text: 'AE reviews and personalises before the call.' },
                { actor: 'human', text: 'AE conducts the call (Atlantis is not a meeting-bot company).' },
                { actor: 'agent', text: 'Ops Agent transcribes (consent-gated) and extracts pain points + decision-maker map.' },
                { actor: 'agent', text: 'Routes any compliance question to Legal Agent for follow-up.' },
              ],
              phaseNote: 'Transcription requires explicit attendee consent in every phase — see Operations Agent Playbook § 4.',
            },
            {
              name: 'Demo customisation',
              trigger: 'AE marks discovery as complete',
              primaryAgent: 'Sales + Marketing Agent',
              humanRole: 'Sales Engineer',
              steps: [
                { actor: 'agent', text: 'Composes a demo flow targeting the prospect\'s stated pain points.' },
                { actor: 'agent', text: 'Generates demo script and slide deck via the anthropic-skills:pptx skill.' },
                { actor: 'gate', text: 'Brand gate applied to the deck.' },
                { actor: 'human', text: 'SE reviews and adapts.' },
              ],
            },
            {
              name: 'Demo follow-up',
              trigger: 'Demo completed',
              primaryAgent: 'Sales Agent',
              humanRole: 'AE',
              steps: [
                { actor: 'agent', text: 'Drafts personalised follow-up summarising what was shown and discussed.' },
                { actor: 'human', text: 'AE reviews and sends.' },
                { actor: 'agent', text: 'Schedules next touchpoints; tracks engagement.' },
              ],
            },
          ],
        },
        {
          id: 'proposal',
          num: '03',
          icon: '📝',
          name: 'Proposal & Negotiation',
          description: 'Pricing assembled, contract drafted, redlines reviewed. Legal and commercial gates active throughout.',
          workflows: [
            {
              name: 'Custom proposal generation',
              trigger: 'AE indicates readiness',
              primaryAgent: 'Sales Agent',
              humanRole: 'AE',
              steps: [
                { actor: 'agent', text: 'Assembles proposal from tenant pricing/packaging page + prospect requirements.' },
                { actor: 'agent', text: 'Recommends tier and add-ons; flags any required discount approval.' },
                { actor: 'gate', text: 'Brand gate applied to the proposal document.' },
                { actor: 'human', text: 'AE reviews before sending.' },
              ],
            },
            {
              name: 'Discount approval workflow',
              trigger: 'Proposal includes discount > AE band',
              primaryAgent: 'Sales Agent',
              humanRole: 'Sales Lead / VP Sales / CEO',
              steps: [
                { actor: 'agent', text: 'Identifies approver per Pricing § 8 discount matrix.' },
                { actor: 'gate', text: 'Routes to Approval Queue with explanation.' },
                { actor: 'human', text: 'Approver reviews and signs (or modifies / rejects).' },
                { actor: 'agent', text: 'Updates proposal with approved terms once green-lit.' },
              ],
              phaseNote: 'Discount governance is a hard rule — agents never autonomously approve discounts in any phase.',
            },
            {
              name: 'Contract drafting & redlines',
              trigger: 'Proposal accepted in principle',
              primaryAgent: 'Legal Agent',
              humanRole: 'General Counsel',
              steps: [
                { actor: 'agent', text: 'Generates contract from tenant MSA template with DPA / BAA if applicable.' },
                { actor: 'human', text: 'General Counsel reviews substantive changes.' },
                { actor: 'agent', text: 'When counterparty sends redlines, compares against playbook clauses.' },
                { actor: 'agent', text: 'Categorises each redline (standard / acceptable / risky / unacceptable).' },
                { actor: 'both', text: 'Suggests responses; human attorney signs every external response.' },
              ],
            },
            {
              name: 'Signature & deal closure',
              trigger: 'Final terms agreed',
              primaryAgent: 'Sales Agent',
              humanRole: 'Authorised signatory',
              steps: [
                { actor: 'agent', text: 'Sends contract via DocuSign (templated, queued for approval in Phase 1–3).' },
                { actor: 'human', text: 'Both parties sign.' },
                { actor: 'agent', text: 'Updates CRM opportunity to Closed Won.' },
                { actor: 'agent', text: 'Triggers onboarding handoff workflow.' },
                { actor: 'gate', text: 'Action Executor emits event; Finance Agent picks up for billing setup.' },
              ],
            },
          ],
        },
        {
          id: 'onboarding',
          num: '04',
          icon: '🚀',
          name: 'Onboarding',
          description: 'The structured intake. We map your data, configure your agents, and bring your team along — before any agent acts autonomously.',
          workflows: [
            {
              name: 'Welcome kickoff',
              trigger: 'Deal closed',
              primaryAgent: 'CS Workflow',
              humanRole: 'Customer Success Manager',
              steps: [
                { actor: 'agent', text: 'Customer Success workflow auto-initiates on Closed Won.' },
                { actor: 'agent', text: 'Assigns CSM per tier; sends welcome email with kickoff link.' },
                { actor: 'human', text: 'CSM holds kickoff call with customer admin.' },
              ],
            },
            {
              name: 'Onboarding interview',
              trigger: 'Kickoff complete',
              primaryAgent: 'Onboarding Agent',
              humanRole: 'Customer admin',
              steps: [
                { actor: 'agent', text: 'Guides customer admin through structured conversational interview.' },
                { actor: 'human', text: 'Customer admin answers: company profile, jurisdictions, tools, team, risk tolerance, pain points.' },
                { actor: 'agent', text: 'Captures answers as tenant-scoped Wiki pages (your profile, ICP, brand voice, etc.).' },
              ],
            },
            {
              name: 'Data Readiness Assessment',
              trigger: 'Onboarding interview complete',
              primaryAgent: 'Universal Data Bridge',
              humanRole: 'Customer admin',
              steps: [
                { actor: 'agent', text: 'Scores each department\'s source data for completeness, freshness, consistency.' },
                { actor: 'agent', text: 'Produces Department Activation Checklist with red/yellow/green status.' },
                { actor: 'human', text: 'Customer admin remediates red items.' },
                { actor: 'gate', text: 'Agents cannot activate for a department until its data score crosses threshold.' },
              ],
              phaseNote: 'This is a hard gate. Agents acting on bad data is the #1 cause of enterprise AI failures — we refuse to let it happen.',
            },
            {
              name: 'Universal Data Bridge configuration',
              trigger: 'Data Readiness assessment passes',
              primaryAgent: 'Universal Data Bridge',
              humanRole: 'Customer admin / IT',
              steps: [
                { actor: 'agent', text: 'Connects to source systems per checklist (Salesforce, HubSpot, QuickBooks, HRIS, etc.).' },
                { actor: 'agent', text: 'Ingests historical data into the normalised entity model.' },
                { actor: 'gate', text: 'Audit log entries created for every ingest batch.' },
                { actor: 'human', text: 'Customer admin reviews data quality score per source.' },
              ],
            },
            {
              name: 'Phase 1 (Drafting) activation',
              trigger: 'Data bridge configured + admin trained',
              primaryAgent: 'Selected agents (HR / Finance / etc.)',
              humanRole: 'Customer admin',
              steps: [
                { actor: 'human', text: 'Customer admin reviews selected agents and their initial scopes.' },
                { actor: 'agent', text: 'Selected agents activate in Drafting Mode — no autonomous execution yet.' },
                { actor: 'agent', text: 'Trust Score Dashboard starts accumulating evidence from Day 1.' },
                { actor: 'agent', text: 'Change Management Module generates employee-facing communications.' },
                { actor: 'human', text: 'Customer HR distributes the rollout messaging.' },
              ],
            },
          ],
        },
        {
          id: 'active',
          num: '05',
          icon: '⚙️',
          name: 'Active Use & Phase Progression',
          description: 'Day-in, day-out operation. Trust accumulates as evidence. Agents earn autonomy through demonstrated reliability — never by default.',
          workflows: [
            {
              name: 'Approval queue management',
              trigger: 'Agent proposes an action requiring approval',
              primaryAgent: 'All agents',
              humanRole: 'Customer admin / designated approver',
              steps: [
                { actor: 'agent', text: 'Agent proposes action with plain-English Explain-Before-Execute rationale.' },
                { actor: 'gate', text: 'Validation gates run (schema, business logic, confidence, contradiction).' },
                { actor: 'human', text: 'Customer admin or designated approver reviews in the console.' },
                { actor: 'gate', text: 'Action Executor commits or rolls back based on the decision.' },
                { actor: 'agent', text: 'Full audit event logged.' },
              ],
            },
            {
              name: 'Trust Score monitoring',
              trigger: 'Continuous',
              primaryAgent: 'Trust Score system',
              humanRole: 'Customer admin / CIO',
              steps: [
                { actor: 'agent', text: 'Trust Score recomputed daily per agent.' },
                { actor: 'agent', text: 'Dashboard surfaces accuracy, override rate, gate failures, time-to-resolution.' },
                { actor: 'human', text: 'Customer admin uses this to evaluate phase progression.' },
                { actor: 'gate', text: 'Drop below floor for 48h triggers automatic phase rollback.' },
              ],
            },
            {
              name: 'Phase progression — Drafting → Startup',
              trigger: 'Exit criteria checked nightly',
              primaryAgent: 'Platform',
              humanRole: 'Customer admin',
              steps: [
                { actor: 'gate', text: 'Platform checks: ≥ 30 days, Trust Score ≥ 0.80, override rate < 25%.' },
                { actor: 'gate', text: 'Zero hard-rule violations (e.g. delete/financial without approval).' },
                { actor: 'agent', text: 'Surfaces "ready for promotion" recommendation to admin.' },
                { actor: 'human', text: 'Customer admin approves promotion.' },
                { actor: 'agent', text: 'Agent reconfigures to Phase 2 behaviour; Read actions become autonomous.' },
              ],
            },
            {
              name: 'Quarterly Business Review',
              trigger: 'Every quarter',
              primaryAgent: 'CS Agent',
              humanRole: 'CSM + customer exec sponsor',
              steps: [
                { actor: 'agent', text: 'CS Agent assembles QBR materials: usage, Trust Score trends, cost analysis, ROI signals.' },
                { actor: 'human', text: 'CSM presents to customer exec sponsor.' },
                { actor: 'agent', text: 'Captures QBR action items; assigns owners.' },
                { actor: 'agent', text: 'Identifies expansion candidates based on Trust Score on existing agents.' },
              ],
            },
            {
              name: 'Phase progression — Approval → Enterprise',
              trigger: 'Exit criteria checked',
              primaryAgent: 'Platform',
              humanRole: 'Customer board / exec sponsor',
              steps: [
                { actor: 'gate', text: 'Platform checks: ≥ 90 days, Trust Score ≥ 0.95 sustained 30d, override < 5%.' },
                { actor: 'human', text: 'Customer board or exec sponsor approves.' },
                { actor: 'agent', text: 'Agent moves to Enterprise Mode — policy-based auto-approval for pre-approved task categories.' },
                { actor: 'gate', text: 'Delete and Financial actions still always require human confirmation. Hard rule.' },
              ],
              phaseNote: 'Even in Enterprise Mode, every destructive or financial action remains human-gated. The hard rule never relaxes — across all phases, across all customers, across all tenants.',
            },
          ],
        },
        {
          id: 'support',
          num: '06',
          icon: '🛟',
          name: 'Support & Incidents',
          description: 'When something needs help or breaks. Transparent communication, fast resolution, blameless postmortems.',
          workflows: [
            {
              name: 'Customer-initiated ticket',
              trigger: 'Customer admin creates ticket',
              primaryAgent: 'Ops Agent',
              humanRole: 'Customer admin / support engineer',
              steps: [
                { actor: 'human', text: 'Customer admin creates a ticket via console or email.' },
                { actor: 'agent', text: 'Ops Agent triages by kind, priority, risk tier.' },
                { actor: 'agent', text: 'Routes to appropriate internal owner.' },
              ],
            },
            {
              name: 'Self-serve resolution',
              trigger: 'Ticket matches known pattern',
              primaryAgent: 'Ops Agent',
              humanRole: 'Customer admin',
              steps: [
                { actor: 'agent', text: 'Matches issue against documented resolution patterns.' },
                { actor: 'agent', text: 'Proposes the fix with rationale.' },
                { actor: 'human', text: 'Customer admin accepts (or escalates to a human).' },
              ],
            },
            {
              name: 'Escalation to engineering',
              trigger: 'L1 cannot resolve',
              primaryAgent: 'Ops Agent',
              humanRole: 'Engineering on-call',
              steps: [
                { actor: 'agent', text: 'Escalates to L2 with full context (trace IDs, audit history, customer state).' },
                { actor: 'human', text: 'Engineering on-call investigates.' },
                { actor: 'agent', text: 'Pushes status updates to customer admin automatically.' },
              ],
            },
            {
              name: 'Incident notification (Sev1/Sev2)',
              trigger: 'Severity declared',
              primaryAgent: 'Comms Lead',
              humanRole: 'Incident Commander + Legal',
              steps: [
                { actor: 'human', text: 'Severity declared by Incident Commander.' },
                { actor: 'agent', text: 'Comms Lead drafts customer communication using approved templates.' },
                { actor: 'human', text: 'IC + Legal (if data-involving) approve before send.' },
                { actor: 'agent', text: 'Sends to affected tenants within SLA (1h Sev1 / 4h Sev2).' },
                { actor: 'agent', text: 'Status page updated; updates every 60 minutes during Sev1.' },
              ],
              phaseNote: 'Customer communication on data-involving incidents always goes through human legal review before send — speed bounded by accuracy.',
            },
          ],
        },
        {
          id: 'renewal',
          num: '07',
          icon: '🔄',
          name: 'Renewal & Expansion',
          description: 'Renewal is the result of evidence accumulated since day one. Expansion is the natural conversation after trust is established.',
          workflows: [
            {
              name: 'Renewal forecasting',
              trigger: '90 days before renewal date',
              primaryAgent: 'CS Agent',
              humanRole: 'CSM',
              steps: [
                { actor: 'agent', text: 'Generates renewal health report.' },
                { actor: 'agent', text: 'Inputs: Trust Score trends, expansion signals, ticket volume, NPS.' },
                { actor: 'human', text: 'CSM reviews; intervenes if amber/red.' },
              ],
            },
            {
              name: 'Renewal proposal',
              trigger: '60 days before renewal',
              primaryAgent: 'Sales + CS Agent',
              humanRole: 'AE + CSM',
              steps: [
                { actor: 'agent', text: 'Assembles renewal proposal with tier changes, expansion add-ons, multi-year incentives.' },
                { actor: 'human', text: 'AE/CSM presents to customer.' },
                { actor: 'agent', text: 'Legal Agent generates renewal contract; flags clauses needing update (e.g., new compliance regimes).' },
                { actor: 'human', text: 'Counterparty + our signatory sign.' },
              ],
            },
            {
              name: 'Expansion conversation',
              trigger: 'Existing agent sustains Trust Score > 0.90',
              primaryAgent: 'CS Agent',
              humanRole: 'CSM + customer admin',
              steps: [
                { actor: 'agent', text: 'Identifies expansion opportunity — high Trust Score → additional agent ready.' },
                { actor: 'agent', text: 'Drafts evidence-based expansion brief showing existing agent\'s performance.' },
                { actor: 'human', text: 'CSM holds expansion conversation with customer admin.' },
                { actor: 'agent', text: 'Routes back through proposal workflow once committed.' },
              ],
            },
            {
              name: 'Off-boarding (if churn)',
              trigger: 'Customer requests cancellation',
              primaryAgent: 'Platform off-boarding workflow',
              humanRole: 'Customer admin + CSM',
              steps: [
                { actor: 'human', text: 'Customer admin requests data export and tenant deletion.' },
                { actor: 'agent', text: 'Export generated in portable JSON per the Unified Entity Model.' },
                { actor: 'gate', text: 'Audit log entries pseudonymised on configured deletion grace.' },
                { actor: 'agent', text: 'Account closed; CRM updated; alumni-customer entry created.' },
              ],
              phaseNote: 'Right-to-be-forgotten obligations honoured in 30 days; audit log is preserved (pseudonymised, not deleted) to meet compliance retention rules.',
            },
          ],
        },
      ],
    },

    // ====== EMPLOYEE JOURNEY =========================================
    employee: {
      title: 'Employee Journey',
      subtitle: 'From candidate through active employee to departure',
      stages: [
        {
          id: 'recruit',
          num: '01',
          icon: '🔍',
          name: 'Recruitment',
          description: 'From requisition to accepted offer. Agents handle the logistics and structured analysis; humans make every hiring decision.',
          workflows: [
            {
              name: 'Job requisition & JD',
              trigger: 'Hiring manager opens a requisition',
              primaryAgent: 'HR Agent',
              humanRole: 'Hiring manager + recruiter',
              steps: [
                { actor: 'human', text: 'Hiring manager opens a requisition in the ATS.' },
                { actor: 'agent', text: 'HR Agent suggests JD improvements based on past successful hires.' },
                { actor: 'agent', text: 'Drafts JD using the anthropic-skills:docx skill.' },
                { actor: 'gate', text: 'Jurisdiction-aware gate: required disclosures (e.g. salary range in US-CA) added automatically.' },
                { actor: 'human', text: 'Recruiter reviews and posts to job boards.' },
              ],
            },
            {
              name: 'Candidate sourcing',
              trigger: 'Active requisition',
              primaryAgent: 'HR Agent',
              humanRole: 'Recruiter',
              steps: [
                { actor: 'agent', text: 'Searches connected sourcing tools for candidates matching the requisition.' },
                { actor: 'gate', text: 'Anti-bias filter: protected-class signals removed before LLM reasoning.' },
                { actor: 'agent', text: 'Scores candidates against role profile.' },
                { actor: 'human', text: 'Recruiter reviews shortlist and approves outreach.' },
              ],
              phaseNote: 'Protected-class fields (race, religion, etc.) are pre-filtered from any data passed to the LLM — the agent literally cannot reason about them.',
            },
            {
              name: 'Resume screening',
              trigger: 'New applications received',
              primaryAgent: 'HR Agent',
              humanRole: 'Recruiter',
              steps: [
                { actor: 'agent', text: 'Screens applications against required + preferred criteria.' },
                { actor: 'agent', text: 'Categorises as to_interview / reject / nurture.' },
                { actor: 'gate', text: 'Reject decisions always queued for human review — never autonomous, in any phase.' },
                { actor: 'human', text: 'Recruiter reviews categorisations before any rejection email goes out.' },
              ],
            },
            {
              name: 'Interview scheduling & feedback',
              trigger: 'Candidate moves to interview loop',
              primaryAgent: 'HR Agent',
              humanRole: 'Interviewers + candidate',
              steps: [
                { actor: 'agent', text: 'Coordinates interviewer availability + candidate availability across the panel.' },
                { actor: 'agent', text: 'Generates personalised prep packet for the candidate.' },
                { actor: 'agent', text: 'Generates interview kits for each interviewer with calibrated questions.' },
                { actor: 'human', text: 'Humans conduct interviews; submit structured feedback.' },
                { actor: 'agent', text: 'Aggregates feedback; flags conflicting signals; recommends hire/no-hire with confidence.' },
              ],
            },
            {
              name: 'Reference & background checks',
              trigger: 'Hiring decision in principle',
              primaryAgent: 'HR Agent',
              humanRole: 'Recruiter',
              steps: [
                { actor: 'agent', text: 'Contacts references via structured questionnaire.' },
                { actor: 'agent', text: 'Initiates background check via Checkr (or equivalent) after candidate consent.' },
                { actor: 'gate', text: 'Adverse-action workflow per jurisdiction triggers if applicable.' },
                { actor: 'agent', text: 'Summarises responses for recruiter.' },
              ],
            },
            {
              name: 'Offer generation & extension',
              trigger: 'Hiring decision finalised',
              primaryAgent: 'HR + Finance Agent',
              humanRole: 'Hiring manager + Head of People',
              steps: [
                { actor: 'agent', text: 'Generates offer per role, level, jurisdiction; runs pay-equity check.' },
                { actor: 'gate', text: 'Action class: Write high — always queued for approval.' },
                { actor: 'human', text: 'Hiring manager + recruiter + Head of People approve.' },
                { actor: 'human', text: 'Recruiter delivers offer via call.' },
                { actor: 'agent', text: 'Sends formal offer letter via DocuSign; tracks signature.' },
              ],
            },
          ],
        },
        {
          id: 'employee-onboard',
          num: '02',
          icon: '🚀',
          name: 'Onboarding',
          description: 'From signed offer to ramped contributor. The platform handles the logistics, paperwork, and provisioning so the new hire focuses on the work.',
          workflows: [
            {
              name: 'Pre-start paperwork',
              trigger: 'Offer signed',
              primaryAgent: 'HR Agent',
              humanRole: 'New hire',
              steps: [
                { actor: 'agent', text: 'Generates jurisdiction-appropriate forms (I-9, W-4, equivalents elsewhere).' },
                { actor: 'agent', text: 'Sends to new hire for signature with deadline tracking.' },
                { actor: 'gate', text: 'Sensitive fields encrypted at rest immediately; never visible in agent logs.' },
                { actor: 'human', text: 'New hire completes and signs.' },
              ],
            },
            {
              name: 'IT provisioning',
              trigger: 'Start date confirmed',
              primaryAgent: 'Ops + HR Agent',
              humanRole: 'IT team',
              steps: [
                { actor: 'agent', text: 'Creates IT tickets for laptop, email, SSO, role-based application access.' },
                { actor: 'agent', text: 'Tracks completion; alerts manager 3 business days before start if anything missing.' },
                { actor: 'human', text: 'IT team executes provisioning.' },
              ],
            },
            {
              name: 'First-day plan & training',
              trigger: '7 days before start',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager + new hire',
              steps: [
                { actor: 'agent', text: 'Suggests buddy from team based on tenure + workload.' },
                { actor: 'human', text: 'Manager confirms buddy assignment.' },
                { actor: 'agent', text: 'Generates personalised first-day plan and calendar invites for Day-1 events.' },
                { actor: 'agent', text: 'Sends welcome email with first-day logistics.' },
              ],
            },
            {
              name: 'Payroll & benefits setup',
              trigger: 'New hire active in HRIS',
              primaryAgent: 'Finance + HR Agent',
              humanRole: 'Finance approver',
              steps: [
                { actor: 'agent', text: 'Finance Agent registers new hire in payroll system.' },
                { actor: 'gate', text: 'Action class: Financial — always queued for human approval.' },
                { actor: 'human', text: 'Finance Approver signs.' },
                { actor: 'agent', text: 'Sends benefits enrollment links with deadline + automated reminders.' },
              ],
            },
            {
              name: '30/60/90 check-ins',
              trigger: 'Recurring on schedule',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager + employee',
              steps: [
                { actor: 'agent', text: 'Co-generates 30/60/90 day plan with manager.' },
                { actor: 'agent', text: 'Schedules check-in cadence.' },
                { actor: 'agent', text: 'Provides manager with structured agenda before each check-in.' },
                { actor: 'human', text: 'Manager + employee conduct each check-in.' },
                { actor: 'agent', text: 'Captures outcomes; flags flight risks.' },
              ],
            },
          ],
        },
        {
          id: 'active-employee',
          num: '03',
          icon: '💼',
          name: 'Active Employment',
          description: 'Day-to-day operation. The agents take logistics off your plate so you and your manager focus on the work and the relationship.',
          workflows: [
            {
              name: 'PTO requests',
              trigger: 'Employee submits PTO request',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager',
              steps: [
                { actor: 'human', text: 'Employee submits request via portal.' },
                { actor: 'agent', text: 'Checks balance, blackout periods, team coverage.' },
                { actor: 'gate', text: 'Routes to manager (per-policy auto-approve for in-policy / queues exceptions).' },
                { actor: 'human', text: 'Manager approves.' },
                { actor: 'agent', text: 'Updates calendar; notifies team; updates payroll if unpaid.' },
              ],
            },
            {
              name: 'Goal setting / OKRs',
              trigger: 'New quarter / cycle starts',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager + employee',
              steps: [
                { actor: 'agent', text: 'Surfaces last cycle\'s outcomes to manager + employee.' },
                { actor: 'agent', text: 'Suggests new OKRs based on team objectives.' },
                { actor: 'human', text: 'Employee + manager finalise in 1:1.' },
                { actor: 'agent', text: 'Schedules check-ins; tracks progress signals.' },
              ],
            },
            {
              name: 'Performance review',
              trigger: 'Review cycle',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager + Head of People',
              steps: [
                { actor: 'agent', text: 'Aggregates accomplishments, 360 feedback, OKR completion.' },
                { actor: 'agent', text: 'Drafts review summary.' },
                { actor: 'human', text: 'Manager reviews and personalises.' },
                { actor: 'gate', text: 'Performance change actions (PIP, promotion) always require Head of People sign-off.' },
                { actor: 'human', text: 'Manager conducts the review conversation.' },
              ],
            },
            {
              name: 'Compensation review',
              trigger: 'Annual cycle',
              primaryAgent: 'Finance + HR Agent',
              humanRole: 'Manager → Head of People → CFO',
              steps: [
                { actor: 'agent', text: 'Compiles market data + internal calibration data.' },
                { actor: 'gate', text: 'Action class: Financial — every comp change queued for approval.' },
                { actor: 'human', text: 'Manager proposes; Head of People + CFO sign.' },
                { actor: 'agent', text: 'Updates payroll on approval; generates communication.' },
              ],
            },
            {
              name: 'Promotion',
              trigger: 'Manager nominates',
              primaryAgent: 'HR Agent',
              humanRole: 'Manager + promotion committee',
              steps: [
                { actor: 'agent', text: 'Compiles promotion case from performance history, 360, role-fit signals.' },
                { actor: 'human', text: 'Promotion committee decides.' },
                { actor: 'gate', text: 'On approval, saga workflow coordinates: new offer letter + comp change + announcement + role update.' },
                { actor: 'agent', text: 'Each downstream action passes its own validation gate; compensating actions ready on failure.' },
              ],
              phaseNote: 'This is a saga workflow per Cross-Agent Coordination — all four downstream actions land together or none of them do.',
            },
            {
              name: 'Role change / transfer',
              trigger: 'Internal mobility agreed',
              primaryAgent: 'HR Agent',
              humanRole: 'Employee + both managers',
              steps: [
                { actor: 'human', text: 'Employee + receiving manager + current manager agree.' },
                { actor: 'agent', text: 'Coordinates the transition: role updates, OKR transfer, access changes.' },
                { actor: 'gate', text: 'Saga workflow ensures role + comp + comms land together.' },
                { actor: 'agent', text: 'Updates affected systems; generates announcement.' },
              ],
            },
          ],
        },
        {
          id: 'life-events',
          num: '04',
          icon: '📋',
          name: 'Life Events & Compliance',
          description: 'Real life intersects with work — life events, compliance obligations, and confidentiality. The platform handles each with jurisdiction-aware care.',
          workflows: [
            {
              name: 'Address change',
              trigger: 'Employee updates address',
              primaryAgent: 'HR Agent',
              humanRole: 'Employee',
              steps: [
                { actor: 'human', text: 'Employee updates address via self-service.' },
                { actor: 'agent', text: 'Propagates to payroll, benefits, tax jurisdictions.' },
                { actor: 'gate', text: 'Tax jurisdiction change triggers HR + Finance review.' },
              ],
            },
            {
              name: 'Parental leave',
              trigger: 'Employee notifies HR',
              primaryAgent: 'HR Agent',
              humanRole: 'Employee + manager + HR Domain Council',
              steps: [
                { actor: 'agent', text: 'Applies correct jurisdictional leave rules (UK SMP, US FMLA, etc.).' },
                { actor: 'agent', text: 'Generates leave plan: dates, pay continuation, handover plan template.' },
                { actor: 'human', text: 'Manager + employee finalise handover.' },
                { actor: 'gate', text: 'Plan reviewed by HR Domain Council for jurisdiction-specific compliance.' },
              ],
            },
            {
              name: 'Visa / work permit tracking',
              trigger: 'Continuous monitoring',
              primaryAgent: 'HR Agent',
              humanRole: 'Immigration counsel + employee',
              steps: [
                { actor: 'agent', text: 'Tracks expiry dates of all work-permit documents.' },
                { actor: 'agent', text: 'Sends reminders at 180 / 90 / 60 / 30 days.' },
                { actor: 'human', text: 'Immigration counsel handles renewal applications.' },
                { actor: 'agent', text: 'Supports document gathering and scheduling.' },
              ],
            },
            {
              name: 'Required compliance training',
              trigger: 'New hire / annual refresh / role change',
              primaryAgent: 'HR Agent',
              humanRole: 'Employee + manager',
              steps: [
                { actor: 'agent', text: 'Assigns required training per role + jurisdiction (anti-harassment, security, GDPR).' },
                { actor: 'agent', text: 'Tracks completion; escalates overdue to manager.' },
                { actor: 'gate', text: 'Non-completion past grace period flagged to People Lead.' },
              ],
            },
            {
              name: 'Anonymous concern / whistleblowing',
              trigger: 'Employee uses confidential channel',
              primaryAgent: '— (no agent involvement)',
              humanRole: 'Designated humans only',
              steps: [
                { actor: 'human', text: 'Employee submits via separate confidential channel.' },
                { actor: 'gate', text: 'NO AGENT reads this content. Routes directly to designated humans per company policy.' },
                { actor: 'gate', text: 'Cannot be edited or rolled back from the agent layer.' },
                { actor: 'human', text: 'Investigation conducted entirely by humans.' },
              ],
              phaseNote: 'Some processes deliberately exclude AI. Confidentiality and protection of reporting parties cannot be compromised for convenience.',
            },
          ],
        },
        {
          id: 'offboard',
          num: '05',
          icon: '👋',
          name: 'Offboarding',
          description: 'When an employee leaves. Knowledge preserved, access closed, final obligations met, alumni relationship started.',
          workflows: [
            {
              name: 'Resignation processing',
              trigger: 'Employee submits resignation',
              primaryAgent: 'HR Agent',
              humanRole: 'Employee + manager + HR',
              steps: [
                { actor: 'human', text: 'Employee submits resignation; manager + HR notified.' },
                { actor: 'agent', text: 'Starts offboarding workflow with the employee\'s last day.' },
                { actor: 'agent', text: 'Schedules knowledge-transfer sessions and exit interview.' },
                { actor: 'agent', text: 'Generates jurisdiction-appropriate paperwork.' },
              ],
            },
            {
              name: 'Knowledge transfer',
              trigger: 'Notice period begins',
              primaryAgent: 'HR + Ops Agent',
              humanRole: 'Departing employee + manager',
              steps: [
                { actor: 'agent', text: 'Suggests knowledge artefacts to document based on the employee\'s work history.' },
                { actor: 'human', text: 'Departing employee + manager prioritise.' },
                { actor: 'agent', text: 'Drafts knowledge documents from interviews / existing artefacts.' },
                { actor: 'human', text: 'Employee reviews drafts.' },
              ],
            },
            {
              name: 'IT deprovisioning',
              trigger: 'Last working hour',
              primaryAgent: 'Ops Agent',
              humanRole: 'IT team',
              steps: [
                { actor: 'agent', text: 'Schedules access revocation for the employee\'s last working hour, per role.' },
                { actor: 'gate', text: 'Final account closure NEVER autonomous — human IT confirms.' },
                { actor: 'human', text: 'IT executes deprovisioning.' },
                { actor: 'agent', text: 'Equipment return checklist generated; prepaid shipping if remote.' },
              ],
            },
            {
              name: 'Final payroll',
              trigger: 'Last day processed',
              primaryAgent: 'Finance Agent',
              humanRole: 'Finance approver + Head of People',
              steps: [
                { actor: 'agent', text: 'Computes final paycheck (PTO payout, severance, per-jurisdiction rules).' },
                { actor: 'gate', text: 'Action class: Financial — always queued for approval.' },
                { actor: 'human', text: 'Finance Approver + Head of People sign.' },
                { actor: 'agent', text: 'Initiates benefits termination; sends COBRA materials (US) or equivalent.' },
              ],
            },
            {
              name: 'Alumni entry',
              trigger: 'Offboarding complete',
              primaryAgent: 'HR Agent',
              humanRole: 'Former employee (opt-in)',
              steps: [
                { actor: 'human', text: 'Former employee opts in to alumni network.' },
                { actor: 'agent', text: 'Adds them to the alumni network with retained re-hire profile per data retention policy.' },
                { actor: 'agent', text: 'On future reference requests, routes per company policy (manager / HR / no-reference).' },
                { actor: 'gate', text: 'Reference-giving is governed; agents do not provide unvetted references.' },
              ],
            },
          ],
        },
      ],
    },
  };

  // ====== STATE =====================================================
  const state = {
    journey: 'customer',
    stageIdx: 0,
    workflowIdx: 0,
  };

  // ====== RENDERING =================================================
  function renderTimeline() {
    const tl = document.getElementById('timeline');
    const stages = DATA[state.journey].stages;
    tl.innerHTML = stages.map((s, i) => {
      const isActive = i === state.stageIdx;
      const arrow = i < stages.length - 1
        ? '<div class="wf-stage-arrow" aria-hidden="true">→</div>'
        : '';
      return `
        <div class="wf-stage">
          <button class="wf-stage-card ${isActive ? 'active' : ''}" data-idx="${i}" role="tab" aria-selected="${isActive}">
            <span class="wf-stage-num">STAGE ${s.num}</span>
            <span class="wf-stage-icon" aria-hidden="true">${s.icon}</span>
            <span class="wf-stage-name">${s.name}</span>
            <span class="wf-stage-count">${s.workflows.length} workflow${s.workflows.length === 1 ? '' : 's'}</span>
          </button>
          ${arrow}
        </div>
      `;
    }).join('');

    tl.querySelectorAll('.wf-stage-card').forEach(el => {
      el.addEventListener('click', () => {
        state.stageIdx = parseInt(el.dataset.idx, 10);
        state.workflowIdx = 0;
        renderAll();
        // scroll active stage into view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  }

  function renderStageHead() {
    const head = document.getElementById('stage-head');
    const s = DATA[state.journey].stages[state.stageIdx];
    head.innerHTML = `
      <div class="wf-stage-eyebrow">Stage ${s.num} · ${DATA[state.journey].title}</div>
      <h2 class="wf-stage-title">${s.name}</h2>
      <p class="wf-stage-description">${s.description}</p>
    `;
  }

  function renderWorkflowList() {
    const list = document.getElementById('workflow-list');
    const wfs = DATA[state.journey].stages[state.stageIdx].workflows;
    list.innerHTML = wfs.map((w, i) => {
      const isActive = i === state.workflowIdx;
      return `
        <button class="wf-wf-item ${isActive ? 'active' : ''}" data-idx="${i}" aria-pressed="${isActive}">
          <span class="wf-wf-item-num">${(i + 1).toString().padStart(2, '0')} · ${w.primaryAgent}</span>
          <span class="wf-wf-item-name">${w.name}</span>
        </button>
      `;
    }).join('');

    list.querySelectorAll('.wf-wf-item').forEach(el => {
      el.addEventListener('click', () => {
        state.workflowIdx = parseInt(el.dataset.idx, 10);
        renderWorkflowList();
        renderWorkflowDetail();
        // on mobile, scroll detail into view
        if (window.innerWidth < 900) {
          document.getElementById('workflow-detail')
            .scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function renderWorkflowDetail() {
    const detail = document.getElementById('workflow-detail');
    const w = DATA[state.journey].stages[state.stageIdx].workflows[state.workflowIdx];

    const actorIcons = {
      agent: '🤖',
      human: '👤',
      both: '🤖+👤',
      gate: '🛡',
    };
    const actorLabels = {
      agent: 'Agent acts',
      human: 'Human acts',
      both: 'Proposal + approval',
      gate: 'Platform gate',
    };

    const metaItems = [
      { label: 'Trigger', value: w.trigger },
      { label: 'Primary agent', value: w.primaryAgent },
      { label: 'Human role', value: w.humanRole },
    ];
    if (w.duration) metaItems.push({ label: 'Typical duration', value: w.duration });

    const stepsHtml = w.steps.map((step, i) => `
      <li class="wf-step">
        <div class="wf-step-marker" data-actor="${step.actor}" aria-hidden="true">
          ${actorIcons[step.actor]}
        </div>
        <div class="wf-step-body">
          <span class="wf-step-actor">${actorLabels[step.actor]} · step ${i + 1}</span>
          <div class="wf-step-text">${step.text}</div>
          ${step.note ? `<span class="wf-step-note">${step.note}</span>` : ''}
        </div>
      </li>
    `).join('');

    detail.innerHTML = `
      <header class="wf-wd-header">
        <h2 class="wf-wd-title">${w.name}</h2>
      </header>
      <div class="wf-wd-meta">
        ${metaItems.map(m => `
          <div class="wf-wd-meta-item">
            <span class="wf-wd-meta-label">${m.label}</span>
            <span class="wf-wd-meta-value">${m.value}</span>
          </div>
        `).join('')}
      </div>
      <h3 class="wf-steps-title">How it flows</h3>
      <ol class="wf-steps">${stepsHtml}</ol>
      ${w.phaseNote ? `
        <div class="wf-phase-note">
          <span class="wf-phase-note-label">Phase note</span>
          ${w.phaseNote}
        </div>
      ` : ''}
    `;
  }

  function renderAll() {
    renderTimeline();
    renderStageHead();
    renderWorkflowList();
    renderWorkflowDetail();
  }

  // ====== EVENT WIRING ==============================================
  function wireTabs() {
    document.querySelectorAll('.wf-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.wf-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        state.journey = tab.dataset.journey;
        state.stageIdx = 0;
        state.workflowIdx = 0;
        renderAll();
        // scroll to top of timeline
        document.querySelector('.wf-timeline-section')
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function wireKeyboard() {
    document.addEventListener('keydown', (e) => {
      const stages = DATA[state.journey].stages;
      const wfs = stages[state.stageIdx].workflows;
      // skip when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight' && e.shiftKey) {
        state.stageIdx = (state.stageIdx + 1) % stages.length;
        state.workflowIdx = 0;
        renderAll();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && e.shiftKey) {
        state.stageIdx = (state.stageIdx - 1 + stages.length) % stages.length;
        state.workflowIdx = 0;
        renderAll();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && !e.shiftKey) {
        if (state.workflowIdx < wfs.length - 1) {
          state.workflowIdx++;
          renderWorkflowList();
          renderWorkflowDetail();
          e.preventDefault();
        }
      } else if (e.key === 'ArrowUp' && !e.shiftKey) {
        if (state.workflowIdx > 0) {
          state.workflowIdx--;
          renderWorkflowList();
          renderWorkflowDetail();
          e.preventDefault();
        }
      }
    });
  }

  // ====== INIT ======================================================
  function init() {
    wireTabs();
    wireKeyboard();
    renderAll();
  }

  init();
})();
