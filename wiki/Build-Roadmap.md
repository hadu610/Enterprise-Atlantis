# 7 · Build Roadmap

The roadmap is structured so that **all six barrier solutions are built as infrastructure before department agents are added**. This is the opposite of what most teams would do (start with visible agent features).

The reason: building department agents on top of an unsolved orchestration, identity, or data layer creates technical debt that becomes impossible to fix at scale.

---

## Phase 1 · Core Infrastructure *(Months 1–6)*

**Priority:** Build the foundation that solves B1, B3, B4, B6 before any agent goes live. **Skipping this phase to ship faster is the #1 reason enterprise AI projects fail in production.**

- Complete technical architecture for all core components — Orchestration Engine, Validation Gate Architecture, Zero-Trust Agent Identity, Universal Data Bridge
- Build Orchestration Engine and Shared Context Object infrastructure
- Build Validation Gate Architecture with deterministic execution wrapper and rollback engine
- Build Zero-Trust Agent Identity system with OAuth scoping and action risk classification
- Build Universal Data Bridge with **Salesforce, HubSpot, QuickBooks, and GitHub** connectors (Phase 1 priority integrations)
- Build Knowledge Wiki with versioning and approval workflow
- Build Ticketing System with risk-tier classification and Phased Autonomy Model framework
- Build onboarding interview engine with Data Readiness Assessment and jurisdiction detection
- **SOC 2 Type II readiness audit begins** — must be certified before first commercial customer
- Recruit Domain Expert Councils: HR law specialist, CPA/accounting expert, employment compliance expert
- Beta with **3–5 design partner enterprises** focused on core infrastructure validation

## Phase 2 · First Two Agents *(Months 7–12)*

**Priority:** Prove the full stack works end-to-end for HR and Finance. **All 6 barriers must be demonstrably solved at this scale before adding more departments.** Do not add departments 3+ until HR and Finance are in Approval Mode (Phase 3 autonomy) with at least 3 design partners.

- Launch **HR Agent** (jurisdiction-aware, wiki-validated, domain expert reviewed) — Drafting Mode only initially
- Launch **Finance Agent** (GAAP/IFRS compliant, confidence-bounded) — Drafting Mode only initially
- Deploy Change Management Module for design partners — employee communication and role-evolution guides
- Launch **Trust Score Dashboard** — begin accumulating agent performance evidence
- Build activity tracking dashboards for agents and employees
- Progress design partners from Drafting to Startup Mode; validate validation gate performance
- **First commercial customers**; refine Phased Autonomy Model based on real usage
- Expand Universal Data Bridge: add Microsoft 365, Google Workspace, Jira connectors

## Phase 3 · Agent Expansion *(Months 13–24)*

- Launch Sales, Marketing, and Operations agents (only after HR + Finance are in Approval Mode — B6 discipline)
- Launch **Dev Agent: Drafting + Startup Mode** with full validation gate suite and agent identity
- Deploy Prompt Injection Defence layer for all agents reading external content
- **SOC 2 Type II certification achieved**; begin ISO 27001 audit
- Domain Playbook Marketplace beta: first certified industry packs (SaaS, Healthcare, Retail)
- Expand Data Bridge: add HRIS platforms (BambooHR, Workday, ADP), accounting systems (Xero, NetSuite)
- Scale to **20+ enterprise customers**; Customer Success team reaches 5 CSMs

## Phase 4 · Full Autonomy & Scale *(Months 25–36)*

- Dev Agent: **Approval Mode and Enterprise Mode** — autonomous coding with validation gates running silently
- Legal Agent with full jurisdiction-aware compliance automation
- **ISO 27001 certification**; **HIPAA compliance** for healthcare verticals
- Partner marketplace: third-party domain playbooks and agent skill extensions
- Agent-to-agent coordination across customer organisations (B2B agent workflows)
- Scale to **50+ enterprise customers**; evaluate white-label licensing for IT consultancies
- Mid-market tier: simplified onboarding with pre-configured agent packs for SMBs

---

→ Next: [Strategic Considerations](Strategic-Considerations)
