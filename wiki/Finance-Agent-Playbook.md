# Finance Agent Playbook

> **Type:** Playbook · **Owner:** Finance Domain Council · **Status:** Draft · **Applies to:** Finance Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This playbook defines the Finance Agent's scope and procedures. The Agent is **jurisdiction-aware** for tax and reporting (GAAP, IFRS, local equivalents). **Every `Financial` action requires human confirmation, in every autonomy phase. No exceptions.**

The Finance Agent never executes payments autonomously. It prepares, validates, and queues. A human Finance Approver clicks.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `accounting.<provider>` (QuickBooks, Xero, NetSuite) | `read`, `write_low`, `write_medium` |
| `expense.<provider>` (Expensify, Brex, Ramp) | `read`, `write_low`, `write_medium` |
| `billing.<provider>` (Stripe, Chargebee) | `read`, `write_medium` (drafting only) |
| `bank.<provider>` | `read` (transaction sync) |
| `comms.email` | `external_templated` |
| `wiki` | `read` (finance playbooks, accounting standards) |

### Explicitly forbidden

- `delete` on any financial record
- `financial` action **execution** — Finance Agent can *prepare* and *queue*; only humans *execute*
- `write_high` on HR or compensation entities
- Direct ACH / wire initiation — must always go through the bank's approval flow with a human signer

## 2. Data sources

- Accounting system — chart of accounts, ledger, journal entries, AR, AP
- Expense systems — submitted expenses, receipts, policy violations
- Billing system — invoices, subscriptions, payments, refunds, dunning state
- Bank — cleared transactions, statement balances
- HRIS — for payroll allocation (read-only)

## 3. Task types

### 3.1 Expense processing

| Sub-task | Action class | Default approval |
|---|---|---|
| Ingest new expense submissions | `Read` | Autonomous |
| Categorise expense per chart of accounts | `Write` low | Autonomous Phase 2+ |
| Match expense to project / cost centre | `Write` low | Autonomous Phase 2+ |
| Flag policy violations | `Write` low (tagging) + queued ticket to submitter's manager | Autonomous Phase 2+ |
| Approve reimbursement payout | `Financial` | **Always queued — human Finance Approver** |

### 3.2 Invoice management

| Sub-task | Action class | Default approval |
|---|---|---|
| Draft outbound invoice from contract data | `Write` medium (draft only) | Autonomous Phase 3+ |
| Send invoice to customer | `External` templated + `Write` medium | Queued for review, then human signs |
| Process inbound vendor invoice | `Read` + `Write` medium | Phase 3+ autonomous, with anomaly detection |
| Issue payment for vendor invoice | `Financial` | **Always queued — human Finance Approver** |

### 3.3 Financial reporting

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate monthly P&L / cash flow | `Read` | Autonomous |
| Reconcile bank to ledger | `Read` + `Write` low (matching) | Autonomous Phase 3+; queued on unmatched > tolerance |
| Draft board financial update | `Write` low (in wiki/draft area) | Queued for CFO review |
| File tax return | `External` + `Financial` | **Always queued — CFO + tax preparer** |

### 3.4 Budget monitoring

| Sub-task | Action class | Default approval |
|---|---|---|
| Monitor department spend vs budget | `Read` | Autonomous |
| Alert department head on threshold breach | `External` templated | Autonomous Phase 2+ |
| Recommend budget reallocation | — | Always queued; agent drafts, human decides |

## 4. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Expense categorisation | 0.85 |
| Bank reconciliation matching | 0.92 |
| Invoice generation | 0.92 |
| Anomaly flagging | 0.70 (high recall preferred over high precision) |
| GL coding for unfamiliar transaction | Never autonomous — queue with suggestions |

## 5. Jurisdiction handling

The Finance Agent loads:

- The customer's primary reporting standard (`GAAP` or `IFRS` or local equivalent)
- The applicable tax jurisdiction(s) per transaction (`tax_jurisdiction` field on Transaction)
- Sales tax / VAT rules for outbound invoices by customer location

If a jurisdiction page is missing for a non-trivial transaction, the agent does not categorise — it escalates to the Finance Domain Council.

## 6. Anomaly detection

The Finance Agent runs continuous anomaly checks. Default detectors:

- Duplicate expense submissions (same merchant, same amount, ≤ 48 hours apart)
- Round-number invoices to new vendors (potential fraud signal)
- Sudden spend velocity changes (department spending > 2σ above 90-day baseline)
- Mismatched currency for a known vendor
- Expense submitted from a geography inconsistent with the employee's recent travel

Detected anomalies create `high` priority tickets routed to the Finance Approver and the submitter's manager. The Agent does not auto-reject — humans decide.

## 7. Escalation contacts

| Trigger | Escalation |
|---|---|
| Confidence below threshold | Finance Approver per routing config |
| Jurisdiction / accounting standard ambiguity | Finance Domain Council |
| Anomaly above auto-flag threshold | Finance Approver + submitter's manager |
| Suspected fraud | **CFO + Legal. Agent freezes further actions on involved entities pending review.** |
| Reconciliation breach > tolerance | Controller / Head of Finance |

## 8. Domain knowledge dependencies

- [Domain Knowledge Index § Accounting Standards](Domain-Knowledge-Index)
- Customer chart-of-accounts mapping page (per tenant)
- Customer expense policy page (per tenant)
- Tax jurisdiction reference pages (per country)

## 9. Forbidden Finance Agent behaviours

- **Never** initiate an outbound payment without an explicit human approval per action.
- **Never** modify a closed accounting period.
- **Never** override a duplicate-detection flag autonomously.
- **Never** disclose financial data to entities outside the customer's authorised viewer list.
- **Never** draft financial communications that make forward-looking statements without human approval.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Unified Entity Model § Transaction](Unified-Entity-Model#transaction)
- [Domain Knowledge Index](Domain-Knowledge-Index)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Rollback Procedures](Rollback-Procedures)
