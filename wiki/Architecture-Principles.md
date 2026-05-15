# Architecture Principles

> **Type:** Reference · **Owner:** Engineering · **Status:** Approved · **Applies to:** All humans contributing code · Dev Agent (advisory) · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

The fifteen principles below are the constitutional rules of the platform's architecture. Individual ADRs may refine them; nothing overrides them without an explicit "supersedes" entry on this page and a CTO-signed ADR.

These principles exist because Atlantis's central technical bet — solving [Barrier B6 (Breadth Multiplies Complexity)](The-Six-Barriers#b6--breadth-multiplies-complexity) — is won or lost at the architecture level, not the code level.

---

## 1. Modular monolith for the Core; isolated services for Department Agents

The shared Core (Orchestration Engine, Identity, Data Bridge, Wiki, Ticketing, Audit) is a **modular monolith**. The Department Agents (HR, Finance, etc.) are **isolated services**.

**Why.** Core components share too much state for clean microservice extraction at our scale; the monolith pays off in development velocity, transactional integrity, and shared schema. Department agents, by contrast, must be isolated because a fault in Finance cannot corrupt HR — this is a contract with the customer.

**Implication.** Department agents communicate with the Core only via the Orchestration Engine's structured APIs. They never call each other. They never share a database with another department.

## 2. Single source of truth, always

Every piece of data has one owner — one service, one schema, one canonical representation. Reads can be replicated; writes go to the owner.

**Why.** Multi-master is the most expensive engineering mistake in distributed systems.

**Implication.** The Wiki owns rules; the Universal Data Bridge owns the normalised entity model; the Audit Engine owns immutable history. Anyone reading these reads the owner, not a cache they invalidate themselves.

## 3. Idempotency by design

Every write API supports an `Idempotency-Key` header. Repeating a request with the same key returns the original result, not a duplicate side effect.

**Why.** Network failures and retries are guaranteed at scale. Idempotency is the cheapest insurance against double-charges, duplicate emails, and double-applied state changes.

**Implication.** Every state-changing endpoint either is naturally idempotent (PUT) or accepts a client-supplied key. Agents always supply a key.

## 4. Strong consistency where it matters; eventual elsewhere

Financial transactions, agent identity, and audit log writes use strong consistency (single-writer Postgres). Read replicas and caches are eventually consistent, with explicit staleness budgets per use case.

**Why.** Trading consistency for performance is a domain decision, not a default. Default to strong, weaken only where impact is bounded.

**Implication.** A Finance Agent's read of a transaction is always up-to-date. A Marketing Agent's read of an aggregate dashboard tolerates 60-second staleness.

## 5. Validation at the boundary, trust within

Every external input — user request, third-party API response, file upload, LLM output — is validated at the boundary using a schema (Zod, Pydantic, etc.). Once inside trusted code, types are trusted; no defensive re-validation.

**Why.** Defensive code everywhere becomes a forest in which actual bugs hide. Validation at the boundary is one place to look when something goes wrong.

**Implication.** Every API surface has a schema. Schemas are versioned. Schema changes are diff-reviewed like code.

## 6. Failure is data, not exception

Expected failure modes (validation errors, retryable timeouts, permission denials) are returned as values, not thrown as exceptions. Unexpected failures (programming errors, OOM, panic) throw — and crash the worker, which restarts.

**Why.** "Let it crash" (Erlang-influenced) is the most resilient pattern for unexpected failure. Throwing for expected failure couples error handling to exception machinery, which is both slow and opaque.

**Implication.** Result/Either types in TS and Python; idiomatic `error` returns in Go.

## 7. Observability is not optional

Every service emits structured logs, metrics, and traces from the moment it goes to staging. There is no "we'll add observability later" — services without observability fail their readiness review.

**Why.** Observability bolted on retroactively is observability with gaps. Gaps in observability are gaps in trust.

**Implication.** Service templates include OTel instrumentation by default; PR checks verify required instrumentation is present.

## 8. 12-Factor app

