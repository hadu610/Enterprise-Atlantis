# CI/CD and Release Engineering

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** Dev Agent · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page defines our branching, build, test, release, and deployment processes. We optimise for **small frequent changes**, **continuous deployment to staging**, and **deliberate, rollback-friendly promotion to production**.

We follow [Trunk-Based Development](https://trunkbaseddevelopment.com/), [Semantic Versioning](https://semver.org/), and [Conventional Commits](https://www.conventionalcommits.org/).

---

## 1. Branching strategy — trunk-based

- Single long-lived branch: `main`.
- Short-lived feature branches off `main`: `<author>/<short-name>` for humans, `agent/<task-id>` for Dev Agent.
- Branches live ≤ 7 days. Longer-lived branches require explicit approval and a documented rebase plan.
- No release branches. Tags mark releases.

**Why not GitFlow.** GitFlow optimises for infrequent, batched releases. We optimise for continuous deployment. The bookkeeping cost of multiple long-lived branches exceeds its benefit at our deployment cadence.

## 2. Pull request rules

- Every change is a PR. No direct push to `main`.
- PR title follows [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, etc.
- PR body follows the template in [Coding Standards § 13](Coding-Standards#13-pr-conventions).
- Minimum one human reviewer in CODEOWNERS.
- All CI checks must pass:
  - Lint (ESLint, Ruff, golangci-lint)
  - Type check (tsc strict, mypy strict)
  - Tests (unit, integration as applicable)
  - SAST (Semgrep)
  - Dependency vuln scan (Snyk / Dependabot)
  - Container scan (Trivy) for changes producing images
  - License check
  - Wiki adherence check (Dev Agent PRs only)
- No merging with failing CI. The check is the policy.

Dev Agent PRs additionally pass the agent's own gates ([Dev Agent Playbook § 4](Dev-Agent-Playbook#4-validation-gates-dev-agent-specific)) before opening for human review.

## 3. Merge strategy

- **Squash merge** by default. Keeps `main` linear and readable; the PR is the unit of history.
- The squash commit message is the PR title (Conventional Commits) plus the PR body.
- Exceptions: changes intentionally captured as multiple commits (e.g. a generated migration paired with its application change) may use a merge commit with explicit rebase first.

## 4. Build and artefact strategy

- Every PR builds a container image with a tag `<service>:<sha>`.
- Images are immutable. We do not retag — once an image is built and signed, it never moves.
- Images are signed (cosign / Sigstore) and the signature is verified at deploy time.
- Build artefacts live in ECR.

## 5. Continuous deployment to staging

- A merge to `main` triggers an automated deployment to **staging**.
- Staging mirrors production topology (same number of services, same data store classes) but at smaller scale.
- Staging is always live; engineers exercise it manually as well.
- A failed deploy to staging blocks the next merge until investigated.

## 6. Promotion to production

Promotion from staging to production is **deliberate and auditable**, not automatic.

- A release candidate must "soak" in staging for at least 1 hour, no errors above baseline.
- Promotion creates a release in ArgoCD, applying the artefact set as one transaction.
- Customer-facing services: weekly release window for batched changes (Wednesday morning); hotfixes promoted as needed.
- Internal-only services: continuous promotion as ready.

## 7. Deployment strategies

| Service class | Strategy |
|---|---|
| Stateless API services | Rolling update with health-check gates |
| Customer-facing UI | Blue/green with feature-flag gating |
| Agent runtime | Canary (5% → 25% → 50% → 100% over 30 min) with auto-rollback on metric regression |
| Database migrations | Online migration patterns; multi-phase deploys (write-old → write-both → read-new → drop-old) |

## 8. Rollback

- Rollback must complete within **5 minutes** for any deployment.
- ArgoCD `rollback` action is a one-click path from the deploy timeline.
- Rollback is exercised in quarterly DR drills.
- Database rollback: never destructive. We forward-migrate fixes; in extreme cases, restore from snapshot is the path.

## 9. Feature flags

- **OpenFeature** as the standard (provider-agnostic SDK).
- **LaunchDarkly** as Phase 1–2 provider; reassess at Phase 3 for cost.
- Every flag has an owner and a sunset date.
- Flags older than 90 days without a sunset are flagged for cleanup.
- Code paths gated by removed flags are deleted in the next release window — no "just leave it for now."

Feature flag uses:

- Progressive rollout to subsets of tenants
- Kill switch for new functionality
- Temporary differentiation (e.g. beta cohort)
- A/B experiments (with explicit measurement plan)

Forbidden:

- Flags that gate critical bugfixes (fix it for everyone or revert)
- Permanent flags (use config, not flags)
- Flags evaluated in hot loops without local caching

## 10. Versioning

- Every service has a semantic version.
- Public APIs use the version in their URL.
- Internal services version their event/RPC schemas independently.
- The `version` endpoint on every service returns:

```json
{
  "service": "hr-agent",
  "version": "1.4.2",
  "build_sha": "abc123def",
  "build_time": "2026-05-14T18:22:11Z",
  "dependencies_hash": "sha256:..."
}
```

Cross-service version compatibility is documented in the service's README and enforced by contract tests (see [Testing Strategy § 6](Testing-Strategy)).

## 11. Releases and changelogs

- Every release is tagged in git (`<service>-v1.4.2`).
- Changelog generated from Conventional Commits.
- Customer-facing services publish a public changelog at `https://changelog.atlantis.os/`.
- Breaking changes never ship in a minor release. Major releases trigger a customer notification (12-month sunset for the prior major).

## 12. Hotfixes

- Hotfix path: branch off the affected production tag, fix, PR, merge to `main`, expedited promotion.
- Hotfix candidates must pass full CI — there is no "skip tests for emergencies."
- Hotfixes never bypass code review; the reviewer SLA for hotfixes is 30 minutes.

## 13. Secrets and config in CI

- CI runners cannot access production secrets.
- Staging secrets are limited and rotate monthly.
- Production deploys retrieve secrets from Vault at workload startup, not at build time.
- Secrets cannot appear in build logs (CI uses masking; PRs that introduce candidate-secret strings are blocked by Semgrep).

## 14. Self-hosted CI runners

- For compliance-sensitive jobs (touching customer data, signing artefacts, deploying to production), self-hosted runners in our VPC.
- Public hosted runners (GitHub-hosted) for general unit/integration test workloads.
- Runner pool capacity is monitored; under-provisioning causes PR queue depth alarms.

## 15. Continuous deployment of the Wiki

The Wiki is a deployment target like any other service.

- Edits to `wiki/` in `main` trigger a sync to the GitHub Wiki repo.
- Agents poll the Wiki for changes via the change feed (see [How Agents Use This Wiki § 4](How-Agents-Use-This-Wiki#4-caching-and-freshness)).
- Wiki changes are visible in agent behaviour within 15 minutes (cache TTL).

## 16. Forbidden

- Merging with red CI ("we'll fix it after")
- Direct push to `main`
- Rebasing public branches
- Force-pushing `main` (the remote rejects it)
- Skipping pre-commit hooks (`--no-verify`)
- Tagging a release without a green build
- Editing released artefacts (immutability is the contract)

---

## When to revisit

- Production incident traces to deployment process — review the gates that failed to catch it.
- Time-to-production from merge regresses (target: < 60 min for staging, < 2h for production on the release day).
- Rollback exercises fail to meet 5-minute target.
- New compliance regime requires additional release evidence.

---

## Cross-references

- [Coding Standards](Coding-Standards)
- [Testing Strategy](Testing-Strategy)
- [Observability Standards](Observability-Standards)
- [Security and Data Policy](Security-and-Data-Policy)
- [Technology Stack](Technology-Stack)
- [Dev Agent Playbook](Dev-Agent-Playbook)
