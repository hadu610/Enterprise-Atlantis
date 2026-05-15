# Agent Skills Strategy

> **Type:** Rule · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

Agent skills are versioned, reusable capability packages that an agent can invoke for a specific task (e.g. "generate a PPTX", "extract tables from a PDF", "apply UK employment law to a termination case"). This page is the platform's strategy for **adopting third-party skills**, **authoring our own**, and **distributing them** through the Domain Playbook Marketplace.

The principle: **adopt the commoditised, build the moat.** We do not reinvent generic capabilities; we do not outsource our differentiators. Where we cannot get both, we build a thin layer that lets us swap in either direction.

This page resolves an ambiguity in the earlier plan. The "[Agent Skills Registry](Product-Concept)" mentioned in Product Concept is operationalised here.

---

## 1. What is a skill?

A skill, in the Atlantis sense, is a self-contained capability with:

- **A name and version** (semver).
- **A declared input schema and output schema.**
- **A declared permission surface** — what scopes it needs (`Read`, `Write`, `External`, etc. per [Action Risk Classification](Action-Risk-Classification)).
- **Documentation** — what it does, what it does NOT do, examples, refusal cases.
- **An implementation** — code, a prompt, or a combination, packaged in a single artefact.

Agents invoke skills like function calls; the skill returns structured output that passes through our [Validation Gate Architecture](Validation-Gate-Specifications) before being acted on.

## 2. The four sources of skills

| Source | Examples | Pros | Cons |
|---|---|---|---|
| **Anthropic-published** | `pptx`, `docx`, `xlsx`, `pdf`, `skill-creator` | Battle-tested; provider-supported; free; familiar to industry | Provider-coupled; we depend on Anthropic's release pace |
| **Community / open-source** | OSS skills from the Claude ecosystem | Rapid coverage of niche capabilities | Variable quality; supply-chain risk; need vetting |
| **Atlantis-built (horizontal)** | Validation gate evaluator, Trust Score calculator, Universal Data Bridge query | Owned end-to-end; our IP; portable across providers | Our engineering cost |
| **Atlantis-built (vertical) — Domain Playbooks** | "UK Employment Law", "SaaS Revenue Recognition (ASC 606)" | Our moat; differentiates the platform | Requires Domain Expert Councils to author |

## 3. The adopt-vs-build decision framework

For every skill we consider, this 2×2 decides:

|                                  | **Low security / compliance sensitivity** | **High security / compliance sensitivity** |
|----------------------------------|-------------------------------------------|--------------------------------------------|
| **Generic capability**           | **Adopt** (Anthropic / OSS) — vetted only | **Adopt with wrapping** — additional gates + redaction |
| **Domain-specific to Atlantis**  | **Build** — keeps platform coherent       | **Build** — required by compliance posture |

Examples plotted on the matrix:

- "Generate a PowerPoint deck" → generic + low-sensitivity → **adopt `anthropic-skills:pptx`**.
- "Process a contract PDF" → generic + high-sensitivity (legal docs) → **adopt `anthropic-skills:pdf` with our PII redaction + audit wrapping**.
- "Apply UK Employment Law to a termination" → domain-specific + high-sensitivity → **build** (Domain Playbook authored by HR + Legal Councils).
- "Validate that an agent's output conforms to its schema" → domain-specific to our architecture → **build**.

A skill that does not clearly fall into one quadrant is escalated to a CTO + CISO joint review.

## 4. Skills we adopt at launch

Phase 1 starting set, all Anthropic-published:

| Skill | Use case | Wrapping we add | Primary agents |
|---|---|---|---|
| **`anthropic-skills:pptx`** | Sales decks, executive reports, change-management presentations | Brand gate (Marketing); PII redaction; audit | Marketing, Sales, Ops |
| **`anthropic-skills:docx`** | HR letters, contract drafts, policy documents, customer letters | PII redaction; jurisdiction check (HR/Legal); audit | HR, Legal, Ops, Sales |
| **`anthropic-skills:xlsx`** | Finance reports, budget exports, payroll summaries, data delivery to customers | Field-level encryption for restricted columns; audit | Finance, Ops |
| **`anthropic-skills:pdf`** | Contract review, expense receipt processing, policy extraction, document understanding | PII redaction; document classification; audit | Legal, Finance, HR, Ops |
| **`anthropic-skills:skill-creator`** | Internal — used by Engineering to author new Atlantis skills in the same format | Engineering scope only; not exposed to runtime agents | Engineering humans |

What we do **not** adopt at launch:

- Skills with insufficient documentation or unclear permission surface
- Skills that bypass our PII redaction layer
- Skills that require persistent broad credentials
- Skills with last-update date > 12 months without an active maintainer

## 5. Skills we build ourselves

### Horizontal (platform-internal capabilities)

