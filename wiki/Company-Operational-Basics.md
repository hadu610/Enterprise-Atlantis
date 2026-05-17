# Company Operational Basics

> **Type:** Playbook · **Owner:** Product / Operations · **Status:** Approved · **Applies to:** All agents · All employees · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

This page holds the thin set of **cross-cutting operational basics** that every business runs but which do not belong to any single department in the [Company Operation Builder Catalog](Company-Operation-Builder-Catalog). The rule is: if an operation cleanly fits HR, Finance, Sales, Marketing, Operations, Legal, or Dev, it lives in that department's [Agent Playbook](#agent-playbook-pages). Only operations that cross all departments (or none) live here.

> **The reframe this page makes:** *the "company" department is residual, not central.* Department playbooks own most of what a company does. The Basics page keeps the small handful of operations that are genuinely about the company as a whole.

---

## 1. Why this page exists

The single-home rule for playbooks ([Playbook Customization Model](Playbook-Customization-Model)) means every operational playbook has exactly one canonical home — the owning department's page. Operations that span departments are *sagas* (parent ticket + child tickets per [Unified Ticketing § 5](Unified-Ticketing-Blueprint#5-sagas)), still owned by a lead department.

But a residue remains: a small set of operations that are truly about the company as an entity, not about any one department's work. Examples: "an employee submits a general question," "a new department is added," "the customer admin opens a feedback ticket about the platform." None of these fit cleanly under HR, Finance, Sales, etc. They belong on a residual page — this one.

The Basics page is intentionally short. Anything that grows beyond a residual playbook (e.g. a feedback flow that becomes a full programme) graduates into the appropriate department.

---

## 2. The operational basics

### 2.1 General request intake

| Field | Value |
|---|---|
| **id** | `basics.general_request` |
| **Name** | Submit a general internal request |
| **Owner** | Operations Agent (with auto-routing) |
| **Trigger** | Employee submits an untyped request in chat or UI |
| **Risk class** | `Read` (intake) → routed to the appropriate department's playbook |
| **Hrs/mo saved** | 6 |
| **Default sizes** | Startup, Medium, Enterprise |

The Atlantis Manager classifies the request (Finance? HR? Legal? Other?) and either routes to the correct department's playbook (becoming a regular ticket in that department) or surfaces the request to the Customer Admin for triage. The Basics playbook is the *intake* — it never executes a final action itself.

### 2.2 System access request

| Field | Value |
|---|---|
| **id** | `basics.access_request` |
| **Name** | Request access to a system or document |
| **Owner** | Operations Agent (routes to system owner) |
| **Trigger** | Employee submits a typed access request |
| **Risk class** | `Write` |
| **Hrs/mo saved** | 4 |
| **Default sizes** | Startup, Medium, Enterprise |

Distinct from a Dev access request to engineering systems (which goes to the Dev Agent per [Dev Agent Playbook](Dev-Agent-Playbook)) — this is the general case for access to wikis, shared drives, SaaS tools, etc.

### 2.3 Feedback / suggestion intake

| Field | Value |
|---|---|
| **id** | `basics.feedback` |
| **Name** | Submit feedback or suggestion |
| **Owner** | Operations Agent |
| **Trigger** | Employee submits feedback in chat or UI |
| **Risk class** | `Read` |
| **Hrs/mo saved** | 2 |
| **Default sizes** | Medium, Enterprise |

The Manager acknowledges, files the feedback in a quarterly review queue, and routes if the feedback maps to a specific department's improvement backlog.

### 2.4 Announce a company-wide change

| Field | Value |
|---|---|
| **id** | `basics.company_announcement` |
| **Name** | Distribute a company-wide announcement |
| **Owner** | Operations Agent |
| **Trigger** | Customer admin initiates |
| **Risk class** | `External` (employee comms) |
| **Hrs/mo saved** | 3 |
| **Default sizes** | Medium, Enterprise |

This is *not* marketing comms to external audiences (that lives in `mkt.*` playbooks). This is internal: holiday schedule changes, policy updates, leadership announcements, all-hands schedule changes.

### 2.5 Activate a new department

| Field | Value |
|---|---|
| **id** | `basics.activate_department` |
| **Name** | Activate a new department in the tenant |
| **Owner** | Customer admin via Atlantis Manager (configuration mode) |
| **Trigger** | Customer admin initiates |
| **Risk class** | `Write` (provisions an agent identity, scopes, dashboards) |
| **Hrs/mo saved** | n/a — provisioning event |
| **Default sizes** | Medium, Enterprise (Startup tenants usually activate all departments at the start) |

Provisions a new agent identity per [Identity and Access Control](Identity-and-Access-Control), creates the department's default playbooks per the [Catalog](Company-Operation-Builder-Catalog), registers the department panel in the [Live Activity Stream](Live-Activity-Stream).

### 2.6 Reorganise the tenant

| Field | Value |
|---|---|
| **id** | `basics.reorganise` |
| **Name** | Reorganise reporting lines, departments, or roles |
| **Owner** | Customer admin via Atlantis Manager (configuration mode) |
| **Trigger** | Customer admin initiates |
| **Risk class** | `Write` |
| **Hrs/mo saved** | n/a — configuration event |
| **Default sizes** | Medium, Enterprise |

