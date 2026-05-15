# 2 · The Six Barriers

This is the strategic core of v2.0. Each barrier is documented with evidence, followed by the specific platform design decision that neutralises it. **These decisions are non-negotiable architectural requirements, not optional features.**

---

## B1 · Compound Failure

> 95% per-step accuracy = 60% success over 10 steps. Multi-agent errors compound exponentially.

### Evidence

- A 10-step multi-agent workflow with 95% per-step accuracy produces correct output only ~60% of the time.
- **80% of enterprise AI agent deployments fail in production**, nearly double the failure rate of traditional IT projects.
- The most dangerous failure mode is confident, well-formatted output that is operationally wrong — it passes human review.
- Multi-agent systems fail not because models are bad, but because errors propagate unchecked between agents.

### Our Solution: Validation Gate Architecture

**Design Decision B1** — Every hand-off point between agents in our platform inserts an automatic Validation Gate. The gate checks: (1) output schema correctness, (2) business logic consistency against wiki rules, (3) confidence score threshold, and (4) contradiction with previous agent outputs. If any check fails, the gate routes to human review rather than the next agent. This converts compound probability failure into a bounded, catchable error.

- **Deterministic Execution Wrapper:** Hard-coded logic (API calls, database writes, financial transactions) is always executed via deterministic code, not by the LLM directly. The LLM decides WHAT to do; deterministic code executes HOW.
- **Step-Level Audit Log:** Every agent step is logged with input, output, confidence score, and decision rationale before the next step begins. Creates a traceable chain that enables fast incident diagnosis.
- **Graceful Degradation:** When an agent fails a validation gate, the system does not halt — it routes to a lower-autonomy fallback (human task queue) with full context preserved.
- **Rollback Capability:** Every state-changing action (code deployment, data write, API call) stores a rollback snapshot. One-click revert is available from the console for any action within the last 30 days.

---

## B2 · Domain Expertise Gap

> HR law, finance compliance, security engineering — each requires years of specialist knowledge to build correctly.

### Evidence

- Vertical AI solutions are experiencing **400% year-over-year growth** as enterprises reject general-purpose models that lack domain depth.
- General LLMs trained on public data do not understand a company's proprietary processes, validated procedures, or compliance obligations.
- Domain expertise is one leg of a three-legged stool — without it, even the best AI model fails in production.
- HR AI that applies the wrong employment law jurisdiction, or Finance AI that misclassifies an expense, destroys trust instantly.

### Our Solution: Domain Expert Councils + Vertical Knowledge Layers

**Design Decision B2** — Each agent department is designed in partnership with a Domain Expert Council — senior practitioners in HR, finance, law, marketing, and engineering who validate every workflow, decision tree, and compliance rule. Their knowledge is encoded directly into the Wiki as structured, version-controlled playbooks. Agents do not improvise domain logic — they execute from wiki-defined rules, with LLM reasoning applied only for ambiguous judgment calls within those bounds.

- **Domain-Specific Fine-Tuning:** Each agent layer is fine-tuned or prompted with curated domain corpora: employment law databases, accounting standards (GAAP/IFRS), security frameworks (OWASP, NIST), marketing attribution models, etc.
- **Jurisdiction Awareness:** HR and Legal agents are jurisdiction-aware from day one. The onboarding interview captures the customer's operating countries, and agents apply the correct legal framework per geography.
- **Confidence-Bounded Answers:** Agents declare confidence levels for domain-specific judgments. Low-confidence outputs are automatically escalated to human reviewers with a suggested action, not presented as definitive.
- **Domain Playbook Marketplace:** As we accumulate validated playbooks from enterprise customers, we build a marketplace of certified domain playbooks (e.g., "UK Employment Law Pack", "SaaS Revenue Recognition Pack") that new customers can install in minutes.

---

## B3 · Enterprise Data Silos

> CRM, ERP, HRIS, codebase — all separate systems. 43% of AI leaders say data quality is their #1 blocker.

