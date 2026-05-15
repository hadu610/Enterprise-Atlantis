# 8 · Strategic Considerations

## Infrastructure before agents — non-negotiable

The single most important strategic decision in this plan is the **Phase 1 focus on infrastructure** (Orchestration Engine, Validation Gates, Agent Identity, Data Bridge) before any visible agent features are built.

This will feel wrong to investors and early customers who want to see agents working. **The team must be able to articulate clearly why this sequence is the only path to production reliability at scale.** Every enterprise AI project that skipped this step failed publicly — Gartner's 40% cancellation figure is almost entirely attributable to this shortcut.

## Domain Expert Councils are not optional

Barrier 2 (domain expertise) is the hardest to solve with software alone.

Domain Expert Councils — senior practitioners who own and validate the wiki playbooks for each department — are a **human resource requirement, not a nice-to-have**. Budget for their ongoing engagement, their updates when regulations change, and their review of every new domain playbook before it is published. Consider offering equity or revenue share to keep senior domain experts engaged long-term.

## The Trust Score is the sales tool

The Trust Score Dashboard is not just a product feature — **it is the primary sales tool for expanding contracts from one department to multiple departments**.

A Chief People Officer who sees that the HR Agent has a 97% accuracy rate, 4% human override rate, and zero validation gate failures over 90 days will approve the Finance Agent without hesitation. Build this dashboard to be **boardroom-ready**. It should be the first thing a customer's CIO sees when they log in.

## The Dev Agent is still the moat

The autonomous software development agent remains the feature no competitor offers in a full-company platform context.

The combination of:

- (a) Validation Gate Architecture ensuring code quality
- (b) Zero-Trust Agent Identity attributing PRs to the agent
- (c) Wiki-enforced coding standards
- (d) Rollback capability for every deployment

creates a Dev Agent that is **safer and more auditable than many human dev contractors**. This is the story that wins enterprise CTO buy-in.

## The production gap is the competitive battlefield

Gartner projects 40% of agentic AI projects will be cancelled by 2027 — not because the technology fails, but because of the gap between demo and production reliability.

**Every competitor will have good demos. The winner will be the platform that performs in production.** Our entire architecture — validation gates, deterministic wrappers, rollback, prompt injection defence, data quality scoring — is designed for one purpose: to be the platform that works in production when others don't.

---

## Final strategic principle

> We are not building a product that is "10% better" than competitors. We are building the first platform that has genuinely solved the six barriers that have prevented every competitor from succeeding. If we execute the infrastructure phase correctly, we will have a technical and trust moat that takes 3–5 years for well-funded competitors to replicate. **Speed matters — but only if we build the right thing first.**

---

→ Next: [Next Steps](Next-Steps)
