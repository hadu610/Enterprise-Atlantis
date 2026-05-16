# Unified CRM Blueprint

> **Type:** Blueprint · **Owner:** Engineering / CTO · **Status:** Approved · **Applies to:** All agents · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-16

## Summary

The **Unified CRM** is one of the two foundational substrates of Atlantis (the other is the [Unified Ticketing System](Unified-Ticketing-Blueprint)). It is **the single store for every entity in the customer's business** — customers, employees, vendors, partners, leads, deals, contracts, transactions, projects, and the relationships between them.

Every department agent and the Dev Agent reads from, and proposes writes to, this one substrate. There is no "Sales CRM" separate from an "HR system" separate from an "ERP" separate from a "vendor database." There is one schema, one canonical record per entity, one audit trail, one access-control model.

This is **structurally different from every existing enterprise** today. Most companies operate on three to ten disconnected systems of record:

| Today (fragmented) | Atlantis (unified) |
|---|---|
| Salesforce / HubSpot — customers, leads, deals | One Customer / Lead / Deal store |
| BambooHR / Workday — employees | Same store, Employee entity |
| QuickBooks / NetSuite — transactions, vendors | Same store, Transaction / Organisation:vendor |
| Zendesk — support contacts | Same store, Person:customer_contact + Ticket |
| Jira / Linear — projects | Same store, Project |
| Coupa / Ironclad — contracts, procurement | Same store, Contract / Transaction |

The fragmentation in the left column is **not a design choice** — it is the accident of every vendor selling a single point solution. Because Atlantis owns the agent runtime across every department, we collapse it. **One CRM that knows everyone the business knows; one history of everything the business has done with them.**

> **This page is the blueprint.** The wire-level schema for each entity lives in [Unified Entity Model](Unified-Entity-Model). This page defines *what the CRM is, why it must be unified, how each department uses it, and what we never allow it to become.*

---

## 1. What "CRM" means in Atlantis

Conventional usage: "CRM" = Customer Relationship Management = a tool the Sales and Marketing teams use to track leads and deals.

Atlantis usage: **CRM = the customer's full business graph.** Customers are one node type among many. Employees are nodes. Vendors are nodes. Transactions are edges with money attached. Tickets are edges with work attached. Contracts are edges with legal force attached.

Two implications:

