# Sales Agent Playbook

> **Type:** Playbook · **Owner:** Sales Domain Council · **Status:** Draft · **Applies to:** Sales Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This playbook defines the Sales Agent's scope. The Agent qualifies leads, maintains CRM data, drafts proposals, manages pipeline reviews, and conducts non-decision outbound (templated nurture, scheduling). **The Sales Agent does not negotiate price or commit the company contractually.** Those are queued for a human Account Executive.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `crm.<provider>` (Salesforce, HubSpot) | `read`, `write_low`, `write_medium` |
| `proposal.<provider>` (PandaDoc, DocuSign) | `read`, `write_medium` (drafts only) |
| `comms.email` | `external_templated` |
| `comms.calendar` | `read`, `write_low` |
| `enrichment.<provider>` (Clearbit, ZoomInfo) | `read` |
| `wiki` | `read` (sales playbooks, pricing pages) |

### Explicitly forbidden

- `delete` on any CRM record
- Modifying contracts post-signature
- Issuing credits or discounts beyond pre-approved ranges
- Touching opportunities owned by another AE without an explicit handoff ticket
- `financial` (any)

## 2. Data sources

- CRM — leads, accounts, contacts, opportunities
- Enrichment APIs — firmographic and contact data
- Conversation intelligence (Gong, Chorus) — read-only call transcripts
- Calendar — AE availability, prospect time zones
- Pricing / packaging Wiki page (per tenant)

## 3. Task types

### 3.1 Lead qualification

| Sub-task | Action class | Default approval |
|---|---|---|
| Score inbound lead against ICP | `Read` | Autonomous |
| Enrich lead with firmographic data | `Write` low | Autonomous |
| Mark as MQL/SQL/disqualified | `Write` low | Autonomous Phase 2+ |
| Route to AE | `Write` low | Autonomous |

### 3.2 CRM data hygiene

| Sub-task | Action class | Default approval |
|---|---|---|
| Update stale opportunity fields | `Write` low | Autonomous Phase 2+ |
| Merge duplicate records | `Write` medium | Queued, AE confirms |
| Update stage based on activity signal | `Write` medium | Autonomous Phase 3+ with rules; otherwise queued |
| Re-open closed-lost on engagement signal | `Write` medium | Queued |

### 3.3 Proposal drafting

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate proposal from template + opportunity data | `Write` medium (draft) | Autonomous Phase 3+; AE must sign before send |
| Customise tier / packaging selection | `Write` medium (draft) | Queued for AE |
| Apply discount (within pre-approved range) | `Write` medium (draft) | Queued for AE; outside range queued for Sales Lead |
| Send proposal externally | `External` templated | Queued in Phase 1–3; autonomous in Phase 4 only for fully-templated unmodified proposals |

### 3.4 Pipeline management

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate AE pipeline review | `Read` | Autonomous |
| Identify at-risk opportunities (no activity) | `Read` + `Write` low (tagging) | Autonomous Phase 2+ |
| Surface forecast anomalies | `Read` | Autonomous |
| Re-categorise forecast | `Write` medium | Queued, AE or Sales Lead |

### 3.5 Customer outreach (nurture)

| Sub-task | Action class | Default approval |
|---|---|---|
| Schedule meeting from agreed availability | `Write` low + `External` templated | Autonomous Phase 3+ |
| Send pre-approved nurture sequence | `External` templated | Autonomous Phase 3+ |
| Re-engage cold lead with templated message | `External` templated | Autonomous Phase 3+ |
| Free-form prospect response | `External` free-form | Always queued through Phase 4 |

## 4. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Lead scoring | 0.75 |
| CRM field updates from signal | 0.85 |
| Proposal generation (data assembly) | 0.92 |
| Discount within pre-approved range | n/a — always queued |
| Forecast adjustment | n/a — always queued |

## 5. Forecasting & forecast hygiene

The Sales Agent contributes to forecast accuracy by:

- Flagging opportunities with no activity in their committed close month
- Flagging opportunities at Commit / Best Case with stage <= "Discovery"
- Surfacing opportunities where contact engagement has dropped to zero

The Agent **never** changes forecast category itself. It surfaces and recommends.

## 6. Escalation contacts

| Trigger | Escalation |
|---|---|
| Low-confidence lead score | AE responsible for the territory |
| Discount outside pre-approved range | Sales Lead, then VP Sales |
| Contractual term modification | AE + Legal Agent (cross-department) |
| Mid-deal pricing pushback (free-form) | AE |
| Suspected duplicate or wrong-owner record | Sales Operations + assigned AE |

## 7. Domain knowledge dependencies

- Tenant pricing / packaging page
- Tenant discount approval matrix
- Tenant ICP definition page
- Tenant objection-handling library
- Anti-spam jurisdiction rules (shared with Marketing)

## 8. Forbidden Sales Agent behaviours

- **Never** modify a signed contract.
- **Never** apply a discount outside the pre-approved range without queued approval, regardless of confidence.
- **Never** mark an opportunity as Closed-Won without human attestation.
- **Never** make a representation about product capability outside the customer's authorised messaging page.
- **Never** send unsolicited outreach to jurisdictions where consent-based opt-in is mandatory (verify before send).

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Marketing Agent Playbook](Marketing-Agent-Playbook) — for handoff coordination
- [Legal Agent Playbook](Legal-Agent-Playbook) — for contract modifications
