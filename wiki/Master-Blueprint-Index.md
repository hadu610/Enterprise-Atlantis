# Master Blueprint Index

> **Type:** Reference · **Owner:** Founders · **Status:** Approved · **Applies to:** Humans only · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is **the table of contents for the Atlantis blueprint** — the complete catalogue of every consideration the platform plan covers, every decision that has been documented, and every gap we've identified but not yet authored.

If you are joining Atlantis as an engineer, manager, investor, or partner, this is the page that tells you what the full plan covers and where each piece lives. It is intentionally exhaustive — the goal is to make the unknowns visible, not to hide them behind authored pages.

The Wiki is a living document. Items marked `WIP` are explicitly identified as gaps to fill; items marked `Proposed` are recommendations that have not yet been ratified as part of the plan.

---

## Reading guide

| Marker | Meaning |
|---|---|
| ✅ **Approved** | Page exists, content reviewed, in force |
| 🟡 **Draft** | Page exists, content authored, awaiting Owner review |
| 🚧 **WIP** | Page exists or is reserved, but content is incomplete |
| 📋 **Proposed** | No page yet; identified as a needed consideration; not yet committed |

The strategic plan (B1–B6 barriers, the six solutions) is the **why**. The pages catalogued here are the **how**. Both halves must exist for the blueprint to be complete.

---

## A · Strategic Plan v2.0 (the why)

| Page | Status |
|---|---|
| [Executive Summary](Executive-Summary) | ✅ |
| [The Six Barriers](The-Six-Barriers) | ✅ |
| [Product Concept](Product-Concept) | ✅ |
| [Competitor Analysis](Competitor-Analysis) | ✅ |
| [Advantages and Risks](Advantages-and-Risks) | ✅ |
| [Product Requirements](Product-Requirements) | ✅ |
| [Build Roadmap](Build-Roadmap) | ✅ |
| [Strategic Considerations](Strategic-Considerations) | ✅ |
| [Next Steps](Next-Steps) | ✅ |

---

## B · Wiki Foundation

| Page | Status |
|---|---|
| [Wiki Conventions](Wiki-Conventions) | ✅ |
| [How Agents Use This Wiki](How-Agents-Use-This-Wiki) | ✅ |
| [Wiki Governance](Wiki-Governance) | ✅ |
| [Page Template](Page-Template) | ✅ |

---

## C · Platform Rules (apply to every agent)

| Page | Status |
|---|---|
| [Phased Autonomy Reference](Phased-Autonomy-Reference) | ✅ |
| [Action Risk Classification](Action-Risk-Classification) | ✅ |
| [Approval Workflow Framework](Approval-Workflow-Framework) | ✅ |
| [Validation Gate Specifications](Validation-Gate-Specifications) | ✅ |
| [Confidence and Escalation Rules](Confidence-and-Escalation-Rules) | ✅ |
| [Rollback Procedures](Rollback-Procedures) | ✅ |

---

## D · Shared Vocabulary

| Page | Status |
|---|---|
| [Unified Entity Model](Unified-Entity-Model) | ✅ |
| [Glossary](Glossary) | ✅ |

---

## E · Agent Playbooks

| Page | Status |
|---|---|
| [HR Agent Playbook](HR-Agent-Playbook) | 🟡 Draft (HR Domain Council to approve) |
| [Finance Agent Playbook](Finance-Agent-Playbook) | 🟡 Draft |
| [Marketing Agent Playbook](Marketing-Agent-Playbook) | 🟡 Draft |
| [Sales Agent Playbook](Sales-Agent-Playbook) | 🟡 Draft |
| [Legal Agent Playbook](Legal-Agent-Playbook) | 🟡 Draft |
| [Operations Agent Playbook](Operations-Agent-Playbook) | 🟡 Draft |
| [Dev Agent Playbook](Dev-Agent-Playbook) | 🟡 Draft |

---

## F · Engineering Blueprint (the "how" for code)

| Page | Status |
|---|---|
| [Coding Standards](Coding-Standards) | ✅ |
| [Technology Stack](Technology-Stack) | ✅ |
| [Architecture Principles](Architecture-Principles) | ✅ |
| [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) | ✅ |
| [Security and Data Policy](Security-and-Data-Policy) | ✅ |
| [Observability Standards](Observability-Standards) | ✅ |
| [API Design Standards](API-Design-Standards) | ✅ |
| [CI/CD and Release Engineering](CI-CD-and-Release-Engineering) | ✅ |
| [Testing Strategy](Testing-Strategy) | ✅ |
| [Documentation Standards](Documentation-Standards) | ✅ |

