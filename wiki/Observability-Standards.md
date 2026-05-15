# Observability Standards

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

Every service emits structured logs, metrics, and traces from the moment it goes to staging. Observability is not optional ([Architecture Principles § 7](Architecture-Principles#7-observability-is-not-optional)). This page is the canonical standard for what to emit, how to emit it, and how to alert on it.

We follow Google SRE's [four golden signals](https://sre.google/sre-book/monitoring-distributed-systems/) and use [OpenTelemetry](https://opentelemetry.io/) as our instrumentation standard.

---

## 1. The four golden signals

Every service exposes:

- **Latency** — distribution of request duration (p50, p95, p99)
- **Traffic** — requests per second per endpoint
- **Errors** — rate of failed requests, by error class
- **Saturation** — utilisation of CPU, memory, connections, queue depth

These four are the minimum dashboards every service must have before passing readiness review.

## 2. Service Level Objectives (SLOs)

Every service declares SLOs. SLO targets live in `slo.yaml` per service:

```yaml
service: hr-agent
slos:
  - name: ticket_processing_p95_latency
    objective: 5s
    window: 28d
    target: 99%
  - name: availability
    objective: success_ratio
    window: 28d
    target: 99.9%
```

- Error budget = `1 - target`. We burn it knowingly.
- Burn-rate alerts at 5%, 10%, and 25% of budget consumed in 1 hour / 6 hours / 3 days.
- Sustained SLO violation triggers a "feature freeze" — only fixes ship until the budget recovers.

## 3. Logging

### Format

- **Structured JSON only.** Free-text logs are forbidden.
- One log line = one JSON object.

### Required fields

| Field | Description |
|---|---|
| `timestamp` | ISO 8601 UTC with sub-second precision |
| `level` | `debug` \| `info` \| `warn` \| `error` \| `fatal` |
| `service` | Service identifier |
| `version` | Build SHA |
| `correlation_id` | Trace-correlated request ID |
| `actor_kind` | `human` \| `agent` \| `system` |
| `actor_id` | Actor identity |
| `tenant_id` | Tenant scope (omitted for platform-internal events) |
| `event` | Short event name (snake_case) |
| `message` | Human-readable description |

### Optional fields

`workflow_id`, `ticket_id`, `agent_id`, `data_source`, `confidence`, plus event-specific fields prefixed by category.

### Levels

- `debug` — only in non-production environments
- `info` — normal operations
- `warn` — recoverable anomaly
- `error` — request failed but service is healthy
- `fatal` — service is going down

### PII redaction

The logger redacts known PII patterns at the boundary. Agents cannot bypass the redactor — there is no free-form log path.

## 4. Metrics

### Naming convention

`<service>_<resource>_<unit>` in `snake_case`, [Prometheus conventions](https://prometheus.io/docs/practices/naming/).

Examples:

- `hr_agent_ticket_processing_seconds`
- `data_bridge_sync_failures_total`
- `validation_gate_failures_total{gate="business_logic"}`

### Cardinality

- Labels must be bounded. Tenant ID is acceptable (bounded by paying customers). User ID is NOT — it's unbounded.
- High-cardinality data lives in traces or audit events, not metrics.

### Required metrics per service

- Request rate (per endpoint)
- Request duration histogram (per endpoint)
- Error rate (per endpoint, per error class)
- CPU / memory / open connections (from infrastructure layer)
- Custom business metrics (e.g. tickets processed, agent escalations, validation gate failures)

## 5. Distributed tracing

- Every external request gets a trace ID at the edge.
- Every service propagates it via W3C trace context headers.
- Every async operation (queue message, scheduled job, agent task) carries the trace ID.
- Sampling: 100% for errors; 10% for normal traffic at scale (1% for very high-traffic services).
- Trace retention: 30 days hot, archived to ClickHouse for longer queries.

Every agent's wiki-loading, tool-use, and step-execution is a span. A single agent task's trace tells the full story: which Wiki pages were loaded, which tools called, which validation gates passed.

## 6. Alerting

### What gets paged

- **Sev1/Sev2 from the [Security and Data Policy § 13](Security-and-Data-Policy#13-incident-response).**
- **SLO burn-rate alerts** at thresholds defined in §2.
- **Saturation alerts** — disk > 80%, CPU sustained > 80%, connection pool exhausted.
- **Validation gate failures** spiking above baseline (potential agent regression).
- **Cost anomalies** — LLM spend > 2× rolling 24h average.

### What does NOT page

- A single high latency request.
- Individual user errors (4xx).
- Backups that succeeded.
- Anything that has not been demonstrated to require human action.

### Alert hygiene

- Every alert has a runbook link.
- An alert that fires more than 5 times per month without action is either fixed or deleted.
- "Notify-only" channels for informational signal; reserve paging for action-required.

## 7. Dashboards

- Per-service dashboard — the four golden signals at a glance.
- Per-tenant dashboard — top customers' usage, error rate, latency.
- Per-agent dashboard — task throughput, escalation rate, Trust Score inputs.
- Executive dashboard — platform availability, customer NPS, cost trends.

Dashboards live in Grafana, source-controlled as JSON.

## 8. On-call

- Rotation: weekly, 7-day shifts; minimum two engineers per rotation per team.
- Primary + secondary. Secondary is silent backup; primary leads response.
- Response SLA: Sev1 < 15 min, Sev2 < 30 min, Sev3 < business hours.
- Compensation: on-call days are time off in lieu (TOIL) or stipend per policy.
- Mandatory monthly on-call review — what fired, what should have, what was noisy.

Phase 1–2: founder-team on-call. Phase 3+: dedicated SRE rotation.

## 9. Postmortems

Every Sev1 and Sev2 incident produces a postmortem within 14 days.

Format:

- **Summary** — what happened
- **Impact** — who, for how long, what they saw
- **Timeline** — minute-by-minute
- **Root cause** — 5 Whys
- **Contributing factors** — what made it worse / harder to detect
- **Action items** — owners, due dates, follow-up tickets

Postmortems are **blameless**: focus on systems, not people. Failures are platform defects in detection, design, or process.

Sev1 postmortems with customer impact are published to affected customers within 30 days.

## 10. Audit observability vs operational observability

These are deliberately separated.

| Concern | Operational | Audit |
|---|---|---|
| Purpose | Detecting and resolving incidents | Compliance, dispute resolution, forensic discovery |
| Retention | 90 days hot, 1 year cold | 1–7 years (per data class) |
| Mutability | Logs may be rotated, compressed, deleted | Append-only, immutable |
| Store | Loki / standard logs | Audit Engine (ClickHouse + S3 archive) |
| Access | Engineering on-call | Restricted: Security, Legal, customer compliance officers |

Operational logs may contain (redacted) sensitive context for debugging. Audit logs are the legal record.

## 11. Forbidden

- Logging customer PII in operational logs (use audit events instead).
- Logging secrets (the redactor catches obvious patterns; the rule covers the rest).
- Metric labels with unbounded cardinality (user IDs, request IDs, free-form strings).
- Alerts without runbooks.
- "Dashboards" maintained as screenshots in docs — dashboards live in the dashboard tool, source-controlled.

---

## When to revisit

- A class of incidents recurs because it was not detectable (observability gap).
- SLOs cannot be met within current architecture and the cause is observability blindness rather than service quality.
- A new compliance regime requires audit detail beyond current capture.
- Cost of observability stack > 5% of cloud bill — reassess tooling.

---

## Cross-references

- [Architecture Principles § 7](Architecture-Principles#7-observability-is-not-optional)
- [Security and Data Policy § 12](Security-and-Data-Policy#12-logging-and-audit)
- [Technology Stack § Observability](Technology-Stack#observability)
- [Coding Standards § 10](Coding-Standards#10-logging)
- [Master Blueprint Index](Master-Blueprint-Index)