- **Every department writes to the CRM.** HR creates Employee nodes. Finance creates Transaction edges. Legal attaches Contract edges. Operations attaches Project edges. Sales attaches Lead → Customer edges. Marketing attaches Campaign edges. The Dev Agent attaches Feature edges. **None of them have a separate database.**
- **Every department reads the CRM.** When the Sales Agent drafts a renewal email, it reads the Customer node, the open Tickets edge (support history), the Contract edge (renewal terms), the Transaction history (payment record), the Person edge (the contact's role and tenure). All from the same store. No joins across vendor APIs.

The page [Unified Entity Model](Unified-Entity-Model) names the entities. This page is why they have to be in one place.

---

## 2. Why this is one of a kind

No SaaS company has built this because none of them owns the agent runtime across every department. The economics force them into narrow lanes:

- **Salesforce** tried to absorb HR (Work.com), then divested — the HR schema is too distant from CRM. Their answer is "integrate via APIs."
- **Workday** tried to absorb procurement and FP&A — their CRM coverage remains thin. Their answer is "integrate via APIs."
- **Microsoft Dynamics** ships a CRM and an ERP that mostly talk to each other — but Marketing, Customer Support, Code, Legal, and Vendor Risk live in seven other Microsoft products with seven other databases.
- **ServiceNow** ships ticketing and workflow with an underlying CMDB — but the CMDB is for IT assets, not for customers, employees, or transactions.

Each vendor solves one column of the table above. Atlantis solves all of them — and only because **the agent runtime is ours**, the canonical data has to be ours too. **If the same Customer record is read by the Sales Agent, the Finance Agent, and the Legal Agent in a single workflow, it cannot live in three different vendors.** It has to live in our store.

This is also why we are not just "a better Salesforce" or "a better Workday." We are a substrate the existing single-domain CRMs become connectors *into*, via the [Universal Data Bridge](Product-Requirements). They remain authoritative for their own niche (you keep using Salesforce as your sales rep's UI); our CRM holds the **agent-readable canonical view** that every Atlantis agent operates on.

---

## 3. The entity inventory (what is in the CRM)

Eight first-class entity kinds. Schema and field lists live in [Unified Entity Model](Unified-Entity-Model); this section defines **what each entity represents at the platform level**, **who writes it**, and **who depends on it**.

### 3.1 Person

Every human the platform knows about. `kind` distinguishes `employee`, `customer`, `lead`, `vendor_contact`, `other`.

- **Writers:** HR Agent (employees), Sales Agent (leads, customer contacts), Operations Agent (vendor contacts), Marketing Agent (lead enrichment), AI Business Consultant (during onboarding).
- **Readers:** Every agent. Person identity is the universal anchor.
- **Identity rule:** A single human is **one Person record**, even if they show up in five source systems. The Universal Data Bridge resolves identity at ingest time (email match, name+org match, manual merge queue).

### 3.2 Employee (extension of Person)

Employment-specific fields. Compensation is a **separate restricted entity** that requires a scope no department agent except HR holds.

- **Writers:** HR Agent only.
- **Readers:** All agents (read-only). Finance reads for payroll. Legal reads for jurisdiction. Operations reads for project staffing.

### 3.3 Organisation

Every external organisation the business interacts with. `kind` distinguishes `customer`, `prospect`, `vendor`, `partner`, `other`.

- **Writers:** Sales Agent (customers, prospects), Operations Agent (vendors, partners), Marketing Agent (prospect enrichment).
- **Readers:** Every agent.

### 3.4 Customer (specialisation of Organisation, kind = `customer`)

The customer's customers. Adds account ownership, lifecycle stage, contract dates, ARR.

- **Writers:** Sales Agent (lifecycle, ARR), Operations Agent (account owner), AI Business Consultant (during onboarding for B2B customers).
- **Readers:** Every agent.

### 3.5 Lead (specialisation of Person, kind = `lead`)

A Person who is not yet a customer.

- **Writers:** Sales Agent, Marketing Agent.
- **Readers:** Sales, Marketing.

### 3.6 Project

Any unit of work tracked across systems — engineering project, marketing campaign, audit, customer implementation.

- **Writers:** Operations Agent, Dev Agent (engineering projects), Marketing Agent (campaigns), Sales Agent (customer implementations).
- **Readers:** Every agent.

### 3.7 Transaction

Any financial movement — invoice, payment, refund, expense, journal entry.

- **Writers:** Finance Agent only.
- **Readers:** Sales (ARR computation), Operations (vendor spend), Legal (contract performance), Marketing (campaign ROI).

### 3.8 Contract *(see § 4 — new entity to be added to [Unified Entity Model](Unified-Entity-Model))*

Any legally binding document — customer contract, vendor contract, employment offer, NDA, MSA, SOW.

- **Writers:** Legal Agent (drafting), Sales Agent (customer contracts via Legal review), HR Agent (employment contracts via Legal review).
- **Readers:** Every agent. Renewals depend on it, payroll depends on it, vendor management depends on it.

### Entity-kind extension policy

New first-class entity kinds (above) require a [Wiki Governance § 8](Wiki-Governance) decision and a schema migration. **Tenant-extensible attributes** (custom fields on existing entities) are added per-tenant via a side-table pattern that does not require schema migration — see [Architecture Principles § 9](Architecture-Principles) for the multi-tenancy contract.

---

## 4. Departmental ownership matrix

Who can read, propose-write, and propose-delete each entity kind. Enforced at the API gateway via [Action Risk Classification](Action-Risk-Classification) scopes; this table is the authoritative source.

| Entity | HR | Finance | Sales | Marketing | Legal | Operations | Dev |
|---|---|---|---|---|---|---|---|
| **Person** (employee) | R/W | R | — | — | R | R | — |
| **Person** (customer/lead) | — | R | R/W | R/W | R | R | — |
| **Person** (vendor) | — | R | — | — | R | R/W | — |
| **Employee** | R/W | R | — | — | R | R | — |
| **Compensation** *(restricted)* | R/W | R (aggregate only) | — | — | R (audit only) | — | — |
| **Organisation** | — | R | R/W (customer/prospect) | R/W (prospect) | R | R/W (vendor/partner) | — |
| **Customer** | — | R | R/W | R | R | R | — |
| **Lead** | — | — | R/W | R/W | — | — | — |
| **Project** | — | R | R/W (customer impl) | R/W (campaign) | R | R/W | R/W (engineering) |
| **Transaction** | R (own payroll) | R/W | R (ARR) | R (campaign ROI) | R (contract perf) | R (vendor spend) | — |
| **Contract** | R (employment) | R | R (customer) | — | R/W | R (vendor) | — |
| **Audit Event** | R | R | R | R | R | R | R |

Legend: `R` = read; `R/W` = read + propose-write; `—` = no scope. **No agent has a direct `Delete` scope** — deletes go through the [Approval Workflow Framework](Approval-Workflow-Framework) with human confirmation, per [Action Risk Classification](Action-Risk-Classification).

The matrix is also the **prevention list for forbidden combinations** ([Action Risk Classification § Forbidden combinations](Action-Risk-Classification#forbidden-combinations)): Marketing cannot touch HR; Sales cannot delete; Dev has no read scope on HR / Finance / Legal entities.

---

## 5. How data gets in (write paths)

Three write paths into the Unified CRM, all enforced at the API gateway:

### 5.1 Agent-proposed writes

The dominant path. Agents reason, validate, and propose. The [Action Executor](Cross-Agent-Coordination#3-the-action-executor) writes. Every mutation:

1. Passes [validation gates](Validation-Gate-Specifications) — schema, business logic, confidence, contradiction.
2. Enters the entity-keyed action queue with `expected_entity_version` (OCC).
3. Snapshots the pre-state for [Rollback Procedures](Rollback-Procedures).
4. Commits inside a database transaction.
5. Emits a state-change event on the event bus.
6. Appends to the immutable [Audit Event](Unified-Entity-Model#audit-event) log.

See [Cross-Agent Coordination](Cross-Agent-Coordination) for the full sequence, including saga compensation for multi-entity workflows and lease-based exclusion for long-running operations.

### 5.2 Universal Data Bridge sync (external sources)

When the customer connects an external system (Salesforce, BambooHR, QuickBooks, GitHub, etc.), the [Universal Data Bridge](Product-Requirements) maintains live sync into the Unified CRM:

- **Pull on schedule + push on webhook** for systems that support webhooks; pull-only for those that don't.
- **Identity resolution at ingest.** Incoming records are matched against existing Person / Organisation records by email + domain + canonical-name heuristics. Ambiguous matches enter a human merge queue rather than auto-merging.
- **External refs preserved.** Every entity in the Unified CRM carries `external_refs: {salesforce: "00x...", bamboohr: "1234"}` so we can write back to the source system when appropriate.
- **Data quality scoring.** Each source is scored on completeness, freshness, and consistency. Agents see the quality score of their context and adjust confidence accordingly (this is the B3 solution).
- **Source-of-truth designation.** Per tenant and per field, one external system is designated authoritative. If Salesforce is the authoritative source for `Customer.arr_cents`, an agent proposing a different value triggers a conflict-resolution workflow, not a silent overwrite.

### 5.3 Human-initiated writes (console + API)

Customers can write directly via the Atlantis console or REST API:

- A finance manager corrects a `Transaction.gl_account` from the console.
- An admin imports a list of vendors via CSV at onboarding.
- A developer pushes a CMDB-style sync from their internal HR system via API.

All three paths go through the **same** Action Executor + validation gates + audit trail as agent writes. The only difference is the `actor_kind` field on the resulting audit event (`human` vs. `agent` vs. `system`). **There is no "admin backdoor" that bypasses the gates** — even root-level platform engineers operate through the Executor.

---

## 6. How data is read (read paths)

Agents and humans never query the underlying database directly. They query the **Unified CRM Read API**, which provides:

### 6.1 Two consistency modes

Per [Cross-Agent Coordination § 11](Cross-Agent-Coordination#11-read-consistency):

| Mode | Use | Source | Staleness budget |
|---|---|---|---|
| `eventual` (default) | Most agent reads, dashboards, analytics | Read replica | Up to 60s |
| `strong` | About-to-mutate reads, financial reads, identity checks | Primary | Sub-100ms |

The rule from that page: **any read that will lead to a mutation must use `strong`, and the proposed action's `expected_entity_version` must come from that read.** OCC and read-mode are paired.

### 6.2 Scope-checked reads

Every read is filtered by the caller's scope before results are returned:

- An HR Agent reading a Person record sees `kind=employee` records freely but only the public profile of `kind=customer` (no compensation, no internal HR fields).
- A Marketing Agent querying Organisations sees `kind=customer|prospect` but no `kind=vendor`.
- A Dev Agent has no `Read` scope on Person/Employee/Transaction/Contract — its queries return empty result sets, not authorisation errors, so it cannot probe for the existence of records.

Scope filtering is implemented in the Read API itself, not delegated to the caller. **An agent cannot accidentally read data outside its scope, because the API never returns it.**

### 6.3 Jurisdiction-aware reads

Records carry a `jurisdiction` field. Agents reading employees, customers, or vendors get jurisdiction in every response so they can apply the correct legal framework ([B2 — Domain Expertise](The-Six-Barriers#b2--domain-expertise-gap)). HR Agent reading a German employee sees `work_jurisdiction=DE` and routes to the DE employment-law playbook; reading a US employee, the US playbook.

### 6.4 Tenant isolation

Every read carries a `tenant_id`. Cross-tenant reads are **impossible at the API layer** — the read service rejects them with a 404, not a 403, so the existence of other tenants is not even leaked.

### 6.5 Query language

The Read API exposes:

- **Direct lookup** by entity ID: `GET /crm/person/{id}` (most common; cheap; cached).
- **Filtered list** with declarative filters: `GET /crm/person?kind=employee&work_jurisdiction=DE&employment_status=active`.
- **Graph traversal** for relationship queries: `GET /crm/customer/{id}/related?kinds=person,transaction,contract,project&depth=1`.
- **Saved views** for repeat workflows: `GET /crm/views/finance.open_invoices`.

There is **no raw SQL access for agents**. Custom queries are tickets to the Dev Agent, who adds a saved view if the use case is recurring.

---

## 7. Per-department day-to-day

Concrete examples of how each department consumes the Unified CRM in normal operation.

### HR Agent

- Reads `Person[kind=employee]` with `work_jurisdiction` to pull the correct employment-law playbook.
- Writes `Employee.role_title`, `Employee.role_level` on promotions (with Finance Agent's parallel compensation write coordinated via [saga](Cross-Agent-Coordination#9-saga-pattern-for-cross-entity-workflows)).
- Reads `Contract[kind=employment_contract]` for clause lookup before answering policy questions.
- Reads `Project[kind=customer_implementation]` to staff customer rollouts.

### Finance Agent

- Reads `Transaction[direction=inbound, status=executed]` for ARR computation across `Customer` records.
- Writes `Transaction[kind=invoice|payment|expense]` (with human approval — Financial class).
- Reads `Contract[kind=customer_contract]` for revenue recognition rules.
- Reads `Employee` (aggregated, no compensation) for headcount-based budgeting.

### Sales Agent

- Reads `Lead`, writes `Lead.qualification` and `Lead.last_touch_at`.
- Converts `Lead` → `Customer` (multi-entity saga: create `Organisation[kind=customer]`, link existing `Person`, create initial `Contract` ticket for Legal review).
- Reads `Customer.lifecycle_stage` and the customer's `Ticket` history to decide renewal vs. churn outreach.
- Reads `Transaction` history (ARR trend) to inform expansion proposals.

### Marketing Agent

- Reads `Lead` cohorts and `Customer` cohorts for campaign segmentation.
- Reads `Person.emails` only for `Lead` and `Customer` records, with explicit consent flags.
- Writes `Project[kind=marketing_campaign]` and attaches campaigns to `Customer` or `Lead` cohorts.
- Has **no scope** on Employees or Vendors.

### Legal Agent

- Reads every entity (read-only) to assess contract exposure.
- Writes `Contract` records; routes high-risk drafts to human counsel via the [Approval Workflow Framework](Approval-Workflow-Framework).
- Reads `Customer.jurisdiction` and `Employee.work_jurisdiction` to apply correct legal frameworks.

### Operations Agent

- Reads + writes `Organisation[kind=vendor|partner]`.
- Writes `Project` records (non-engineering, non-campaign).
- Reads everything else (operations is the cross-cutting view).

### Dev Agent

- Reads + writes `Project[kind=engineering]`.
- **Has no read scope on Person/Employee/Customer/Transaction/Contract.** The Dev Agent's job is to extend the platform; it does not need access to the customer's business data. This is the strongest separation in the matrix.
- Reads the [Wiki](Wiki-Governance) and the customer's tenant-specific extension catalogue.

---

## 8. The relationship graph

The CRM is a graph as much as a set of tables. The high-leverage queries are relationship traversals:

```
Customer (Acme Corp)
  ├─ Person (Jane Doe, CFO) — primary contact
  │    └─ Ticket (renewal-discussion-2026-Q3)
  ├─ Contract (acme-msa-v3) — auto-renew 2026-09-01
  │    └─ Transaction (invoice-2026-08-01, $120K, status=pending)
  ├─ Project (acme-implementation-2025) — status=complete
  │    └─ Ticket × 47 — historical implementation tickets
  └─ Audit Event × 312 — every action against this account
```

The Atlantis Read API exposes this directly:

```
GET /crm/customer/cust:acme/graph?depth=2&kinds=person,contract,transaction,project,ticket
```

This is the query that lets the Sales Agent draft a fully contextual renewal email in one call instead of seven API hits across five vendor systems. **The graph is the product** — it is why agents in Atlantis perform better in production than agents that have to stitch fragments from external vendor APIs every time they reason.

Tickets are first-class edges in this graph (see [Unified Ticketing Blueprint § 6 — How tickets link entities](Unified-Ticketing-Blueprint#6-how-tickets-link-entities)).

---

## 9. Privacy, sensitivity, and access classes

Some fields are more sensitive than others. The Read API applies **field-level access classes**:

| Class | Examples | Who can read |
|---|---|---|
| `public` | `display_name`, `kind`, `jurisdiction` | Any scoped agent |
| `internal` | `role_title`, `department`, `lifecycle_stage` | Most agents per matrix |
| `restricted` | `Employee.compensation`, `Person.health_information` | HR only, scope-gated |
| `confidential` | `Contract.commercial_terms`, `Customer.churn_risk_score` | Owner department + Legal |
| `regulated` | `Transaction.tax_id`, `Person.ssn`, `Person.passport` | Finance + Legal; auditor scope on read |

Class membership is set on the field, not the entity. An Employee record is mostly `internal`, but its compensation fields are `restricted` and its identity-document fields are `regulated`.

**Encryption at rest** for `restricted`, `confidential`, and `regulated` fields uses per-tenant keys (envelope encryption via tenant KEK). See [Security and Data Policy](Security-and-Data-Policy).

---

## 10. Tenancy, residency, and BYOC

Every record carries a `tenant_id`. Reads are tenant-scoped (§ 6.4). Writes are tenant-scoped. Cross-tenant traversal is impossible by construction.

For [bring-your-own-cloud (BYOC)](Architecture-Principles#16-managed-first-with-customer-owned-integrations-and-bring-your-own-cloud-as-an-option) customers, the CRM's data plane runs in the customer's chosen cloud (AWS / GCP / Azure) under the customer's IAM. The control plane (orchestration, identity issuance, audit aggregation) stays with Atlantis. **The customer's CRM data never leaves their chosen jurisdiction.**

Per [Architecture Principles § 13](Architecture-Principles#13-cell-based-architecture-for-tenant-isolation), each BYOC tenant is a cell whose data layer happens to be customer-owned. The same schema, the same API, the same audit guarantees — just a different physical location for the Postgres cluster and the read replicas.

---

## 11. What the Unified CRM is NOT

- **Not a customer data platform (CDP).** A CDP normalises event streams for marketing analytics. We do not pretend to replace Segment, mParticle, or RudderStack. Marketing event streams flow *into* the CRM as enrichment but the CRM is the entity store, not the event firehose.
- **Not a marketing automation tool.** We do not send the email; the Marketing Agent does, through the [External-Communication action class](Action-Risk-Classification#external).
- **Not a help-desk system.** The customer-facing support ticketing experience belongs in Zendesk / Intercom / Front, which the customer keeps. The Atlantis CRM mirrors those tickets as `Ticket` entities the Support Agent reasons over. See [Unified Ticketing Blueprint § 8 — External system mirroring](Unified-Ticketing-Blueprint#8-external-system-mirroring).
- **Not an ETL warehouse.** We do not replace Snowflake / BigQuery / Redshift. Customers running analytics warehouses can stream Atlantis data into their warehouse; the warehouse is downstream, not the source of truth.
- **Not the customer's UI for Salesforce / Workday / etc.** The sales rep still uses Salesforce as their working surface. Atlantis reads Salesforce via the Universal Data Bridge and writes back to it when agents propose changes. The CRM is the **agent-readable canonical view**, not a replacement UI for human users of single-domain tools.

This "is-not" list is the discipline that keeps the CRM from sprawling. Every proposed feature that drifts into one of these categories triggers a Wiki Governance review.

---

## 12. Mapped to the six barriers

| Barrier | How the Unified CRM addresses it |
|---|---|
| **B1 — Compound failure** | Single source of truth eliminates the most common multi-agent failure mode: two agents reasoning from contradictory copies of the same record. Validation gates run on every proposed write before queueing. |
| **B2 — Domain expertise gap** | Jurisdiction and access-class metadata on every record let agents route to the correct domain playbook automatically. |
| **B3 — Data silos** | This entire blueprint is the answer to B3. The CRM **is** the de-siloed canonical view. The Universal Data Bridge keeps it in sync with external systems of record. |
| **B4 — Agent identity & security** | Scope-checked reads (§ 6.2), field-level access classes (§ 9), and the rule that only the Action Executor writes (§ 5.1) enforce least-privilege at the data layer, not just the agent layer. |
| **B5 — Trust & change management** | The relationship graph (§ 8) is what the Trust Score Dashboard reads from. Every action that touches a record is in the audit trail visible to the customer. |
| **B6 — Breadth complexity** | One schema for seven departments is what makes the breadth tractable. Adding the eighth department does not add a new database. |

---

## 13. Performance envelope

Targets for the platform-level CRM service. These feed the [SLOs in Observability Standards](Observability-Standards#2-service-level-objectives-slos).

| Operation | p50 | p95 | p99 |
|---|---|---|---|
| Entity read by ID (`eventual`) | < 20ms | < 60ms | < 150ms |
| Entity read by ID (`strong`) | < 50ms | < 100ms | < 250ms |
| Filtered list (10 records, indexed filter) | < 40ms | < 120ms | < 300ms |
| Graph traversal (depth=2, ≤ 100 nodes) | < 100ms | < 300ms | < 800ms |
| Write commit (via Action Executor) | < 100ms | < 200ms | < 500ms |

Read throughput target: 10K reads/sec/cell sustained. Write throughput target: 500 writes/sec/cell sustained. These numbers shape the [Technology Stack](Technology-Stack) database sizing.

---

## 14. Forbidden

- Any service writing directly to an entity table without going through the Action Executor (rejected at API gateway; CI lint rule).
- Any agent issuing a raw SQL query against the CRM database.
- Cross-tenant reads or writes from any service that is not the platform-level analytics aggregator (which has a separate, audited identity).
- Replicating CRM entities into a per-department database "for performance" — the read replicas exist for that purpose and are tenant-isolated.
- Storing `restricted` or `regulated` fields outside the encrypted columns (e.g. in a free-text `notes` field).
- Adding a new first-class entity kind without a [Wiki Governance § 8](Wiki-Governance) decision.
- Marketing or Dev Agent scope expansion to Person/Employee/Transaction/Contract without a recorded ADR ([Coding Standards § 12](Coding-Standards#12-architecture-decision-records-adrs)).

---

## 15. When to revisit

- A repeated incident class traces to a missing entity kind or relationship — promote it from tenant-extensible attribute to first-class entity.
- Read throughput exceeds 8K reads/sec/cell sustained — re-evaluate read-replica fan-out or sharding strategy.
- A new regulatory framework (HIPAA, FedRAMP, IRAP) requires an additional access class — extend § 9.
- A customer in BYOC mode requires a database technology other than Postgres — evaluate the cost of multi-database support against the value of that segment.
- The forbidden-combinations list ([Action Risk Classification](Action-Risk-Classification#forbidden-combinations)) needs to change in either direction — both pages must be updated together.

CTO is the accountable owner. Engineering owns the CRM service's roadmap. The Domain Expert Councils are consulted whenever entity semantics change (e.g. "what fields make up an Employee record in DE vs. US?").

---

## Cross-references

- [Unified Entity Model](Unified-Entity-Model) — wire-level schema for each entity
- [Unified Ticketing Blueprint](Unified-Ticketing-Blueprint) — the other foundation
- [Cross-Agent Coordination](Cross-Agent-Coordination) — Action Executor, OCC, sagas, leases
- [Action Risk Classification](Action-Risk-Classification) — scopes and forbidden combinations
- [Validation Gate Specifications](Validation-Gate-Specifications) — gates that run before every write
- [Approval Workflow Framework](Approval-Workflow-Framework) — human approval routing
- [Architecture Principles](Architecture-Principles) — multi-tenancy, idempotency, zero-trust, BYOC
- [Security and Data Policy](Security-and-Data-Policy) — encryption, IAM, classification
- [The Six Barriers § B3](The-Six-Barriers#b3--enterprise-data-silos)
- [Product Requirements](Product-Requirements)
- [Master Blueprint Index](Master-Blueprint-Index)