---

## G · Domain Knowledge — authored by Domain Expert Councils

| Page | Status |
|---|---|
| [Domain Knowledge Index](Domain-Knowledge-Index) | ✅ (index complete; sub-pages WIP) |
| Employment Law — US / UK / DE / FR / etc. | 🚧 WIP (HR + Legal Councils) |
| Accounting Standards — GAAP / IFRS | 🚧 WIP (Finance Council) |
| Tax Jurisdictions — US sales tax / EU VAT / UK VAT / CA GST | 🚧 WIP (Finance + Legal Councils) |
| Legal Frameworks — GDPR / CCPA / SaaS clauses / Anti-spam | 🚧 WIP (Legal Council) |
| Compliance Frameworks — SOC 2 / ISO 27001 / HIPAA / PCI DSS | 🚧 WIP (Security + Legal) |
| Security Frameworks — OWASP Top 10 / OWASP LLM Top 10 / NIST SSDF / Prompt Injection Defence | 🚧 WIP (Security) |
| Marketing — Attribution Models / Consent / Brand Template | 🚧 WIP (Marketing Council) |
| Industry Blueprints — SaaS / Healthcare / Retail / Manufacturing / ProServ | 🚧 WIP (Product + Domain Councils) |

---

## H · Operational Playbooks I propose adding

These are recommended additions to the blueprint that would close current gaps. None exists yet; each is a candidate page for the next quarter.

