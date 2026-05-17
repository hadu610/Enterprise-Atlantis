# Playbook Customization Model

> **Type:** Rule · **Owner:** Product / CTO · **Status:** Approved · **Applies to:** All agents · All customer admins · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

Every operational playbook in the [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) ships with platform defaults. Every default is **customisable per tenant** — steps, trigger, owner agent, risk class (within platform floors), approval rules, output artifacts, integration hooks. This page specifies the override model: where customisations live, how they layer over the platform default, how customers reset to default, and how platform upgrades to defaults interact with active customisations.

> **The reframe this page makes:** *the default catalog is a starting point, not a contract.* Customers shape playbooks to their business; the platform learns from common customisations and promotes them into the default — but never silently overwrites a customer's choice.

---

## 1. Why this page exists

A platform that ships rigid default playbooks fails the diversity of real businesses. A platform that ships infinite freeform configuration fails to deliver value out of the box. The customisation model is the seam between the two.

Three constraints shape this design:

- **Customers must be able to change anything in a playbook that doesn't violate a platform-floor guardrail.** Steps, triggers, agents, approval routing, output templates — all overrideable.
- **Platform upgrades to defaults must not silently break customer workflows.** The customer accepts upgrades, never the platform forcing them.
- **The customisation must be auditable.** A regulator should be able to see "this customer customised the AR-followup playbook to send Slack messages first; here is the diff vs default and when it was set."

The model:

```
effective_playbook(tenant, playbook_id) =
    merge(
        platform_default(playbook_id, frozen_at_version),
        tenant_overrides(tenant, playbook_id)
    )
```

A frozen platform default + a tenant-local override file = the effective playbook the agent executes. Both halves are versioned, auditable, and reversible.

---

## 2. The default-and-override architecture

### 2.1 Platform default

The platform default is the spec written in the owning department's [Agent Playbook](Company-Operation-Builder-Catalog#10-agent-playbook-pages) `§ Operational Playbooks` section. The wiki page is the human-readable source; a structured representation lives at `engine/catalog/defaults/<playbook_id>.yaml` (Phase 1 deliverable).

The default has:

- `id` — the playbook's canonical id
- `version` — semver, bumped whenever the default changes
- `steps` — the ordered list of steps (each with a tool call, parameters, produces, rollback)
- `trigger` — the event(s) that start the playbook
- `owner_dept` and `agents_involved` — the platform default agent assignment
- `risk_class` — the platform default risk class
- `approval_rules` — the platform default approval routing
- `output_templates` — the platform default artifact templates (emails, journal entries, contract clauses)
- `integrations` — the platform default external system hooks
- `notification_hooks` — what notifications fire when (default = Control Center + email digest)

### 2.2 Tenant override

The tenant override file is a sparse YAML document stored in the tenant's configuration namespace. It overrides any subset of the default's fields. Fields not present in the override inherit from the default.

```yaml
# tenants/acme/playbooks/fin.stripe_reconciliation.yaml
id: fin.stripe_reconciliation
based_on_default_version: 2.3.0
overrides:
  steps:
    insert_after_step: 3
    new_step:
      summary: "Post #finance Slack notification with reconciliation summary"
      tool: slack.post_message
      parameters:
        channel: "#finance"
        template: "stripe-recon-summary"
      produces: "slack_message_id"
      rollback: "slack.delete_message"
  notification_hooks:
    daily_digest_recipients:
      - finance-team@acme.com
      - cfo@acme.com
```

The override above adds a Slack notification step after step 3 of the platform default and adds two recipients to the daily digest. Every other field — trigger, agents, risk class, the other 6 steps — inherits unchanged.

### 2.3 The merge function

The merge applies the override on top of the default. Merge rules:

| Field type | Merge rule |
|---|---|
| Scalar (string, number, label) | Override replaces default |
| List (steps, recipients, tags) | Override directives explicit: `insert_before/after`, `replace_step_id`, `remove_step_id`, `append`, `replace_all` |
| Map (parameters, templates) | Deep merge: override keys win; default keys not in override remain |
| `null` in override | Explicit removal — clears the default for that field |

The merge is **referentially transparent** — given the same default version and override file, the effective playbook is deterministic. This makes the agent's behaviour reproducible during audit replay.

---

## 3. What customers can customise

For each playbook, the customer can:

| Aspect | Override directive | Common use |
|---|---|---|
| **Steps** — insert, replace, remove | `insert_before`, `insert_after`, `replace_step_id`, `remove_step_id` | Add an internal approval, swap an integration, skip a step that doesn't apply |
| **Trigger** | `trigger.override` | Change a daily run to weekly; switch from "form submission" to "manual only" |
| **Owner agent** | `owner_dept.override` (within § 5 limits) | Route HR onboarding to Operations Agent if HR Agent isn't activated |
| **Risk class** — within platform floors | `risk_class.tighten` (always allowed); `risk_class.relax` (within floor) | Tighten "Write" to "Financial" for a higher-than-default review bar |
| **Approval rules** | `approval_rules.override` | Add an extra approver; route to a specific manager; change SLA |
| **Output templates** | `output_templates.<artifact>.override` | Use the customer's branded email template, their journal entry naming, their contract clauses |
| **Integrations** | `integrations.<system>.override` | Point at the customer's instance of Slack, GitHub, NetSuite, etc. |
| **Notification hooks** | `notification_hooks.override` | Change digest recipients, mute channels, add Slack channel notifications |
| **Field mappings** | `field_mappings.override` | Match the customer's CRM field names to the playbook's expected schema |

