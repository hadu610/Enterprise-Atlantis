# Domain Knowledge Index

> **Type:** Reference · **Owner:** Engineering · **Status:** Approved · **Applies to:** All agents · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This page is the entry point for domain-specific knowledge agents consult during task execution. **Each subsection below points to jurisdiction-specific or framework-specific pages that are owned and authored by the relevant Domain Expert Council.**

This index is intentionally a skeleton. Detail lives in the linked pages. Pages marked **(WIP)** are not yet authored — agents that require those pages will escalate rather than improvise.

---

## Employment Law

Owned by the **HR Domain Council** in coordination with the **Legal Domain Council**.

Pages organised per jurisdiction. The HR Agent loads the page matching the affected employee's `work_jurisdiction`.

| Jurisdiction | Page | Status |
|---|---|---|
| United States — federal | `Employment-Law-US-Federal` *(WIP)* | WIP |
| United States — California | `Employment-Law-US-CA` *(WIP)* | WIP |
| United States — New York | `Employment-Law-US-NY` *(WIP)* | WIP |
| United Kingdom | `Employment-Law-UK` *(WIP)* | WIP |
| Germany | `Employment-Law-DE` *(WIP)* | WIP |
| France | `Employment-Law-FR` *(WIP)* | WIP |
| Canada | `Employment-Law-CA` *(WIP)* | WIP |

Each jurisdiction page includes (minimum schema):

- Notice periods (by tenure, by termination kind)
- Probationary period rules
- Statutory leave entitlements
- Working time limits
- Anti-discrimination protected classes
- Required onboarding disclosures
- Documentation retention requirements

## Accounting Standards

Owned by the **Finance Domain Council**.

| Framework | Page | Status |
|---|---|---|
| US GAAP | `Accounting-GAAP` *(WIP)* | WIP |
| IFRS | `Accounting-IFRS` *(WIP)* | WIP |
| Revenue recognition — ASC 606 | `Revenue-Recognition-ASC606` *(WIP)* | WIP |
| Revenue recognition — IFRS 15 | `Revenue-Recognition-IFRS15` *(WIP)* | WIP |
| Lease accounting — ASC 842 | `Lease-Accounting-ASC842` *(WIP)* | WIP |

## Tax Jurisdictions

Owned by the **Finance Domain Council** in coordination with **Legal**.

Pages per jurisdiction covering sales tax / VAT / GST rules, registration thresholds, filing cadence, and rate tables.

| Jurisdiction | Page | Status |
|---|---|---|
| United States — sales tax | `Tax-US-Sales-Tax` *(WIP)* | WIP |
| EU VAT (incl. OSS / IOSS) | `Tax-EU-VAT` *(WIP)* | WIP |
| United Kingdom VAT | `Tax-UK-VAT` *(WIP)* | WIP |
| Canada GST/HST/PST | `Tax-CA-GST` *(WIP)* | WIP |

## Legal Frameworks

Owned by the **Legal Domain Council**.

| Framework | Page | Status |
|---|---|---|
| Standard SaaS contracting clauses | `Legal-SaaS-Clauses` *(WIP)* | WIP |
| GDPR | `Legal-GDPR` *(WIP)* | WIP |
| CCPA / CPRA | `Legal-CCPA` *(WIP)* | WIP |
| Anti-spam — CAN-SPAM | `Legal-CAN-SPAM` *(WIP)* | WIP |
| Anti-spam — CASL | `Legal-CASL` *(WIP)* | WIP |
| Anti-spam — EU e-Privacy | `Legal-EU-ePrivacy` *(WIP)* | WIP |

## Compliance Frameworks

Owned by **Security** in coordination with **Legal Domain Council**.

| Framework | Page | Status |
|---|---|---|
| SOC 2 Type II | `Compliance-SOC2` *(WIP)* | WIP |
| ISO 27001 | `Compliance-ISO27001` *(WIP)* | WIP |
| HIPAA | `Compliance-HIPAA` *(WIP)* | WIP |
| GDPR (controls view) | `Compliance-GDPR` *(WIP)* | WIP |
| PCI DSS | `Compliance-PCI` *(WIP)* | WIP |

## Security Frameworks

Owned by **Security** in coordination with **Engineering**.

| Framework | Page | Status |
|---|---|---|
| OWASP Top 10 (web) | `Security-OWASP-Top-10` *(WIP)* | WIP |
| OWASP LLM Top 10 | `Security-OWASP-LLM` *(WIP)* | WIP |
| NIST SSDF (Secure Software Development) | `Security-NIST-SSDF` *(WIP)* | WIP |
| Prompt injection defence playbook | `Security-Prompt-Injection` *(WIP)* | WIP |

## Marketing & Attribution

Owned by the **Marketing Domain Council**.

| Topic | Page | Status |
|---|---|---|
| Multi-touch attribution models | `Marketing-Attribution-Models` *(WIP)* | WIP |
| Consent-based marketing rules (cross-jurisdiction) | `Marketing-Consent` *(WIP)* | WIP |
| Brand guidelines template | `Marketing-Brand-Template` *(WIP)* | WIP |

## Industry Blueprints

Pre-built playbook bundles per industry. Customer onboarding may pre-install the relevant blueprint.

| Industry | Page | Status |
|---|---|---|
| SaaS | `Blueprint-SaaS` *(WIP)* | WIP |
| Healthcare | `Blueprint-Healthcare` *(WIP)* | WIP |
| Retail | `Blueprint-Retail` *(WIP)* | WIP |
| Manufacturing | `Blueprint-Manufacturing` *(WIP)* | WIP |
| Professional services | `Blueprint-ProServ` *(WIP)* | WIP |

---

## How agents use this index

1. The agent determines the relevant domain area (from its playbook and task context).
2. The agent determines the relevant jurisdiction or framework.
3. The agent loads the linked page.
4. If the page is `WIP` or missing, the agent does NOT improvise. It escalates per [How Agents Use This Wiki § 7](How-Agents-Use-This-Wiki#7-how-agents-request-wiki-updates).

Each linked page below is authored under the standard [Page Template](Page-Template) by the responsible Domain Expert Council. Adding a new jurisdiction or framework requires:

- Council member authorship
- Peer review by a second council member
- Inclusion in this index

---

## Cross-references

- [How Agents Use This Wiki](How-Agents-Use-This-Wiki)
- [Wiki Conventions](Wiki-Conventions)
- [Wiki Governance](Wiki-Governance)
- [Page Template](Page-Template)