### Evidence

- Enterprise data is scattered across CRMs, ERPs, HRIS platforms, code repositories, and communication tools — often with no shared schema.
- **42% of business leaders say they lack sufficient proprietary data to customise AI models effectively**.
- 80% of AI project work is consumed by data engineering, not model quality — the "unglamorous 80%" that kills timelines.
- **72–80% of enterprise RAG implementations underperform or fail within their first year** due to data quality issues.

### Our Solution: Universal Data Bridge + Semantic Normalisation Layer

**Design Decision B3** — We build a Universal Data Bridge as the first layer every customer activates — before any agent goes live. The bridge connects to all data sources (Salesforce, HubSpot, QuickBooks, GitHub, HRIS, etc.), ingests their data into a normalised semantic model, and maintains live sync. Agents never query source systems directly — they query the normalised model. This decouples agent quality from integration complexity.

- **Data Quality Scoring:** Every data source is scored on completeness, freshness, and consistency before agents are allowed to act on it. Agents know the quality score of their context and adjust confidence levels accordingly.
- **Semantic Normalisation:** A unified entity model (Customer, Employee, Project, Transaction, etc.) maps fields from any source system to a common schema. An HR agent and a Finance agent share the same definition of "employee", eliminating cross-agent contradictions.
- **Data Readiness Checklist:** The onboarding interview includes a mandatory Data Readiness Assessment. Customers cannot activate agents for a department until that department's data meets minimum quality thresholds.
- **Incremental Activation:** Customers do not need to connect all systems before getting value. Each agent activates with its primary data source and improves as additional sources are connected. The platform shows a "data completeness score" per agent that motivates progressive integration.

---

## B4 · Identity & Security Crisis

> Agents sharing human credentials, no audit trails, over-permissioning. Real incidents in 2025 included AI deleting live production databases.

### Evidence

- Teams currently share human credentials with AI agents in the absence of agent-specific identity standards — a critical security failure.
- **In July 2025, a real incident occurred where an AI agent deleted a production database containing 1,200+ records** despite explicit instructions not to — caused by over-permissioning at the protocol level.
- AI agents expand the attack surface to every document they read and every tool they touch — the entire agent loop can be hijacked.
- Traditional IAM systems were not designed for autonomous non-human actors taking multi-step actions.

### Our Solution: Zero-Trust Agent Identity System

**Design Decision B4** — Every agent in our platform is treated as a distinct, non-human identity with its own scoped credentials, not a sub-process of a human user. Agents are issued OAuth tokens with the minimum permissions required for each specific task type. Permissions are task-scoped, time-bounded, and automatically revoked on completion. **No agent ever holds persistent broad access.**

- **Least-Privilege by Default:** The HR agent cannot access financial data. The Dev agent cannot modify HR records. The Finance agent cannot deploy code. Permissions are enforced at the API gateway level, not just by agent instruction.
- **Action Risk Classification:** Every action type is pre-classified into a risk tier (Read / Write / Delete / External-Communication / Financial-Transaction). Higher-risk tiers require explicit approval regardless of autonomy phase. **Deletion actions always require human confirmation — this is a hard-coded rule, not a configuration option.**
- **Prompt Injection Defence:** All external content (emails, documents, web pages, API responses) that agents read is sanitised through an injection detection layer before being passed to the LLM. Content claiming to be system instructions is flagged and quarantined.
- **Complete Action Provenance:** Every action taken by every agent is logged with: agent identity, human who triggered the workflow, data sources accessed, tool calls made, and output produced. Immutable and exportable for legal/compliance discovery.
- **SOC 2 Type II from Day One:** Security certification is a prerequisite for first commercial customer, not a Phase 3 goal.

---

## B5 · Trust & Change Management

> 55% of enterprises cite trust as their #1 barrier. Employees fear replacement. Sales cycles stretch to 12–18 months.

