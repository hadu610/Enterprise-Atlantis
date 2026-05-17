# Unified Entity Model

> **Type:** Reference · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

This page defines the **unified entity model** — the common schema every agent uses to refer to people, organisations, and core objects. Agents never query source systems (Salesforce, BambooHR, QuickBooks) directly; they query the [Universal Data Bridge](The-Six-Barriers#b3--enterprise-data-silos) using these entity definitions. This is how we ensure the HR Agent and the Finance Agent share an identical definition of "employee".

If a concept exists across multiple departments, it lives here.

---

## Conventions

- Every entity has a stable string ID (`<entity>:<source>:<source_id>` or `<entity>:<uuid>`).
- Fields marked **(required)** must be present for the entity to be valid.
- Fields marked **(tenant)** can be customised per customer via tenant overrides.
- All datetimes are ISO 8601 UTC.
- All currency amounts are stored as integer minor units (cents) with a 3-letter ISO currency code.

---

## Person

Represents any human the platform knows about — employees, customers, leads, vendors, contacts.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `person:<uuid>` |
| `kind` | enum | ✓ | `employee` \| `customer` \| `lead` \| `vendor_contact` \| `other` |
| `display_name` | string | ✓ | |
| `legal_name` | string | | Where required for compliance |
| `emails` | list<string> | | At least one if used by Marketing/Sales |
| `phones` | list<string> | | E.164 format |
| `jurisdiction` | string | | ISO country code, e.g. `US`, `UK`, `DE` |
| `external_refs` | map<source, id> | | e.g. `{ "salesforce": "00x...", "bamboohr": "1234" }` |
| `created_at` | datetime | ✓ | |
| `updated_at` | datetime | ✓ | |

A `Person` may have an associated `Employee` record (extending Person with employment-specific fields) and zero or more `CustomerContact` records.

## Employee

Extends `Person` with employment-specific fields. Read-write by HR Agent; read-only by other agents.

| Field | Type | Required | Notes |
|---|---|---|---|
| `person_id` | string | ✓ | FK to Person |
| `employee_number` | string | ✓ | |
| `employment_status` | enum | ✓ | `active` \| `pre_hire` \| `on_leave` \| `terminated` |
| `start_date` | date | ✓ | |
| `end_date` | date | | If terminated |
| `work_jurisdiction` | string | ✓ | ISO country code; drives HR/Legal rules |
| `department` | string | | |
| `manager_person_id` | string | | FK to Person |
| `role_title` | string | ✓ | |
| `role_level` | string | | Customer-defined band |
| `compensation_visible_to` | enum | | `hr_only` (default) \| `manager_chain` \| `self_and_hr` |

Note: compensation fields live in a separate restricted entity, accessible only by agents holding the `employee.compensation` scope.

## Agent

Represents an AI agent identity. Mirrors `Employee` in shape — agents are first-class actors with names, titles, departments, and named human managers, exactly as employees have. Full semantics, lifecycle, and the asymmetry that agents cannot approve are specified in [Identity and Access Control](Identity-and-Access-Control).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `agent:<uuid>` |
| `tenant_id` | string | ✓ | Agents are tenant-scoped; cross-tenant identity is forbidden |
| `display_name` | string | ✓ | Customer-visible, e.g. `"HR Agent"`, `"Hiring Co-Pilot"` |
| `agent_family` | enum | ✓ | `hr_agent` \| `finance_agent` \| `legal_agent` \| `sales_agent` \| `marketing_agent` \| `operations_agent` \| `dev_agent` |
| `agent_version` | string | ✓ | Semantic version of the deployed build, e.g. `hr-agent-v3.1` |
| `role_title` | string | ✓ | Org-chart title, e.g. `"HR Specialist (Agent)"` |
| `role_level` | string | | Customer-defined band |
| `department` | string | ✓ | Canonical department or customer-defined |
| `manager_person_id` | string | ✓ | **Required.** FK to Person. Every agent has a named human owner |
| `status` | enum | ✓ | `active` \| `paused` \| `quarantined` \| `deprecated` |
| `scopes_document_id` | string | ✓ | FK to the scope-assignment doc ([Action Risk Classification § Scope assignment](Action-Risk-Classification#scope-assignment)) |
| `role_bundle_id` | string | ✓ | FK to a Role record |
| `model_routing_profile` | string | | AI model and prompt version ([AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)) |
| `started_at` | datetime | ✓ | Activation timestamp |
| `deprecated_at` | datetime | | Set when status transitions to `deprecated` |
| `external_refs` | map<source, id> | | e.g. `{ "iam": "iam-record-uuid" }` |

Read-write by the platform IAM service only. Other agents and humans interact with `Agent` records through the IAM API, never directly.

## Role

Represents a named bundle of permissions plus a scope constraint. An actor (Person or Agent) does not hold raw permissions; permissions are inherited by holding one or more Roles. Canonical roles ship in the wiki ([Identity and Access Control § 7](Identity-and-Access-Control#7-default-role-bundles-canonical)); custom roles live in the IAM database.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `role:<uuid>` (custom) or `role:default:<name>` (canonical) |
| `tenant_id` | string | (custom only) | Null for canonical roles; required for custom |
| `name` | string | ✓ | Human-readable, e.g. `"Sales Engineering Lead"` |
| `description` | string | | |
| `applies_to` | enum | ✓ | `human` \| `agent` \| `both` |
| `scope` | enum | ✓ | `tenant` \| `department` \| `entity` |
| `scope_value` | string | | Department name (when `scope=department`) or entity ID (when `scope=entity`); null for `tenant` |
| `permissions` | list<string> | ✓ | Permission keys from the canonical registry ([Identity and Access Control § 5](Identity-and-Access-Control#5-the-canonical-permission-registry)) |
| `inherits_from` | list<string> | | FKs to parent Role IDs; cycles forbidden, depth ≤ 5 |
| `is_canonical` | boolean | ✓ | True for default roles shipped in the wiki; false for tenant-defined |
| `created_by` | string | ✓ | Actor ID of the creator (canonical roles use the platform's system identity) |
| `created_at` | datetime | ✓ | |
| `updated_at` | datetime | ✓ | |

The IAM service is the only write path. Direct DB writes are forbidden.

## Organisation

Represents any external organisation — customer, prospect, vendor, partner.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `org:<uuid>` |
| `kind` | enum | ✓ | `customer` \| `prospect` \| `vendor` \| `partner` \| `other` |
| `display_name` | string | ✓ | |
| `legal_name` | string | | |
| `domain` | string | | Primary web domain |
| `jurisdiction` | string | | Headquarters ISO country code |
| `industry` | string | | |
| `size_band` | enum | | `solo` \| `smb` \| `mid_market` \| `enterprise` \| `f500` |
| `external_refs` | map<source, id> | | |

## Customer

Specialisation of `Organisation` with kind = `customer`. Adds:

| Field | Type | Notes |
|---|---|---|
| `account_owner_person_id` | string | FK to Person (account exec / CSM) |
| `lifecycle_stage` | enum | `onboarding` \| `active` \| `at_risk` \| `churned` |
| `contract_start_date` | date | |
| `contract_end_date` | date | |
| `arr_cents` | integer | Annual recurring revenue, minor units |
| `currency` | string | ISO 4217 |

## Lead

A `Person` (kind = `lead`) optionally associated with an `Organisation` (kind = `prospect`). Adds:

| Field | Type | Notes |
|---|---|---|
| `source` | string | e.g. `inbound_form`, `linkedin`, `event:dreamforce_2026` |
| `qualification` | enum | `mql` \| `sql` \| `disqualified` \| `nurture` |
| `assigned_sales_person_id` | string | FK to Person |
| `last_touch_at` | datetime | |

## Project

Represents a unit of work tracked across systems (engineering project, marketing campaign, audit, etc.).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `project:<uuid>` |
| `name` | string | ✓ | |
| `kind` | enum | ✓ | `engineering` \| `marketing_campaign` \| `audit` \| `customer_implementation` \| `other` |
| `owner_person_id` | string | ✓ | |
| `status` | enum | ✓ | `planned` \| `active` \| `blocked` \| `complete` \| `cancelled` |
| `start_date` | date | | |
| `target_end_date` | date | | |
| `actual_end_date` | date | | |
| `external_refs` | map<source, id> | | e.g. `{ "jira": "PROJ-123", "github": "repo/proj" }` |

## Transaction

Represents any financial movement — invoice, payment, refund, expense, journal entry.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `txn:<uuid>` |
| `kind` | enum | ✓ | `invoice` \| `payment` \| `refund` \| `expense` \| `journal` \| `other` |
| `direction` | enum | ✓ | `inbound` \| `outbound` |
| `amount_cents` | integer | ✓ | Minor units |
| `currency` | string | ✓ | ISO 4217 |
| `counterparty_org_id` | string | | FK to Organisation |
| `counterparty_person_id` | string | | FK to Person (for expenses, etc.) |
| `gl_account` | string | | Chart-of-accounts code |
| `tax_jurisdiction` | string | | ISO country code |
| `status` | enum | ✓ | `pending` \| `approved` \| `executed` \| `failed` \| `rolled_back` |
| `external_refs` | map<source, id> | | e.g. `{ "stripe": "ch_...", "quickbooks": "..." }` |
| `occurred_at` | datetime | ✓ | |

## Ticket

Represents any item flowing through the [ticketing system](Product-Requirements).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | `ticket:<uuid>` |
| `originator_kind` | enum | ✓ | `human` \| `agent` \| `system` |
| `originator_id` | string | ✓ | |
| `assignee_kind` | enum | | `human` \| `agent` |
| `assignee_id` | string | | |
| `kind` | string | ✓ | e.g. `expense_review`, `pr_review`, `hire_request`, `wiki_update` |
| `priority` | enum | ✓ | `low` \| `normal` \| `high` \| `urgent` |
| `status` | enum | ✓ | `open` \| `in_progress` \| `awaiting_approval` \| `closed_resolved` \| `closed_rejected` \| `stale` |
| `risk_tier` | enum | | Per [Action Risk Classification](Action-Risk-Classification) |
| `due_at` | datetime | | |
| `body` | string | ✓ | Plain-text or markdown description |

## Audit Event

The lowest-level entity. Every action the platform takes — by humans, agents, or system processes — produces an immutable audit event.

| Field | Type | Required |
|---|---|---|
| `id` | string | ✓ |
| `actor_kind` | enum | ✓ |
| `actor_id` | string | ✓ |
| `action_class` | enum | ✓ |
| `target_entity_id` | string | |
| `before` | object | (for state-changing actions) |
| `after` | object | (for state-changing actions) |
| `confidence` | float | (for agent actions) |
| `gate_results` | list<gate_result> | (for agent actions) |
| `occurred_at` | datetime | ✓ |
| `workflow_id` | string | (when part of a multi-step workflow) |

Audit events are append-only and retained per the [Rollback Procedures](Rollback-Procedures) retention schedule for the relevant action class.

---

## Cross-references

- [Identity and Access Control](Identity-and-Access-Control) — the full semantics of Actor / Agent / Role and permission enforcement
- [Glossary](Glossary)
- [Action Risk Classification](Action-Risk-Classification)
- [Rollback Procedures](Rollback-Procedures)
- [Product Requirements](Product-Requirements)
- [The Six Barriers](The-Six-Barriers#b3--enterprise-data-silos)