| Skill | Why we build | Owner |
|---|---|---|
| `atlantis:validation-gate-evaluator` | Specific to our gate architecture; not a generic concept | Engineering |
| `atlantis:trust-score-calculator` | Proprietary algorithm; brand-load-bearing | Engineering |
| `atlantis:data-bridge-query` | Specific to our normalised entity model | Engineering |
| `atlantis:wiki-reader` | Specific to our Wiki metadata convention | Engineering |
| `atlantis:agent-identity-issuer` | Security-critical; cannot be outsourced | Security |
| `atlantis:rollback-snapshot` | Specific to our state-change protocol | Engineering |
| `atlantis:pii-redactor` | Boundary control; must be ours so we own the policy | Security |
| `atlantis:prompt-injection-detector` | Boundary control; must be ours | Security |

### Vertical (Domain Playbooks — packaged as skills)

| Playbook skill | Owner Council | Phase |
|---|---|---|
| `atlantis:hr-employment-law-{jurisdiction}` (US-CA, US-NY, US-Federal, UK, DE, FR, CA) | HR + Legal Domain Councils | 2 onward |
| `atlantis:finance-revenue-recognition-asc606` | Finance Domain Council | 2 |
| `atlantis:finance-revenue-recognition-ifrs15` | Finance Domain Council | 2 |
| `atlantis:finance-lease-accounting-asc842` | Finance Domain Council | 3 |
| `atlantis:legal-saas-clause-review` | Legal Domain Council | 2 |
| `atlantis:legal-gdpr-compliance` | Legal Domain Council | 2 |
| `atlantis:legal-ccpa-compliance` | Legal Domain Council | 2 |
| `atlantis:marketing-attribution-multi-touch` | Marketing Domain Council | 3 |
| `atlantis:industry-blueprint-{saas, healthcare, retail, manufacturing, proserv}` | Product + relevant Council | 3 |

