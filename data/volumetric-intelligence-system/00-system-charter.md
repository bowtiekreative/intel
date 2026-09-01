# System Charter

## 1. Objective

The LAKA Volumetric Intelligence System converts lawful public evidence about a company and its environment into testable commercial hypotheses. Its purpose is to help a service provider establish immediate authority by showing a prospect a small number of high-value, well-supported observations—not by overwhelming or surveilling the prospect.

The system answers seven executive questions:

1. What is happening?
2. How do we know?
3. How material could it be?
4. Why might it be happening?
5. What alternatives exist?
6. What is the smallest safe test?
7. What evidence would change the recommendation?

## 2. Canonical protocol

Use the previously established LAKA protocol:

> **Symptom → Decomposition → Variety → Elimination → Prescription → Routing → Review**

| Stage | Purpose | Required output |
| --- | --- | --- |
| Symptom | Record the visible signal without diagnosing it | neutral observation and source |
| Decomposition | Separate system components | objects, conditions, actions, tools, resources, stakeholders, dependencies, outcomes |
| Variety | Generate materially different explanations and interventions | morphological alternatives, including do-nothing and measurement-first |
| Elimination | Filter without hiding discarded options | decision table using evidence, fit, urgency, reversibility, cost, capacity, risk, and time-to-evidence |
| Prescription | Select the smallest sufficient intervention | action, owner, inputs, expected state change, stop rule |
| Routing | Send work to the correct human/tool/agent | route, authorization, data classification, review gate |
| Review | Compare predicted and observed outcomes | result, variance, learning, next state |

## 3. Scope contract

Every run begins with this contract:

```yaml
audit_id: ""
target_company: ""
canonical_domain: ""
target_executives: []
industry: ""
regions: []
analysis_window:
  start: ""
  end: ""
offered_services: []
competitor_rule: "three closest like-for-like competitors"
external_security_engagement_reference: null
allowed_sources: "public and lawfully accessible"
excluded_data:
  - credentials and authentication secrets
  - private or sensitive personal information
  - family and household profiling
  - bypassed, purchased-without-provenance, or access-controlled data
financial_currency: "CAD|USD|other"
report_as_of: ""
```

If target data is missing, the engine creates a reusable plan/template rather than inventing a company, executive, competitors, or financials.

## 4. Separation of layers

Do not collapse these layers:

| Layer | Question | Examples |
| --- | --- | --- |
| Source | Where did the material come from? | filing, company page, review, official API |
| Observation | What can a reviewer directly inspect? | page lacks a visible CTA; filing reports revenue |
| Calculation | What follows arithmetically? | growth rate; ad frequency; SOV count |
| Inference | What explanation is supported but not proven? | unclear positioning may contribute to low conversion |
| Hypothesis | What should be tested? | a shorter form may increase completion |
| Recommendation | What intervention best balances value and risk? | instrument the form and run a controlled test |
| Outreach | What is relevant and appropriate to tell the executive? | one observation, its business implication, a low-friction next step |

## 5. Finite core and open registry

“Exhaustive” is defined operationally:

- **Finite core:** required dimensions, evidence fields, LAKA matrices, nine phases, scoring rules, financial formulas, safety gates, and completion tests.
- **Expandable registry:** tools, sources, jurisdictions, industries, platforms, query patterns, competitors, and service modules.

Coverage claims refer only to the declared scope and registry version. The report must not say “all tools,” “the entire internet,” or “no other risk exists.” It may say “all applicable core checks in version 1.0 were evaluated.”

## 6. Output truth labels

| Code | State | Meaning |
| --- | --- | --- |
| O | Observed | Directly supported by a preserved source or authorized measurement |
| C | Calculated | Deterministic transformation of cited inputs |
| I | Inferred | Best explanation supported by evidence but not directly observed |
| H | Hypothesized | Testable possibility; not yet supported enough to prefer |
| U | Unknown | Necessary information is unavailable or inaccessible |
| X | Contradicted | Credible evidence conflicts with the claim |

The state belongs on every material sentence, database claim, financial input, and outreach fact.

## 7. Non-goals

This system does not:

- perform penetration testing or exploit validation;
- find or trade leaked passwords;
- infer protected characteristics or sensitive personal traits;
- diagnose an executive psychologically;
- scrape prohibited sources or defeat access controls;
- impersonate a person or create deceptive outreach;
- manufacture precision from industry benchmarks;
- turn correlation, sentiment, or share of voice into causal revenue claims;
- auto-send messages without jurisdictional and human review.

## 8. Authority model

Immediate authority comes from specificity plus restraint:

\[
\text{Authority} = \frac{\text{Relevant Evidence} \times \text{Economic Clarity} \times \text{Useful Next Step}}{1 + \text{Unsupported Certainty} + \text{Intrusiveness} + \text{Friction}}
\]

This is a design equation, not a measured scientific law. It reminds the operator that one verifiable insight can outperform a long generic audit.

## 9. Audit modes

| Mode | Time box | Use | Output |
| --- | ---: | --- | --- |
| Signal scan | 20–45 minutes | qualification | 3–5 observations, unknowns, no hard dollar claim |
| Authority brief | 2–4 hours | first outreach | one dominant thesis, 3 evidence chains, scenario value |
| Standard audit | 1–3 days | discovery or proposal | all nine phases, 3 competitors, financial ranges |
| Deep audit | 1–3 weeks | paid diagnostic | time-series evidence, interviews/data room where authorized, tested models |
| Monitoring program | recurring | change detection | deltas, alerts, narrative shifts, model refresh |

## 10. Stop conditions

Stop or narrow the run when:

- the task requires bypassing authentication, rate limits, paywalls, CAPTCHAs, or source controls;
- a claim relies on stolen or sensitive data;
- the target cannot be reliably resolved;
- a person-directed action has an ambiguous recipient;
- evidence cannot support a proposed allegation;
- a security observation could materially increase risk if exposed in outreach;
- financial inputs are too speculative to produce a useful range;
- terms, law, or contracts prohibit the planned collection or use;
- the operator cannot explain why a data field is necessary.

Route security concerns to a private responsible-disclosure process or the target's published security contact—not a sales message.
