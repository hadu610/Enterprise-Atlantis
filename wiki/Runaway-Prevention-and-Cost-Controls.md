# Runaway Prevention and Cost Controls

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-16

## Summary

Two failure modes can destroy a customer relationship (and a credit card) in hours: **agents stuck in a loop** burning tokens against the same problem, and **cascading workflows** where one trigger fires N more that fire N more again. This page is the platform's authoritative defence against both.

Every rule below is **a hard limit enforced in code**, not a guideline. None can be disabled by customer config, tenant policy, or platform admin without a CTO-signed exception. The cost ceiling is a feature of the platform; it does not relax under pressure.

Real industry incidents that motivate this page:

- Public AI agent products in 2024–2025 produced 5–6 figure cost spikes from prompt regressions, runaway retries, and self-triggering workflows.
- Replit's AI agent deleted a production database in July 2025; cost-control discipline is part of the same posture as destructive-action discipline.
- The most expensive incidents are the ones discovered at month-end on the bill, not at minute-1 on the dashboard.

---

## 1. The three failure modes we prevent

| Failure mode | What it looks like | Example trigger |
|---|---|---|
| **Loop** | Agent retries the same step indefinitely | Validation gate fails; agent re-runs identical proposal expecting different result |
| **Token explosion** | One task consumes 10×–100× normal tokens | Prompt regression causes the model to enumerate all data when a sample was needed |
| **Cascade** | Workflow triggers more workflows recursively | Agent A files a ticket that triggers Agent B, which files a ticket that re-triggers Agent A |

A single uncaught instance of any of these can produce a four- or five-figure cost spike in under an hour. Every defence below is sized for that timescale.

---

## 2. Hard limits — per agent task

These are non-negotiable. The agent runtime aborts the task if any is exceeded; the abort itself is logged and capped.

