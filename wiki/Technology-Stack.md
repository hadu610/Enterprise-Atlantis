# Technology Stack

> **Type:** Reference · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the authoritative list of every technology, language, framework, and service the platform is built on. Every choice records its **rationale**, the **alternatives considered**, and the **conditions that would trigger a revisit**. This is intentional: when the strategy changes, the next reader needs to know what we knew when we chose.

The Dev Agent reads this page before writing code. Humans evaluating a new dependency or service consult this page before adding it.

---

## Headline choices at a glance

| Layer | Choice |
|---|---|
| **Primary application language** | TypeScript on Node.js (LTS) |
| **AI / data services** | Python 3.12+ |
| **Performance-critical services** | Go 1.22+ (sparingly) |
| **Frontend framework** | Next.js (App Router) + React + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui (Radix primitives) |
| **Primary database** | PostgreSQL 16+ |
| **Cache / ephemeral / pub-sub** | Redis 7+ |
| **Analytics / audit warehouse** | ClickHouse |
| **Object storage** | S3 (AWS) or S3-compatible |
| **Vector store** | pgvector (Phase 1–3); evaluate Qdrant / Pinecone at scale |
| **Event bus** | NATS JetStream (Phase 1–3); evaluate Kafka if scale demands |
| **AI providers** | Anthropic Claude (primary) + OpenAI (secondary) + self-hosted via Bedrock (regulated tenants) |
| **Cloud** | AWS (primary) — multi-region from Day 1, multi-cloud explicitly NOT |
| **Container orchestration** | Kubernetes (EKS) |
| **Infrastructure as Code** | Terraform + Terragrunt |
| **GitOps deployment** | ArgoCD |
| **Observability** | OpenTelemetry + Grafana stack (LGTM) |
| **CI** | GitHub Actions |
| **Secrets** | HashiCorp Vault + AWS KMS |
| **Identity (humans)** | Auth0 (Phase 1–2) → evaluate self-hosted (Ory) at scale |
| **Identity (agents)** | Custom OAuth scope layer (we build) on top of Vault-issued credentials |

Rationale for each section below.

---

## Languages

### Primary: TypeScript on Node.js

We default to TypeScript for backend services, the customer console, and the orchestration layer.

**Why.**

- **Talent pool.** TypeScript is the most-asked language on Stack Overflow surveys and dominates job postings in our segment. Hiring is faster.
- **Type safety with iteration speed.** Strict TS catches a class of bugs at compile time without the heaviness of JVM languages.
- **Code sharing across the stack.** The same domain model can be used in the backend, the customer console, and CLI tools.
- **Mature ecosystem for our domain.** SDKs for every integration (Salesforce, HubSpot, QuickBooks, GitHub) are first-class in JS/TS.
- **Async-by-default fits our workload.** Most agent work is I/O-bound — fetching from data bridge, calling LLMs, writing to ticket systems.

**Runtime: Node.js LTS, evaluate Bun.** Node.js 20+ LTS is the default. Bun 1.x is GA and shows compelling performance — we trial it on isolated services in Phase 2; promote to default if no production incidents emerge in six months.

### AI / data services: Python 3.12+

Python is required, not optional, for ML/AI and data engineering work.

**Why.**

- The AI ecosystem (PyTorch, transformers, LangChain when we want it, evaluation harnesses, sklearn) is Python-first. Going against this is taxation we cannot afford.
- Pandas / Polars / DuckDB ecosystem for data engineering inside the Universal Data Bridge.
- Most Domain Expert Council members coming from data science backgrounds expect Python.

**Strict scoping.** Python is for ML inference, training, data pipelines, and evaluation harnesses. It is **not** for general application APIs — those are TypeScript. This keeps the boundary clean and the deployment surface contained.

### Performance-critical: Go 1.22+

Reserved for components where latency or throughput dominates and the workload is CPU-bound or networking-bound.

Expected uses:

- API gateway / request routing
- Validation gate runtime executor (millions of evaluations per day)
- High-throughput webhook/event processors

**Why not for everything.** Go's productivity for general application code is lower than TypeScript's for our team and our problem space. Use it where the latency or throughput payoff is real.

### Languages we explicitly reject (today)