Updates the Role bundles, reassigns approvals, re-routes the approval queues, updates the org chart consumed by the Manager and the Control Center.

### 2.7 Platform support escalation

| Field | Value |
|---|---|
| **id** | `basics.platform_support` |
| **Name** | Escalate a platform issue to Atlantis support |
| **Owner** | Customer admin via Atlantis Manager |
| **Trigger** | Customer admin or platform-detected `gate_failed` / `quarantined` |
| **Risk class** | `External` (sends data to Atlantis support with admin consent) |
| **Hrs/mo saved** | varies |
| **Default sizes** | Startup, Medium, Enterprise |

Opens a support session per [Security and Data Policy](Security-and-Data-Policy) with a time-boxed access grant. The grant expires automatically; the admin can revoke it at any time.

---

## 3. What does NOT belong here

The Basics page is residual, not catch-all. Operations that *seem* basic but actually fit a department's bucket go to the department:

| Operation | Goes to |
|---|---|
| "Onboard a new hire" | `hr.hire_to_day1` |
| "Pay an invoice" | `fin.ap_processing` |
| "Send a marketing email" | `mkt.email_nurture` |
| "Renew a vendor contract" | `ops.vendor_renewals` |
| "Review a legal document" | `legal.msa_review` |
| "Triage a bug" | `dev.bug_triage` |
| "Qualify a sales lead" | `sales.inbound_qualification` |

When the question "which department owns this?" has a clear answer, that department owns it. The Basics page only holds operations whose department answer is genuinely "none / all".

---

## 4. The pattern when this page grows

If a Basics playbook accumulates volume or complexity, it does *not* live here forever. Three exit paths:

| Exit path | When | Example |
|---|---|---|
| **Promote to a department** | The operation gains a clear owner | "Feedback" grows into a full Product feedback programme owned by an emerging Product department |
| **Split into department variants** | Different departments need different shapes | "General request" splits into per-department triage playbooks |
| **Stay residual** | The operation is small and stable | "Submit feedback" stays here for years; no growth |

The Basics page is reviewed annually by Product + Operations to confirm each playbook still belongs here. Operations that have outgrown the page are migrated to their proper home.

---

## 5. The Atlantis Manager's relationship to Basics

The [Atlantis Manager](Atlantis-Manager-Playbook) handles the intake for all Basics playbooks. The pattern:

1. Employee asks the Manager something open-ended ("can I get access to the marketing dashboard?")
2. Manager classifies the intent against the Basics playbook catalog
3. Manager produces a [Resolution Plan](Resolution-Plan-Specification) for the Basics intake
4. On approval, Manager creates the ticket
5. The ticket may then auto-route into a department playbook (e.g. `basics.general_request` → `dev.access_request`)

Basics playbooks are deliberately broad in intake. Sharpening happens through the routing step, where the Manager makes a typed decision and the audit log records what was classified as what.

---

## 6. Agent Playbook pages

The seven (or more) department playbook pages each contain a `§ Operational Playbooks` section listing the playbooks they own. This page mirrors that structure for the residual operations.

| Department | Playbook page |
|---|---|
| Sales | [Sales-Agent-Playbook](Sales-Agent-Playbook) |
| Marketing | [Marketing-Agent-Playbook](Marketing-Agent-Playbook) |
| HR | [HR-Agent-Playbook](HR-Agent-Playbook) |
| Finance | [Finance-Agent-Playbook](Finance-Agent-Playbook) |
| Operations | [Operations-Agent-Playbook](Operations-Agent-Playbook) |
| Legal | [Legal-Agent-Playbook](Legal-Agent-Playbook) |
| Dev | [Dev-Agent-Playbook](Dev-Agent-Playbook) |
| Cross-cutting basics | **This page** |

---

## 7. Forbidden

- **Department-owned operations on this page.** If a department owns it, the spec lives there, not here.
- **Inventing new "basics" playbooks because they don't fit anywhere obvious.** If an operation seems homeless, the issue is usually a missing department or a missing decomposition, not a Basics entry.
- **Bypassing the Resolution Plan for Basics playbooks.** Same Plan contract applies to every operation, including residual ones.
- **Routing Basics operations outside the Unified Ticketing substrate.** Every Basics request becomes a ticket; nothing skips the substrate.

---

## 8. When to revisit

- A Basics playbook's volume exceeds 100 tickets/month for a single tenant — likely too important to stay residual; promote.
- A new department is added — review whether any Basics operations now fit that department.
- Customer admins frequently request a customisation to a Basics playbook — the residual scope is too narrow.
- The Atlantis Manager classifies Basics intake into the same department > 80% of the time — promote that path into a proper department playbook.

Product owns this page. Operations owns the residual playbook specs. Founders approve the activation of new departments.

---

## Cross-references

- [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) — where Basics playbooks appear in the catalog
- [Operational Playbook Index](Operational-Playbook-Index) — the unified index across all departments + Basics
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the intake surface for Basics requests
- [Identity and Access Control § agent provisioning](Identity-and-Access-Control) — what `basics.activate_department` calls
- [Security and Data Policy § support access](Security-and-Data-Policy) — the `basics.platform_support` flow
- [Master Blueprint Index](Master-Blueprint-Index)
