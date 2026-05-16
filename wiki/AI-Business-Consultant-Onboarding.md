# AI Business Consultant · Quick-Start Onboarding

> **Type:** Product concept · **Owner:** Product · **Status:** Draft · **Applies to:** Every new customer's first session · **Last reviewed:** 2026-05-16

The customer's first five minutes with Atlantis are the most important five minutes of the relationship. The product they meet in those minutes is the **AI Business Consultant** — an agent whose only job is to turn *"I run a 12-person law firm in Austin"* into a complete, custom-fit business blueprint, **in minutes**, with no cloud setup, no procurement call, and no integration project.

This page defines that experience and why it is the default path for every customer — SMB, mid-market, and even most enterprises.

---

## 1 · The promise to the customer

> **"Tell us about your business. Five minutes later, you'll have a working blueprint of how your company runs, which departments you need first, and the agents to run them — already on, already configured, already cited to industry best practice."**

No environment setup. No cloud account. No connector wizard. No procurement gate. The customer arrives, describes their business in plain English, and leaves the session with a working configuration.

---

## 2 · The flow (5 to 15 minutes)

### Step 1 — Sign in and describe the business *(60 seconds)*

A single conversational form. The customer answers in their own words:

- *"What does your business do?"*
- *"What industry / who are your customers?"*
- *"How big is the team, and what roles exist today?"*
- *"What's the painful part — the work you wish would just happen?"*
- *"Where do you operate? Any regulatory constraints we should know?"*

No dropdowns of taxonomies. The AI Business Consultant parses free text. If something is unclear, it asks a single clarifying question, never a wall of them.

### Step 2 — The Consultant researches *(2–5 minutes, visible to the customer)*

In parallel, with a live activity feed so the customer sees the work happening:

