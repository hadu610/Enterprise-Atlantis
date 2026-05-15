# Glossary

> **Type:** Reference · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · All humans · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

Plain-English definitions of every platform-specific term. When an agent encounters an unfamiliar term in a ticket or page, the [agent reading protocol](How-Agents-Use-This-Wiki) requires it to resolve the term here before proceeding.

Terms are listed alphabetically.

---

**Action class** — One of five categories of action an agent can attempt: `Read`, `Write`, `Delete`, `External`, `Financial`. See [Action Risk Classification](Action-Risk-Classification).

**Action tier** — Sub-category within `Write` (`low`, `medium`, `high`) and `External` (`templated`, `free_form`) that further controls approval routing.

**Agent identity** — A distinct non-human identity issued to each agent. Holds its own scoped OAuth tokens. Never reuses human credentials. See [Action Risk Classification](Action-Risk-Classification).

**Approved (page status)** — Page has been reviewed and signed off by the Owner; agents may consume it during execution. See [Wiki Conventions](Wiki-Conventions).

**Atlantis** — The platform / product name.

**Audit event** — Immutable log record of every action the platform takes. Append-only, retained per compliance schedule. See [Unified Entity Model § Audit Event](Unified-Entity-Model#audit-event).

**Autonomy phase** — One of `Drafting`, `Startup`, `Approval`, `Enterprise`. Determines what an agent may do without human approval. See [Phased Autonomy Reference](Phased-Autonomy-Reference).

**Calibration error** — `|confidence_avg − accuracy_avg|`. A measure of whether an agent's stated confidence matches its real-world accuracy. See [Confidence and Escalation Rules § 6](Confidence-and-Escalation-Rules#6-do-not-pretend-to-be-confident).

**Change Management Module** — Customer-facing tools (templates, role-evolution guides) that help customer HR teams onboard their own employees to working alongside agents. See [Product Requirements § K](Product-Requirements).

**Complexity Budget** — Formal engineering discipline tracking integration points, data dependencies, and cross-agent communication paths. New features require retiring complexity elsewhere first. See [The Six Barriers § B6](The-Six-Barriers#b6--breadth-multiplies-complexity).

**Confidence score** — Scalar `0.0`–`1.0` produced by an agent alongside any judgment-bearing output. Drives whether the action proceeds, queues, or escalates. See [Confidence and Escalation Rules](Confidence-and-Escalation-Rules).

**Context Object** — Structured data packet passed between agent steps in a multi-step workflow. Prevents agents from contradicting each other due to incomplete information. See [Product Requirements § B](Product-Requirements).

**Customer admin** — A human user at a customer organisation with administrative privileges over their tenant — agent activation, phase progression, routing config.

**Data Readiness Assessment** — Mandatory pre-activation scoring of a customer's data sources for completeness, freshness, and consistency. Agents cannot activate for a department until that department's data score meets the threshold. See [Product Requirements § A](Product-Requirements).

**Deprecated (page status)** — Page is no longer in force; retained for audit only; agents ignore.

**Deterministic Execution Wrapper** — Hard-coded code that executes the literal action (API call, DB write) on behalf of an agent. The LLM decides *what*; the wrapper executes *how*. Agents never call write APIs directly. See [Validation Gate Specifications § 4](Validation-Gate-Specifications#4-deterministic-execution-wrapper).

**Domain Expert Council** — Senior practitioners (employment lawyers, CPAs, etc.) who validate the wiki playbooks for each department. Their knowledge is encoded into the Wiki as version-controlled `Rule` and `Playbook` pages. See [The Six Barriers § B2](The-Six-Barriers#b2--domain-expertise-gap).

**Domain Playbook Marketplace** — Marketplace of certified domain packs (e.g. "UK Employment Law Pack") that customers install in minutes. Pre-publication review by the relevant Council. See [Product Requirements § G](Product-Requirements).

**Draft (page status)** — Page authored but not yet approved; agents ignore during execution; humans may review.

**Enterprise Mode** — Phase 4 of the [Phased Autonomy Reference](Phased-Autonomy-Reference). Policy-based auto-approval; humans oversee exceptions.

**Escalation budget** — Hourly cap on how many escalations an agent may produce before its circuit breaker trips. See [Confidence and Escalation Rules § 5](Confidence-and-Escalation-Rules#5-the-escalation-budget).

**Escalation packet** — Standardised payload an agent produces when escalating to a human. Includes task description, proposed action, confidence breakdown, sources, and a recommended next step.

**Explain-Before-Execute** — Every autonomous action is preceded by a plain-English rationale, stored at all autonomy levels. At Drafting/Startup, approval gates on the rationale before the action runs.

**Hard rule** — Constraint that cannot be disabled by customer config or platform admin. Examples: `Delete` and `Financial` actions always require human confirmation. See [Phased Autonomy Reference § Hard rules](Phased-Autonomy-Reference#hard-rules--never-configurable).

**Jurisdiction** — ISO country code (or region) that scopes a Wiki page's applicability. Agents only consume pages whose jurisdiction matches the task context.

**Last reviewed** — Page metadata field indicating the most recent Owner attestation date. Pages overdue auto-downgrade.

**Orchestration Engine** — Central broker for cross-department agent coordination. Agents never call each other directly — all coordination flows through Orchestration. See [Product Requirements § B](Product-Requirements).

**Owner** — The team or council accountable for a Wiki page's correctness.

**Phased Autonomy Model** — Framework that progresses agents through four trust levels (Drafting → Startup → Approval → Enterprise) on the basis of accumulated evidence. See [Phased Autonomy Reference](Phased-Autonomy-Reference).

**Playbook** — Procedural Wiki page defining how an agent performs a specific task type. Agents must follow when their context matches.

**Prompt injection defence** — Layer that sanitises external content (emails, documents, web pages) before passing it to the LLM. Content claiming to be system instructions is flagged and quarantined. See [The Six Barriers § B4](The-Six-Barriers#b4--identity--security-crisis).

**Rollback snapshot** — Pre-action state capture enabling one-click revert. Retention is action-class dependent. See [Rollback Procedures](Rollback-Procedures).

**Rule (page type)** — Binding constraint. Agents must follow; violations block execution.

**Scope** — A permission granted to an agent identity covering a specific source, action class, and entity constraint. Enforced at the API gateway, not by agent instruction. See [Action Risk Classification § 4](Action-Risk-Classification#4-scope-assignment).

**Shared Context Object** — See *Context Object*.

**Trust Score** — Live per-agent metric derived from accuracy, override rate, gate failure rate, and resolution time. Boardroom-ready evidence basis for autonomy expansion. See [Product Requirements § F](Product-Requirements).

**Universal Data Bridge** — First layer activated by every customer. Connects to all source systems and presents agents with a normalised semantic model. Agents never query source systems directly. See [The Six Barriers § B3](The-Six-Barriers#b3--enterprise-data-silos).

**Validation Gate** — Deterministic checkpoint between agent steps that prevents error propagation. Four core gates: schema, business logic, confidence, contradiction. See [Validation Gate Specifications](Validation-Gate-Specifications).

**WIP (page status)** — Skeleton in progress; not authoritative; agents ignore.

**Zero-Trust Agent Identity** — Design principle that every agent has its own scoped, time-bounded credentials — never reusing human credentials, never holding persistent broad access. See [The Six Barriers § B4](The-Six-Barriers#b4--identity--security-crisis).

---

## Cross-references

- [Wiki Conventions](Wiki-Conventions)
- [Unified Entity Model](Unified-Entity-Model)
- [How Agents Use This Wiki](How-Agents-Use-This-Wiki)
