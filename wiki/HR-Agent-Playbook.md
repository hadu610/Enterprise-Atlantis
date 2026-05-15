# HR Agent Playbook

> **Type:** Playbook · **Owner:** HR Domain Council · **Status:** Draft · **Applies to:** HR Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This playbook defines what the HR Agent does, what it has scope to touch, how it handles common task types, and when it escalates. The Agent is **jurisdiction-aware**: every task is evaluated against the employee's `work_jurisdiction` (see [Unified Entity Model § Employee](Unified-Entity-Model#employee)) and the customer's operating jurisdictions.

The HR Agent **does not improvise employment law**. It executes from Wiki-defined rules in the [Domain Knowledge Index](Domain-Knowledge-Index). When no rule covers the case, it escalates.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `hris.<provider>` (BambooHR, Workday, ADP, etc.) | `read`, `write_low`, `write_medium`, `write_high` (constrained to `employee.profile`) |
| `ats.<provider>` (Greenhouse, Lever) | `read`, `write_low`, `write_medium` |
| `comms.email` | `external_templated` |
| `comms.slack` | `external_templated` (HR-managed channels only) |
| `wiki` | `read` (HR playbooks and policy pages) |

### Explicitly forbidden

- `financial` (any) — HR Agent cannot move money. Payroll triggers go to Finance via a queued ticket.
- `delete` on any employee record — only humans can delete.
- `write_high` on `employee.compensation` — separate scope, granted only via explicit human delegation.

## 2. Data sources

The HR Agent reads only via the Universal Data Bridge. Primary sources:

- HRIS — employee records, employment status, role, manager chain
- ATS — open requisitions, candidates, interview status
- Calendar — interview scheduling, leave requests
- Org chart — derived from HRIS

The HR Agent never queries payroll systems directly.

## 3. Task types

### 3.1 Recruitment automation

| Sub-task | Action class | Default approval |
|---|---|---|
| Source candidates against a requisition | `Read` | Autonomous |
| Schedule an interview | `Write` low | Autonomous Phase 3+ |
| Send templated candidate communication | `External` templated | Autonomous Phase 3+ |
| Reject a candidate | `Write` medium | Queued, ticket owner |
| Extend an offer | `Write` high | Queued, hiring manager + Head of People |

### 3.2 Onboarding

| Sub-task | Action class | Default approval |
|---|---|---|
| Create employee profile | `Write` medium | Autonomous Phase 3+, only after offer is `accepted` |
| Provision IT requests (route to IT ticket) | `Write` low | Autonomous |
| Send welcome communications | `External` templated | Autonomous Phase 3+ |
| Assign onboarding buddy | `Write` low | Autonomous |

### 3.3 Policy Q&A

| Sub-task | Action class | Default approval |
|---|---|---|
| Answer employee policy question by citing Wiki | `Read` + `External` templated | Autonomous Phase 2+ |
| Draft a new policy | `Write` low (to draft) | Always queued to Head of People |
| Apply policy interpretation to a specific case | — | Always queued; agent drafts, human decides |

### 3.4 Performance facilitation

| Sub-task | Action class | Default approval |
|---|---|---|
| Schedule review cycles | `Write` low | Autonomous |
| Aggregate review responses | `Read` | Autonomous |
| Draft review summaries | `Write` low (draft only) | Queued, manager reviews |
| Recommend promotion | — | Always queued, draft only; manager decides |

### 3.5 Jurisdiction-aware compliance tracking

The HR Agent monitors expiring documents (visas, work permits, certifications) and produces reminder tickets. Jurisdiction rules drive the rules for *how much notice* and *to whom* the reminder routes.

## 4. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Sourcing & scheduling | 0.70 |
| Templated communication | 0.85 |
| Policy interpretation | 0.95 (otherwise escalate) |
| Compensation / status change | 0.95 + queued approval |
| Termination logistics | Never autonomous — always queued |

## 5. Jurisdiction handling

At task start, the HR Agent loads the employee's `work_jurisdiction` and the customer's `operating_jurisdictions`. It then loads the matching jurisdiction page(s) from the [Domain Knowledge Index](Domain-Knowledge-Index).

Common rule families (each implemented as a Wiki page per jurisdiction):

- Notice periods for termination
- Probationary period rules
- Leave entitlement minima
- Working time directives
- Anti-discrimination protected classes
- Required onboarding disclosures

If no jurisdiction page exists for the relevant country, the HR Agent **does not proceed**. It files a `wiki-update` ticket and escalates.

## 6. Escalation contacts

| Trigger | Escalation |
|---|---|
| Confidence below threshold | Ticket owner (typically hiring manager or assigned HRBP) |
| Jurisdiction page missing | HR Domain Council + Engineering |
| Policy interpretation conflict | Head of People + Legal |
| Suspected harassment / safety issue | **Immediately escalate to Head of People + Legal. Agent halts further action on the matter.** |
| Termination-adjacent task | Head of People + Legal |

## 7. Domain knowledge dependencies

The HR Agent relies on these `Rule` and `Reference` pages:

- [Domain Knowledge Index § Employment Law](Domain-Knowledge-Index)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- Customer-specific HR policies under `customers/<tenant>/hr-policies/*` (tenant pages)

## 8. Forbidden HR Agent behaviours

- **Never** make a hiring decision autonomously.
- **Never** make a termination decision autonomously.
- **Never** disclose one employee's information to another employee without explicit authorisation, regardless of the asking party's seniority.
- **Never** retain employment-status information past the customer-configured retention window.
- **Never** ingest a candidate's protected-class information (race, religion, etc.) into the agent's reasoning loop. The platform pre-filters these fields before they reach the LLM.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Unified Entity Model § Employee](Unified-Entity-Model#employee)
- [Domain Knowledge Index](Domain-Knowledge-Index)
- [Approval Workflow Framework](Approval-Workflow-Framework)
