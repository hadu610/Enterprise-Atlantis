# Atlantis Wiki

**The single source of truth for every agent in the Atlantis Enterprise AI Operating System.**

Every agent reads this Wiki before acting. Every human contributing to the platform follows the conventions here. This is not documentation about the platform — this is the platform's brain.

> **Status:** Active · **Version:** Strategic Plan v2.0 + Operational Layer v1 · **Updated:** 2026-05-15

---

## Start here

If you are new to the Wiki, read these four pages **in order**:

1. **[Wiki Conventions](Wiki-Conventions)** — how every page is structured and what the metadata block means
2. **[How Agents Use This Wiki](How-Agents-Use-This-Wiki)** — the agent reading protocol (the meta-instruction for every agent)
3. **[Wiki Governance](Wiki-Governance)** — who can edit, how changes are reviewed, version control
4. **[Page Template](Page-Template)** — copy-paste skeleton for authoring new pages

---

## The two halves of the Wiki

### A · Strategic Plan v2.0 *(context for humans)*

Why we are building this, what we are building, and how it differs from every competitor. These pages are read by humans — they are not consumed by agents during execution.

- [Executive Summary](Executive-Summary)
- [The Six Barriers](The-Six-Barriers) — the strategic core
- [Product Concept](Product-Concept)
- [Competitor Analysis](Competitor-Analysis)
- [Advantages and Risks](Advantages-and-Risks)
- [Product Requirements](Product-Requirements)
- [Build Roadmap](Build-Roadmap)
- [Strategic Considerations](Strategic-Considerations)
- [Next Steps](Next-Steps)

### B · Operational Layer *(rules every agent follows)*

The authoritative rules, playbooks, and references agents consult on every task.

#### Wiki Foundation

- [Wiki Conventions](Wiki-Conventions)
- [How Agents Use This Wiki](How-Agents-Use-This-Wiki)
- [Wiki Governance](Wiki-Governance)
- [Page Template](Page-Template)

#### Platform Rules — apply to every agent

- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules)
- [Rollback Procedures](Rollback-Procedures)

#### Shared Vocabulary

- [Unified Entity Model](Unified-Entity-Model) — the schema every agent shares
- [Glossary](Glossary)

#### Agent Playbooks — one per department agent

- [HR Agent Playbook](HR-Agent-Playbook)
- [Finance Agent Playbook](Finance-Agent-Playbook)
- [Marketing Agent Playbook](Marketing-Agent-Playbook)
- [Sales Agent Playbook](Sales-Agent-Playbook)
- [Legal Agent Playbook](Legal-Agent-Playbook)
- [Operations Agent Playbook](Operations-Agent-Playbook)
- [Dev Agent Playbook](Dev-Agent-Playbook)

#### Engineering Standards — Dev Agent + humans

- [Coding Standards](Coding-Standards)

#### Domain Knowledge — owned by Domain Expert Councils

- [Domain Knowledge Index](Domain-Knowledge-Index) — entry point to jurisdiction-specific pages

---

## The six barriers (one-line reminders)

This Wiki is the operational answer to the six structural barriers documented in [The Six Barriers](The-Six-Barriers):

| # | Barrier | Pages that solve it |
|---|---|---|
| **B1** | Compound failure | [Validation Gate Specifications](Validation-Gate-Specifications), [Rollback Procedures](Rollback-Procedures) |
| **B2** | Domain expertise gap | [Domain Knowledge Index](Domain-Knowledge-Index), all [Agent Playbooks](HR-Agent-Playbook) |
| **B3** | Enterprise data silos | [Unified Entity Model](Unified-Entity-Model) |
| **B4** | Agent identity & security | [Action Risk Classification](Action-Risk-Classification) |
| **B5** | Trust & change management | [Phased Autonomy Reference](Phased-Autonomy-Reference), [Approval Workflow Framework](Approval-Workflow-Framework) |
| **B6** | Breadth complexity | [How Agents Use This Wiki](How-Agents-Use-This-Wiki), [Wiki Governance](Wiki-Governance) |

---

## How this Wiki updates itself

Agents can author **draft** pages when they discover a gap (a missing jurisdiction page, a new task type, a recurring escalation pattern). Drafts route to the relevant Domain Expert Council for promotion to `Approved`.

Humans author and maintain `Approved` pages. The Wiki's `git` history is the source of truth; every change is reviewed.

**The Wiki always wins** — if code disagrees with the Wiki, the code is wrong. See [Wiki Governance § 8](Wiki-Governance#8-conflict-between-wiki-and-code).

---

## Pitch site

The public pitch site for investors and customers lives at [hadu610.github.io/Enterprise-Atlantis](https://hadu610.github.io/Enterprise-Atlantis/) (once Pages is enabled). Repo at [github.com/hadu610/Enterprise-Atlantis](https://github.com/hadu610/Enterprise-Atlantis).

*Confidential — For internal use and authorised partner review only · Strategic Plan v2.0 + Operational Layer v1 · 2026-05-15*