| Language | Why not |
|---|---|
| **Rust** | Hiring difficulty at our stage. Reconsider for v2.0 critical-path components once team is 30+. |
| **Java / Kotlin** | JVM operational overhead and iteration speed compared to TS/Go for our profile. The enterprise familiarity argument is real but not yet decisive. |
| **C#** | Possible if our customer base skews heavily Microsoft. Not Day 1. |
| **Ruby** | Declining ecosystem; runtime performance materially behind Node. |
| **Elixir / Erlang** | Excellent fit for parts of our system, but talent pool is small enough that hiring risk outweighs benefit. |
| **PHP** | No. |

### When to revisit language choices

- Hiring throughput drops below target for any role using a default-stack language → consider broadening to languages with overlapping talent pools.
- Latency SLO regression on a TS/Node service that cannot be optimised within Node → migrate the hot path to Go.
- Team size > 30 → reconsider Rust for critical-path components.
- Major LTS change in Node.js or Python → assess upgrade path; never lag more than one LTS behind.

---

## Frontend

### Framework: Next.js (App Router) + React + TypeScript

**Why Next.js.**

- Server Components and streaming SSR give performance for marketing/customer-facing pages without separate infrastructure.
- File-based routing reduces boilerplate.
- Vercel deployment is one path; AWS Amplify or self-host are also supported — no lock-in.
- The largest React framework — biggest talent pool, longest survival horizon.

**Why React (over Solid, Svelte, Vue).**

- Talent pool dominance. We optimise for hiring velocity over framework elegance.
- Ecosystem maturity — every component, library, and integration we need exists.
- Internal consistency — pitch site, customer console, and (future) admin tools can all share components.

### Styling: Tailwind CSS

- Utility-first prevents bespoke CSS sprawl.
- Design tokens encoded in `tailwind.config` make brand-wide changes a single PR.
- Excellent DX for AI-assisted code generation (the Dev Agent generates Tailwind correctly more often than it generates bespoke CSS).

### UI components: shadcn/ui (Radix primitives)

- We own the source — components are copied into our repo, not imported as a package. No version churn.
- Built on Radix primitives, which handle accessibility (WCAG 2.2 AA) by default.
- Avoids the "MUI / Chakra / Mantine lock-in" failure mode where the design system can't evolve independently.

### Data fetching / state

- **TanStack Query** for server state.
- **Zustand** for non-trivial client state. Avoid Redux unless we hit a scenario it genuinely solves.
- **React Hook Form + Zod** for forms and validation. Zod is also our shared validation library across server and client.

### Frontend rejects

| Tool | Why not |
|---|---|
| **Vue / Svelte / Solid** | Smaller talent pool; benefit not large enough at our scale. |
| **Material UI / Chakra / Mantine** | Lock-in pain when the design system needs to evolve. |
| **Redux** | Heavy for our needs in 2026; we'd reach for it only if Zustand fails us. |
| **Remix** | Overlaps Next.js too heavily; we don't need two answers. |

### When to revisit frontend stack

- Browser-side performance budgets failing on a major customer's hardware profile (low-end Windows enterprise laptops) → revisit framework / bundle strategy.
- Mobile becomes a Phase-3 priority → introduce React Native (code-sharing with web) or accept it as a separate stack.

---

## Data layer

### Primary database: PostgreSQL 16+

The single most important infrastructure choice.

**Why.**

- ACID-compliant, mature, battle-tested at every scale we will see for years.
- JSONB columns give NoSQL flexibility where needed without losing relational guarantees.
- `pgvector` extension covers our vector-store needs in Phase 1–3.
- Strong open-source community + multiple managed offerings (RDS, Aurora, Cloud SQL) = no vendor lock-in at the data layer.
- Excellent observability tooling (`pg_stat_statements`, slow query log, query plan analysis).

**Multi-tenancy strategy.** Schema-per-tenant for enterprise customers requiring data isolation; shared schema with `tenant_id` partitioning for mid-market. Decision per customer at onboarding.

### Cache, queues, pub/sub: Redis 7+

- Cache layer for hot data (entity model lookups, frequently-read Wiki pages, etc.).
- Pub/sub for low-latency cross-service signalling.
- Sorted sets and streams for short-lived event buffers.

### Analytics / audit warehouse: ClickHouse

- The audit log alone will generate millions of events per day at scale.
- ClickHouse is the strongest open-source columnar store; sub-second queries over billions of rows.
- We avoid Snowflake / BigQuery to retain cost control and avoid vendor lock-in on a critical data path.

### Object storage: S3 (or S3-compatible)

- Audit log archival, file snapshots for rollback, document storage.
- S3-compatible API means we can swap to MinIO (self-hosted), R2 (Cloudflare), or GCS without code changes.

