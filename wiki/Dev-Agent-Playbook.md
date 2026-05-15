# Dev Agent Playbook

> **Type:** Playbook · **Owner:** Engineering · **Status:** Draft · **Applies to:** Dev Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

The Dev Agent is the category-defining differentiator. It receives tickets, plans, scaffolds, writes code, generates tests, runs validation gates, and submits pull requests — all under its own non-human identity. **PRs are attributed to the Dev Agent, not to a human user.**

The Dev Agent is held to a higher confidence bar than any other agent because code changes have a large and often delayed blast radius.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `github` (or `gitlab`) | `read`, `write_medium` constrained to `branch_pattern: agent/*` |
| `ci.<provider>` (GitHub Actions, CircleCI) | `read` |
| `package_registry` (npm, PyPI, crates.io) | `read` only |
| `wiki` | `read` (engineering standards, ADRs, glossary) |
| `secrets_manager` | `read` only on scoped, non-production secrets (e.g. test API keys) |

### Explicitly forbidden

- Direct push to `main` / production branches
- Modifying CI/CD configuration in production environments without queued human approval
- Adding new third-party dependencies without queued human approval
- Reading or modifying any HR, Finance, or Legal scope
- Accessing customer production data
- `delete` (any) — branches and PRs are closed via human action
- Deploying directly to production — deployment is a separate, governed action

## 2. Data sources

- Repositories — code, history, CODEOWNERS
- CI — test results, build artefacts, coverage reports
- Engineering Wiki — coding standards, ADRs, naming conventions, file size limits
- Ticketing system — feature requests, bug reports
- Existing agent skill registry — reusable patterns

## 3. Task types

### 3.1 Bug fix

| Sub-task | Action class | Default approval |
|---|---|---|
| Reproduce reported bug | `Read` + sandbox execution | Autonomous |
| Identify root cause | `Read` | Autonomous |
| Write fix + accompanying regression test | `Write` medium (branch only) | Autonomous Phase 2+ |
| Run validation gates (tests, SAST, coverage) | — | Always — these are gates, not steps |
| Open PR | `Write` medium | Autonomous Phase 3+ if all gates pass at confidence ≥ 0.90 |
| Merge PR | `Write` high | **Always queued — human reviewer in CODEOWNERS.** |

### 3.2 Feature implementation

| Sub-task | Action class | Default approval |
|---|---|---|
| Read feature spec from ticket | `Read` | Autonomous |
| Produce implementation plan (Wiki draft) | `Write` low (draft in agent space) | Queued for tech lead review |
| Scaffold files per coding standards | `Write` medium (branch only) | Autonomous Phase 3+ |
| Implement feature in increments | `Write` medium (branch only) | Autonomous Phase 3+ |
| Open PR | `Write` medium | Autonomous Phase 3+ |
| Merge PR | `Write` high | **Always queued — human reviewer.** |

### 3.3 Refactoring

| Sub-task | Action class | Default approval |
|---|---|---|
| Identify candidate refactors from file-size / complexity flags | `Read` | Autonomous |
| Open refactor ticket | `Write` low | Autonomous |
| Execute refactor (mechanical) | `Write` medium (branch only) | Autonomous Phase 3+ for behavior-preserving changes with full test coverage |
| Behavior-changing refactor | `Write` high | Always queued |

### 3.4 Test generation

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate unit tests for uncovered code | `Write` medium (branch only) | Autonomous Phase 3+ |
| Generate integration tests | `Write` medium | Queued for tech lead review |
| Modify existing tests | `Write` medium | Queued — never autonomous to change a test that is failing |

### 3.5 Dependency management

| Sub-task | Action class | Default approval |
|---|---|---|
| Patch-level upgrades for non-breaking versions | `Write` medium | Autonomous Phase 4 if all tests pass; queued otherwise |
| Minor / major upgrades | `Write` medium | Always queued |
| Adding a new dependency | `Write` medium | **Always queued — supply chain risk.** |

### 3.6 Operations & runbook execution

The Dev Agent does **not** run production operations autonomously. It can:

- Draft runbooks
- Run pre-approved diagnostic queries against staging environments
- Open incident tickets

It cannot:

- Restart production services
- Roll back production deployments (humans do this through the Console)
- Modify production secrets
- Execute against production data

## 4. Validation gates (Dev Agent specific)

In addition to the four [core validation gates](Validation-Gate-Specifications#1-the-four-core-gates), Dev Agent PRs run:

| Gate | Pass criterion |
|---|---|
| Test coverage | New code coverage ≥ baseline; overall coverage non-decreasing |
| Test results | All tests pass; no flake retries beyond configured limit |
| SAST | No new critical or high findings |
| Dependency vulnerability scan | No new critical CVEs introduced |
| Lint / format | Zero violations per the engineering standards page |
| File size | No file exceeds the configured maximum (default 300 lines) |
| Wiki adherence | PR description references the ADR or playbook it implements; agent self-checks the implementation matches the cited rule |

Failure of any gate blocks PR creation. The agent files an internal ticket showing the gate failure.

## 5. Code review by code-review sub-agent

Before a PR opens for human review, a separate **code-review sub-agent** reviews the Dev Agent's PR against:

- Engineering standards page
- Naming conventions
- File-size and complexity limits
- Test design quality (not just coverage — meaningful assertions)
- Idiomatic style for the language

The code-review sub-agent's output is included in the PR description for the human reviewer. **It is advisory; the human reviewer still merges.**

## 6. Confidence priors

| Task | Floor confidence |
|---|---|
| Mechanical refactor (rename, extract method) | 0.92 |
| Bug fix with clear repro | 0.90 |
| Feature implementation | 0.90 |
| Dependency upgrade | 0.95 |
| Test generation for uncovered branch | 0.85 |
| Any change touching authentication / authorisation code | n/a — always queued |
| Any change to payment / financial code paths | n/a — always queued |

## 7. Wiki-first

The Dev Agent loads the relevant Wiki pages before writing a single line:

- [Coding Standards](Coding-Standards)
- Any ADR (Architecture Decision Record) for the affected subsystem
- The customer's tenant-specific overrides (if any)
- Domain playbooks if the code touches a department's logic

If a coding standard contradicts the agent's planned implementation, the agent **defers to the Wiki**. If the standard is wrong, the agent files a `wiki-update` ticket instead of implementing against the wrong standard.

## 8. Escalation contacts

| Trigger | Escalation |
|---|---|
| Wiki gap (no ADR for the affected subsystem) | Tech lead + Engineering |
| SAST critical finding in existing code (not introduced by the PR) | Security |
| Test flake exceeding tolerance | Tech lead |
| Authentication / authorisation path modification | Security + tech lead |
| Conflicting ADRs | ADR Owners + tech lead |
| Repeated reviewer rejection (3+ in 30 days for the same kind of change) | Likely Wiki gap — `wiki-update` ticket |

## 9. Forbidden Dev Agent behaviours

- **Never** push directly to `main` or any protected branch.
- **Never** merge a PR — only humans merge.
- **Never** deploy to production — deployment is a separate, governed action.
- **Never** modify or delete a test that is failing.
- **Never** add a new third-party dependency without queued approval.
- **Never** read or write customer production data.
- **Never** circumvent a validation gate.
- **Never** sign or commit using a human's git identity.

---

## Cross-references

- [Coding Standards](Coding-Standards)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Rollback Procedures](Rollback-Procedures)
- [The Six Barriers § B1](The-Six-Barriers#b1--compound-failure) — why every PR has gates
