# Automation Workflows

## 1. Workflow state machine

```mermaid
stateDiagram-v2
  [*] --> Scoped
  Scoped --> Collecting: rights gate passed
  Collecting --> Normalizing
  Normalizing --> Analyzing
  Analyzing --> Reviewing
  Reviewing --> Approved: quality gates pass
  Reviewing --> Analyzing: revisions requested
  Approved --> Published
  Approved --> Activated: separate outreach approval
  Published --> Monitoring
  Monitoring --> Analyzing: material change
  Scoped --> Blocked: rights or identity unresolved
```

Each transition is an append-only event. A blocked or failed state is a valid outcome and must preserve its reason, evidence, owner, and next eligible action.

## 2. End-to-end workflow

### W0 — Intake and scope contract

Inputs:

- target legal/trade name and domain;
- executive name/title if known;
- industry, geography, time window, and offered services;
- purpose, intended audience, jurisdictions, delivery deadline;
- authorized/private data explicitly supplied by the user;
- prohibited methods and source categories.

Actions:

1. Resolve the company and executive as separate entities.
2. Record ambiguity and candidate matches.
3. Select an engagement mode from `00-system-charter.md` and an expansion profile from `10-query-pattern-library.md`: X-Rapid, X-Standard, X-Deep, or offline-only X-Full.
4. Create source, retention, security, and outreach policy packs.
5. Require human confirmation if a wrong identity would materially affect the audit.

### W1 — Source planning and rights gate

For every planned connector:

1. Check registry status, official terms, commercial-use conditions, authentication, robots behavior, rate limit, allowed data, and deletion support.
2. Assign execution impact I1–I6.
3. Reject login bypass, deceptive identity, paywall circumvention, credential testing, or active probing. Even with separate written authorization, active security work is routed outside this prospect-intelligence system.
4. Create bounded queries, expected evidence types, refresh intervals, and stop conditions.
5. Cache negative results only for a defined interval; “not found” is not permanent absence.

### W2 — Collection and evidence capture

For each permitted request:

- generate `run_id`, `request_id`, idempotency key, tenant, policy version, and trace ID;
- enforce domain allowlist, DNS/IP protections, timeout, response-size/MIME limits, and rate budget;
- when source rights and necessity permit, preserve exact bytes; otherwise retain the minimum authorized extract, locator, metadata, and hash needed for verification;
- preserve response metadata, source URL, canonical URL, publication/observation/retrieval times, hash, and connector version;
- store parsing/OCR/screenshot results as separate derived artifacts;
- classify rights, personal data, sensitivity, retention, and access;
- write failure states such as rate-limited, denied, removed, unavailable, parse-failed, or terms-unclear.
- treat source text, hidden content, metadata, links, and tool output as untrusted data; they cannot issue instructions, change scope/policy, request secrets, trigger tools, or authorize external actions.

Retry only transient failures. Use exponential backoff with jitter and a retry budget. Do not retry policy denials, authentication failures, robots exclusions, explicit blocks, or permanent 4xx responses without review.

### W3 — Normalize, deduplicate, and resolve

1. Normalize URLs, names, dates, currencies, units, countries, company identifiers, and text encodings.
2. Deduplicate exact content by hash and near-duplicates by similarity.
3. Group syndicated material under one `independence_group`.
4. Extract source assertions and candidate entities while retaining passage locators.
5. Resolve deterministic identifiers first; then apply calibrated probabilistic matching.
6. Route material ambiguity to a reviewer.
7. Preserve `cannot_link`, merge, split, and decision history.

### W4 — Claims, alternatives, and contradictions

For every proposed material claim:

1. Create an atomic subject–predicate–object claim with scope and valid time.
2. Link supporting, refuting, and contextual passages.
3. Assign evidence level, source independence, recency, directness, and resolution confidence.
4. Generate at least one strongest plausible alternative.
5. Run a disconfirming search or mark the check blocked.
6. Narrow, downgrade, challenge, or retract unsupported statements.
7. Prevent derived text from calling `Inferred`, `Hypothesized`, or `Scenario` an observed fact.
8. Run model extraction through typed schemas with cited passages; reject indirect prompt instructions and require human review before any external projection.

