# Testing Strategy

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines what we test, how, and where. The defining feature of an AI-native platform is that **eval suites are first-class tests** — they are not optional, they are not separate, they sit alongside unit and integration tests in the pyramid.

We follow the [test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html), with an AI/eval layer added.

---

## 1. The test pyramid (extended)

```
              /\
             /E2E\
            /------\
           /  Eval  \         ← AI behaviour evals
          /----------\
         / Integration\
        /--------------\
       /    Component   \
      /------------------\
     /        Unit        \
    /----------------------\
```

Approximate distribution by count:

- Unit ~ 60%
- Component ~ 15%
- Integration ~ 15%
- Eval ~ 5% (but expensive — these consume the most CI time)
- E2E ~ 5%

The eval count is small, but their importance is large — they are the safety net for non-deterministic agent behaviour.

## 2. Unit tests

- Pure functions, no I/O, no time, no randomness.
- Run on every commit. Target: full unit suite < 60 seconds per service.
- Each test names a behaviour, not an implementation (see [Coding Standards § 7](Coding-Standards#7-tests)).
- Coverage: ≥ 80% line coverage on new code; legacy modules tracked but not gated.
- One assertion concept per test.

## 3. Component tests

- A single service's unit + its immediate dependencies (its database, its message queue) using ephemeral containers (Testcontainers).
- Reset state between tests; no shared global fixtures.
- Run on every PR.

## 4. Integration tests

- Multi-service interactions through real interfaces.
- Use **real services where feasible** (real Postgres, real Redis, real NATS in CI). Mocking external SaaS where unavoidable.
- Documented contract for what each external service requires (real Salesforce API in CI for some critical paths; mock for others).
- Run on every PR for services they cover; nightly full suite.

## 5. End-to-end tests (E2E)

- Cover **critical user journeys only**. We do not exhaustively test the UI; we test the journeys that, if broken, are customer-visible incidents.
- Tools: Playwright for browser; Cypress alternative if needed.
- Run on every PR (smoke subset) + full suite nightly + before every production promotion.
- E2E flakes are P1 — flakes destroy the value of E2E tests.

## 6. Contract tests

- Every service boundary has a **consumer-driven contract** ([Pact](https://pact.io/) or equivalent).
- Producer service publishes its API spec; consumer services publish their contract expectations.
- Contract verification runs on every PR for both producer and consumer changes.
- Contract drift blocks merge.

## 7. Property-based tests

- For data invariants, validation logic, and any algorithm with a wide input space.
- Tools: fast-check (TS), Hypothesis (Python), gopter (Go).
- Property tests run alongside unit tests.

## 8. Eval suites (agent behaviour)

This is the AI-native addition. Every agent task type has an eval suite.

| Eval class | Frequency | Pass criterion |
|---|---|---|
| **Regression evals** | Every prompt or model change | < 1% regression vs. baseline |
| **Adversarial evals** | Every prompt change + weekly | 100% refusal on known injection vectors |
| **Cost evals** | Every prompt change | Within budget per [AI Model and Prompt Standards § 12](AI-Model-and-Prompt-Standards#12-token-budgets) |
| **Latency evals** | Every prompt change | p95 within SLO for the task class |
| **Domain evals** | Weekly + on relevant prompt change | Golden cases from Domain Expert Councils pass |
| **Bias evals** | Weekly + on prompt change | Demographic-pairs disparity within tolerance |
| **Calibration evals** | Weekly | Calibration error < 0.10 over rolling 30-day window |

Eval cases are stored in `evals/<agent>/<task>/cases/` as versioned data. Each case is `(input, expected_behaviour, rationale)`.

Eval failures **block prompt promotion**. The eval suite is the safety net that lets us change prompts confidently.

## 9. Performance and load tests

- Per-release for critical paths: API gateway, agent runtime, validation gate evaluator.
- Tools: k6 for HTTP load; custom harness for agent task throughput.
- Performance budgets per endpoint in `perf-budget.yaml`; regressions > 10% block release.
- Soak tests (8h continuous load) before any major release.

## 10. Chaos engineering

- Regular failure injection in staging:
  - Random pod kills
  - Network partitions
  - Database failover
  - Provider outage simulation (mock 503s from Anthropic / OpenAI / Salesforce / etc.)
- Goal: every documented degradation path is exercised at least quarterly.
- Postmortems on unexpected behaviour during chaos exercises feed back into runbooks.

## 11. Security testing

- SAST on every PR (Semgrep) — see [Coding Standards § 15](Coding-Standards#15-tooling).
- DAST nightly against staging.
- Penetration testing annually (external firm) + ad-hoc before major releases.
- Bug bounty from Phase 3.
- Annual red-team exercise on the AI layer.

## 12. Test data

- Synthetic data for unit, component, integration, E2E tests. No production data leaks into test fixtures.
- For evals: golden cases authored by humans, with synthetic variations generated where useful.
- Tenant-specific test data lives in `<tenant>/test-fixtures/` and never leaves the tenant scope.

## 13. Test environments

| Environment | Purpose | Data source |
|---|---|---|
| `local` | Engineer's machine, Docker Compose | Synthetic |
| `pr-<n>` | Ephemeral, per PR | Synthetic |
| `dev` | Shared engineering integration | Synthetic |
| `staging` | Production mirror | Production-shaped synthetic + opt-in customer betas |
| `production` | Live | Live |

Ephemeral PR environments tear down 24h after PR close.

## 14. Coverage — report but don't worship

- Coverage is published per service per release.
- We use it diagnostically (which modules are under-tested?) not as a hurdle to meet.
- High coverage of trivial code is not a virtue. Coverage of critical paths is.

## 15. Test ownership

- Every test has an owner (the CODEOWNER of the code under test).
- Persistently flaky tests are quarantined and ticketed; flaky tests left in the suite > 2 weeks are deleted (with a `wiki-update` ticket explaining the deletion).
- The flake rate is a tracked metric — sustained increase indicates test infrastructure decay.

## 16. CI time budget

- Per-PR CI: < 15 minutes (target), < 25 minutes (hard limit).
- Beyond the hard limit, we split the suite and run in parallel — engineers should not wait > 25 min for a PR signal.

## 17. Forbidden

- Modifying a test to make a failing build pass (see [Coding Standards § 14](Coding-Standards#14-forbidden))
- Mocking the unit under test
- Tests that depend on wall-clock time without a clock abstraction
- Tests that depend on test order
- Shared mutable state between tests
- Skipping tests via `xit`, `xdescribe`, `pytest.skip` without a linked ticket
- Releasing without all required test classes green

---

## When to revisit

- Production incident traces to a class of tests we don't have.
- Test suite time grows past CI time budget for two consecutive weeks.
- An AI eval class is too noisy to be useful — calibrate or replace it.
- New regulatory requirement requires a new test class.

---

## Cross-references

- [Coding Standards](Coding-Standards)
- [CI/CD and Release Engineering](CI-CD-and-Release-Engineering)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Observability Standards](Observability-Standards)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Technology Stack](Technology-Stack)
