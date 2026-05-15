# Coding Standards

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the canonical source for coding standards used by the Dev Agent and human engineers. The Dev Agent reads this page before writing a single line; human engineers' PRs are reviewed against it.

The principle: **the Wiki is the source of truth.** If a standard here is wrong, change the page first — then the code.

---

## 1. File size

- **Default maximum lines per file: 300.**
- Files exceeding the maximum trigger an automatic refactoring ticket.
- Exceptions are explicit, documented in the file's first comment with a rationale, and audited quarterly.

Long files are a smell, not a sin. The limit exists to force compositional decomposition by default.

## 2. Function size

- Default maximum function length: 50 lines.
- Default maximum cyclomatic complexity: 10.
- Functions exceeding either trigger a refactor suggestion at PR time.

## 3. Naming

| Element | Style |
|---|---|
| Files | `kebab-case.<ext>` for non-class, `PascalCase.<ext>` where the file's primary export is a class |
| Classes / Types / Interfaces | `PascalCase` |
| Functions / Methods | `camelCase` |
| Variables | `camelCase` |
| Constants | `SCREAMING_SNAKE_CASE` (true global immutables only — most "constants" are just variables) |
| Booleans | Prefix with `is_`, `has_`, `should_`, `can_` |
| Database tables | `snake_case_plural` |
| Database columns | `snake_case` |
| Environment variables | `SCREAMING_SNAKE_CASE` with project prefix (e.g. `ATLANTIS_DB_URL`) |

## 4. Imports

- No wildcard imports (`from x import *` / `import * as x from 'y'`).
- Imports grouped: standard library, then third-party, then internal; alphabetised within each group.
- No circular imports — the linter blocks them.

## 5. Comments

- Default: **no comments**.
- Comment only when the *why* is non-obvious. Good: "Workaround for upstream issue #4131". Bad: "Increment the counter".
- Never describe what the code does — well-named identifiers do that.
- Never reference tickets, fixes, or callers in comments. Use the PR description for context that doesn't belong in source.
- Never use a comment to explain code that should be refactored instead.

## 6. Error handling

- Validate at system boundaries (API input, external responses, user input). Do not validate inside trusted internal code.
- Never catch a broad exception class to silently continue. If you catch, you must either: rethrow, log with context AND rethrow, or transform into a domain error.
- No fallback values for "shouldn't happen" cases. If it shouldn't happen, let it fail loudly.
- No defensive null checks for values the type system already guarantees.

## 7. Tests

- Every new module ships with tests.
- Test names describe behavior, not implementation: `it("rejects expired tokens")`, not `it("calls validateToken")`.
- One assertion concept per test (multiple `expect` calls are fine; multiple distinct behaviors are not).
- Integration tests run against real services where feasible. Mocking is a last resort and must be documented.
- Tests are not modified to make failing builds pass. A failing test is investigated, not silenced.

## 8. Dependency policy

- Adding a new third-party dependency requires queued human approval (Dev Agent has no scope to introduce dependencies autonomously).
- Prefer the standard library. Prefer one well-maintained dependency over three small ones.
- Every dependency has an owner. If no internal owner is willing to own upgrades, the dependency is not added.
- Dependencies are pinned. Lock files are committed.

## 9. Configuration

- Configuration lives in environment variables, not source code.
- Configuration is validated at startup. Missing or malformed config fails fast at boot.
- Secrets never live in source. The secrets manager is the only secret store.

## 10. Logging

- Structured logs only (JSON). Free-text logs are forbidden.
- Required fields on every log line: `level`, `timestamp`, `service`, `actor_kind`, `actor_id`, `correlation_id`.
- No PII in logs. The platform redacts at the logger layer; agents do not have a free-form log path that bypasses the redactor.

## 11. Migrations

- Every schema change ships as a migration.
- Migrations are forward-only. No `DROP TABLE` in a production migration without a separate ADR and a CTO sign-off.
- Migrations are reversible where possible. Each migration ships with a documented rollback procedure or an explicit "no rollback" note.

## 12. Architecture Decision Records (ADRs)

Significant architectural choices are recorded as ADRs in `wiki/adrs/<n>-<title>.md`. Each ADR has:

- Context — what problem and constraints
- Decision — what we chose
- Consequences — what we accept by choosing this
- Status — `proposed`, `accepted`, `superseded by ADR-N`

Dev Agent reads ADRs before working on the affected subsystem. Contradicting an ADR requires either a new ADR or a `wiki-update` ticket.

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

## 14. Forbidden

- `// TODO` and `# TODO` comments in code that is merged to `main`. (Open a ticket instead.)
- `console.log` / `print` in production code. (Use the logger.)
- Hard-coded environment-specific values. (Use config.)
- Test code that depends on wall-clock time without a clock abstraction.
- Catch-all retry loops without backoff and a max attempt count.

---

## Cross-references

- [Dev Agent Playbook](Dev-Agent-Playbook)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Wiki Conventions](Wiki-Conventions)
- [Wiki Governance](Wiki-Governance)