### Vector store: pgvector first

- We start with `pgvector` because it lives in the database we're already running.
- Migration to a dedicated vector DB (Qdrant, Pinecone, Weaviate) is on the table when (a) embeddings exceed ~100M vectors, OR (b) hybrid retrieval (lexical + vector) latency degrades.

### Data rejects

| Tool | Why not |
|---|---|
| **MongoDB** | Our data is relational; we'd recreate Postgres features at higher cost. |
| **DynamoDB** | Vendor lock-in, weaker query flexibility, no joins. We use it only if a specific service needs the global low-latency profile. |
| **Snowflake / BigQuery** | Cost trajectory is the concern; ClickHouse covers our analytics needs at predictable cost. |
| **Cassandra** | Operational complexity not warranted at our scale. |

### When to revisit the data layer

- Single-table row counts exceed 500M with hot-path queries degrading → consider partitioning, sharding, or migration to a specialised store.
- Vector workload exceeds pgvector capabilities → migrate.
- Customer demands a specific data residency stack we cannot satisfy on current infrastructure → revisit.

---

## Eventing and orchestration

### Event bus: NATS JetStream

Phase 1–3 default.

**Why NATS over Kafka, Day 1.**

- Operational simplicity. Kafka is excellent but requires Zookeeper/KRaft + careful capacity planning.
- NATS JetStream has the durable streams we need without the operational overhead.
- Multi-region replication built in.

### When to revisit (move to Kafka or similar)

- Sustained event throughput exceeds ~100K events/sec on any single stream.
- Specific customer demands Kafka compatibility for their internal integrations.
- Stream replay or retention needs exceed what NATS comfortably handles.

---

## AI and LLM infrastructure

### Multi-provider abstraction layer

We build a thin **model routing layer** in-house. Every agent calls our layer, not a provider SDK directly. The layer routes by:

- Task type (reasoning-heavy vs. lookup vs. code generation)
- Cost class (premium / standard / draft)
- Tenant residency requirements
- Provider health and current rate limits

This is mandatory — vendor lock-in to a single LLM provider is the single biggest concentration risk we face.

### Primary: Anthropic Claude

- **Default for high-stakes reasoning.** Highest empirical reliability for agent workflows in our internal evals. Sonnet for production agent work; Opus for reasoning-heavy / domain-expert review tasks; Haiku for high-throughput classification.
- Long context windows materially help our wiki-loading protocol.
- Strong safety posture aligned with our enterprise audience.

### Secondary: OpenAI

- **For business continuity and where benchmarks favour.** Maintained as live secondary path with regular evals; never below 10% of routed traffic so the path stays warm.

### Tertiary / regulated tenants: self-hosted on Bedrock

- For healthcare, defence, or any tenant with data-residency or model-sovereignty requirements.
- Open-weight models (Llama-class) hosted in VPC-isolated Bedrock deployments.

### What we explicitly avoid

- **Heavy LLM frameworks (LangChain, LlamaIndex) as core dependencies.** We use them for evaluation experiments only. Our thin abstraction layer is intentional — we cannot afford another layer's release cadence and bug surface controlling our agent runtime.
- **Single-provider strategy.** Risk too high.
- **Custom fine-tuning Day 1.** Prompt engineering + retrieval is sufficient at our scale; fine-tuning is a Phase-3 investment.

See [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) for governance.

### When to revisit AI stack

- A provider releases a model with materially better cost/capability ratio for a major task type → re-route.
- A self-hostable open model crosses the capability threshold for our default tasks → reduce provider dependency.
- Cost per task exceeds budget by > 20% sustained → renegotiate, re-route, or optimise prompts.

---

## Cloud and infrastructure

### Cloud: AWS (primary)

**Why.**

- Mature service portfolio across every layer (compute, storage, IAM, networking).
- Enterprise customer preference — most of our buyers run AWS.
- Strongest compliance certifications (FedRAMP, IRAP, etc.) we will eventually need.
- Bedrock for self-hosted LLMs is a major Phase 3 enabler.

**Not multi-cloud Day 1.** Multi-cloud is a goal sometimes confused with a means. We pick AWS, get excellent at it, design for portability where cheap, and revisit when a customer-driven reason emerges.

### Container orchestration: Kubernetes (EKS)

- Industry standard; talent pool and tooling depth unmatched.
- EKS over self-managed for operational simplicity.
- We start with a single regional control plane per environment; expand to multi-region when SLOs demand.

