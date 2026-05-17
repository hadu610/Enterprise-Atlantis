# Dual Surface Architecture

> **Type:** Rule · **Owner:** CTO / Product · **Status:** Approved · **Applies to:** All agents · Engineering · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

Every customer-facing capability in Atlantis must be reachable from **both** the [Atlantis Manager](Atlantis-Manager-Playbook) chat **and** the [Control Center](Control-Center) UI. This is the dual-surface contract: chat and UI are two presentations over one set of APIs; they never diverge in capability, never diverge in state, and never differ in audit consequence.

> **The reframe this page makes:** *most chat-augmented platforms build a parallel chat layer that lags or contradicts the UI.* Atlantis builds the chat as a thin layer over the same API the UI uses. There is one platform, two interfaces; not two platforms loosely coupled.

---

## 1. Why this page exists

[Strategy Touchstone 12](Master-Blueprint-Index#k--strategy-touchstones) commits to the chat window as the primary surface, with the UI always available. That commitment becomes a liability if the two surfaces diverge — a customer who clicks the UI and a customer who chats with the Manager must be able to do the same things, see the same state, and produce the same audit consequences.

This page specifies the contract that makes the dual-surface promise tractable:

- **Capability parity** — every action available in one surface is available in the other.
- **State parity** — both surfaces read the same data, with the same permissions, at the same time.
- **Audit parity** — an action taken via chat and the same action taken via UI produce identical audit events.

Without these guarantees, the chat would inevitably become a thin marketing demo while real customers stay in the UI. Touchstone 12 fails. This page prevents that.

---

## 2. The architectural shape

```
┌─────────────────────────────────────────────────────────────┐
│                  HUMAN (customer admin, employee)            │
│                                                              │
│        ┌──────────────────┐    ┌──────────────────┐         │
│        │  Manager (chat)  │    │ Control Center   │         │
│        │   chat.html /    │    │     (UI)         │         │
│        │  floating widget │    │  index, build,   │         │
│        │                  │    │  workflows, etc. │         │
│        └────────┬─────────┘    └────────┬─────────┘         │
│                 │                       │                    │
└─────────────────┼───────────────────────┼────────────────────┘
                  │                       │
                  ▼                       ▼
        ┌─────────────────────────────────────────┐
        │       Platform API (one set)            │
        │   tickets · CRM · audit · approval ·    │
        │   trust score · autonomy · playbooks    │
        └──────────────────┬──────────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────────────┐
        │     Unified CRM + Unified Ticketing     │
        │            + Audit Event Store          │
        └─────────────────────────────────────────┘
```

The Manager is **a tool-using LLM client** of the same API the Control Center renders. It cannot do anything the API cannot do; it cannot bypass any permission the API enforces; it cannot produce any audit event the API does not.

---

## 3. The parity contracts

### 3.1 Capability parity

For every customer-facing capability `C` (e.g. *approve ticket*, *roll back action*, *change Autonomy Mode*, *customise playbook*, *export audit bundle*):

- `C` is reachable from the Control Center UI via a documented click path.
- `C` is reachable from the Manager via a documented intent + tool call.
- A new capability does not ship to one surface ahead of the other by more than 30 days; the temporary asymmetry is documented and time-bounded.
- A capability deprecated from one surface is deprecated from both.

The capability registry lives at `engine/parity/capabilities.yaml`. CI fails when a capability lacks an entry in either surface column.

### 3.2 State parity

Both surfaces read from the same projection cache (per [Control Center § 9](Control-Center#9-performance-envelope)). A change made through either surface invalidates the cache for both. Lag tolerance: < 30 seconds for any state visible in both.

Worked example: a customer admin chats with the Manager "Pause Finance Agent." On approval, the Manager calls the same `agent.pause` API the UI's Pause button calls. The Live Activity Stream reflects the pause within seconds in both surfaces.

### 3.3 Audit parity

A `ticket.approve` action emits the same audit event regardless of caller (Manager tool call vs UI button). The audit event carries the surface origin (`surface: "manager"` vs `surface: "ui"`) so analytics can measure surface usage, but every other field is identical: same actor, same ticket, same approval rationale, same timestamp precision.

A regulator requesting evidence of an action gets a deterministic answer regardless of how the action was initiated.

### 3.4 Permission parity

The Manager's session identity inherits the human's Role bundle exactly. There is no Manager-only capability that an admin lacks; there is no admin-only capability the Manager exceeds. Permission denial messages are the same wording in both surfaces.

---

## 4. The shared API surface

A capability exposed in either surface must first be implemented as an API endpoint with:

| Property | Requirement |
|---|---|
| Stable contract | Versioned per [API Design Standards](API-Design-Standards); breaking changes follow the deprecation policy |
| Permission enforcement | Server-side per [Identity and Access Control](Identity-and-Access-Control); never client-only |
| Audit emission | Every state-changing endpoint emits an audit event per [Resolution Plan Specification § 7](Resolution-Plan-Specification#7-plan-storage-and-retention) |
| Idempotency | Required for retry safety; idempotency key carried by both surfaces |
| Error contract | Typed errors with stable codes; the Manager and the UI render them identically |
| Documentation | Single documentation source consumed by both surface implementations |

The Manager's tool registry ([Atlantis Manager § 4](Atlantis-Manager-Playbook#4-the-managers-tool-catalogue)) is a thin wrapper over these endpoints. The Control Center's components are also thin wrappers. Neither bypasses the API.

---

## 5. What the Manager-side wrapper adds

The Manager wraps the API with the conversational layer:

| Wrapper concern | What it adds | What it does NOT add |
|---|---|---|
| Intent parsing | NLU to map "approve this" → `ticket.approve(ticket_id)` | Permission overrides; capability extensions |
| Context binding | Resolves "this" / "yesterday" / "the customer we just talked about" to concrete entity ids | New entities; speculative ids |
| Plan generation | Produces a [Resolution Plan](Resolution-Plan-Specification) before tool call | Action execution without the Plan |
| Confirmation | Waits for explicit Yes per [Conversational UX Principles § 6](Conversational-UX-Principles#6-asking-for-confirmation) | Skipping confirmation on side-effecting actions |
| Result narration | Summarises the API result for the user | Hiding errors or fabricating success |

The wrapper is the *only* layer between the user and the API on the chat side. There is no separate "chat-only" workflow that doesn't go through the API.

---

## 6. What the UI-side surface adds

The Control Center wraps the same API with the visual layer:

- Forms with field validation matching the API's validation rules.
- Tables, charts, and filters that read from the projection cache.
- Bulk operations that batch API calls with shared rationale capture.
- Drag-and-drop, keyboard shortcuts, and other interaction patterns suited to mouse and keyboard.

These are *presentation* additions; no business logic the API doesn't already enforce.

---

## 7. Capability registry — the parity ledger

A YAML file at `engine/parity/capabilities.yaml` enumerates every capability and how it surfaces:

```yaml
- id: ticket.approve
  description: Approve a pending ticket
  api_endpoint: POST /api/v1/tickets/{id}/approve
  manager_intent_examples: ["approve this", "approve ticket {id}", "yes, do it"]
  manager_tool: ticket.approve
  ui_path: Control Center > Approval Queue > [Approve button]
  permission: ticket.approve
  audit_event: ticket_approved
  added_in_phase: 1
- id: agent.pause
  description: Pause a named agent
  api_endpoint: POST /api/v1/agents/{name}/pause
  manager_intent_examples: ["pause {agent}", "stop {agent}"]
  manager_tool: agent.pause
  ui_path: Control Center > Fleet View > [Row action: Pause]
  permission: agent.pause
  audit_event: agent_paused
  added_in_phase: 2
```

CI checks:

- Every entry has both `manager_tool` and `ui_path` (or has an explicit `parity_exception:` with a reason and an expiry date).
- Every entry's `permission` resolves in [Identity and Access Control](Identity-and-Access-Control)'s registry.
- Every entry's `audit_event` resolves in the event schema registry.

A pull request adding a capability must update this file or CI fails.

---

## 8. Time-bounded parity exceptions

There are legitimate reasons one surface ships a capability ahead of the other (engineering load balancing, beta testing). Exceptions are allowed but **time-bounded**:

| Property | Requirement |
|---|---|
| Recorded | `parity_exception:` block in the capability entry |
| Reason | Typed rationale |
| Expiry | ISO date; max 30 days from now |
| Tracked | Visible in the Capability Parity Dashboard |
| Reviewed | Founders review expiring exceptions weekly |

Exceptions that expire without parity being closed escalate to a Sev3 incident; the founders + CTO triage.

---

## 9. What this rules out

The dual-surface contract rules out architectural patterns that are common in chat-bolted-onto-existing-platforms:

| Pattern | Why we reject it |
|---|---|
| **Chat as a separate orchestrator with its own state** | Two systems of record → state drift → wrong actions |
| **Chat-only capabilities (e.g. "this only works in chat")** | Forces users to chat for things; violates "UI always available" |
| **UI-only capabilities (e.g. "you have to click here for this")** | Forces users to UI; violates "chat as primary" |
| **Different permission models in the two surfaces** | Security holes; one surface becomes a permission-bypass vector |
| **Different audit emissions in the two surfaces** | Compliance failure; auditors get different answers depending on caller |
| **Cached chat-side data with no invalidation on UI write** | State drift; user confusion; trust failure |

If any of these patterns appears in a design, the design is wrong.

---

## 10. Surface usage metrics

The platform measures the chat/UI split for each capability:

| Metric | Purpose |
|---|---|
| **chat-share per capability** | Where chat is < 30%, the chat NLU may be missing intents for that capability |
| **chat-failure rate per capability** | When the Manager attempts but fails to call a capability, the wrapper has a gap |
| **UI-fallback rate per session** | How often a chat session ends with the user opening the UI to finish — indicates the chat is incomplete for that flow |
| **median time-to-action per capability per surface** | Diagnostic for friction; high UI time may mean the form is too complex; high chat time may mean too many confirmations |
| **per-capability error parity** | Errors emitted should be the same types in both surfaces; divergence is a bug |

Touchstone 12 commits to "the majority of customer actions" through chat. The metric for that commitment is **chat-share-of-actions** weighted by capability importance — see [Strategy Touchstones](Master-Blueprint-Index#k--strategy-touchstones).

---

## 11. Edge cases

| Case | Resolution |
|---|---|
| Bulk operations (50+ items) | Both surfaces support; UI presents a selection grid; chat asks for a *pattern* and shows a 3-sample preview |
| Long-running operations (> 30s) | Both surfaces show progress; both can leave and return; the Live Activity Stream renders progress in both |
| Capability requires data the user doesn't have at hand (file upload) | Chat surfaces an inline upload affordance; UI shows the standard upload control |
| User starts in chat, switches to UI mid-flow | The Manager surfaces a deep link to the current state; the UI opens with the same context (selected entity, draft form values) |
| User starts in UI, switches to chat mid-flow | Same; the Manager picks up the open form / selected entity |
| Capability is in a phased rollout to some tenants | Both surfaces respect the rollout flag; either both have it or neither does |

The state preservation across surface switches uses the tenant's session store with a 24-hour TTL.

---

## 12. Forbidden

- **Implementing a capability in one surface without the API behind it.** Always API-first; surfaces wrap the API.
- **Bypassing the API from either surface.** No direct CRM writes from the chat; no direct CRM writes from the UI.
- **Different validation rules per surface.** Validation is server-side; both surfaces re-render the same errors.
- **Storing chat-specific state outside the platform's stores.** Conversation memory is tenant-store-scoped; no shadow database.
- **Surface-specific permissions.** A permission applies to a capability, not to a surface.
- **Surface-specific audit fields.** The surface origin is one field; everything else is identical.
- **Parity exceptions without an expiry date.** Indefinite exceptions are technical debt by definition.
- **Releasing a capability to chat that the UI cannot reach within 30 days.** Even if engineering prioritises chat, the UI must follow.

---

## 13. When to revisit

- A capability's parity exception is approaching expiry — schedule the parity closure work.
- A capability's chat-share is < 30% for > 90 days — investigate; the chat NLU is probably missing intents.
- A capability's UI-fallback rate is > 50% — chat is incomplete for that flow; design the missing affordance.
- Surface-divergent bugs reported — re-run the capability parity audit; the API is probably leaking state.
- A new agent or surface is added (e.g. a mobile app) — the contract extends to that surface; do not exempt mobile.
- The shared API itself is breaking — the surfaces both break together, and the deprecation policy applies to both.

CTO owns the contract. Product owns the surface usage metrics. Engineering owns the capability registry. Founders own the Touchstone 12 commitment that this page makes operational.

---

## Cross-references

- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the chat surface
- [Control Center](Control-Center) — the UI surface
- [Conversational UX Principles](Conversational-UX-Principles) — how the chat surface behaves
- [API Design Standards](API-Design-Standards) — the shared API contract
- [Identity and Access Control](Identity-and-Access-Control) — the permission model both surfaces enforce
- [Resolution Plan Specification](Resolution-Plan-Specification) — the audit emission contract
- [Live Activity Stream](Live-Activity-Stream) — both surfaces render this in parity
- [Architecture Principles](Architecture-Principles) — the dual-surface principle is added there as a top-level rule
- [Master Blueprint Index](Master-Blueprint-Index)