We follow the [12-Factor App](https://12factor.net/) methodology, with two amendments:

- Configuration is validated at startup (factor IV).
- Stateless processes are the default; stateful workers (e.g. long-running agent reasoning) declare their state class explicitly (factor VI).

**Why.** 12-Factor is the industry standard for cloud-native services; deviating from it is a tax on every engineer who has read the book.

## 9. Multi-tenancy first

Every service is designed for multi-tenancy from the first line of code. There is no "single-tenant mode" we'll evolve later.

**Why.** Retrofitting multi-tenancy is expensive and dangerous. Tenant isolation bugs are the worst kind of bug in B2B SaaS.

**Implication.** Every query includes a `tenant_id`. Every cache key is tenant-prefixed. Every audit log entry carries the tenant identity. The schema-per-tenant decision is made per-customer at onboarding (see [Technology Stack § Data layer](Technology-Stack#primary-database-postgresql-16)).

## 10. Zero-trust between services

Inside the platform, every service-to-service call authenticates with mTLS and an issued JWT carrying the calling service's identity and permissions. No service trusts any other by network location.

**Why.** "We're inside the VPC" is not a security model. A compromised service compromises everything it can reach by default. Zero-trust makes blast radius bounded.

**Implication.** The service mesh (or sidecar pattern) handles mTLS; the platform's identity issuer (Vault) issues short-lived JWTs.

## 11. Backpressure, not buffering

When a downstream service is slow or saturated, upstream callers slow down (backpressure) rather than accumulating unbounded queues.

**Why.** Unbounded queues are a guarantee of cascading failure under load.

**Implication.** Every queue has a max depth. Every async caller has a timeout. Every retry has a budget.

## 12. Graceful degradation

When a non-critical service is unhealthy, the platform reduces feature set rather than failing entirely.

**Why.** "All-or-nothing" availability is a luxury no enterprise platform can afford.

**Implication.** The Trust Score Dashboard degrades to "data unavailable, last refreshed N hours ago" rather than crashing the console. Agent execution continues even if telemetry export is failing — telemetry is buffered, not blocking.

## 13. Cell-based architecture for tenant isolation

At scale, we partition the runtime into **cells** — independent infrastructure stacks each serving a subset of tenants. A cell's failure affects only its tenants.

**Why.** The most reliable way to make a fault non-global is to make it non-global by construction.

**Implication.** Phase 4 introduces cells; Phase 1–3 customers all run in a single cell with a documented migration plan.

## 14. Versioning is contract; breakage is migration

Every public API and event schema is versioned. Breaking changes ship as a new version, not as edits to the existing one. Old versions are deprecated with a documented migration window (minimum 12 months for paying customers).

**Why.** Customer trust survives only if their integrations survive.

**Implication.** API surfaces use `/v1/`, `/v2/`. Events carry `schema_version`. Database migrations are forward-only (see [Coding Standards § 11](Coding-Standards#11-migrations)).

## 15. Architecture decisions are documented or they didn't happen

Every non-trivial architectural choice is recorded as an ADR ([Coding Standards § 12](Coding-Standards#12-architecture-decision-records-adrs)). "We talked about this in a meeting" is not a decision; it's a memory that will not survive a team change.

**Why.** Memory is unreliable. Future-you needs to know not just what we chose but what we chose against and why.

---

## When to revisit these principles

Trigger a full review of this page if:

- A customer-driven requirement cannot be satisfied within current principles without abandoning a stated trade-off.
- A repeated incident class (3+ in 90 days) traces to a principle being either violated or wrong.
- The Complexity Budget shows accumulation that cannot be retired without a structural change.
- A new technology category emerges that genuinely changes the cost equation (e.g. consensus protocols, edge compute models, new tenancy models).

Reviews are conducted by Engineering, with the CTO accountable.

---

## Cross-references

- [Technology Stack](Technology-Stack)
- [Coding Standards](Coding-Standards)
- [Security and Data Policy](Security-and-Data-Policy)
- [Observability Standards](Observability-Standards)
- [Product Requirements § B Orchestration Engine](Product-Requirements)
- [The Six Barriers](The-Six-Barriers)
- [Master Blueprint Index](Master-Blueprint-Index)