### IaC: Terraform + Terragrunt

- Terraform is the most widely-known IaC tool.
- Terragrunt for DRY across environments.
- Atlantis (no relation to us) for PR-driven plan/apply.

### GitOps: ArgoCD

- Declarative deployment from git is non-negotiable.
- ArgoCD is the most mature OSS option.
- Promotion between environments (dev → staging → prod) via PR.

### Infrastructure rejects

| Tool | Why not |
|---|---|
| **GCP / Azure** as primary | Pick one; multi-cloud is a future migration topic, not a Day-1 architecture topic. |
| **Heroku / Render / Fly** | Fine for prototypes; insufficient for the enterprise compliance posture we need. |
| **Serverless-first (Lambda only)** | Works for parts; full-Lambda makes long-running agent workflows hard. We use Lambda for event-driven glue, not core agent runtime. |
| **Pulumi / CDK** | Strong tools; Terraform's ubiquity wins on talent grounds. |
| **Helm** as primary deployment tool | Replaced by ArgoCD-managed Kustomize manifests for the platform; Helm acceptable for third-party charts. |

---

## CI/CD

### Continuous Integration: GitHub Actions

- We're already on GitHub; minimal additional surface.
- Excellent matrix support for multi-language testing.
- Hosted runners cover most needs; self-hosted runners for compliance-sensitive jobs.

### Deployment: ArgoCD (see above)

### Container registry: AWS ECR

- Integrated with our cloud; vulnerability scanning included (Inspector).

See [CI/CD and Release Engineering](CI-CD-and-Release-Engineering).

---

## Observability

### Instrumentation: OpenTelemetry

- The industry standard; vendor-neutral.
- Every service emits traces, metrics, and structured logs via OTel.

### Backend: Grafana stack (LGTM)

- **Loki** for logs, **Grafana** for dashboards, **Tempo** for traces, **Mimir** for metrics.
- Self-host initially; migrate to Grafana Cloud if operational cost grows.
- Avoid Datadog Day 1 due to cost trajectory; reconsider if we hit SLO measurement bottlenecks self-hosted.

### Error tracking: Sentry

- Frontend and backend.
- Source-map integration; release-tagged events.

See [Observability Standards](Observability-Standards).

---

## Security tooling

| Concern | Tool |
|---|---|
| Secrets management | HashiCorp Vault (primary); AWS Secrets Manager (cloud-integrated leaves) |
| Encryption keys | AWS KMS |
| SAST | Semgrep |
| Dependency scanning | Snyk + Dependabot |
| Container scanning | Trivy (CI) + AWS Inspector (runtime) |
| Cloud posture | Wiz or Prowler (TBD on procurement) |
| Identity (humans) | Auth0 Day 1; Ory Kratos consideration at scale |

See [Security and Data Policy](Security-and-Data-Policy).

---

## Versioning and dependency posture

- Every service publishes a `version` endpoint that returns build SHA, build time, and dependency manifest hash.
- We pin major versions of all dependencies. Minor/patch upgrades flow via Dependabot PRs.
- LTS-only for languages: Node LTS, Python 3.12+ (oldest non-EOL release).
- We never lag more than one major version behind upstream on critical dependencies (Postgres, Redis, Kubernetes).

---

## Cost discipline

- Every new technology added has a documented cost trajectory at 10×, 100×, and 1000× our current usage.
- Quarterly review of cloud spend by service.
- Cost is treated like latency — a service that doubles spend without a corresponding capability change is a regression.

A dedicated [FinOps Strategy](Master-Blueprint-Index) page will codify the rules — currently WIP.

---

## When to revisit the entire stack

This page reviews quarterly at minimum. Trigger an immediate review on:

- A foundational provider (cloud, primary LLM, primary database) significantly changes terms.
- A security incident exposes a class of risk our stack does not mitigate.
- A customer-mandated requirement (residency, sovereignty, on-prem) cannot be met within the current stack.
- A new technology emerges with > 5× advantage in a core capability — we evaluate but do not chase.

The CTO is the accountable owner.

---

## Cross-references

- [Coding Standards](Coding-Standards)
- [Architecture Principles](Architecture-Principles)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Security and Data Policy](Security-and-Data-Policy)
- [Observability Standards](Observability-Standards)
- [API Design Standards](API-Design-Standards)
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering)
- [Testing Strategy](Testing-Strategy)
- [Master Blueprint Index](Master-Blueprint-Index)