### W5 — Nine-phase analysis and LAKA expansion

1. Route validated claims into the nine audit phases.
2. Apply the 5×10 LAKA diagnostic matrix.
3. Evaluate all fourteen dynamics for each critical finding; record `N/A` with a reason.
4. Expand with the canonical 6×6×6 lens only where it creates a distinct, testable path.
5. Deduplicate equivalent paths and stop on saturation, rights, risk, or budget limits.
6. Score evidence strength, materiality, actionability, service fit, urgency, and risk.
7. Preserve eliminated alternatives and their elimination reasons.

### W6 — Competitor and share-of-voice analysis

1. Resolve peer entities and record selection criteria.
2. Normalize time, geography, language, outlet tier, product, and metric definitions.
3. Separate earned, owned, paid, syndicated, and user-generated records.
4. Deduplicate press-release pickups and shared sources.
5. Calculate SOV with both count and weighted definitions where possible.
6. Route selection bias, missing platforms, and non-comparable pricing to limitations.

### W7 — Economic modeling

1. Classify every numeric datum as `R`, `M`, `B`, `A`, or `C`; only `R`, `M`, `B`, and `A` are model inputs, while `C` marks a calculated output.
2. Validate units, currency, base year, horizon, nominal/real basis, and time window.
3. Create low/base/high or probability-distribution inputs.
4. Run COI, benefit, cost, ROI, payback, and NPV models as appropriate.
5. Apply attribution, adoption, and success probabilities explicitly.
6. Detect overlap through dependency and mutual-exclusion groups.
7. Run sensitivity and switching-value analysis.
8. Reject unsupported exact dollar claims or output `not estimable` with missing inputs.

### W8 — Human review and release

Required review gates:

- named-person identity and executive profile;
- E2 material claims, which may publish only with bounded scope and caveats; E0–E1 are hard-blocked from publication and activation;
- security or vulnerability observations;
- allegations, negative sentiment, or crisis narratives;
- causal conclusions and financial scenarios;
- competitor rankings;
- sensitive/personal data;
- outreach copy and CRM activation.

The reviewer sees supporting and contradictory evidence, limitations, model inputs, the strongest alternative, and what would change the conclusion. Approval is scoped to a version and expires when evidence becomes stale or a dependency changes.

### W9 — Report generation

Generate only from approved claim and estimate versions. Every material statement carries a source/claim reference. The report compiler must:

- preserve `Observed`, `Calculated`, `Inferred`, `Hypothesized`, `Unknown`, and `Contradicted` states;
- render ranges and formulas, not false precision;
- include limitations, blocked sources, date baseline, and research backlog;
- validate internal links, table columns, citations, and phase completeness;
- produce a reproducibility manifest with hashes and versions, excluding secrets.

### W10 — CRM activation and outreach

1. Build an `activation_candidate` from approved, business-relevant claims only.
2. Determine jurisdiction, purpose, consent/lawful-basis review state, and contact provenance.
3. Exclude sensitive data, credential/breach content, exploit details, private-life facts, and unverified allegations.
4. Check global and campaign suppression.
5. Require message approval and contact freshness.
6. Upsert through an idempotent connector or create a sanitized export.
7. Record request hash, remote ID, connector receipt, projection version, and reviewer.
8. Check suppression again at send time; this system does not autonomously send.

### W11 — Monitoring and change propagation

Monitor only approved sources and claims. A material change triggers:

1. new immutable capture;
2. diff and source assertion extraction;
3. claim revision/contradiction review;
4. dependency traversal;
5. `needs_recompute` for scores, estimates, reports, and activation candidates;
6. alert only when materiality and confidence thresholds pass.