- **Industry research.** Pull public information about similar businesses of similar size — what departments they staff, what tools they use, what workflows are standard, what the regulatory baseline looks like in their jurisdiction.
- **Blueprint match.** Pull the matching [department playbooks](Master-Blueprint-Index) from our Wiki — HR, Finance, Sales, Marketing, Legal, Operations, Dev — already validated by our [Domain Expert Councils](The-Six-Barriers#b2--domain-expertise-gap).
- **Tool-stack inference.** Suggest the integrations this profile typically needs (Salesforce or HubSpot for sales, QuickBooks or Xero for finance, Slack or Teams for comms) and flag the ones our [Universal Data Bridge](Architecture-Principles) already supports.
- **Risk and jurisdiction layer.** Match the customer's jurisdiction(s) to the appropriate compliance rules in the Wiki — wage laws, tax rules, data-residency requirements, industry regulations.

The output is a citation trail, not a black box — every recommendation links back either to the public source or to the Wiki page it came from.

### Step 3 — Custom blueprint produced *(in-session, reviewable)*

The Consultant produces a customer-specific document with:

- **Recommended department lineup** — ranked by impact on the customer's stated pain. *"Based on what you described, Sales and Marketing agents will give you the most leverage in the first 30 days. Finance and HR are valuable but lower-priority for a team your size."*
- **Per-department starting playbook** — adapted from our wiki playbooks to the customer's industry, scale, jurisdiction, and tool stack.
- **Recommended integrations** — first three to connect, with reasons.
- **Phased Autonomy starting point** — for most customers, Drafting Mode on day one; Startup Mode for low-risk actions once data readiness is confirmed.
- **A 30 / 60 / 90 day plan** — what the customer should expect each agent to be doing, and which trust milestones unlock the next autonomy phase.

### Step 4 — Customer reviews and chooses *(2–5 minutes)*

The customer can:

- Accept the blueprint as-is.
- Edit any line by clicking and describing the change in plain English (the same UX pattern Durable uses for specs — see [§ 6.5 of the Durable deep-dive](Competitor-Deep-Dive-Durable)).
- **Pick the subset of departments to activate now.** Most customers will not turn on all seven agents at once. The common starting set is **Sales + Marketing** for revenue-stage companies, **HR + Finance** for compliance-stage companies, **Dev** for engineering-led teams. Other departments can be activated later from the same console with one click.

### Step 5 — Activation *(seconds)*

The chosen agents spin up immediately on our managed cloud. The customer connects integrations through OAuth as they need them — not all up-front, just the ones the active agents require. The activity feed starts running.

**No environment setup. No cloud account on the customer's side. No SRE on call.** This is the design promise.

---

## 3 · Why managed-first is the default

We support [bring-your-own-cloud](Architecture-Principles) for customers who need it — regulated industries, large enterprises with existing AWS/GCP/Azure commitments, sovereignty requirements. **But BYOC is a path, not the default path.**

The reasons we lead with managed:

- **Most SMBs do not have a cloud.** Asking them to set one up is a "no" before the product can prove value.
- **Most mid-market customers want a quick start.** They will adopt BYOC later, as their footprint grows, but only after the platform has earned trust.
- **Many enterprises start as a single business unit.** A 40-person business unit inside a 4,000-person enterprise will run on our managed cloud first, then graduate to BYOC when central IT brings them under their umbrella. Forcing BYOC on day one means losing the unit-level deal.
- **Speed to value is the moat.** The day-one experience is *"I described my business and got a working blueprint in five minutes."* This experience is impossible if the customer is wiring up an AWS account in parallel.

**The architecture supports both. The marketing leads with managed.** See [Pricing and Packaging](Pricing-and-Packaging) for tier mapping.

---

## 4 · Departments as on-demand modules

A customer who starts with Sales + Marketing this month and later realises they need HR can activate it from the same console with one click. The newly activated agent inherits the blueprint, integrations, and policies the AI Business Consultant already produced — there is no re-onboarding. Departments are modules; the blueprint is the contract.

This is also how we land-and-expand: each activated department is upsell-able usage, and each new department reads the same wiki + data bridge the others already use. **No agent has to re-learn the company.**

---

## 5 · What the Consultant must never do

- **Never invent compliance rules.** If the Consultant cannot cite a specific Wiki page or external authority for a regulation, it flags the question for a Domain Expert review rather than guessing. (See [Confidence and Escalation Rules](Confidence-and-Escalation-Rules).)
- **Never auto-activate a department the customer did not pick.** The Consultant recommends; the human decides.
- **Never start in Approval or Enterprise mode.** Every new customer begins in Drafting Mode, regardless of how confident the blueprint looks. Trust is earned per-customer, not assumed from the playbook.
- **Never connect an integration without explicit OAuth consent from a named human.** OAuth scopes are minimum-necessary per [Zero-Trust Agent Identity](The-Six-Barriers#b4--agent-identity--security-crisis).
- **Never persist research output as fact.** Public-web research is treated as *signal*, not *truth*. Anything that becomes part of the customer's operating blueprint must be reviewed by them and is then stored in their Wiki, with a citation, under their version control.

---

## 6 · How this maps to our six-barrier moat

| Barrier | How quick-start onboarding addresses it |
|---|---|
| **B1 — Compound failure** | Drafting Mode is the only available starting state — no autonomous action until the customer approves it. Validation gates are active from minute one. |
| **B2 — Domain expertise** | The blueprint is generated from Domain-Expert-Council-validated wiki playbooks; the Consultant cites every recommendation. |
| **B3 — Data silos** | The Universal Data Bridge configuration is proposed in the blueprint; the customer can accept or override. Each integration is OAuth-scoped per agent. |
| **B4 — Agent identity** | Activated agents get their own scoped identity automatically; no shared service account. |
| **B5 — Trust & change management** | The blueprint includes a 30/60/90 plan and named trust milestones, so the customer can predict the autonomy ramp. |
| **B6 — Breadth complexity** | The customer activates only the departments they need; complexity grows with adoption, not all at once. |

---

## 7 · Open questions (to resolve before Phase 1 ships)

- **How much public-web research is acceptable inside SOC 2 / GDPR boundaries?** The Consultant must not exfiltrate customer-specific information to external search; only the customer's own framing (industry, size, jurisdiction) is used as the query input. To be specified in [Security and Data Policy](Security-and-Data-Policy).
- **What is the SLA on blueprint generation?** Target is under 5 minutes for the median case; the failure mode (timeout, low confidence) must be clearly defined.
- **Multilingual onboarding** — when does this become a blocker? Probably Phase 2.
- **How does the Consultant handle a business it has no playbook for?** Falls back to "we can build agents for your sales and finance workflows, but we don't yet have a domain playbook for your industry — here's the gap, here's how to fill it together." Honesty over fake coverage.

---

## Cross-references

- [Product Concept](Product-Concept) — the onboarding section now points here for detail.
- [Competitor Deep Dive · Durable.ai](Competitor-Deep-Dive-Durable) — the lessons (§6) that motivated this design.
- [Architecture Principles § 16](Architecture-Principles) — managed-first, BYOC available.
- [Pricing and Packaging](Pricing-and-Packaging) — tier-to-deployment mapping.
- [Phased Autonomy Reference](Phased-Autonomy-Reference) — every customer starts in Drafting Mode.
- [Confidence and Escalation Rules](Confidence-and-Escalation-Rules) — when the Consultant must defer to a human.
- [Master Blueprint Index](Master-Blueprint-Index) — the playbook library the Consultant draws from.