These are distributed via the **Domain Playbook Marketplace** ([Product Requirements § G](Product-Requirements#g-centralized-knowledge-wiki)) — same packaging format as Anthropic-published skills, our content.

## 6. The Skills Registry

A central registry catalogues every skill the platform supports:

```yaml
skill: anthropic-skills:pptx
version: 1.4.2
source: anthropic
status: approved
security_review:
  reviewer: <security engineer name>
  reviewed_at: 2026-05-14
  scopes_requested: [external_templated]
  redaction_required: true
  audit_class: write_low
eval_status:
  last_pass: 2026-05-14
  pass_rate: 0.99
tenant_access:
  tiers: [starter, growth, enterprise, enterprise_regulated]
agent_access:
  - marketing-agent
  - sales-agent
  - ops-agent
deprecation:
  status: active
```

The Registry is a Wiki-managed source of truth. Agents query it at task start to discover available skills; they cannot use a skill not in the Registry.

## 7. Skill governance — how skills are admitted

Every skill — Anthropic, community, internal — passes through this gate before reaching production:

### Step 1 — Security review

- Permissions requested: does the skill ask for scopes beyond agent needs?
- Data flow: what data leaves the platform, to whom, under what controls?
- Supply chain: signed artefacts? maintained? version-pinned?
- Prompt injection surface: how does the skill handle untrusted input?

### Step 2 — Compatibility check

The skill must:

- Respect [Action Risk Classification](Action-Risk-Classification) — never request scope outside the agent's allowed actions.
- Respect [Approval Workflow Framework](Approval-Workflow-Framework) — `Delete` / `Financial` outputs route to human approval.
- Respect [Phased Autonomy Reference](Phased-Autonomy-Reference) — behaviour gated to current phase.
- Emit outputs through [Validation Gate Specifications](Validation-Gate-Specifications) — no bypass.
- Operate via the [PII redaction layer](AI-Model-and-Prompt-Standards#5-pii-redaction-before-prompt) — never see un-redacted PII.

### Step 3 — Eval suite

- Skill is run through the [Testing Strategy § 8](Testing-Strategy#8-eval-suites-agent-behaviour) eval classes appropriate to its task type.
- Skill must achieve eval pass rates equivalent to in-house alternatives before promotion.

### Step 4 — Promotion

- Skill registered with version pin and review evidence.
- Agents granted access per playbook updates.
- Customer admin notified of new skill availability (if customer-facing).

A skill that fails any step is rejected with a reason; engineering may iterate or escalate.

## 8. Skill versioning

- Skills are version-pinned in the Registry — never auto-upgraded.
- Version upgrades go through the full governance gate (security + compatibility + evals).
- Customers see a changelog of skill version changes that affected their workflows.
- A skill version we adopted that gets retracted by the publisher (security advisory, supply-chain compromise) is immediately disabled across all tenants; engineering investigates an internal fork or replacement.

## 9. Provider portability

Our [multi-provider AI strategy](AI-Model-and-Prompt-Standards#2-multi-provider-strategy) means no LLM provider serves more than 80% of traffic. Skills must align.

| Skill source | Portability path |
|---|---|
| Anthropic-published | If the skill calls Anthropic-specific APIs, we either: (a) build a thin adapter for OpenAI / Bedrock equivalent, (b) accept the dependency for that specific capability and label the skill `provider:anthropic` so the model router knows, or (c) build our own equivalent if portability matters. |
| Community / OSS | Prefer skills with documented provider neutrality. |
| Atlantis-built | Always provider-neutral. Built on our model routing layer, not a provider SDK directly. |
| Domain Playbooks | Provider-neutral — they are prompts + structured rules, not provider-API-dependent. |

The Registry records each skill's provider dependency. The model router avoids selecting a provider that lacks support for a skill the current task requires.

## 10. Skill access per customer tier

Not every customer sees every skill. Access is tier-controlled:

| Skill class | Starter | Growth | Enterprise | Regulated |
|---|---|---|---|---|
| Anthropic-published horizontal | ✓ | ✓ | ✓ | ✓ |
| Atlantis horizontal | ✓ | ✓ | ✓ | ✓ |
| Atlantis Domain Playbooks — global (US, UK, EU) | — | ✓ | ✓ | ✓ |
| Atlantis Domain Playbooks — all jurisdictions | — | — | ✓ | ✓ |
| Custom playbooks (tenant-authored) | — | — | ✓ | ✓ |
| Self-hosted-model-compatible skills only | — | — | — | ✓ |

This is enforced at the Registry layer, not by agent instruction.

## 11. Skills + the Domain Playbook Marketplace

The Marketplace ([Product Requirements § G](Product-Requirements#g-centralized-knowledge-wiki)) is where Atlantis Domain Playbooks and (Phase 3+) curated partner-authored playbooks live.

- Marketplace listings are skills in the same packaging format as Anthropic's.
- Each listing carries: author, version, supported jurisdictions, security review status, eval pass rate, customer adoption count.
- Customer admins install with one click; the platform runs governance Steps 1–4 above before activation.
- Marketplace revenue split for partner-authored playbooks (Phase 4): TBD; tracked in proposed [Partnership Strategy](Master-Blueprint-Index) page.

## 11.5 The coding skills day-1 list

This page covers the general strategy. The specific day-1 adoption list for coding (frontend + backend), with rationale per tool and explicit "we adopt this, we don't build" calls, lives at **[Coding Agent Skills](Coding-Agent-Skills)**.

The headline: from the first commit, the Dev Agent uses Anthropic's published `review`, `security-review`, `simplify`, `init`, and `skill-creator` skills, plus an opinionated tooling stack (ESLint, Prettier, TypeScript strict, Vitest, Playwright, Ruff, mypy, Semgrep, Snyk, Dependabot, Trivy, OpenAPI 3.1, Spectral). We do not invent parallel versions.

## 12. The Dev Agent and skills

The Dev Agent uses skills more than any other agent:

- `anthropic-skills:skill-creator` for authoring new skills internally
- `atlantis:wiki-reader` to read coding standards before writing code
- Future: `atlantis:adr-checker`, `atlantis:test-coverage-checker`, etc.

When the Dev Agent encounters a recurring task pattern, it files a `wiki-update` ticket proposing a **new skill** rather than re-implementing the pattern inline. This is how the skills library grows organically from the platform's own use.

## 13. Forbidden

- Adopting a skill without the full governance gate (Steps 1–4 of § 7).
- Skills that request OAuth scopes beyond their agent's allowed actions.
- Skills that bypass PII redaction or prompt injection defence.
- Auto-upgrading skill versions (must be reviewed each time).
- Customer-uploaded skills below Enterprise tier — supply-chain risk is too high without our review path.
- Listing an Atlantis Domain Playbook in the Marketplace without the responsible Domain Expert Council's approval.
- Inlining behaviour in agent prompts that could/should be a reusable skill (causes the same pattern to be reinvented across agents).

## 14. Anti-patterns we explicitly avoid

- **"We can build it better in a week."** Sometimes true, often false. The 5-month maintenance tail is what really matters.
- **"Anthropic's skill almost works, let's fork it."** Forks become abandoned forks. Prefer: contribute upstream, or build our own clearly-scoped equivalent.
- **"We don't need a skill, just put it in the prompt."** Inline-prompt behaviour is the opposite of reusable. Promote frequently-used prompt patterns to skills.
- **"Custom skills per customer."** Customer-specific skills create N variants we can't eval. Use tenant-scoped config on shared skills instead.
- **"Adopting all Anthropic skills by default."** Each adoption is a security review and a maintenance commitment. Adopt deliberately.

---

## When to revisit

- A new Anthropic skill release covers a capability we previously built — evaluate retirement of our version.
- A community / OSS skill emerges with strong adoption that fills a gap we have — evaluate adoption.
- The skill-version-upgrade backlog exceeds two months — process is too slow; streamline.
- A skill we adopted is retracted by its publisher (security or otherwise) — re-baseline the affected agents.
- A customer requests a new Domain Playbook category not in our roadmap — evaluate Council assignment.
- Annual review by Engineering + CTO + each Domain Council Lead.

CTO is the accountable owner.

---

## Cross-references

- [Technology Stack](Technology-Stack)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Validation Gate Specifications](Validation-Gate-Specifications)
- [Security and Data Policy](Security-and-Data-Policy)
- [Product Concept § 3.5](Product-Concept) — original "Agent Skills Registry" mention
- [Product Requirements § G](Product-Requirements#g-centralized-knowledge-wiki) — Domain Playbook Marketplace
- [Dev Agent Playbook](Dev-Agent-Playbook)
- [Master Blueprint Index](Master-Blueprint-Index)
