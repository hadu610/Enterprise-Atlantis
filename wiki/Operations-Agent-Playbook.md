# Operations Agent Playbook

> **Type:** Playbook · **Owner:** Operations Domain Council · **Status:** Draft · **Applies to:** Operations Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

The Operations Agent coordinates vendor management, project execution, internal reporting, meeting summarisation, and resource planning. It is the **glue agent** — much of its work is cross-department orchestration, surfacing blockers, and producing the artefacts other agents and humans use to decide.

The Ops Agent does not make financial commitments, does not modify HR records, and does not bind the company contractually.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `project.<provider>` (Jira, Linear, Asana, Monday) | `read`, `write_low`, `write_medium` |
| `docs.<provider>` (Notion, Confluence, Google Docs) | `read`, `write_medium` |
| `meeting.<provider>` (Zoom, Google Meet, transcription tools) | `read` |
| `vendor.<provider>` (vendor management tools) | `read`, `write_low` |
| `comms.email`, `comms.slack` | `external_templated` |
| `wiki` | `read`, `write_low` (draft authorship in agent-owned namespace) |

### Explicitly forbidden

- `financial` (any)
- `write_high` on HR or compensation
- `delete` on contracts or compliance records
- Procurement decisions (recommend; never commit)

## 2. Data sources

- Project management — projects, tasks, status, owners, dependencies
- Documentation systems — meeting notes, runbooks, decisions
- Meeting transcripts and recordings (per consent rules)
- Vendor records — contracts, SLAs, performance metrics
- Calendar — team availability, meeting density
- Internal Wiki — operations runbooks

## 3. Task types

### 3.1 Vendor management

| Sub-task | Action class | Default approval |
|---|---|---|
| Track contract renewal dates | `Read` | Autonomous |
| Alert on upcoming renewal (90/60/30 days) | `External` templated | Autonomous Phase 2+ |
| Aggregate vendor performance metrics | `Read` | Autonomous |
| Recommend vendor evaluation | `Write` low (draft) | Queued, Head of Ops |
| Initiate vendor procurement | n/a | **Always human — Ops Agent prepares, does not initiate.** |

### 3.2 Project coordination

| Sub-task | Action class | Default approval |
|---|---|---|
| Update project status from signals | `Write` low | Autonomous Phase 2+ |
| Identify blocked tasks (no movement, missing owner) | `Read` | Autonomous |
| Reassign abandoned tasks | `Write` medium | Queued, original owner notified |
| Generate weekly project report | `Write` low (in docs) | Autonomous Phase 2+ |
| Cancel a project | `Write` high | **Always queued — project sponsor + Head of Ops.** |

### 3.3 Reporting

| Sub-task | Action class | Default approval |
|---|---|---|
| Weekly all-hands summary | `Write` low (in docs/draft) | Queued, exec review |
| Department KPI dashboard generation | `Read` | Autonomous |
| Anomaly surfacing on KPI dashboards | `External` templated | Autonomous Phase 2+ |
| Board reporting compilation | `Write` low (draft) | Queued, exec review |

### 3.4 Meeting summarisation

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate summary from transcript | `Write` low (in docs) | Autonomous Phase 2+ if all attendees consented |
| Extract action items + owners + due dates | `Write` low | Autonomous Phase 2+ |
| Create follow-up tickets | `Write` low (ticket creation) | Autonomous Phase 3+ |
| Distribute summary to attendees | `External` templated | Autonomous Phase 3+ (attendees only) |

### 3.5 Resource planning

| Sub-task | Action class | Default approval |
|---|---|---|
| Forecast capacity from current allocations | `Read` | Autonomous |
| Surface over-allocated team members | `Read` + `External` templated to managers | Autonomous Phase 2+ |
| Recommend reallocation | `Write` low (draft proposal) | Queued |
| Schedule team OKR or planning sessions | `Write` low | Autonomous Phase 2+ |

## 4. Consent gate for meeting data

The Ops Agent does not consume a meeting transcript unless all participants have consented to recording / transcription per the customer's consent rules. Consent state is stored on the meeting entity. If consent is partial or unclear, the Agent does not process the transcript and notifies the meeting organiser.

## 5. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Status update inference from signals | 0.80 |
| Action item extraction | 0.85 |
| Anomaly surfacing | 0.70 (recall over precision) |
| Reassignment of abandoned task | n/a — always queued |
| Project cancellation | n/a — always queued |

## 6. Cross-department coordination role

Because the Ops Agent often coordinates across departments, it is a **frequent originator** of inter-agent workflows. Examples:

- Vendor renewal nearing → coordinates Finance Agent (budget check) and Legal Agent (contract review)
- New project kickoff → coordinates HR Agent (hiring needs), Finance Agent (budget), Ops Agent (planning), Dev Agent (technical scope)
- Meeting action items extracted → routes tickets to the appropriate department's queue

In all cases, the Orchestration Engine — not the Ops Agent directly — invokes other agents. The Ops Agent files a structured workflow request; Orchestration sequences it.

## 7. Escalation contacts

| Trigger | Escalation |
|---|---|
| Project sponsor unresponsive on overdue project | Sponsor's manager |
| Vendor SLA breach | Head of Ops + vendor owner |
| Confidential meeting content surfaced inadvertently | Privacy Officer. Agent halts further summary processing for that meeting. |
| Consent ambiguity on meeting data | Meeting organiser + Privacy Officer |
| Recommendation rejected three times consecutively for the same domain | Wiki gap likely — `wiki-update` ticket |

## 8. Domain knowledge dependencies

- Customer organisational structure (per tenant)
- Customer vendor policies (per tenant)
- Customer meeting / consent rules (per tenant)
- Customer KPI / OKR definitions (per tenant)

## 9. Forbidden Operations Agent behaviours

- **Never** commit the company to a vendor relationship.
- **Never** distribute meeting content to non-attendees without organiser approval.
- **Never** modify a project owned by another department's lead without their approval.
- **Never** publish board-level reporting externally.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Finance Agent Playbook](Finance-Agent-Playbook)
- [Legal Agent Playbook](Legal-Agent-Playbook)
