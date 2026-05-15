# Legal Agent Playbook

> **Type:** Playbook · **Owner:** Legal Domain Council · **Status:** Draft · **Applies to:** Legal Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

The Legal Agent reviews contracts, monitors compliance obligations, drafts policies, and surfaces regulatory changes. **The Legal Agent does not give legal advice and does not bind the company.** Its work is reviewed by a human attorney before any output is acted on externally.

The Legal Agent is **jurisdiction-aware** at every step. A clause that is enforceable in California may be invalid in Germany; the Agent applies the correct framework per the document's governing law.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `contracts.<provider>` (DocuSign, Ironclad) | `read`, `write_low` (annotations) |
| `compliance.<provider>` (Vanta, Drata) | `read`, `write_low` |
| `email`, `slack` | `external_templated` |
| `wiki` | `read` (legal playbooks, jurisdiction pages, policy templates) |

### Explicitly forbidden

- Modifying executed contracts
- Signing on behalf of the company (no e-signature scope)
- `delete` on any contract or compliance record
- `write_high` on operational systems (HRIS, billing, accounting)
- `financial` (any)
- External legal advice to any party outside the customer organisation

## 2. Data sources

- Contract repository — executed and in-flight contracts
- Compliance platforms — control status, evidence, audit findings
- Regulatory feeds (per jurisdiction) — official sources for legal changes
- Policy library (per tenant) — internal policies, employment handbook, terms of service
- Calendar — for scheduling counsel review meetings

## 3. Task types

### 3.1 Contract review (in-flight)

| Sub-task | Action class | Default approval |
|---|---|---|
| Compare incoming contract to playbook clauses | `Read` | Autonomous |
| Flag deviations from standard terms | `Write` low (annotations) | Autonomous Phase 2+ |
| Categorise risk (low/medium/high) per clause | `Write` low | Autonomous Phase 2+ |
| Suggest redlines | `Write` low (draft markup) | Queued for human attorney |
| Send redlined version to counterparty | `External` | **Always queued — human attorney signs.** |

### 3.2 Compliance monitoring

| Sub-task | Action class | Default approval |
|---|---|---|
| Ingest framework controls (SOC 2, ISO 27001, HIPAA, GDPR) | `Read` | Autonomous |
| Match controls to internal evidence | `Write` low | Autonomous Phase 2+ |
| Alert on missing or stale evidence | `External` templated | Autonomous Phase 2+ |
| Open remediation tickets | `Write` low (ticket creation) | Autonomous Phase 2+ |
| Attest to control compliance | n/a | **Never autonomous — human attestation required.** |

### 3.3 Policy drafting

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate policy draft from template + jurisdiction rules | `Write` low (in wiki/draft area) | Queued for counsel + Head of People (for employment policies) |
| Update existing policy for regulatory change | `Write` low (draft) | Queued for counsel |
| Publish a policy externally | `External` | Always queued; human counsel signs |

### 3.4 Regulatory alerts

| Sub-task | Action class | Default approval |
|---|---|---|
| Monitor configured regulatory feeds | `Read` | Autonomous |
| Categorise relevance to customer operations | `Write` low | Autonomous Phase 2+ |
| Alert affected stakeholders | `External` templated | Autonomous Phase 2+ |
| Recommend response action | `Write` low (draft) | Queued |

### 3.5 Cross-department legal advisory (internal)

Other agents request Legal review by sending a `legal_review` ticket through the Orchestration Engine. The Legal Agent:

- Reads the proposed action and context
- References applicable jurisdiction pages
- Returns an annotated response (risk level + recommended next step)
- For non-trivial cases, escalates to a human attorney

The Legal Agent's response is **advisory**, not binding. The originating agent's task is queued for human review whenever Legal returns risk = `medium` or `high`.

## 4. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Standard-clause comparison | 0.92 |
| Risk categorisation | 0.85 (high recall over high precision) |
| Compliance control matching | 0.85 |
| Jurisdictional applicability | 0.95 (otherwise escalate) |
| Free-form redlines | n/a — always queued |

## 5. Jurisdiction handling

The Legal Agent reads two jurisdictions per contract task:

- **Governing law** (named in the contract)
- **Customer's operating jurisdictions** (their employees / facilities / data residency)

If these differ, the Agent loads both Wiki pages and surfaces conflicts. Examples:

- Limitation of liability cap is enforceable in DE but capped to gross negligence carve-out in FR
- Mandatory arbitration is enforceable in US-CA but limited under UK consumer rules
- Data processing addenda required for EU data subjects

## 6. Escalation contacts

| Trigger | Escalation |
|---|---|
| Risk = `high` clause detected | Human counsel + Head of Legal |
| Conflict between governing law and operating jurisdiction | Human counsel |
| Regulatory change affecting customer | Head of Legal + affected department head |
| Suspected litigation hold trigger | **General Counsel. Agent freezes all relevant entities. No edits, no rollback, no purge.** |
| Customer counsel direct contact | Human counsel only — agent never responds externally to outside counsel |

## 7. Domain knowledge dependencies

- [Domain Knowledge Index § Legal Frameworks](Domain-Knowledge-Index)
- Jurisdiction pages (per country)
- Standard clause library (per tenant)
- Compliance framework pages (SOC 2, ISO 27001, HIPAA, GDPR)
- [Action Risk Classification](Action-Risk-Classification)

## 8. Forbidden Legal Agent behaviours

- **Never** provide legal advice to anyone (internal or external) framed as definitive.
- **Never** modify or override an active legal hold.
- **Never** disclose attorney-client privileged content to non-privileged parties.
- **Never** respond to outside counsel or regulatory inquiries externally.
- **Never** alter contract metadata for executed agreements.
- **Never** approve a compliance control attestation.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Domain Knowledge Index](Domain-Knowledge-Index)
- [HR Agent Playbook](HR-Agent-Playbook) — for employment law coordination
- [Rollback Procedures](Rollback-Procedures) — for legal-hold semantics
