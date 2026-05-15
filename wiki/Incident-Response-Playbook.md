# Incident Response Playbook

> **Type:** Playbook · **Owner:** Security · **Status:** Approved · **Applies to:** All humans (on-call) · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This is the step-by-step playbook for responding to any incident — production outage, data exposure, agent safety failure, or supply-chain compromise. It expands the framework in [Security and Data Policy § 13](Security-and-Data-Policy#13-incident-response) into the actual movements an on-call engineer makes.

The principle: **contain before you fix; communicate before you finish.** A handled-well Sev1 builds customer trust; a mishandled one destroys quarters of compounding.

---

## 1. Severity definitions

| Sev | Definition | First response |
|---|---|---|
| **Sev1** | Production outage affecting > 25% of tenants, OR confirmed data exposure, OR agent took an unauthorised destructive action in production | Page on-call + exec; all-hands until contained |
| **Sev2** | Production outage affecting < 25% tenants, OR major degradation (SLO burn > 25% of budget in 1h), OR Trust Score anomaly across multiple agents | Page on-call; war room within 30 min |
| **Sev3** | Limited customer impact; workaround exists; or single-tenant issue | Business-hours response, ticket-tracked |
| **Sev4** | Internal-only; no customer impact | Normal triage |

If severity is unclear, **err high**. It is far cheaper to step down a Sev1 than to discover three hours in that you should have escalated.

## 2. Roles during an incident

Activated for Sev1 and Sev2 only.

| Role | Who | Responsibility |
|---|---|---|
| **Incident Commander (IC)** | On-call primary | Owns the response; makes containment decisions; speaks externally |
| **Communications Lead** | Customer Success on-call (Phase 2+) / IC (Phase 1) | Drafts customer comms, status page updates, internal updates |
| **Scribe** | Anyone in the war room | Captures the timeline (this becomes the postmortem) |
| **Subject Matter Experts (SMEs)** | Pulled by IC | Engineers / Security / Legal as needed |
| **Exec Sponsor** | CTO or CEO | Decision authority for legal/regulatory escalation, customer notification beyond SLA |

The IC is not the most senior person — the IC is the person running the response. An exec joining a war room defers to the IC unless they explicitly take over the role.

## 3. The six-step process

### Step 1 — Detect

Sources: alert page, customer report, internal observation, security disclosure, regulator inquiry.

On detection, the on-call engineer:

1. Acknowledges the page within 5 minutes (Sev1/2).
2. Opens an **incident channel** (`#inc-<YYYYMMDD>-<short-name>`).
3. Posts initial signal: *"Investigating <symptom>. Current scope unknown. Status: triage."*

### Step 2 — Triage (first 15 minutes)

Goals: assess severity, identify scope, decide if it's a real incident.

Triage checklist:

- What are we seeing? (symptoms, affected services)
- Who is affected? (tenants, percentage, geographic)
- When did it start? (correlate with recent deploys, dependency changes)
- Is it getting worse? (rate of change)
- What is the working hypothesis? (cause to investigate first)

Output: severity classification declared in channel. If Sev1 or Sev2, war room is opened.

### Step 3 — Contain (next 30 minutes)

Goal: **stop the bleed**, even before root cause is understood.

Containment options, in preferred order:

1. **Roll back the recent deploy** (if correlation is plausible). ArgoCD rollback < 5 min.
2. **Flip a feature flag** to disable the affected functionality.
3. **Scale up / shed load** if saturation-driven.
4. **Failover to backup region** if the entire region is impaired.
5. **Isolate the affected tenant** if blast radius is single-tenant and bleeding to others.
6. **Disable the affected agent** if an AI safety incident — set the agent to Phase 1 (Drafting) in the customer config.

Containment may not fix the problem. That is fine. Containment buys time to fix.

### Step 4 — Communicate (within 1 hour of Sev1/Sev2 declaration)

Customer communication is **mandatory** at the SLA below. The Comms Lead drafts; the IC approves.

| Sev | Initial notification SLA | Update cadence |
|---|---|---|
| Sev1 | 1 hour | Every 60 min until resolved |
| Sev2 | 4 hours | Every 4 hours |
| Sev3 | 24 hours (or next business day) | Daily |
| Sev4 | Not required | N/A |

Communication channels:

- **Status page** — `https://status.atlantis.os/` (set up Day 1)
- **Email** to affected tenants' admin contacts
- **In-app banner** for the customer console
- **Direct outreach** to top-tier accounts via CSM (Sev1)

### Step 5 — Remediate

After containment, work the root cause.

- The IC may hand off to a remediation owner once containment is stable.
- Root-cause fix follows the standard PR process — **no shortcuts**. A bypassed CI is a future incident.
- Fix is verified in staging before production promotion (unless the incident is itself the absence of staging signal, in which case a P0 hotfix path is invoked).

The incident is not "resolved" until:

- Containment is reverted (the platform is back to normal posture, not just degraded-but-stable)
- Customer-facing SLO has recovered
- Comms lead has posted the final update

### Step 6 — Postmortem

Mandatory within **14 days** for Sev1 and Sev2.

Postmortem format:

```
# Incident: <short title>
- Date: YYYY-MM-DD
- Severity: Sev1 | Sev2
- Duration: HH:MM impact
- Affected: <tenants / users / data scope>

## Summary
One paragraph.

## Impact
What customers saw, for how long.

## Timeline
- HH:MM — first signal
- HH:MM — page acknowledged
- HH:MM — severity declared
- HH:MM — containment applied
- HH:MM — root cause hypothesised
- HH:MM — fix deployed
- HH:MM — resolved

## Root cause
The actual cause, not a symptom.

## Contributing factors
What made it harder to detect / contain / fix.

## What went well
Capture the practices to keep.

## Action items
- [ ] <owner> <description> — due YYYY-MM-DD
```

Postmortems are **blameless**. Focus on systems, not people. Sev1 postmortems with customer impact are published to affected customers within 30 days.

## 4. Communication templates

### Sev1 initial (status page + email)

> We're investigating an issue affecting [service / functionality]. We declared this a Sev1 at [time]. Our team is actively working on it. We will post the next update within 60 minutes.
> 
> If you are seeing [symptom], the working guidance is: [workaround, if any].
> 
> Atlantis incident reference: INC-YYYYMMDD-XXXX.

### Sev1 update

> Update [N] at [time]:
> 
> **Status:** [investigating / containment applied / remediation in progress / monitoring recovery]
> 
> **What we know:** [one paragraph in plain English]
> 
> **What we're doing:** [one paragraph]
> 
> **Next update:** [time]

### Sev1 resolution

> The incident affecting [service] has been resolved as of [time]. Total impact duration: [X hours Y minutes].
> 
> [One sentence: what the issue was, in plain English.]
> 
> We will publish a full postmortem to affected customers within 30 days. If you need information specific to your account in the meantime, please contact your Customer Success Manager or reply to this email.

### Customer-direct (CSM to top accounts)

Use the SaaS-standard "We're sorry / what happened / what we did / what we're doing" four-paragraph structure. Tone is direct and honest, not defensive.

## 5. Regulatory notification

Some incidents trigger statutory notification windows:

| Regulation | Trigger | Notification window |
|---|---|---|
| GDPR (Art. 33/34) | Personal data breach with risk to data subjects | **72 hours** to supervisory authority; without undue delay to data subjects if high risk |
| CCPA | Breach of unencrypted personal information | "Most expedient time possible" |
| HIPAA Breach Notification Rule | Unsecured PHI breach | **60 days** to affected individuals; HHS for ≥500 affected |
| State breach laws (US) | Varies by state | Varies by state |
| Customer contractual notification | Per MSA | Per contract — typically 24–72 hours |

The **Comms Lead works with Legal Counsel** on any incident that may involve personal data. **Default assumption: legal counsel reviews customer comms before send if data is involved.** Speed is bounded by accuracy on these messages.

## 6. Incident classes — quick reference

### Outage (no data exposure)

- Containment: rollback, flag, scale, failover
- Comms SLA per severity table
- No regulatory notification

### Data exposure (confirmed or suspected)

- **Immediately involve Legal + CTO/CISO.**
- Preserve evidence — do not "fix and forget"; the forensic trail is required.
- Scope determination: what data, how many subjects, who accessed.
- Customer notification + regulator notification per § 5.

### AI safety incident (agent took unauthorised destructive action)

- **Immediately disable the offending agent** across all tenants if the failure is systemic; per-tenant if isolated.
- Snapshot full agent action chain (Wiki pages loaded, tool calls made, gates evaluated).
- Customer notification: 1 hour for any affected tenant.
- Root cause investigation includes the AI Eval suite — what eval should have caught this?

### Supply-chain compromise (dependency, container image, third-party service)

- Containment: pin to last-known-good version; scope blast radius via SBOM.
- If a third-party service is compromised, treat their incident as our incident for any tenant whose data flowed through them.
- Coordinate disclosure with the affected vendor.

### Insider incident

- **Do not investigate internally.** Engage Legal Counsel and (depending on jurisdiction) external investigators.
- Revoke access immediately; preserve evidence.
- This playbook defers to a separate confidential workflow once engaged.

## 7. War room norms

- One channel, one war room, one IC. No parallel coordination — confusion compounds.
- Status updates posted every 15 minutes during active Sev1, even if "no change."
- New joiners are pinged the channel pin: current status + working hypothesis. They do not ask "what's going on?" — they read the pin.
- Decisions are recorded in the channel before action ("Going to roll back deploy 92ef. Concur?"). The Scribe captures these timestamps.
- Speculation is labelled ("hypothesis: ...", not "X is broken"). Premature certainty has caused more incidents than it has solved.

## 8. Forbidden

- "We'll fix the postmortem later." Postmortem within 14 days, period.
- Customer notification that does not pass Legal review on data-involving incidents.
- Containment that introduces a new risk class without IC sign-off.
- Rolling forward to fix when rollback was available and not yet attempted.
- Ending an incident without a posted "resolved" comms update.
- Hiding the incident from internal teams — every incident is a learning opportunity, internally transparent.

---

## When to revisit

- A Sev1 occurs that the runbook did not adequately cover — playbook gap.
- Regulatory landscape changes the notification windows.
- Mean Time To Resolve (MTTR) trends up across two quarters.
- The on-call team reports the playbook is hard to follow under stress — usability matters.

CISO and CTO are accountable owners.

---

## Cross-references

- [Security and Data Policy](Security-and-Data-Policy)
- [Observability Standards](Observability-Standards)
- [Rollback Procedures](Rollback-Procedures)
- [Action Risk Classification](Action-Risk-Classification)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering)