| Topic | Why we need it | Suggested Owner |
|---|---|---|
| **Incident Response Playbook** | [Security and Data Policy § 13](Security-and-Data-Policy#13-incident-response) references this; the standalone playbook should detail Sev1–Sev4 response in step-by-step form | Security + Engineering |
| **Data Subject Rights Procedures** | GDPR / CCPA Article-17 workflows ([Security and Data Policy § 9](Security-and-Data-Policy#9-data-subject-rights-gdpr--ccpa)) | Legal + Security |
| **Disaster Recovery Runbook** | Quarterly DR drill procedures, RTO/RPO test plan | Engineering |
| **Customer Approval Defaults** | Default routing rules for [Approval Workflow Framework § 2](Approval-Workflow-Framework#2-routing-rules) | Engineering + Customer Success |
| **Routing Policy** (LLM) | The data-driven routing rules referenced in [AI Model and Prompt Standards § 1](AI-Model-and-Prompt-Standards#1-model-selection-per-task-type) | Engineering |
| **Vendor Risk Management** | Approved vendor list, security review process, ongoing attestation | Security + Legal |
| **Customer Success Playbook** | How CSMs guide customers through autonomy phases | Customer Success |
| **Onboarding Interview Script** | The structured interview at customer activation | Product + Customer Success |
| **Data Readiness Assessment** | Detailed scoring rubric per source system | Engineering + Customer Success |
| **Change Management Templates** | Customer-facing employee communication templates | Customer Success |
| **Role-Evolution Guides** | How each role's daily work changes when agents arrive (per department) | Customer Success + Domain Councils |
| **Adversarial Testing Catalogue** | Living list of known prompt-injection vectors and our responses | Security |

---

## I · Business and Operations I propose adding

These are blueprint pages outside engineering that round out the platform plan.

| Topic | Why we need it | Suggested Owner |
|---|---|---|
| **Hiring Plan and Team Structure** | When to hire what, by phase; org chart trajectory; skills matrix | Founders + Engineering Lead |
| **FinOps Strategy** | Cloud and LLM cost governance; per-tenant unit economics; cost-as-a-feature decisions | CFO (when hired) + Engineering |
| **Pricing and Packaging** | Per-agent / per-seat / per-tenant pricing structure; usage-based components; enterprise contract terms | Founders + Sales lead |
| **Go-to-Market Strategy** | ICP definition, channel mix, sales motion (PLG vs. enterprise), expansion playbook | Founders + Sales lead |
| **Partnership Strategy** | Systems integrators, technology partners, marketplace listings | Founders + BD |
| **Customer Success Operations** | Tiering, response SLAs, expansion motion, NPS programme | Customer Success Lead |
| **People and Culture Playbook** | Hiring rubrics, performance framework, compensation philosophy, remote-work norms | People Lead |
| **Equity and Compensation Framework** | Bands, refresh cycles, executive compensation | Founders + People Lead |
| **Brand and Communications Strategy** | Voice, tone, channel mix, crisis comms, analyst relations | Marketing Lead |
| **Investor Relations and Reporting** | Board meeting cadence, monthly investor update template, KPI dashboard | Founders + CFO |
| **Legal Entity, IP, and Compliance Map** | Entity structure, IP assignment, contractor IP, regulatory map | Legal |
| **Risk Register** | Top-15 platform risks, mitigations, owners, review cadence | Founders |

---

## J · Compliance & Certification Roadmap

Phased plan for the certifications enumerated in [Security and Data Policy § 8](Security-and-Data-Policy#8-compliance):

| Cert | Target phase | Owner |
|---|---|---|
| SOC 2 Type II | Before first commercial customer | Security |
| ISO 27001 | Month 18 | Security |
| HIPAA BAA-readiness | When first healthcare tenant signs | Security + Legal |
| GDPR / CCPA / CPRA posture | Day 1 | Legal + Security |
| FedRAMP (if government tenants emerge) | Phase 4 evaluation | Security |
| Industry-specific (PCI DSS, IRAP, ISMAP) | Customer-driven | Security |

---

## K · Strategy Touchstones

These are the unchanging strategic anchors of the platform. When evaluating any future change, hold it against these:

1. **Infrastructure before agents.** [Strategic Considerations § 1](Strategic-Considerations).
2. **The Wiki is the source of truth.** Code defers to it. [Wiki Governance § 8](Wiki-Governance#8-conflict-between-wiki-and-code).
3. **Trust is engineered, not sold.** The Phased Autonomy Model accumulates evidence; the Trust Score Dashboard makes it visible.
4. **Modular-first architecture.** Department isolation prevents the breadth-complexity trap.
5. **Reliability over features.** The production gap is the competitive battlefield ([Strategic Considerations § 5](Strategic-Considerations#5-the-production-gap-is-the-competitive-battlefield)).
6. **Multi-provider AI strategy.** No single LLM provider exceeds 80% of traffic.
7. **The Dev Agent is the moat.** No competitor offers an autonomous software engineer inside the same governance fabric.
8. **Domain Expert Councils are not optional.** Domain depth is one of the three legs of agent reliability.
9. **The Wiki updates itself, bounded.** Agent-authored drafts route to human Owners; no agent ever promotes its own page.
10. **Cost is a feature, not a footnote.** Every technology added has a documented 10×/100×/1000× cost trajectory.

If a decision contradicts a touchstone, the decision needs explicit explanation and an updated touchstone — not silent drift.

---

## L · How to use this index

- **New hire** — read top-to-bottom; skip the WIP/Proposed sections on the first pass.
- **Investor** — A (strategic plan) is the headline; F (engineering blueprint) is the depth-of-thinking signal; H and I are the honest gap list.
- **Engineer** — F is your day-to-day; C is your platform contract; D is your shared vocabulary.
- **Domain expert** — G is your authoring queue; E is the agent playbook that consumes your work.
- **Customer admin** — A and C cover the model; E covers what the agents you activate will and won't do.

---

## M · Review cadence

| Section | Owner | Cadence |
|---|---|---|
| A — Strategic plan | Founders | Quarterly |
| B — Wiki foundation | Engineering | Quarterly |
| C — Platform rules | Engineering | Quarterly |
| D — Shared vocabulary | Engineering | Semi-annually |
| E — Agent playbooks | Domain Councils | Quarterly per department |
| F — Engineering blueprint | Engineering / CTO | Quarterly |
| G — Domain knowledge | Domain Councils | Per regulation change + quarterly |
| H, I — Proposed additions | Founders | Quarterly — promote ≥ 2 per quarter |
| J — Compliance roadmap | Security | Quarterly |
| K — Strategy touchstones | Founders | Annually; immediate review on a touchstone violation |

---

## N · This page as the blueprint contract

Anyone proposing a major change to the platform must, before implementation:

1. Check this index for the affected sections.
2. If a relevant page is `Proposed` or `WIP`, author it (or commission its author) before the change ships.
3. If a relevant `Approved` page would need to be revised, revise it in the same PR as the implementation.
4. Update this index to reflect the new state.

This is how we keep "I want to make sure we layout all of the things we need to consider" honest as the platform grows.

---

## Cross-references

- [Home](Home)
- [Strategic Considerations](Strategic-Considerations)
- [Next Steps](Next-Steps)
- [Wiki Conventions](Wiki-Conventions)
- [Wiki Governance](Wiki-Governance)
