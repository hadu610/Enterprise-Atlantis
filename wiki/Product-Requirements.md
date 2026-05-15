# 6 · Product Requirements

This page enumerates the twelve core platform components. Each component is mapped to the barrier(s) it addresses. **The first five components (B–F) are Core Infrastructure and must be built before any visible agent feature.**

---

## A. Business Interview & Configuration Engine

- Conversational onboarding wizard capturing company strategy, operations, team structure, goals
- **Data Readiness Assessment:** scores each department's data completeness before agent activation (B3)
- **Jurisdiction detection:** identifies operating countries and maps applicable employment/finance law frameworks (B2)
- **Risk tolerance configuration:** defines per-customer approval thresholds per action type for Phased Autonomy Model (B5)
- Auto-generates initial agent config, wiki content, and Department Activation Checklist
- **Industry Blueprint Library:** pre-built frameworks for SaaS, manufacturing, healthcare, retail, professional services

## B. Orchestration Engine & Shared Core *(solves B6)*

- Central broker for all cross-department agent coordination — agents do not call each other directly
- **Shared Context Object:** structured data packet passed through every workflow step, preventing agent contradictions
- **Conflict resolution:** detects when two agents produce contradictory outputs and routes to human arbitration
- **Workflow state machine:** each multi-step workflow has a formal state (pending, in-progress, awaiting-approval, complete, rolled-back, compensating)
- **Action Executor + entity-keyed queue:** serialises mutations to the same entity across all agents; OCC + saga compensation + lease-based exclusion — see [Cross-Agent Coordination](Cross-Agent-Coordination) for the full architecture
- **Complexity Budget monitor:** tracks integration points, data dependencies, and cross-agent communication paths

## C. Validation Gate Architecture *(solves B1)*

- Automatic gates at every agent hand-off point: schema validation, business logic check, confidence threshold, contradiction detection
- **Deterministic Execution Wrapper:** LLM decides; hard-coded logic executes — no LLM directly writing to databases or calling financial APIs
- **Graceful degradation:** failed gates route to human task queue with full context, not a system halt
- **Rollback engine:** state snapshot before every state-changing action; one-click revert from console
- **Step-level audit log:** input, output, confidence score, decision rationale logged per agent step

## D. Zero-Trust Agent Identity System *(solves B4)*

- Every agent issued a distinct non-human identity with scoped OAuth tokens per task type
- **Action Risk Classification:** Read / Write / Delete / External-Communication / Financial-Transaction — enforced at API gateway
- **Delete and Financial-Transaction actions always require human confirmation** — hard-coded, not configurable
- **Prompt injection detection layer:** external content sanitised before being passed to LLM
- **Immutable action provenance log:** agent identity, triggering human, data accessed, tools called, output produced
- **SOC 2 Type II compliant from Day 1**; ISO 27001 by Month 18; HIPAA for healthcare verticals

## E. Universal Data Bridge *(solves B3)*

- Connectors to all major enterprise systems: Salesforce, HubSpot, QuickBooks, GitHub, Google Workspace, M365, Jira, Zendesk, HRIS platforms
- **Semantic Normalisation Layer:** unified entity model (Customer, Employee, Project, Transaction) mapped from all source schemas
- **Data quality scoring per source:** completeness, freshness, consistency — exposed to agents and human admins
- Agent data access via normalised model only — no direct source system queries by agents
- **Live sync with change detection:** data bridge updates the normalised model as source data changes
- Data migration tools for customer onboarding: bulk historical data ingest with quality validation

## F. Agent Management Console

- Visual dashboard: all active agents, current tasks, queue depth, performance metrics, trust scores
- **Trust Score Dashboard:** per-agent accuracy rate, override rate, validation gate failure rate (B5)
- Per-agent and per-employee activity logs with full audit trail
- Agent health monitoring: automatic alerts for failures, anomalies, performance degradation
- Agent skill marketplace: install, configure, and extend agent capabilities

## G. Centralized Knowledge Wiki

- Stores: company context, domain playbooks (validated by Domain Expert Councils — B2), coding standards, compliance rules, agent instructions
- **Jurisdiction-aware content:** HR and Legal wiki sections tagged by country/region, agents read relevant jurisdiction
- Version-controlled: changes require approval; all historical versions preserved
- Auto-populated from onboarding; continuously updated by agents with human approval
- **Domain Playbook Marketplace:** certified playbooks from other enterprise customers installable in minutes

## H. Unified Ticketing System

- Every human request or agent-initiated action creates a structured ticket with risk tier classification
- Configurable approval workflows by ticket type, risk tier, and department (maps to Phased Autonomy Model)
- SLA tracking with escalation rules
- Integration with Jira, Linear, GitHub Issues, and ServiceNow

## I. AI Department Agents *(domain-expert validated — solves B2)*

- **HR Agent** — recruitment automation, onboarding workflows, performance facilitation, policy Q&A, jurisdiction-aware compliance tracking
- **Finance Agent** — expense processing, invoice management, financial reporting, budget monitoring — GAAP/IFRS compliant with jurisdiction awareness
- **Marketing Agent** — campaign planning, content generation, performance reporting, SEO analysis, social scheduling
- **Sales Agent** — lead qualification, CRM updates, proposal drafting, pipeline management, customer outreach
- **Legal Agent** — contract review, compliance monitoring, policy drafting, regulatory alerts — jurisdiction-aware
- **Operations Agent** — vendor management, project coordination, reporting, meeting summarisation, resource planning

## J. AI Software Development Team

- **Dev Agent:** receives tickets, writes production-quality code per wiki standards, submits PRs — validation gates at every step (B1)
- Dev agent identity separate from human engineers: PRs attributed to agent, not to human user (B4)
- Enforces file-size limits, coding conventions, and architectural patterns from wiki
- **Automated test generation:** validation gate requires minimum test coverage before PR is raised
- **Security scan integration:** SAST/DAST tools run before any PR is raised; vulnerabilities block deployment
- Code review agent: checks PRs against wiki standards before human review
- Rollback capability: every deployment stores revert snapshot
- Parallel execution: multiple dev agents on different tickets simultaneously, managed by Orchestration Engine

## K. Change Management Module *(solves B5)*

- **Employee communication templates:** announcing agent deployment to affected teams
- **Role-evolution guides per department:** shows employees how their job changes, not disappears
- **Training materials:** how to work with each agent type — review outputs, provide feedback, escalate appropriately
- **Human Contribution Tracking dashboard:** employee-facing view showing their decisions alongside agent activity
- **Adoption health metrics:** tracks employee engagement rate with agent outputs per department
- Customer Success integration: CSM receives adoption health alerts and guides intervention

## L. Integration Layer

- Native connectors: Slack, Salesforce, HubSpot, Zendesk, GitHub, GitLab, Jira, Linear, Google Workspace, Microsoft 365, QuickBooks, Stripe, Notion, Confluence
- **MCP (Model Context Protocol) compatibility** for agent-to-agent interoperability with third-party tools
- REST API and webhook framework for custom integrations
- All integrations route through Universal Data Bridge — no raw data access by agents

---

→ Next: [Build Roadmap](Build-Roadmap)
