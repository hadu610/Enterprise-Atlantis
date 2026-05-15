# Coding Standards

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the canonical source for coding standards used by the Dev Agent and human engineers. The Dev Agent reads this page before writing a single line; human engineers' PRs are reviewed against it. **The Wiki is the source of truth.** If a standard here is wrong, change the page first — then the code.

These standards are not invented. They are adapted from widely-adopted industry guides so engineers joining from any background recognise most of them on day one.

---

## Standards we draw from

We adopt established conventions wherever they exist. Where standards conflict, our choice and reasoning is recorded in the relevant section below.

| Domain | Reference | Why we adopt it |
|---|---|---|
| TypeScript style | [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) | The strictest mainstream guide; rules track the language's evolution. |
| JavaScript fallback | [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) | Most widely-known JS style guide; familiar to almost every JS developer. |
| Python style | [PEP 8](https://peps.python.org/pep-0008/) + [PEP 257](https://peps.python.org/pep-0257/) | Authoritative Python style and docstring guides. |
| Python type hints | [PEP 484](https://peps.python.org/pep-0484/) + [PEP 526](https://peps.python.org/pep-0526/) | Type annotations on all public surfaces. |
| Go style | [Effective Go](https://go.dev/doc/effective_go) + [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) | Idiomatic Go is its own dialect — the official guides are the spec. |
| Rust style | [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) | Used only for performance-critical components; idiomatic style is non-negotiable. |
| Shell scripting | [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) | Shell scripts are software; treat them like it. |
| SQL | [PostgreSQL coding conventions](https://wiki.postgresql.org/wiki/Developer_FAQ) + lowercase keyword convention | We are a PostgreSQL shop; align with upstream. |
| Commits | [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) | Machine-parsable history enables changelog generation and automated releases. |
| Versioning | [Semantic Versioning 2.0](https://semver.org/) | Industry standard; clear contract between producer and consumer. |
| Branching | [Trunk-Based Development](https://trunkbaseddevelopment.com/) | Optimised for continuous deployment and small, frequent changes. |
| Security | [OWASP Top 10](https://owasp.org/Top10/) + [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/) | Coverage for both classic web app vulnerabilities and AI-specific risks. |
| Accessibility | [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/) | Minimum bar for any customer-facing surface. |

These references are the **lower bound**. Where this Wiki sets a stricter rule, the stricter rule wins.

---

## 1. File size

- **Default maximum lines per file: 300.**
- Files exceeding the maximum trigger an automatic refactoring ticket.
- Exceptions are explicit, documented in the file's first comment with a rationale, and audited quarterly.

**Rationale.** Long files are a smell, not a sin. The limit exists to force compositional decomposition by default. Empirically, files over ~300 lines correlate with multi-responsibility classes and reduced refactor velocity. Adjust if research changes our view — never silently.

## 2. Function size and complexity

- Default maximum function length: 50 lines.
- Default maximum cyclomatic complexity: 10.
- Maximum function parameters: 5 (use a parameter object beyond that).
- Functions exceeding these trigger a refactor suggestion at PR time.

**Rationale.** McCabe's complexity > 10 is a long-standing industry signal for hard-to-test code. The function-length limit is empirical — easier to hold in a reviewer's working memory.

## 3. Naming

| Element | Style | Example |
|---|---|---|
| Files | `kebab-case.<ext>` (non-class) / `PascalCase.<ext>` (when primary export is a class) | `user-service.ts`, `UserService.ts` |
| Classes / Types / Interfaces | `PascalCase` | `OrchestrationEngine` |
| Functions / Methods | `camelCase` (TS/JS), `snake_case` (Python, Go-style for exported `PascalCase`) | `routeTicket`, `route_ticket` |
| Variables | `camelCase` (TS/JS), `snake_case` (Python) | `pendingTickets`, `pending_tickets` |
| Constants | `SCREAMING_SNAKE_CASE` (true global immutables only) | `MAX_FILE_SIZE` |
| Booleans | Prefix `is_`, `has_`, `should_`, `can_` | `isExpired`, `has_permission` |
| Database tables | `snake_case_plural` | `audit_events` |
| Database columns | `snake_case` | `created_at` |
| Environment variables | `SCREAMING_SNAKE_CASE` with `ATLANTIS_` prefix | `ATLANTIS_DB_URL` |
| Branches | `<author>/<short-name>` (humans) / `agent/<task-id>` (Dev Agent) | `du/fix-onboarding`, `agent/T-4127` |

**Rationale.** Most of these match the cited language style guides. The branch naming convention is specific to us because we have agent identities; PR attribution depends on identifying agent branches at a glance.

## 4. Imports

- No wildcard imports (`from x import *` / `import * as x from 'y'`).
- Imports grouped: standard library → third-party → internal; alphabetised within each group.
- No circular imports — the linter blocks them.

**Rationale.** Wildcard imports defeat IDE tooling and make refactoring brittle. Circular imports indicate a missing abstraction — fix the architecture, don't suppress the lint.

## 5. Comments

- Default: **no comments**.
- Comment only when the *why* is non-obvious. Good: `// Workaround for upstream issue #4131`. Bad: `// Increment the counter`.
- Never describe what the code does — well-named identifiers do that.
- Never reference tickets, fixes, or callers in comments. Use the PR description for context that doesn't belong in source.
- Never use a comment to explain code that should be refactored instead.
- Public APIs MUST have docstrings (Python) / TSDoc (TypeScript) / GoDoc (Go) describing contract.

**Rationale.** Comments rot. Identifiers, types, and tests do not. The exception — public API contract — is where comments are *less* likely to rot because the contract is enforced by callers.

## 6. Error handling

- Validate at system boundaries (API input, external responses, user input). Do not validate inside trusted internal code.
- Never catch a broad exception class to silently continue. If you catch, you must either: rethrow, log with context AND rethrow, or transform into a domain error.
- No fallback values for "shouldn't happen" cases. If it shouldn't happen, let it fail loudly.
- No defensive null checks for values the type system already guarantees.
- Use Result/Either patterns for expected-failure paths; reserve exceptions for unexpected ones (Rust- and Go-influenced rule).

**Rationale.** Silent failure is the most expensive bug class — it appears correct, accumulates corruption, and is discovered late. Loud failure is debuggable.

## 7. Tests

- Every new module ships with tests.
- Test names describe behavior, not implementation: `it("rejects expired tokens")`, not `it("calls validateToken")`.
- One assertion concept per test (multiple `expect` calls are fine; multiple distinct behaviors are not).
- Integration tests run against real services where feasible. Mocking is a last resort and must be documented.
- Tests are not modified to make failing builds pass. A failing test is investigated, not silenced.

See [Testing Strategy](Testing-Strategy) for the full strategy.

**Rationale.** Behaviour-named tests survive refactors. Mocks couple tests to implementation, which is the opposite of what tests should do.

## 8. Dependency policy

- Adding a new third-party dependency requires queued human approval (Dev Agent has no scope to introduce dependencies autonomously).
- Prefer the standard library. Prefer one well-maintained dependency over three small ones.
- Every dependency has an internal owner. If no engineer is willing to own upgrades, the dependency is not added.
- Dependencies are pinned. Lock files are committed.
- License: only OSI-approved permissive licenses (MIT, Apache 2.0, BSD, MPL 2.0). GPL/AGPL require Legal review.

**Rationale.** Supply-chain compromise is now a top OWASP risk; the famous `event-stream`, `colors.js`, `xz-utils` incidents prove that small unowned dependencies are a security and reliability liability. Approval + ownership is cheap insurance.

## 9. Configuration

- Configuration lives in environment variables, not source code.
- Configuration is validated at startup. Missing or malformed config fails fast at boot.
- Secrets never live in source. The secrets manager is the only secret store.
- 12-Factor configuration principles apply (see [Architecture Principles](Architecture-Principles)).

**Rationale.** Failing fast at boot is cheaper than failing slow at request time. Validation at the boundary, again.

## 10. Logging

- Structured logs only (JSON). Free-text logs are forbidden.
- Required fields on every log line: `level`, `timestamp`, `service`, `actor_kind`, `actor_id`, `correlation_id`.
- No PII in logs. The platform redacts at the logger layer; agents do not have a free-form log path that bypasses the redactor.
- Levels: `debug` (off in production), `info`, `warn`, `error`, `fatal` (process exit).

See [Observability Standards](Observability-Standards) for the full standard.

## 11. Migrations

- Every schema change ships as a migration.
- Migrations are forward-only. No `DROP TABLE` in a production migration without a separate ADR and a CTO sign-off.
- Migrations are reversible where possible. Each migration ships with a documented rollback procedure or an explicit "no rollback" note.
- Long-running migrations use online migration patterns (e.g. `pg_squeeze`, `pt-online-schema-change` analogues) — never block the table.

**Rationale.** Schema is contract. Treat it with the same care as API versions.

## 12. Architecture Decision Records (ADRs)

Significant architectural choices are recorded as ADRs in `wiki/adrs/<n>-<title>.md`. Each ADR has:

- **Context** — what problem and constraints
- **Decision** — what we chose
- **Consequences** — what we accept by choosing this
- **Status** — `proposed`, `accepted`, `superseded by ADR-N`

Dev Agent reads ADRs before working on the affected subsystem. Contradicting an ADR requires either a new ADR or a `wiki-update` ticket.

We follow the [Michael Nygard ADR format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — short, dated, immutable once accepted.

## 13. PR conventions

- Every PR description includes:
  - **What changed** (one paragraph)
  - **Why** (one paragraph)
  - **Wiki references** (links to ADRs / playbooks / standards the change implements)
  - **Test plan**
- PRs touch one subsystem per PR where possible.
- PRs are sized to be reviewable in 30 minutes. Larger changes are split.
- Dev Agent PRs carry the agent's identity, not a human author.
- All PRs require at least one human reviewer in CODEOWNERS.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`.

**Rationale.** 30-minute review caps are an empirical industry finding (Cisco/SmartBear code review studies) — review quality degrades steeply past that.

## 14. Forbidden

- `// TODO` / `# TODO` in code merged to `main`. (Open a ticket instead.)
- `console.log` / `print` in production code. (Use the logger.)
- Hard-coded environment-specific values. (Use config.)
- Test code that depends on wall-clock time without a clock abstraction.
- Catch-all retry loops without backoff and a max attempt count.
- `eval`, `Function(string)`, dynamic `exec` on user input — anywhere.
- Mutable module-level state (use a service / DI instead).
- Disabling lint rules per-line without a comment explaining why.

## 15. Tooling

| Concern | Tool (TS/JS) | Tool (Python) | Tool (Go) |
|---|---|---|---|
| Lint | ESLint (with @typescript-eslint) | Ruff | golangci-lint |
| Format | Prettier | Ruff format | gofmt |
| Type check | tsc strict mode | mypy strict | (built-in) |
| Security SAST | Semgrep | Bandit + Semgrep | gosec + Semgrep |
| Dependency scan | npm audit, Snyk | pip-audit, Snyk | govulncheck |
| Test runner | Vitest (preferred) / Jest | pytest | go test |
| Coverage | c8 / Vitest built-in | coverage.py | go test -cover |

Tool versions are pinned per repo; upgrades are PRs like any other change.

---

## When to revisit these standards

Trigger a review of this page if any of the following occurs:

- The Dev Agent's PR reviewer-rejection rate exceeds 15% for three consecutive months — likely a standard is mis-calibrated.
- Two or more languages added to the platform that are not yet covered above.
- An OWASP Top 10 or LLM Top 10 update introduces a new class of risk.
- A new industry style guide gains majority adoption among new hires (signals a generational shift in expectations).
- A `wiki-update` ticket is filed three times in 90 days against the same section.

Reviews are conducted by Engineering with the CTO as accountable approver.

---

## Cross-references

- [Technology Stack](Technology-Stack)
- [Architecture Principles](Architecture-Principles)
- [API Design Standards](API-Design-Standards)
- [Testing Strategy](Testing-Strategy)
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering)
- [Observability Standards](Observability-Standards)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Security and Data Policy](Security-and-Data-Policy)
- [Dev Agent Playbook](Dev-Agent-Playbook)
- [Wiki Conventions](Wiki-Conventions)