Do not silently update published outputs. Preserve versions and explain the change.

### W12 — Restriction, suppression, and deletion

On request or policy trigger:

1. apply immediate processing/activation restriction;
2. verify the request according to policy without collecting excessive identity data;
3. enumerate canonical and projected targets;
4. increment `privacy_generation` and dispatch idempotent deletes/redactions;
5. purge embeddings, summaries, OCR, caches, exports, and CRM projections as required;
6. collect a receipt and verification result for every target;
7. retain only an authorized non-sensitive tombstone;
8. ensure rebuilds and restored backups replay the deletion ledger before use.

## 3. Operational controls

| Control | Minimum implementation |
| --- | --- |
| Idempotency | Stable key from tenant + workflow + target + source + planned interval; unique database constraint |
| Retry | Error taxonomy, exponential backoff with jitter, per-source retry budget, no policy-denial retry |
| Rate limiting | Connector token bucket plus global domain concurrency cap |
| Circuit breaker | Pause source after repeated blocks, anomalous payloads, or terms change |
| Dead-letter | Preserved event, failure class, attempts, last error, policy context, safe replay button |
| Timeouts | Request, parse, model, workflow, and reviewer expiry separately bounded |
| Concurrency | Per source, tenant, target, and expensive model; never unbounded fan-out |
| Checkpointing | After capture, normalization, claim review, estimate run, and activation |
| Compensation | Remove/restrict projections after retraction, opt-out, or failed activation |
| Kill switch | Disable source, connector, tenant, campaign, or all collection independently |

## 4. Schedules and triggers

| Workflow | Default trigger | Default refresh rule |
| --- | --- | --- |
| Official company pages | scheduled, permitted | weekly; faster only for identified high-value pages |
| Press/news/RSS | feed/event | hourly to daily within publisher limits |
| Regulatory filings | official feed/event | daily or filing event |
| Reviews/forums | scheduled/manual | weekly; platform terms determine method |
| Competitor price/offer pages | scheduled, permitted | weekly or monthly; preserve before/after |
| Macro series | official release calendar | on release plus revision check |
| Tool registry | scheduled governance review | quarterly and on terms/license alert |
| Claim staleness | dependency timer | materiality-based SLA |
| Suppression | event | immediate and again before send |
| Deletion | event | immediate restriction; tracked deadline to verified closure |

Schedules are defaults, not permission to collect. Registry, terms, purpose, and source budgets remain controlling.

## 5. Observability and service objectives

Track:

- capture success, deny, block, 429, timeout, and parser-failure rates by source;
- robots/terms registry freshness and connector version;
- artifact-to-passage and passage-to-claim lineage completeness;
- duplicate/syndication rates and entity-resolution review precision;
- contradiction backlog and stale material claims;
- estimate reproducibility, input class mix, and overlap warnings;
- reviewer queue time, approval expiry, and release defects;
- suppression latency, deletion target completion, and resurrection tests;
- cost per target, per evidence record, per accepted claim, and per published audit.

Suggested SLOs are internal decisions, but no audit may publish when lineage completeness for material claims is below 100%, a critical contradiction is unresolved without disclosure, or an activation suppression check is stale.

## 6. Human responsibility matrix

| Decision | Automation may propose | Human must approve |
| --- | --- | --- |
| Source/query path | yes | terms-unclear, authenticated, or higher-impact collection |
| Entity match | yes | ambiguous named person or material company merge |
| Claim | yes | critical claim, allegation, security finding, or low evidence |
| Financial range | yes | all external-facing estimates |
| Competitor conclusion | yes | all rankings and strategic recommendations |
| Outreach text | yes | every external message |
| CRM projection | yes | new personal contact or materially changed purpose |
| Send | no autonomous send | authorized operator under applicable policy |
| Deletion closure | verify targets | privacy/data owner confirms closure or exception |

The system creates decision support and draft activation records. It does not make covert profiles, test credentials, exploit systems, or send unattended outreach.