---

## 4. What customers cannot customise

Some aspects are not overrideable, because changing them would either (a) break platform invariants or (b) cross a [platform-floor guardrail](Autonomy-Modes#4-platform-floor-guardrails--what-no-mode-can-bypass).

| Aspect | Why not |
|---|---|
| **Playbook id** | Globally unique; renaming would break references and audit linkage |
| **Resolution Plan structure** | Spec'd in [Resolution Plan Specification](Resolution-Plan-Specification) and identical across all playbooks |
| **Audit event emission** | Every step emits audit events with the standard schema; cannot be suppressed |
| **Risk-class downgrade across a platform floor** | Cannot downgrade `Financial > $1k threshold` to `Write`; floor enforced at Action Executor |
| **Bypass of approval for floor-class actions** | Approval is required regardless of customisation per [Action Risk Classification](Action-Risk-Classification) floors |
| **Cross-tenant references** | An override cannot reference another tenant's data |
| **Disabling the playbook from emitting Live Activity Stream events** | The Stream is always-on |
| **Removing the rollback procedure for reversible actions** | If an action is reversible, the rollback must be defined |

These constraints are validated at override-time, not at execution-time. An invalid override is rejected with a typed error explaining which constraint was violated.

---

## 5. Where customisation happens (three surfaces, one store)

| Surface | When | Persona |
|---|---|---|
| [Company Operation Builder](../build.html) — per-playbook "Customise" affordance | Pre-activation | Onboarding customer |
| [Control Center](Control-Center) — Playbook Editor pane | Anytime | Customer admin |
| [Atlantis Manager](Atlantis-Manager-Playbook) — configuration mode | Anytime via chat | Customer admin |

All three write to the same override store. Conflict resolution: last-write-wins by audit timestamp; the previous state is preserved in the audit log so any change is reversible.

---

## 6. Customisation in the Builder (pre-activation)

In the [Company Operation Builder](Company-Operation-Builder-Catalog), every playbook card has a "Customise" affordance. Clicking opens a side-pane editor that exposes:

- A visual list of the default steps; the customer reorders, inserts, removes (limited to non-floor-class steps).
- The trigger configuration (e.g. switch from "Daily" to "Weekly on Tuesday").
- The notification recipients (free-text email entries; Slack channel picker once Slack is integrated).
- The output templates (a "Use my template" affordance lets the customer upload or paste their version).
- A "Reset to default" button.

The Builder's Customise pane is constrained to the most common ~6 customisations per playbook. Deeper customisation (custom integrations, field mappings, novel steps) happens post-activation in the Control Center's full Playbook Editor.

---

## 7. Customisation in the Control Center (post-activation)

The Control Center hosts the full Playbook Editor — a structured form view that exposes every overrideable field. Capabilities:

- View the effective playbook (default + overrides merged) alongside the diff.
- Drill into any step to see the full tool call signature, parameters, and rollback procedure.
- Edit any field within the constraints of § 4.
- Diff view: side-by-side platform-default vs effective-playbook.
- "Test run" mode: dry-run the playbook against a sample input; renders the Resolution Plan that would result; does not execute.
- Version history: every override change is a versioned diff with the editor's identity, timestamp, and typed rationale.
- "Reset to default" at field level or whole-playbook level.

The Playbook Editor is the same surface a domain expert at the customer (their CFO, their CISO, their CTO) uses to fit Atlantis to their business. It is also the surface engineering uses internally to debug customer-reported issues — what the customer sees is what engineering sees.

---

## 8. Customisation via the Atlantis Manager (chat)

The [Atlantis Manager](Atlantis-Manager-Playbook) in configuration mode handles customisation requests conversationally:

```
Admin: "Add a Slack message to #finance after the Stripe reconciliation step where we post the daily summary."
Manager: [opens fin.stripe_reconciliation, drafts a Resolution Plan]
         "I'll insert a new step after step 3:
            tool: slack.post_message
            channel: #finance
            template: stripe-recon-summary
          Pros: visibility for the finance team without them needing to check the Control Center.
          Cons: one extra Slack message per day; Slack outages would cause a step failure
                that would not block the reconciliation but would log a warning.
          Reversibility: fully (delete_message inverse).
          Confidence: 88 (precedent: 3 other tenants do this).
          Approve?"
Admin: "Yes"
Manager: [calls playbook.customize tool, writes override, confirms]
         "Done. Effective starting tomorrow's run."
```

Every Manager-driven customisation produces a Resolution Plan and an audit event, exactly like any other configuration action.

---

## 9. Platform default upgrades

The platform regularly improves default playbooks — better prompts, refined steps, new integrations. These upgrades must not silently break customer customisations.

The upgrade flow:

1. Engineering ships a new default version (e.g. `fin.stripe_reconciliation` v2.4.0).
2. The platform compares each affected tenant's override against the new default and computes one of three diff classes:
   - **Compatible** — the override still applies cleanly; tenant auto-upgrades on next run; notification only.
   - **Conflict** — the override depends on a default field the new version removed or restructured; tenant stays on the prior default version; admin is notified with the diff and a "Review and upgrade" action.
   - **Breaking** — the new default's signature is incompatible (e.g. risk-class promotion, new required parameter); tenant stays on prior version; admin must explicitly upgrade.
3. The Control Center surfaces pending upgrades in the Playbook Editor with the diff and the action.
4. The Atlantis Manager proactively raises pending upgrades in conversation when the admin is in the relevant context.

A tenant can stay on a prior default version indefinitely, with the trade-off that it stops receiving improvements. The platform never auto-upgrades a conflicting tenant.

---

## 10. Customisation versioning and audit

Every override write produces:

- A versioned record in the override store: `(tenant_id, playbook_id, version, override_yaml, author_id, ts)`.
- An audit event: `playbook_customization_changed` with the diff and a typed rationale.
- A retention guarantee: every prior version of the override is retrievable for the audit-retention window of the tenant.

A customer admin can:

- View the full history of overrides for any playbook.
- Restore a prior version with one click (becomes a new audit event).
- Export the full override history as a compliance bundle.

---

## 11. What gets shared back to the platform

Customer customisations are **tenant-local by default**. They are not visible to other tenants, not aggregated for ML training, not used to influence the platform default unless the customer explicitly contributes.

A separate "Contribute to defaults" affordance lets a customer admin propose an override pattern as a candidate for the platform default. The proposal:

- Anonymises tenant-specific data (no internal team names, no customer-specific integration endpoints).
- Routes to Founders + the relevant Domain Council for review.
- If accepted, becomes part of a future default version; the contributing customer is credited (with consent) in the changelog.

This is the mechanism by which the Catalog learns from real customer practice without violating tenant boundaries.

---

## 12. Forbidden

- **Cross-tenant override visibility.** A customer admin sees only their tenant's overrides. No "look at how Acme customised this" view exists.
- **Auto-applying a customer's override to a different playbook.** Overrides are scoped per playbook id; no cross-playbook auto-application.
- **Silent platform upgrades to incompatible customers.** The platform never moves a tenant onto a conflicting or breaking new default without the admin's explicit upgrade.
- **Override-driven floor relaxation.** No override can downgrade a risk class across a platform-floor boundary, even if the override author is a customer admin.
- **Agent-authored overrides without approval.** Agents (including the Atlantis Manager) can produce a Plan to customise a playbook; the customisation does not apply until an admin approves the Plan.
- **Forking the default version per agent.** Within a tenant, one playbook has one effective version. A tenant cannot run two simultaneous versions of `fin.stripe_reconciliation`.
- **Override files referencing customer-identifying data outside the override store.** Overrides may reference tenant config; they cannot embed secrets, customer PII, or external URLs without the integration system's vetting.

---

## 13. When to revisit

- A class of customisations recurs across ≥ 3 tenants — promote to the platform default (becomes a Catalog change).
- Override conflicts on platform upgrades exceed 5% of affected tenants — the upgrade is too breaking; revisit the default change.
- Override depth grows past 50% of the default's fields for a meaningful fraction of tenants — the default is wrong for that segment; consider an industry-specific variant playbook.
- A regulator requests proof of a customer's playbook lineage — verify the override history export covers the required period.
- A customer admin asks for a customisation that violates § 4 — the constraint may be wrong; bring to Founders + relevant Domain Council; never relax silently.
- Override writes spike unexpectedly for a tenant — possible compromise; security event.

CTO owns the override model. Product owns the customisation surfaces. Engineering owns the merge function. Security owns the validation and audit guarantees. Customer Success owns the upgrade-conflict workflow.

---

## Cross-references

- [Company Operation Builder Catalog](Company-Operation-Builder-Catalog) — the source of platform defaults
- [Autonomy Modes](Autonomy-Modes) — the platform floors that overrides cannot cross
- [Resolution Plan Specification](Resolution-Plan-Specification) — the structure preserved across customisations
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the chat surface for customisation
- [Control Center](Control-Center) — the Playbook Editor pane
- [Action Risk Classification](Action-Risk-Classification) — the floor-class actions
- [Approval Workflow Framework](Approval-Workflow-Framework) — how approval rules are routed when customised
- [Operational Playbook Index](Operational-Playbook-Index) — the index spec_links resolve into
- [Master Blueprint Index](Master-Blueprint-Index)