| Limit | Default | Notes |
|---|---|---|
| Max LLM API calls | **50** | Per single task, across all model classes |
| Max reasoning iterations | **25** | The agent's "think → act → observe" loop cannot exceed this |
| Max external API calls | **100** | Per single task, across all integrations |
| Max parallel tool calls | **5** | Per reasoning iteration |
| Max wall-clock time | **300s** (`lookup_fast`) / **600s** (`reasoning_standard`) / **1800s** (`reasoning_premium`) | Includes all I/O and reasoning |
| Max output tokens | per [AI Model and Prompt Standards § 12](AI-Model-and-Prompt-Standards#12-token-budgets) | Budget is hard; agent cannot extend |
| Max input tokens | per [AI Model and Prompt Standards § 12](AI-Model-and-Prompt-Standards#12-token-budgets) | Retrieval, not context-stuffing |
| Max retries per LLM call | **2** | With exponential backoff; not configurable |
| Max retries per external API call | **3** | With backoff and jitter |

When an agent approaches a limit (80%), it is **forced to escalate**. It does not retry. It does not "try a different angle." It escalates with what it has.

## 3. Hard limits — per workflow

Workflows that touch multiple agents or multiple entities have their own ceiling.

| Limit | Default |
|---|---|
| Max workflow depth (saga steps) | **10** |
| Max parallel agent invocations within one workflow | **10** |
| Max workflow wall-clock | **1 hour** (then escalate, do not abort the saga in-flight) |
| Max recursive workflow triggering | **0** — workflows cannot trigger workflows that include any agent already in the trace |
| Max workflow restart attempts | **2** |

**Recursion is forbidden.** The Orchestration Engine maintains a workflow trace; if a new workflow would include an agent already in the trace for the same root, it is **rejected at the orchestration layer**, not allowed to fail silently downstream. See [Cross-Agent Coordination](Cross-Agent-Coordination) for the trace mechanism.

## 4. Per-agent rate limits

Smoothing limits, separate from the per-task ceilings. These catch the "lots of normal-looking tasks" failure mode.

| Limit | Default | What happens at limit |
|---|---|---|
| Tasks per hour per agent per tenant | **1,000** | Excess tasks queued; sustained queue depth triggers alert |
| Errors per hour per agent per tenant | **50** | Circuit breaker trips; agent disabled pending review |
| Escalations per hour per agent | Per [Confidence and Escalation Rules § 5](Confidence-and-Escalation-Rules#5-the-escalation-budget) | Agent halts new tasks until drained |

Tenant-specific overrides require explicit signed approval at contract time, are visible in the customer console, and cannot exceed 2× the default.

## 5. Per-tenant budget caps

A daily LLM-spend budget per tenant per agent. Independent of headcount or tier.

| Phase | Default per-tenant daily LLM budget |
|---|---|
| Starter | $50 / day / agent |
| Growth | $300 / day / agent |
| Enterprise | $1,500 / day / agent |
| Enterprise Regulated | Tenant-specified ceiling, default $5,000 / day / agent |

**Thresholds:**

- **80% consumed** — alert to customer admin AND platform Engineering.
- **100% consumed** — soft cap. Agent halts new tasks for the day; in-flight tasks finish.
- **150% consumed** (only possible if soft cap is overridden by admin) — hard cap. Agent disabled until next budget cycle.

Customer admins see the budget consumption in the console at all times. They can raise it within their tier ceiling; raising above tier ceiling requires our Customer Success Manager + a signed addendum.

## 6. Velocity caps (cost anomaly detection)

Independent of budget, the platform detects **rate-of-change anomalies**:

| Detector | Threshold | Action |
|---|---|---|
| Daily spend > 3× rolling 24h average | Per tenant per agent | Soft cap activated; alert to customer admin + Engineering |
| Daily spend > 10× rolling 24h average | Per tenant per agent | Hard cap activated; agent disabled pending review |
| Token-per-task > 5× rolling avg for that task type | Per agent globally | Prompt regression suspected; eval suite re-run |
| New peak-hour spend (top 1% of historical) | Per platform | Page on-call |

These detectors catch the slow-burn cases that don't trip a single ceiling but accumulate.

## 7. Platform-wide circuit breakers

Global protections that engage on platform-wide signals:

| Signal | Trigger | Effect |
|---|---|---|
| Global error rate > 5% over 5 min | Across all agents | Stop new task admission; drain queues; page on-call |
| LLM provider error rate > 25% over 5 min | Per provider | Routing layer fails over to secondary provider |
| Cost variance vs forecast > 50% (hourly) | Platform total | Page Finance on-call; freeze new tenant onboarding until investigated |
| A single agent template's failure rate > 25% | Per template across tenants | Template disabled across the platform; rollback in progress |

These breakers exist for the case where many tenants experience the same problem at once — typically a prompt regression that escaped pre-promotion evals.

## 8. Kill switches

Three layers of explicit emergency stop:

### Customer admin kill switch

A single button in the customer console: **"Pause all my agents."**

- Stops new task admission for the tenant.
- In-flight tasks finish (graceful drain) or can be force-cancelled with confirmation.
- Reactivation requires the same admin or a designated co-approver.
- Available in **every phase**, including Phase 1 Drafting. Not a feature gate.

### Platform admin emergency stop

A platform-level command our SRE on-call can execute:

- **Halt all agents** (global) — used in confirmed runaway, provider compromise, or major incident.
- **Halt one agent template** (e.g. all HR Agents across all tenants) — used in template-level bug.
- **Halt one tenant** — used in tenant-specific runaway or security event.

All three are audit-logged with the operator identity and rationale.

### Automatic kill switch

The platform itself halts an agent without human intervention when:

- The agent exceeds its per-task hard limits twice in 24 hours.
- The circuit breaker on errors trips.
- The velocity cap detects > 10× anomaly.
- Validation gate failure pattern matches a known catastrophic mode (e.g. attempted scope escalation).

Automatic halts always notify the customer admin immediately and require explicit human reactivation. The platform never silently re-enables.

## 9. Loop detection

The agent runtime maintains a small **action fingerprint** for each step:

```
fingerprint = hash(action_type, target_entity_id, key_payload_fields)
```

Within a single task:

- The same fingerprint repeating > 2 times → loop detected, task aborted.
- Identical fingerprints across separate tasks within 60s for the same agent + entity → flagged as repeat-attempt pattern; escalated.

Across workflows:

- A workflow trace containing the same `(agent_id, entity_id, action_type)` more than once → rejected at orchestration layer (see [Cross-Agent Coordination § 6](Cross-Agent-Coordination#6-the-action-queue-object--schema)).

## 10. Detection and observability

These signals feed [Observability Standards § 6](Observability-Standards#6-alerting) alerting:

| Signal | Source | Page-worthy threshold |
|---|---|---|
| Token consumption rate | LLM router | > 2× hourly forecast for 15 min |
| Per-task token p99 | Agent runtime | > 5× rolling avg for that task type |
| Workflow depth p99 | Orchestration engine | > 7 |
| Agent error rate | Audit log | > 5% for 5 min |
| Circuit breaker activation | Any breaker | Any activation → page |
| Kill switch activation | Console / admin | Any activation → page (informational, not failure) |
| Cost-per-customer-per-day | FinOps pipeline | > 3× rolling 24h average |

Dashboards display these per tenant per agent in the [Trust Score](AI-Model-and-Prompt-Standards) context — runaway prevention is part of the Trust Score input set.

## 11. Recovery procedures

When a runaway is detected and halted:

1. **Drain safely.** In-flight tasks are not force-killed (they may have partial state). They are allowed to complete their current step, then routed to human review queue.
2. **Quarantine.** The originating agent template, prompt version, and triggering ticket(s) are isolated. No re-runs while the cause is investigated.
3. **Diagnose.** Engineering reviews the audit trail: which step looped, what the agent thought, what changed (model, prompt, data).
4. **Fix or revert.** Either fix forward (validated eval) or revert the prompt/model/code change.
5. **Customer comms.** If the runaway produced billable spend, the customer is notified within 24 hours; cost overage is credited at our cost. This is non-negotiable — the customer should never pay for our runaway.
6. **Postmortem.** Sev1 or Sev2 per [Incident Response Playbook § 1](Incident-Response-Playbook#1-severity-definitions). Action items target prevention of the class, not the instance.

## 12. Cost-overage policy

Stated plainly so there is no ambiguity:

- If a customer's cost overage is caused by **platform malfunction** (loop, regression, our bug) — **we credit it**.
- If a customer's cost overage is caused by **legitimate customer-driven volume** — they pay per the agreement, and we work with them on tier upgrade or volume discount.
- If a customer's cost overage is caused by **customer-side abuse** (e.g. their admin scripts a denial-of-wallet attack against their own tier) — we credit the first incident, work with the admin on prevention, then enforce the contract on repeat.

The customer's bill is **capped at 1.5× the published tier ceiling for any single month**, no matter what. If the platform somehow burns past that, the burn is ours.

## 13. Testing requirements

Before any prompt or model change reaches production:

- **Cost regression eval** — token-per-task must not increase > 10% over baseline.
- **Loop test** — synthetic task with conflicting gates must abort within 25 iterations.
- **Cascade test** — synthetic workflow with cyclic dependencies must be rejected at orchestration layer.
- **Kill switch test** — kill switch must halt agent within 10 seconds in a controlled scenario.

These are part of [Testing Strategy § 8](Testing-Strategy#8-eval-suites-agent-behaviour). Failures block promotion.

## 14. Forbidden

- Unbounded recursion in any agent reasoning code (linter blocks).
- Retry loops without an explicit max-attempts and exponential backoff.
- Self-triggering workflows (a workflow whose terminal step re-creates itself).
- Hardcoding a limit override "temporarily" — every override is a flag, every flag has a sunset.
- Disabling a circuit breaker without a CTO-signed incident exception.
- Releasing a prompt change without passing the cost regression eval.
- Per-tenant overrides exceeding 2× tier default without contract addendum.
- Tools that wrap "retry on failure" without a max-attempts cap.

---

## When to revisit

- A cost incident occurs that any of the above limits should have caught — investigate the gap.
- A new agent class is added that the limits don't fit (e.g. long-running batch analytics tasks may need separate limits).
- LLM provider pricing changes materially — re-baseline daily budgets.
- A customer requests higher limits than 2× tier default — review and update tier definitions.
- Quarterly review by Engineering + Finance + CTO.

CTO is the accountable owner. SRE on-call owns runtime enforcement.

---

## Cross-references

- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [FinOps Strategy](FinOps-Strategy)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Cross-Agent Coordination](Cross-Agent-Coordination)
- [Architecture Principles](Architecture-Principles)
- [Incident Response Playbook](Incident-Response-Playbook)
- [Observability Standards](Observability-Standards)
- [Pricing and Packaging](Pricing-and-Packaging)
- [Testing Strategy](Testing-Strategy)
- [Security and Data Policy](Security-and-Data-Policy)
- [Prompt Injection Defence and Secret Protection](Prompt-Injection-Defence-and-Secret-Protection)
