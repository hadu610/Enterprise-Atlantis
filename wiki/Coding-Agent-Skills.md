# Coding Agent Skills

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-16

## Summary

This page is the **day-one adoption list** for coding skills — the capabilities our Dev Agent and our human engineers rely on from the very first commit. It is a focused application of the [Agent Skills Strategy](Agent-Skills-Strategy) principle (*adopt the commoditised, build the moat*) to the highest-leverage agent activity: writing code.

The principle, sharpened: **if a coding capability is a solved problem, we adopt — we never invent.** We invest engineering hours in our differentiators (validation gates, agent identity, domain playbooks) — not in re-implementing PR review, linting, or test scaffolding.

Two corollaries:

- **Day-1 means day-1.** No "we'll add it later." The set below is in place before the first production PR.
- **Standard means popular.** We pick well-known skills with the largest community, not bespoke choices. Engineers joining from any background should recognise most of the stack.

---

## 1. Selection criteria — what makes a coding skill "day-1 standard"

A skill qualifies for day-1 adoption only if all are true:

1. **Battle-tested** — production usage by thousands of teams; not a recent prototype.
2. **Provider-supported or actively maintained** — released in the last 6 months; clear maintainer.
3. **Covers a commoditised capability** — not something specific to our domain (where we'd build).
4. **Passes our governance gate** (see [Agent Skills Strategy § 7](Agent-Skills-Strategy#7-skill-governance--how-skills-are-admitted)) — security review, compatibility, eval pass, version pin.
5. **Has a non-LLM fallback** — if the LLM-based skill fails, a deterministic tool (linter, type checker) catches it. Defence in depth.

If any of the five fails, the skill is deferred or built.

---

## 2. Anthropic-published coding skills — adopt day 1

These ship as part of the Claude / Anthropic ecosystem. They are first-class, version-pinned, governed by the publisher, and free.

| Skill | What it does | Who uses it | Our day-1 use |
|---|---|---|---|
| `review` | Reviews a pull request against the repo's standards | Dev Agent (every PR) + human reviewers (advisory) | Mandatory before any PR opens for human review; output included in PR description |
| `security-review` | Reviews pending changes on the current branch for security issues | Dev Agent + Security on-call | Mandatory pre-merge for any branch touching auth, payment, identity, or data-access code |
| `simplify` | Reviews changed code for reuse, quality, efficiency, and fixes issues | Dev Agent + human engineers | Run on agent-authored PRs before opening; surfaces dead code, duplication, and over-engineering |
| `init` | Initialises a `CLAUDE.md` file with codebase documentation | Engineers bootstrapping a new repo | Used at every new service repo creation |
| `skill-creator` | Authors new skills in the standard packaging format | Engineering (humans authoring Atlantis skills) | Used to create our internal Atlantis horizontal skills + Domain Playbooks |

These are the **same Anthropic-published skills available in Claude Code today** — we are dogfooding, not inventing parallel tooling.

---

## 3. Anthropic-published document skills — used in coding workflows

Some Anthropic skills aren't coding-specific but are used heavily by the Dev Agent during coding workflows:

| Skill | Coding use case |
|---|---|
| `docx` | Generating engineering documentation deliverables for customer-facing tier (e.g. SOC 2 evidence docs) |
| `pdf` | Parsing third-party API specs delivered as PDFs; reading vendor SDK docs |
| `xlsx` | Generating coverage / performance reports for board materials |

These passed through the [Agent Skills Strategy](Agent-Skills-Strategy) governance gate already; they are wrapped with PII redaction + audit on use.

---

## 4. Frontend coding skills — day-1 adoption list

For our [Technology Stack § Frontend](Technology-Stack#frontend) (Next.js + React + TypeScript + Tailwind + shadcn/ui).

### Built-in to Claude Code (no installation needed)

| Capability | Tool / pattern | Why we adopt |
|---|---|---|
| Code edit (file-level) | Built-in `Edit` tool | Standard mechanism every Claude Code session uses |
| File creation | Built-in `Write` tool | Same; battle-tested |
| Codebase search | Built-in `Grep` / `Glob` | Faster and more reliable than LLM file discovery |
| Codebase exploration | `Explore` subagent | Avoids context bloat from broad searches |

### Linting + formatting (wrapped as Dev Agent capabilities)

| Tool | Language | Why standard |
|---|---|---|
| **ESLint** (with `@typescript-eslint`) | TS/JS | Industry default for TS/JS linting since 2018 |
| **Prettier** | TS/JS/CSS/MD | The de-facto code formatter; no debate, no config wars |
| **Stylelint** | CSS / Tailwind | The standard CSS linter; tailored to our Tailwind usage |

These run on every commit via pre-commit hooks and in CI per [CI/CD and Release Engineering § 2](CI-CD-and-Release-Engineering#2-pull-request-rules).

### Type checking

| Tool | Language | Why standard |
|---|---|---|
| **TypeScript** (`tsc --strict`) | TS | Non-negotiable for our stack |
| **Zod** | TS (runtime + compile-time) | Industry-standard schema validation; type inference flows from one source |

### Component / framework specific

| Tool | Use | Why |
|---|---|---|
| **React Developer Tools** | Browser DevTools | Universal in React development; integrated debugging |
| **shadcn/ui CLI** | UI components | Officially supported way to scaffold our design system components — we copy code, not import |
| **TanStack Query DevTools** | Server state | Standard with the library we picked |

### Accessibility

| Tool | Use | Why day-1 |
|---|---|---|
| **axe-core** (via `@axe-core/playwright` or browser extension) | WCAG 2.2 AA compliance checks | Industry standard; mandatory per [Coding Standards § Standards we draw from](Coding-Standards#standards-we-draw-from) |
| **eslint-plugin-jsx-a11y** | JSX accessibility lint | Catches issues at edit time |

### Testing (frontend)

| Tool | Use | Why standard |
|---|---|---|
| **Vitest** | Unit + component tests | Faster than Jest, drop-in compatible; the default in modern Vite/Next setups |
| **React Testing Library** | Component-behaviour testing | Universal; encourages behaviour-named tests per our [Testing Strategy](Testing-Strategy) |
| **Playwright** | E2E + visual regression + axe a11y runs | Microsoft-backed; the strongest E2E framework in 2026 |
| **MSW (Mock Service Worker)** | API mocking in tests | Standard for offline test reliability |

### Browser preview (during agent development)

The Dev Agent uses the Claude Code Preview surface (built-in) to inspect agent-authored HTML/CSS/JS during development. For runtime UI testing, Playwright drives a real browser.

---

## 5. Backend coding skills — day-1 adoption list

For our [Technology Stack § Languages](Technology-Stack#languages) (TypeScript on Node.js primary; Python for AI/data; Go for hot paths).

### Linting + formatting

| Tool | Language | Why standard |
|---|---|---|
| **ESLint** | TS/JS | Same as frontend |
| **Prettier** | TS/JS | Same |
| **Ruff** (lint + format) | Python | The fastest, most adopted Python tool of the last 3 years; replaces flake8 + black + isort |
| **golangci-lint** | Go | The standard aggregator for Go linters (govet, errcheck, ineffassign, etc.) |
| **gofmt** | Go | Built into Go; no debate possible |

### Type checking

| Tool | Language | Why |
|---|---|---|
| **tsc strict** | TS | Same as frontend |
| **mypy strict** | Python | Industry-standard Python type checker; flowing into PEP 695+ |
| **Built-in** | Go | Type checking is the compiler |

### Testing (backend)

| Tool | Language | Why |
|---|---|---|
| **Vitest** | TS/JS | Same as frontend; one runner across the stack |
| **pytest** | Python | Universal Python test framework; nothing else is close |
| **go test** | Go | Built-in |
| **Testcontainers** | Cross-language | Industry-standard ephemeral container fixtures for integration tests |
| **Pact** | Cross-language | Standard consumer-driven contract testing |

### Security scanning (day-1 mandatory)

| Tool | What it scans | Why |
|---|---|---|
| **Semgrep** | SAST (multi-language) | The most-adopted open-source SAST tool; rule library shared across the industry |
| **Snyk** | Dependency vulnerabilities | Industry standard for SCA; integrated with GitHub natively |
| **Dependabot** | Dependency updates | GitHub-native; zero-setup |
| **Trivy** | Container image scanning | Open-source, widely adopted; runs in CI and at runtime |
| **govulncheck** | Go-specific vuln checks | Official Go tool |
| **pip-audit** | Python-specific vuln checks | PyPA-maintained |

The full security scanning ladder is enforced per [CI/CD and Release Engineering § 2](CI-CD-and-Release-Engineering#2-pull-request-rules). Day-1 means: a PR cannot be merged with any failing scan.

### Database

| Tool | Use | Why |
|---|---|---|
| **Drizzle ORM** (TS) / **SQLAlchemy** (Python) | ORM | Most-adopted modern ORMs in their ecosystems |
| **Prisma** (alt for TS) | Schema-first DB workflows | Acceptable second choice; tracked per repo |
| **Drizzle Kit / Alembic** | Migrations | Standard companion to each ORM |
| **pgvector** | Vector storage in Postgres | Already chosen in [Technology Stack § Data layer](Technology-Stack#data-layer) |

### API design

| Tool | Use | Why |
|---|---|---|
| **OpenAPI 3.1** | API specification source | Mandatory per [API Design Standards § 13](API-Design-Standards#13-openapi-31-specs-are-the-source-of-truth) |
| **Spectral** | OpenAPI linting | The de-facto OpenAPI linter |
| **openapi-typescript** | Client generation | Standard; types flow from spec |
| **Swagger UI / Redocly** | Hosted API docs | Industry standard rendering of OpenAPI |

### Infra-as-code / DevOps

| Tool | Use | Why |
|---|---|---|
| **Terraform** + **Terragrunt** | IaC | Already chosen — industry standard |
| **GitHub Actions** | CI | Already chosen |
| **ArgoCD** | GitOps deployment | Already chosen |
| **Helm** | Third-party chart consumption only | Per [Technology Stack rejects](Technology-Stack#infrastructure-rejects) |

---

## 6. Cross-cutting coding skills — day-1 adoption list

Skills used by Dev Agent regardless of frontend vs backend context.

| Skill / tool | What it does | Day-1 mandate |
|---|---|---|
| **Anthropic `review`** | PR review against standards | Mandatory on every Dev Agent PR before human review |
| **Anthropic `security-review`** | Security review of pending changes | Mandatory on any branch touching auth/payment/identity/data |
| **Anthropic `simplify`** | Quality + reuse review | Run on agent-authored PRs before opening |
| **Git** | Version control | Universal; no agent ever directly modifies `.git/` files |
| **Conventional Commits** + **commitlint** | Commit message format | Enforced via commit-msg hook |
| **Husky / lefthook** | Git hook framework | Standard for pre-commit / pre-push enforcement |
| **EditorConfig** | Cross-editor settings consistency | Universal; zero-setup |
| **Renovate** (alt to Dependabot) | Dependency update automation | Acceptable second choice if Dependabot is insufficient |
| **Codecov** or **Coveralls** | Coverage reporting | Used diagnostically, not as a hurdle (per [Coding Standards § 7](Coding-Standards#7-tests)) |

---

## 7. Atlantis-built coding skills — built day 1 (the moat)

These don't exist outside Atlantis and won't be adopted. We build them.

| Skill | Why we build (not adopt) |
|---|---|
| `atlantis:validation-gate-evaluator` | Specific to our gate architecture |
| `atlantis:wiki-reader` | Reads our wiki metadata format; cannot be off-the-shelf |
| `atlantis:adr-checker` | Verifies code changes against ADRs |
| `atlantis:test-coverage-gate` | Our gate semantics — non-decreasing coverage with class-specific thresholds |
| `atlantis:trust-score-emitter` | Emits structured Trust Score signals after every Dev Agent action |
| `atlantis:cross-tenant-isolation-checker` | Static analysis that no code path crosses tenant boundaries |
| `atlantis:secret-pattern-scanner` | Wraps known credential patterns; runs in CI + at output filter (per [Prompt Injection Defence § 9](Prompt-Injection-Defence-and-Secret-Protection#9-layer-6--output-filtering--pii-redaction-post-response)) |

All Atlantis-built skills follow the same packaging format as Anthropic-published ones (per [Agent Skills Strategy § 1](Agent-Skills-Strategy#1-what-is-a-skill)), authored via `anthropic-skills:skill-creator`.

---

## 8. What we explicitly defer (not day-1)

These are valuable but not foundational. We add them in Phase 2 or later, when the basics are stable.

| Capability | Why deferred | Earliest phase |
|---|---|---|
| Visual regression testing (full Percy / Chromatic) | Playwright + screenshot diffs handle our needs at the customer console scale; Percy when we have a real component library | Phase 2 |
| Performance profiling automation | We profile manually until we have repeatable performance budgets | Phase 2 |
| ML-assisted code search (Sourcegraph Cody, etc.) | Grep + Explore covers us until repo > ~500K LOC | Phase 3 |
| Automatic migration generation from schema changes | Drizzle Kit / Alembic handle manual migration generation well; we wait for sustained pain | Phase 2 |
| Storybook / component library docs | Real value only once we have >50 reusable components | Phase 3 |
| Architectural fitness functions (NetArchTest-style) | Tracked in Complexity Budget manually until quantitative evidence demands it | Phase 3 |

The "earliest phase" column is not a promise — it is a no-earlier-than. A skill enters when the need is concrete, not when it's tempting.

---

## 9. How the Dev Agent integrates these skills

Per the [Dev Agent Playbook](Dev-Agent-Playbook), every Dev Agent task follows this sequence:

1. **Read** the relevant [Coding Standards](Coding-Standards), ADRs, and skill registry.
2. **Plan** the change; emit a draft plan to its ticket.
3. **Implement** using built-in `Edit` / `Write` (Claude Code primitives).
4. **Run gates** locally before opening a PR:
   - Lint + format (auto-fix where possible)
   - Type check
   - Tests for new code
   - Coverage non-decreasing
   - Security scan clean
5. **Run skill suite** on the proposed PR:
   - `anthropic-skills:review` for general PR review
   - `anthropic-skills:security-review` if change touches sensitive surface
   - `anthropic-skills:simplify` for quality/reuse pass
6. **Open PR** with skill outputs included in the PR description.
7. **Wait for human review** (Dev Agent never merges its own PRs — hard rule from [Dev Agent Playbook § 9](Dev-Agent-Playbook#9-forbidden-dev-agent-behaviours)).

Skipping any step is a forbidden behaviour per Section 11 below.

---

## 10. Skill registry entries — what to record per coding skill

Every adopted skill is registered with this metadata (extension of the [Agent Skills Strategy § 6](Agent-Skills-Strategy#6-the-skills-registry) schema):

```yaml
skill: anthropic-skills:review
version: <pinned semver>
language_scope: [typescript, javascript, python, go]
phase_introduced: 1
mandate: required  # required | optional | per-team
gate_blocking: true  # if true, failure blocks PR
wrapping: 
  pre: [redact_pii, scope_check]
  post: [output_filter, audit_log]
```

`gate_blocking: true` means a failed skill output blocks PR creation. For day-1 must-haves (review, security-review, simplify), gate_blocking is always true.

---

## 11. Forbidden

- Building a parallel version of any skill in Section 2, 3, 4, or 5 unless an explicit ADR documents why the standard fails for us.
- Adding a Phase-2+ skill from Section 8 to Phase 1 to "future-proof."
- Adopting a skill outside the [Agent Skills Strategy](Agent-Skills-Strategy) governance gate, even one that "everyone uses."
- Disabling a `gate_blocking: true` skill for a "quick fix" PR — emergency hotfixes still pass the gate per [Incident Response Playbook § 12](Incident-Response-Playbook#3-the-six-step-process).
- Pinning a skill to "latest" instead of a specific version.
- Dev Agent merging its own PR (hard rule from Dev Agent Playbook).
- Customer-tenant-specific overrides of the Section 6 cross-cutting skills.

---

## When to revisit

- A new Anthropic-published coding skill is released → evaluate within 30 days.
- A skill we adopted is deprecated by its publisher → migration plan within 30 days.
- A non-Anthropic OSS skill achieves market-leader adoption in its category → re-evaluate.
- Dev Agent PR rejection rate by reviewers exceeds 15% sustained → likely a skill is mis-calibrated.
- Quarterly review by Engineering + CTO of the day-1 list.

---

## Cross-references

- [Agent Skills Strategy](Agent-Skills-Strategy)
- [Coding Standards](Coding-Standards)
- [Technology Stack](Technology-Stack)
- [Dev Agent Playbook](Dev-Agent-Playbook)
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering)
- [Testing Strategy](Testing-Strategy)
- [Security and Data Policy](Security-and-Data-Policy)
- [Prompt Injection Defence and Secret Protection](Prompt-Injection-Defence-and-Secret-Protection)
- [API Design Standards](API-Design-Standards)
