# Live Activity Stream

> **Type:** Blueprint · **Owner:** Product / Engineering · **Status:** Approved · **Applies to:** All agents · All customer admins · All employees · **Jurisdiction:** Global · **Last reviewed:** 2026-05-17

## Summary

The **Live Activity Stream** is the always-on real-time view of every action by every agent across every department in a customer's tenant. It is the spectator-grade surface that lets a human sit back and watch their company run — like watching their civilization in a real-time strategy game — instead of having to click through reports to learn what already happened.

The Stream runs in every [Autonomy Mode](Autonomy-Modes). The Mode controls whether the human gates actions; visibility is universal.

> **The reframe this page makes:** *most enterprise SaaS shows you what already happened (reports) or what needs doing (queues); almost none show you the live execution itself.* The Live Activity Stream is the differentiator that makes Silent mode acceptable: even when humans are not gating, they can still watch and intervene. See [Strategy Touchstone 13](Master-Blueprint-Index#k--strategy-touchstones).

---

## 1. Why this page exists

The [Control Center](Control-Center) page describes five pillars (Fleet View, Ticket Ledger, Activity Log, Approval Queue, Trust Score) but treats them as separate dashboards a manager navigates between. That model works for an auditor reviewing yesterday. It does not work for a customer who wants to spectate execution as it happens.

The Live Activity Stream is the **integration of the five pillars into a single real-time view**. It is not a sixth pillar — it is a different presentation of the same underlying substrates, optimised for ambient spectating rather than focused investigation.

The Age of Empires analogy is precise: a strategy-game player does not click through reports to learn what their villagers built; they watch the map. The villagers move, buildings rise, units march, status indicators glow green or red. The player intervenes when something looks wrong. Atlantis aims to give customer admins the same spectating experience for their AI workforce.

---

## 2. The four panes

The Live Activity Stream is a single page with four panes, all live, all reading from the same event firehose.

```
┌──────────── LIVE ACTIVITY STREAM ─────────────────────────────┐
│                                                                │
│  ┌─ At-a-glance health ────────────────────────────────────┐  │
│  │  $X today · N actions · G guardrails · E errors        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Fleet ─────────────┐  ┌─ Department panels ───────────┐  │
│  │ agent: HR Agent     │  │  HR      Fin     Mkt          │  │
│  │   ● working         │  │  ●●      ●●      ●            │  │
│  │   ticket: hire-184  │  │  3 act   5 act   2 act        │  │
│  │   conf: 87          │  │  0 err   1 warn  0            │  │
│  │ ────────────────    │  │                                │  │
│  │ agent: Finance Agt  │  │  Sales   Legal   Ops    Dev    │  │
│  │   ● working         │  │  ●●●     ●       ●●     ●●●●   │  │
│  │   ticket: ar-2901   │  │  4 act   1 act   2 act  6 act  │  │
│  │   conf: 92          │  │                                │  │
│  └─────────────────────┘  └────────────────────────────────┘  │
│                                                                │
│  ┌─ Ticker ────────────────────────────────────────────────┐  │
│  │ 14:32:08  Finance Agt  ✓ committed   ar-2901  $1,247    │  │
│  │ 14:32:01  HR Agent     → drafting    hire-184  v2 plan  │  │
│  │ 14:31:54  Marketing    ⚠ awaiting    blog-92   ~ pending│  │
│  │ 14:31:47  Dev Agent    ✓ committed   pr-4421   merged   │  │
│  │ 14:31:39  Finance Agt  ⤺ rolled back ar-2900  customer  │  │
│  │ 14:31:22  HR Agent     ✓ committed   pto-77    approved │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2.1 At-a-glance health row

The top strip shows four numbers, updated every 5 seconds:

| Metric | What it shows |
|---|---|
| **Spend today** | Cumulative irreversible-commitment dollars across all agents today |
| **Actions today** | Count of `action_committed` events today |
| **Guardrails triggered** | Count of times a platform-floor guardrail blocked an action and routed it for approval today |
| **Customer-impacting errors** | Count of `gate_failed` or `rolled_back` events that affected an external party today |

Each number is clickable; clicking opens the Activity Log filtered to that subset.

### 2.2 Fleet pane

A live grid of every agent in the tenant, one row per agent. Same column set as [Control Center § 3.1 Fleet View](Control-Center#31-fleet-view), refreshed within 5 seconds of any backend event.

Each row is collapsible (showing only the current state) or expandable (showing the agent's last 10 actions, current confidence, current Trust Score, current Autonomy Mode).

### 2.3 Department panels

A compact summary grid — seven (or more) department tiles, each showing: count of agents online, count of actions in flight, count of pending approvals, count of warnings/errors today, current SLA adherence colour (green/amber/red).

Each tile is a deep link to the [Department View](Control-Center#32-ticket-ledger) for that department.

### 2.4 Ticker

The defining surface of the Stream. A chronological scroll of every state-changing event across every agent. The ticker is what makes the experience feel live.

**Each ticker row contains:**

| Field | Example |
|---|---|
| Timestamp (tenant timezone, second precision) | `14:32:08` |
| Agent name | `Finance Agt` |
| Event kind icon | `✓` committed · `→` drafting · `⚠` awaiting · `⤺` rolled back · `✗` failed · `🔒` guardrail blocked |
| Ticket id | `ar-2901` |
| Inline summary | `$1,247` — the action's summary line (element 1 of its [Resolution Plan](Resolution-Plan-Specification)) |
| Confidence dot | colour-coded per [Confidence and Escalation Rules](Confidence-and-Escalation-Rules) |
| Risk class chip | `Financial` / `Write` / `External` / `Delete` per [Action Risk Classification](Action-Risk-Classification) |
| Reversibility chip | `↺` reversible · `↺?` partial · `⊘` irreversible |

Clicking a row expands it inline to show the full [Resolution Plan](Resolution-Plan-Specification) and a button row:

| Button | When visible | Effect |
|---|---|---|
| **Pause agent** | Customer admin only, when agent is actively working | Sends `pause` signal; takes effect on the agent's next decision point |
| **Roll back** | When reversibility is `fully_reversible` or `partially_reversible` and within retention | Opens the rollback flow per [Control Center § 4](Control-Center#4-rollback-as-a-ticket-operation) |
| **Undo (reversibles only)** | Only for the 30 seconds after a Silent-mode execution; reversible actions only | One-click rollback without re-approval routing |
| **Investigate** | Always | Opens the ticket's full thread in a side panel |

---

## 3. The 30-second undo affordance

In Silent mode, reversible actions display a countdown affordance for the first 30 seconds after execution. Clicking the affordance triggers `Roll back` without routing through the usual re-approval queue — the action is treated as "the human caught it within the immediate-correction window."

**Rules:**

- Only `fully_reversible` and `partially_reversible` actions display the affordance.
- The 30-second clock starts at the `action_committed` audit event.
- After 30 seconds elapse, the affordance disappears and normal rollback rules apply (which usually requires re-approval).
- An undo within the 30-second window still produces an audit event (`action_undone_in_window`) — silent only with respect to the approval queue, not with respect to the audit log.
- A customer admin can extend the window to up to 5 minutes via a tenant setting; the floor is 0 (admin can disable the affordance entirely if they prefer the standard rollback path).

This affordance is what makes Silent mode safe in practice: most agent errors are caught visually within the first few seconds, and the platform makes correction nearly free during that window.

---

## 4. Replay control

The ticker is the live present, but the human can scrub backward. A timeline control at the bottom of the page lets the viewer:

- Set a specific timestamp to view ("what was happening at 14:00 yesterday")
- Play forward at 1×, 4×, 16×, or 64× speed
- Pause and inspect any row

Replay reads from the Activity Log, not from the live event stream. It produces an identical visual at any past time within the audit log's retention window (per [Rollback Procedures § 2](Rollback-Procedures#2-retention)).

This makes the Live Activity Stream a unified surface for both real-time and historical analysis — there is one mental model the user learns, not two.

---

## 5. Filtering

The Live Activity Stream defaults to **everything, live, for the viewer's permission scope**. Filters narrow the view:

| Filter | Default | Values |
|---|---|---|
| Department | All visible to viewer | One-of-many |
| Agent | All visible to viewer | One-of-many |
| Event kind | All | committed / drafting / awaiting / rolled-back / failed / guardrail-blocked |
| Risk class | All | Read / Write / External / Financial / Delete |
| Time window | Last 1 hour, live tail on | Customizable; live tail toggleable |
| Confidence | All | Threshold slider; e.g. only show < 70 |

Filters are URL-encoded so a customer admin can share a filtered view with a colleague: "look at this".

---

## 6. Event schema (the underlying contract)

Every event surfaced in the ticker conforms to the same JSON schema. This is the contract every agent emits to, and the only contract the Stream depends on.

```json
{
  "event_id": "audit-2026-05-17T14:32:08.041Z-7a9c",
  "ticket_id": "ar-2901",
  "tenant_id": "acme",
  "agent": {
    "name": "finance_agent",
    "title": "Finance Agent",
    "department": "Finance"
  },
  "kind": "action_committed",
  "risk_class": "Financial",
  "reversibility": "fully_reversible",
  "summary": "Reconcile Stripe payout $1,247 against AR ledger",
  "confidence": 92,
  "autonomy_mode": "Silent",
  "plan_id": "plan-2026-05-17T14:32:01.000Z-7a9c",
  "links": {
    "plan": "/plan/plan-2026-05-17T14:32:01.000Z-7a9c",
    "ticket": "/ticket/ar-2901",
    "inverse": "/plan/plan-2026-05-17T14:32:01.000Z-7a9c#rollback"
  },
  "ts": "2026-05-17T14:32:08.041Z"
}
```

This schema is the input to (a) the ticker rendering, (b) the audit log, (c) the daily digest email, (d) the export-for-compliance bundle, (e) the Atlantis Manager's investigation queries. One write; five readers. Implementation lives in `engine/audit/event-schema.ts`.

---

## 7. Performance envelope

The "live" property is non-negotiable. Lagging events break the spectating experience. The envelope:

| Operation | p50 | p95 | p99 |
|---|---|---|---|
| Event emit → ticker render | < 300 ms | < 800 ms | < 2 s |
| Filter application | < 100 ms | < 400 ms | < 1 s |
| Replay seek (any past timestamp) | < 500 ms | < 1.5 s | < 4 s |
| 30-second undo execution | < 200 ms (within window) | < 600 ms | < 1.5 s |
| Initial page load (1 hour history + live tail) | < 800 ms | < 2 s | < 5 s |

Achieved via:

- A pub/sub event bus with per-tenant channels (engineering choice; Redis Streams or NATS JetStream candidates).
- Server-side rendering of the initial 1-hour window with server-sent events for the live tail.
- Per-tenant projection cache that pre-computes the four panes; the Stream reads the cache, not the raw event store.

Detailed engineering target lives in [Observability Standards § 2 SLOs](Observability-Standards#2-service-level-objectives-slos).

---

## 8. Permissions and what each viewer sees

The Stream's content is permission-scoped per [Identity and Access Control](Identity-and-Access-Control). Three viewer profiles:

| Viewer | Sees | Cannot see |
|---|---|---|
| **Employee** | Only events for tickets they originated or are assigned to; only agents acting on their entities | Cross-department activity, other employees' tickets |
| **Department Manager** | All events for their department; agents in their department; tickets in their department | Other departments unless `cross_dept_read` is granted |
| **Customer Admin** | All events across all departments; all agents in the tenant | Other tenants (hard wall) |

A non-admin viewer who lacks permission to see a specific event sees the event redacted to its existence ("Finance Agent committed an action") without details, or hidden entirely depending on the tenant's redaction policy.

The Atlantis founder / Atlantis support staff **cannot see customer tenants** without an explicit, time-boxed `support_session` access grant signed by the customer admin per [Security and Data Policy](Security-and-Data-Policy).

---

## 9. The daily digest

Customers in Silent mode (and any customer who opts in) receive a daily digest email at end-of-day in their tenant timezone. The digest is the asynchronous companion to the live stream — what the customer would have watched, summarised.

**Digest contents:**

- Total actions today, total spend, total guardrails triggered, total errors
- Top 5 actions by impact (financial value, recipient count, entity count affected)
- Any anomalies detected by the anomaly rail per [Autonomy Modes § 5](Autonomy-Modes#5-safety-rails-active-in-silent-mode-and-approval-mode)
- A "review these" section listing actions where confidence was below 70 or where reversibility was `irreversible`
- Trust Score delta vs yesterday
- A deep link to replay the day in the Live Activity Stream

The digest is generated from the same event store the Stream reads. No separate aggregation pipeline.

---

## 10. The Atlantis Manager's relationship to the Stream

The [Atlantis Manager](Atlantis-Manager-Playbook) is the conversational surface that mirrors the Stream. A customer admin can:

- Ask "what's happening right now?" → Manager summarises the live tail
- Ask "show me everything Finance Agent did today" → Manager surfaces the Stream filtered, plus a textual summary
- Ask "why did Finance Agent roll back ar-2900?" → Manager opens the row and answers from the Plan
- Ask "set Finance Agent to Approval mode" → Manager produces a configuration Plan; on approval, the agent's mode changes and the Stream reflects it within seconds

The Stream and the Manager are two surfaces over the same event firehose. They never diverge.

---

## 11. Forbidden

- **Hiding events from the tenant.** Every event the customer's agents emit is visible to the customer (within their permission scope). The platform does not gate visibility for any reason.
- **Cross-tenant leak.** Every event carries `tenant_id`; the Stream's read path enforces tenant scope at the API gateway, not just the UI.
- **Editing event content.** Audit events are immutable. The Stream displays them; it does not amend.
- **Batching for visual smoothness.** Events render the moment they commit; no batching for "smoother animations" or similar.
- **Skipping the Plan link.** Every event row links to its Plan; the Plan is the answer to "why".
- **Differential UX between modes.** The Stream looks identical in Drafting, Approval, and Silent modes. Only the event kinds vary (drafting vs awaiting vs committed). The customer learns one surface, not three.

---

## 12. When to revisit

- A customer reports "I can't tell what's happening" — usually a filter / density problem; revisit defaults.
- Live latency exceeds the p95 target in a tenant — review the projection refresh and the event bus topology; do not paper over with batching.
- The 30-second undo affordance is used > 1% of Silent-mode executions — Silent mode may be too aggressive a default for this tenant; recommend Approval mode.
- The replay control is used for forensics more often than for ambient curiosity — possibly indicates the live ticker is too noisy; consider a "quiet mode" filter preset.
- A regulator asks for a tamper-evidence proof of the event stream — verify the per-event hash chaining and signed-export path per [Observability Standards](Observability-Standards).
- An eighth department is added — confirm the department panel grid still fits and the colour coding remains legible.

Product owns the Stream UX. Engineering owns the event bus and the projection cache. Security owns the permission scoping. Founders own the Touchstone 13 framing.

---

## Cross-references

- [Control Center](Control-Center) — the five-pillar surface this Stream integrates
- [Autonomy Modes](Autonomy-Modes) — Drafting / Approval / Silent; the Stream is always-on in all three
- [Resolution Plan Specification](Resolution-Plan-Specification) — every ticker row links to a Plan
- [Action Risk Classification](Action-Risk-Classification) — the risk-class chips
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules) — the confidence dots
- [Rollback Procedures](Rollback-Procedures) — what the undo affordance executes
- [Identity and Access Control](Identity-and-Access-Control) — the permission scoping
- [Observability Standards](Observability-Standards) — the event store and SLOs
- [Atlantis Manager Playbook](Atlantis-Manager-Playbook) — the conversational surface paired with the Stream
- [Approval Workflow Framework](Approval-Workflow-Framework) — the approval queue the Stream surfaces
- [Strategic Considerations § "The Trust Score is the sales tool"](Strategic-Considerations#the-trust-score-is-the-sales-tool) — the commercial framing this surface extends
- [Master Blueprint Index](Master-Blueprint-Index)
