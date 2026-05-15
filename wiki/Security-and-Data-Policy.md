# Security and Data Policy

> **Type:** Rule · **Owner:** Security · **Status:** Approved · **Applies to:** All agents · All humans contributing code · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the platform's authoritative policy on data classification, encryption, secrets, access, vulnerability management, disclosure, and incident response. It is intentionally strict — we hold every department's data (HR, finance, legal, source code) in a single platform, which makes our attack surface broader than most B2B SaaS.

This page exists alongside, and is informed by, [OWASP Top 10](https://owasp.org/Top10/) and [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/).

---

## 1. Data classification

Every piece of data flowing through the platform is classified into one of four tiers. Classification determines encryption, access controls, audit retention, and incident response thresholds.

| Tier | Examples | Encryption | Access |
|---|---|---|---|
| **Public** | Marketing site content, public documentation | TLS in transit | Open |
| **Internal** | Aggregate metrics, internal docs, non-PII telemetry | TLS in transit; encryption at rest | Authenticated employees |
| **Confidential** | Customer business data, agent outputs, ticket contents | TLS in transit; AES-256 at rest; key-rotated | RBAC + customer ACL |
| **Restricted** | PII, financial transactions, HR records, source code, secrets | TLS 1.3 in transit; AES-256 at rest with customer-tenant key; field-level encryption for sensitive fields | RBAC + customer ACL + audit on every access |

Data crossing tiers must explicitly transition (e.g. anonymisation before being included in cross-tenant analytics). Untyped data is treated as Restricted by default.

## 2. Encryption

### In transit

- **TLS 1.3 minimum** for all external traffic. TLS 1.2 only for legacy integrations on a documented sunset path.
- **mTLS** for all service-to-service traffic inside the platform (zero-trust — [Architecture Principles § 10](Architecture-Principles#10-zero-trust-between-services)).

### At rest

- **AES-256-GCM** for all storage.
- Per-tenant data encryption keys (DEKs) wrapped by per-tenant key encryption keys (KEKs) managed in AWS KMS.
- Restricted-tier fields use **envelope encryption** with field-level keys; the application never holds long-lived plaintext keys.
- Backups encrypted with their own key set; restoring requires KMS access in the restore region.

### Customer-managed keys (CMK)

- Available from Phase 3 for customers requiring full key sovereignty.
- BYOK / HYOK via AWS KMS multi-region keys; customer can revoke at any time.

## 3. Secrets management

- All secrets stored in **HashiCorp Vault** (primary) or AWS Secrets Manager (cloud-integrated leaf services).
- **Zero secrets in source code, environment variables of release artefacts, or container images.**
- Application secrets retrieved at boot via short-lived (≤1 hour) tokens.
- Secret rotation: at least every 90 days for credentials, immediate on suspected compromise.
- The pre-commit hook + Semgrep CI rule blocks any candidate secret pattern from being committed.

## 4. Identity and access management

### Human identities

- Single sign-on (SAML / OIDC) is mandatory for all employees; password-only access is forbidden.
- Phishing-resistant MFA (WebAuthn / FIDO2) for any access to production or restricted data.
- Just-in-time access for production: time-boxed, ticket-attached, peer-approved.
- Quarterly access review for all employees against all privileged roles.

### Agent identities

See [Action Risk Classification](Action-Risk-Classification) for the full framework.

- Every agent has a distinct non-human identity.
- Scopes are minimum-privilege, task-scoped, time-bounded.
- No agent ever holds persistent broad access.
- No agent shares credentials with a human user.

### Customer identities

- Customers authenticate via Auth0 (Phase 1–2) with their preferred federation (Okta, Azure AD, Google Workspace).
- Tenant admins manage their own user lifecycle within their tenant.
- SCIM provisioning supported from Phase 2.

## 5. Network and infrastructure

- VPC-isolated production. No public ingress to compute nodes — only via load balancers behind WAF.
- WAF in front of every customer-facing endpoint.
- DDoS protection via AWS Shield (Advanced for Phase 3+).
- Bastion / break-glass access auditable to the keystroke; the platform's primary SSH path is via short-lived SSO-issued certificates, no shared keys.
- Network segmentation: data tier, application tier, and management tier on separate subnets with default-deny security groups.

## 6. Application security

- **OWASP Top 10 coverage:** every category is addressed by an explicit control, with the responsible team listed. Annual review of coverage gaps.
- **OWASP LLM Top 10 coverage:** ditto, with the [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards) as the primary control surface.
- Input validation at boundaries (see [Coding Standards § 6](Coding-Standards#6-error-handling) and [Architecture Principles § 5](Architecture-Principles#5-validation-at-the-boundary-trust-within)).
- Output encoding (no raw HTML interpolation; CSP enforced).
- CSRF: same-site cookies + token-based protection.
- Dependency scanning: every PR; weekly full scan; immediate alert on critical CVEs in production dependencies.

## 7. Vulnerability management

### Severity definitions

| Severity | CVSS | SLA to remediate |
|---|---|---|
| Critical | 9.0–10.0 | 7 days (or earlier per regulator requirement) |
| High | 7.0–8.9 | 30 days |
| Medium | 4.0–6.9 | 90 days |
| Low | < 4.0 | next quarterly window |

### Sources

- Internal SAST (Semgrep), DAST, SCA (Snyk, Dependabot).
- External: bug bounty (Phase 3+) and responsible disclosure inbox at `security@<domain>`.
- Penetration testing: at least annually, plus before any major release (Phase 2 onward).

### Disclosure

- Coordinated disclosure with finders; public disclosure not earlier than 90 days unless materially in users' interest.
- CVE assignment for findings affecting customers.

## 8. Compliance

| Framework | Status target | Owner |
|---|---|---|
| SOC 2 Type II | Required before first commercial customer | Security |
| ISO 27001 | Month 18 | Security |
| HIPAA | When first healthcare tenant signs | Security + Legal |
| GDPR | Day 1 (data subject rights, DPA template) | Legal + Security |
| CCPA / CPRA | Day 1 | Legal + Security |
| FedRAMP | Phase 4 evaluation if government tenants emerge | Security |

Compliance is a property of operating practice, not a periodic project. Evidence collection is automated through the compliance platform (Vanta / Drata — to be selected).

## 9. Data subject rights (GDPR / CCPA)

- Access request: customer can export all their data within 30 days, in a portable JSON format derived from the [Unified Entity Model](Unified-Entity-Model).
- Erasure / right to be forgotten: customer can delete their tenant or specific subjects' data within 30 days. Audit log entries are pseudonymised (the linkage is removed) rather than deleted — this preserves regulatory audit requirements while honouring erasure.
- Rectification: customers can correct any inaccurate data via the console or API.
- Data portability: same format as access request.

A dedicated [Data Subject Rights Procedures](Data-Subject-Rights) page *(WIP)* operationalises these.

## 10. Data retention

| Data class | Retention |
|---|---|
| Customer business data | For the duration of the contract + customer-configured deletion grace (default 30 days) |
| Audit events — `Write` low/medium | 1 year |
| Audit events — `Write` high / `Delete` | 7 years |
| Audit events — `Financial` | 7 years (compliance minimum) |
| Logs (operational) | 90 days hot, 1 year cold |
| Backups | Daily snapshot retained 30 days; weekly snapshot 90 days; quarterly 7 years |
| Production access logs | 1 year |

Tenant retention overrides apply (a tenant can require longer; never shorter than the minimum).

## 11. Backup and disaster recovery

### Targets

| Metric | Target |
|---|---|
| RPO (max data loss) | 5 minutes |
| RTO (max downtime) | 30 minutes for full restore; 5 minutes for single-AZ failure |

### Practice

- Multi-AZ deployment from Day 1.
- Multi-region active-passive from Phase 3.
- Quarterly DR drill — full restore from backup to an isolated environment, validation against synthetic dataset.
- Annual region-failure exercise — simulate full primary region loss, measure actual RTO.

## 12. Logging and audit

See [Observability Standards](Observability-Standards) for operational logging. This section covers **security-relevant** events:

- All authentication events (success and failure).
- All privilege changes (role grants, scope assignments).
- All `Delete` and `Financial` actions, full payload.
- All access to Restricted-tier data.
- Audit log itself is append-only, written to a separate store with restricted write access.
- Audit log tampering attempts are themselves logged and alerted.

## 13. Incident response

### Severity

| Sev | Definition | Response |
|---|---|---|
| Sev1 | Production outage affecting > 25% of tenants, OR confirmed data exposure | Page on-call + exec; all-hands until contained |
| Sev2 | Production outage affecting < 25% tenants, OR major degradation | Page on-call; war room within 30 min |
| Sev3 | Limited customer impact, workaround exists | Business hours response |
| Sev4 | Internal-only, no customer impact | Normal triage |

### Process

1. **Detect** — automated alert or human report
2. **Triage** — on-call assesses severity within 15 minutes (Sev1/2)
3. **Contain** — stop the bleed before fixing
4. **Communicate** — Sev1/2 customers notified within 1 hour
5. **Remediate** — root-cause fix, not just symptom suppression
6. **Postmortem** — blameless 5-whys analysis, published internally within 14 days; Sev1 postmortems published to affected customers

A dedicated [Incident Response Playbook](Incident-Response) page *(WIP)* operationalises this.

## 14. Third-party / vendor risk

- Every vendor handling customer data is on an approved-vendor list maintained by Security + Legal.
- New vendor onboarding requires a security review (SOC 2 report or equivalent), DPA, and a defined data-flow boundary.
- Quarterly review of vendor list — terminating unused; re-attesting active.
- A dedicated [Vendor Risk Management](Vendor-Risk-Management) page *(WIP)* operationalises this.

## 15. AI-specific security (LLM Top 10 coverage)

| OWASP LLM risk | Our control |
|---|---|
| LLM01 Prompt injection | Prompt injection defence layer + structured tool-use only ([AI Model and Prompt Standards § 9](AI-Model-and-Prompt-Standards#9-red-team--adversarial-testing)) |
| LLM02 Insecure output handling | Output schema validation gate + deterministic execution wrapper |
| LLM03 Training data poisoning | We do not retrain on customer data without opt-in agreement |
| LLM04 Model DoS | Per-tenant rate limits and token budgets |
| LLM05 Supply chain | Provider abstraction layer; no single provider > 80% traffic |
| LLM06 Sensitive information disclosure | PII redaction layer; cross-tenant data isolation |
| LLM07 Insecure plugin design | All tools are platform-defined; agents cannot install arbitrary plugins |
| LLM08 Excessive agency | Phased Autonomy Model + Approval Workflow |
| LLM09 Overreliance | Confidence calibration + human-in-the-loop for high-risk actions |
| LLM10 Model theft | Model weights for self-hosted models live in VPC-isolated Bedrock |

---

## When to revisit

- A regulator publishes new guidance affecting our compliance posture.
- A vulnerability class emerges (new OWASP entry, novel attack vector) requiring control change.
- An incident retrospective shows a policy gap.
- A major customer engagement requires posture beyond current state (FedRAMP, IRAP, specific industry).
- Annual policy review at minimum, with CTO + CISO accountable.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Rollback Procedures](Rollback-Procedures)
- [Architecture Principles](Architecture-Principles)
- [Observability Standards](Observability-Standards)
- [AI Model and Prompt Standards](AI-Model-and-Prompt-Standards)
- [Master Blueprint Index](Master-Blueprint-Index)
