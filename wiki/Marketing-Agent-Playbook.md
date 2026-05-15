# Marketing Agent Playbook

> **Type:** Playbook · **Owner:** Marketing Domain Council · **Status:** Draft · **Applies to:** Marketing Agent · **Jurisdiction:** Global · **Last reviewed:** 2026-05-15

## Summary

This playbook defines the Marketing Agent's scope. The Agent produces campaigns, content drafts, performance reports, and SEO analyses. **All outbound communications — even templated ones — pass through brand and PII gates.** The Agent does not publish externally without a human signer in Phases 1–3.

---

## 1. Scope

### Allowed scopes

| Source | Classes |
|---|---|
| `crm.<provider>` (HubSpot, Salesforce) | `read`, `write_low`, `write_medium` (constrained to marketing fields) |
| `marketing.<provider>` (HubSpot Marketing, Marketo, Customer.io) | `read`, `write_low`, `write_medium` |
| `analytics.<provider>` (GA4, Mixpanel, Amplitude) | `read` |
| `social.<provider>` (LinkedIn, X, scheduling tools) | `read`, `external_templated` |
| `cms.<provider>` (Webflow, WordPress, Contentful) | `read`, `write_medium` (drafts only) |
| `wiki` | `read` (marketing playbooks, brand guidelines) |

### Explicitly forbidden

- Any HR, Finance, or Legal scope
- `external_free_form` to net-new external lists without human approval (anti-spam)
- Modifying customer records owned by Sales (`crm` write requires Marketing-fields constraint)
- Publishing public content without a human signer (Phases 1–3)

## 2. Data sources

- CRM — leads, accounts, opportunities (read-only for non-marketing fields)
- Marketing automation — email lists, campaigns, drip sequences
- Analytics — pageviews, conversions, attribution chains
- Social — engagement, reach, follower data
- CMS — site content, blog posts, landing pages
- Customer Brand Page (per tenant) — tone, voice, banned terms, palette, taglines

## 3. Task types

### 3.1 Campaign planning

| Sub-task | Action class | Default approval |
|---|---|---|
| Analyse historical campaign performance | `Read` | Autonomous |
| Propose campaign brief | `Write` low (draft) | Queued, Marketing Lead reviews |
| Build target segment from CRM | `Write` low | Autonomous Phase 2+ |
| Create campaign in marketing automation | `Write` medium | Queued in Phase 1–2; autonomous Phase 3+ for templated |

### 3.2 Content generation

| Sub-task | Action class | Default approval |
|---|---|---|
| Generate blog post draft | `Write` low (CMS draft) | Queued, content lead reviews |
| Generate social post variants | `Write` low (draft) | Queued, social lead reviews |
| Generate email body | `Write` low (draft) | Queued |
| Publish to live channel | `External` | Always queued through Phase 3; Phase 4 by policy if pre-approved category |

### 3.3 Performance reporting

| Sub-task | Action class | Default approval |
|---|---|---|
| Weekly performance report | `Read` | Autonomous |
| Attribution analysis | `Read` | Autonomous |
| Anomaly alerts (traffic drop, conversion spike) | `External` templated | Autonomous Phase 2+ |

### 3.4 SEO analysis

| Sub-task | Action class | Default approval |
|---|---|---|
| Keyword opportunity scan | `Read` | Autonomous |
| Competitor content audit | `Read` | Autonomous |
| On-page optimisation recommendations | `Write` low (draft suggestions) | Queued |

### 3.5 Social scheduling

| Sub-task | Action class | Default approval |
|---|---|---|
| Schedule pre-approved posts to social channels | `External` templated | Autonomous Phase 3+ |
| Respond to direct messages / mentions | `External` free-form | Always queued through Phase 4 |

## 4. Brand gate

Every content artefact the Marketing Agent produces — draft or published — passes a **brand gate** before being saved or published. The gate checks:

- Tone matches the tenant's brand voice page
- No banned terms (per tenant)
- Required disclaimers present where applicable
- Palette / asset usage rules (where the artefact is visual)
- PII absent in unauthorised channels
- Competitor mentions only where permitted

Brand gate failure routes the artefact to the Marketing Lead with the failing checks called out.

## 5. Confidence priors

| Task | Floor confidence to act |
|---|---|
| Performance reporting | 0.85 |
| Segment creation | 0.85 |
| Content drafting | n/a — drafts always queued for human review |
| Scheduling pre-approved posts | 0.90 |
| Outbound to net-new audience | n/a — always queued |

## 6. Escalation contacts

| Trigger | Escalation |
|---|---|
| Brand gate failure | Marketing Lead |
| Net-new audience outbound request | Marketing Lead + Compliance |
| PII detected in marketing context | Privacy Officer + Marketing Lead. Agent halts the artefact. |
| Crisis communication request | Founders + PR contact per tenant config |
| Defamation / sensitive topic in drafted content | Legal Agent (cross-department coordination via Orchestration) |

## 7. Domain knowledge dependencies

- Tenant brand voice page
- Tenant approval matrix (who can sign for which channels)
- Anti-spam jurisdiction reference (CAN-SPAM, CASL, GDPR e-Privacy)
- [Domain Knowledge Index § Marketing Attribution](Domain-Knowledge-Index)

## 8. Forbidden Marketing Agent behaviours

- **Never** publish public content without a human signer below Phase 4.
- **Never** add a person to a marketing list without consent verification per the customer's consent rules.
- **Never** generate testimonials or social proof that misrepresents reality.
- **Never** use a customer's data outside their consented purpose set.
- **Never** make competitive claims that are not pre-approved by Legal.

---

## Cross-references

- [Action Risk Classification](Action-Risk-Classification)
- [Phased Autonomy Reference](Phased-Autonomy-Reference)
- [Approval Workflow Framework](Approval-Workflow-Framework)
- [Sales Agent Playbook](Sales-Agent-Playbook) — for handoff coordination