### Evidence

- **55% of enterprises cite trust concerns** — data privacy, reliability, and accuracy — as their top barrier to agentic AI adoption.
- **Gartner projects 40% of agentic AI projects will be cancelled by 2027**, not due to technical failure but due to governance immaturity and human resistance.
- The most common cause of scaling failure is not model quality — it is the gap between demo and production reliability, which erodes trust rapidly.
- Employees and middle management actively resist AI agents they perceive as threats, slowing adoption and creating workarounds.

### Our Solution: Phased Autonomy Model + Embedded Change Management

**Design Decision B5** — Trust is not a sales problem — it is a product problem. We build trust features directly into the platform, not into the marketing. The Phased Autonomy Model (Drafting → Startup → Approval → Enterprise) means no customer is ever asked to trust an agent before they have witnessed its performance at lower autonomy levels. The Change Management Module equips customer HR teams with tools to bring their own employees on the journey.

- **Explain-Before-Execute:** Every autonomous action is preceded by a plain-English explanation of what the agent intends to do and why. Stored at all levels. At lower autonomy levels, approval is required before the explanation proceeds to action.
- **Trust Scoring Dashboard:** Live trust score per agent, calculated from: accuracy rate, human override rate, validation gate failure rate, time-to-resolution on escalations. Boardroom-ready basis for expanding autonomy.
- **Built-in Change Management Module:** Templates, training materials, and communication guides for customer HR teams. Frames agents as "AI teammates with specialised skills" rather than replacements. Role-evolution guides show employees how their jobs change, not disappear.
- **Human Contribution Tracking:** Employees can see their own activity alongside agent activity. Reinforces that humans are still decision-makers and shows where their judgment adds value agents cannot replicate.
- **Customer Success Protocol:** Every enterprise customer is assigned a Customer Success Manager whose primary metric is autonomy phase progression.

---

## B6 · Breadth Multiplies Complexity

> Each new department adds a new data model, compliance surface, integration set, and failure mode. Incumbents stayed siloed for this reason.

### Evidence

- Incumbents (SAP, Workday, Salesforce) add AI to existing silos rather than unifying departments — this is a rational choice given the complexity.
- Most multi-agent collaboration failures occur at the orchestration layer — coordinating agents that were built independently with incompatible assumptions.
- Adding departments without a shared orchestration model creates agent sprawl: disconnected agents making conflicting decisions across functions.
- **Gartner: 40% of enterprise applications will embed task-specific agents by 2028**, creating a fragmentation problem that only a unified orchestration layer can solve.

### Our Solution: Modular-First Architecture with Shared Orchestration Core

**Design Decision B6** — We build the platform in layers: a shared Core (orchestration, identity, data bridge, wiki, ticketing, audit) and modular Department Layers that plug into the Core independently. A customer can activate one department without needing others. Department agents share context through the Core but do not call each other directly — all cross-department coordination is managed by a central Orchestration Engine that enforces sequencing, prevents conflicts, and maintains a single source of truth.

- **Shared Context Object:** Every active workflow maintains a Context Object — a structured data packet containing the originating request, all agent outputs so far, and the current state. Agents receive the Context Object at the start of their task and update it on completion. Prevents agents from contradicting each other due to incomplete information.
- **Department Isolation + Core Integration:** Each department agent runs in its own isolated container with its own data access scope. The Orchestration Core brokers communication via structured APIs, not shared memory. A failure or bug in the Finance agent cannot corrupt the HR agent's state.
- **Staged Rollout Strategy:** We deploy two departments in Phase 1 (HR + Finance), proving the Core architecture before adding more departments. Each new department is treated as an integration test of the Core, not just a feature addition.
- **Complexity Budget:** The engineering team will maintain a formal Complexity Budget — a measure of integration points, data dependencies, and cross-agent communication paths. New features require retiring complexity elsewhere before being added.

---

→ Next: [Product Concept](Product-Concept)
