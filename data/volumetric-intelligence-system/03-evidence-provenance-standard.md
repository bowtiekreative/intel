# Evidence and Provenance Standard

## 1. Evidence states

| Level | Name | Minimum condition | Allowed use |
| --- | --- | --- | --- |
| E0 | No evidence | no preserved support | backlog only |
| E1 | Lead | snippet, unverified mention, weakly resolved source | research lead; not report fact |
| E2 | Single-source support | accessible source with extract and time, but secondary, user-generated, or not corroborated | bounded observation with caveat |
| E3 | Current official reference snapshot | current official page, filing, registry, API, policy, repository, or first-party platform record preserved with provenance | direct claim about what source shows |
| E4 | Corroborated official evidence | E3 plus independent primary/authoritative corroboration or an authorized reproducible local measurement/registry | material finding and model input |
| E5 | Confirmed/audited evidence | E4 support plus audited/reconciled target data or a valid controlled test that directly addresses the scoped claim | high-confidence decision input |

E3/E4 preserves the user's established distinction: official current documentation is E3; official current documentation corroborated by an installed registry or independent reproducible evidence is E4.

Evidence level is not truth probability. An official source can be outdated or self-interested; a customer review can accurately describe one experience. Target-confirmed but unaudited data does not automatically outrank corroborated evidence; classify its provenance and validate it under the appropriate E3/E4 level. Claim scope must match what the evidence proves.

## 2. Evidence record

```yaml
source_id: SRC-000001
canonical_url: ""
source_type: official|regulator|filing|registry|court|academic|platform|news|trade|review|forum|social|podcast|advertisement|archive|repository|dataset|measurement|other
publisher: ""
title: ""
author: ""
published_at: ""
observed_at: ""
retrieved_at: ""
valid_time_start: ""
valid_time_end: ""
jurisdiction: ""
access_class: public|authorized|restricted|unknown
collection_method: browser|official_api|rss|download|manual|passive_service
query_or_request: ""
extract: ""
structured_facts: {}
content_hash: ""
archive_pointer: ""
terms_notes: ""
personal_data_class: none|business_contact|personal|sensitive
retention_rule: ""
evidence_level: E0|E1|E2|E3|E4|E5
reviewer: ""
```

Do not store full copyrighted articles when a short extract plus URL and structured facts will do. Never store passwords, tokens, private keys, breach dumps, or unnecessary personal data.

`source_type` is an extensible controlled vocabulary. New values require a registry definition and mapping; do not force a source into a misleading existing class.

## 3. Claim record

```yaml
claim_id: CLM-000001
claim_text: ""
subject_entity_id: ""
predicate: ""
object_or_value: ""
claim_state: O|C|I|H|U|X
scope:
  time: ""
  geography: ""
  product: ""
evidence_links:
  supports: []
  contradicts: []
calculation_id: ""
confidence_band: low|moderate|high|very-high
confidence_score_internal: 0-100
materiality: low|medium|high|critical
last_reviewed_at: ""
review_status: draft|verified|challenged|retracted
limitations: []
```

## 4. Confidence model

Use confidence to prioritize review, not to manufacture certainty.

```text
Raw confidence =
  0.25 SourceAuthority
+ 0.20 Directness
+ 0.15 Independence
+ 0.15 Recency
+ 0.15 Reproducibility
+ 0.10 ScopeCompleteness

Adjusted confidence = 100 × Raw confidence × ResolutionFactor × ContradictionFactor
```

Score each component from 0 to 1. Use:

- `ResolutionFactor`: 1.0 exact entity; 0.75 probable; 0.4 ambiguous; 0 if unresolved.
- `ContradictionFactor`: 1.0 none found after a real check; 0.7 unresolved conflict; 0.3 strong conflict.

Bands:

- 0–39: low
- 40–64: moderate
- 65–84: high
- 85–100: very high

Only E3+ direct observations can normally reach high confidence. Inferences should rarely be labeled very high even when their inputs are strong.

## 5. Triangulation rules

Triangulation requires source independence, not three pages repeating one press release.

For a material claim seek:

1. one primary or official source;
2. one independent source or authorized measurement;
3. one temporal comparison or disconfirming check.

Record syndication and common-origin relationships. Treat reposts, copied reviews, mirrored databases, press-release pickups, and shared datasets as one origin.

## 6. Temporal rules

- Store **event time**, **publication time**, **valid time**, and **retrieval time** separately.
- A current page can describe an old event; a recent article may repeat an obsolete fact.
- For web changes, preserve the before/after source and first-seen/last-confirmed times.
- A missing historical snapshot means `Unknown`, not “the page did not exist.”
- Compare equivalent time windows; state partial-period data.

## 7. Sentiment evidence

Sentiment is a model output, not an observed emotion.

Required fields:

```yaml
text_unit_id: ""
source_id: ""
language: ""
topic: ""
stance_target: ""
sentiment_label: positive|neutral|negative|mixed|uncertain
model_or_coding_method: ""
model_version: ""
human_validated_sample: ""
sampling_frame: ""
platform_bias_notes: ""
```

Never report “customers are 40% negative” when the sample is actually “40% of collected comments were classified as negative.” Report the denominator, window, sources, sampling limits, and validation accuracy.

## 8. Review and complaint evidence

- Separate star rating from text theme, recency, location, product, and company response.
- Detect likely duplicates; do not remove adverse records merely because they are inconvenient.
- Do not infer fraud, identity, or authenticity without platform verification or strong evidence.
- Report complaint prevalence within the collected sample, not the customer population.
- A BBB complaint or forum post is an allegation/experience report, not an adjudicated fact.

## 9. Security evidence

Security observations require especially narrow language:

| Unsafe claim | Evidence-safe version |
| --- | --- |
| “They were breached” | “The domain appears in an authorized breach-notification result as of [date]; scope and current risk are unconfirmed.” |
| “They have no MFA” | “MFA status is not publicly verifiable.” |
| “This version is vulnerable” | “A passive fingerprint suggests version X; the version and exploitability were not validated.” |
| “Their endpoint is exposed” | “A passive index listed service Y at time Z; no active connection was attempted.” |
| “Employee credentials are on the dark web” | Do not make or store this claim from unverified dumps. Use an authorized domain-monitoring process. |

Do not put sensitive technical details in sales outreach. Route privately to a published security contact with minimal proof and no exploitation.

## 10. Financial evidence

Every financial number is one of:

```text
R = Reported by target/filing
M = Measured from authorized data
B = External benchmark
A = Explicit assumption
C = Calculated
```

Show the tag next to each input. A model made entirely from B/A inputs is a scenario, never an estimated loss stated as fact.

## 11. Contradiction protocol

For each high-materiality claim:

1. write the strongest plausible alternative;
2. search for disconfirming evidence;
3. compare source authority, scope, and time;
4. preserve both evidence paths;
5. narrow, downgrade, mark contradicted, or retract the claim;
6. state what new evidence would resolve it.

## 12. Reproducibility packet

Each audit should retain:

- scope contract and registry version;
- tool/source versions where relevant;
- queries or API request templates without secrets;
- retrieval timestamps;
- normalized source/claim ledgers;
- calculations and assumptions;
- decision/elimination log;
- human-review record;
- limitations and failed/blocked retrievals.

API keys, cookies, tokens, and credentials never enter the packet.

## 13. Evidence-use matrix

Evidence level and claim type jointly determine use. “Two sources” never substitutes automatically for an official source, and an official page is not required for every reproducible corpus calculation.

| Claim type | Report use | Outreach use |
| --- | --- | --- |
| Official/company fact `[O]` | Current E3; E4/E5 for material decisions | Current E3+ with exact scope and role relevance |
| Reproducible public-corpus measure `[C]` | Material source items E2+ from at least two independent origins; declared query, window, denominator, dedupe, sampling limits, and reproducible calculation | Allowed as a calculated sample observation after human validation and defamation/privacy review; wording must describe the collected sample, not the population |
| Deterministic historical calculation `[C][DETERMINISTIC_CALCULATION]` | Reconciled inputs and formula; input evidence governs confidence | Allowed when inputs and scope are current/relevant; never imply causality |
| Financial projection `[C][ESTIMATE or SCENARIO]` | Tagged inputs, formula, range, sensitivity, overlap, and limitations | Only as a labeled scenario or break-even threshold anchored to an eligible factual/calculated hook |
| Inference `[I]` | Supported claims, mechanism, strongest alternative, and disconfirming check | Only adjacent to an eligible hook, explicitly bounded, and never as the subject-line fact |
| Hypothesis `[H]` | Testable, falsifiable, metric/guardrail/stop rule | Only as a permission-based diagnostic question anchored to an eligible hook |
| Complaint/allegation | E2 bounded experience/allegation or a reviewed aggregate calculation; never adjudicated fact | Individual allegations are excluded; aggregate themes require the public-corpus rule and must not be weaponized |
| Security signal | Narrow passive observation with technical sensitivity controls | Excluded from sales outreach; use a separate responsible-disclosure route when warranted |
| Unknown `[U]` or contradicted `[X]` | State explicitly; preserve reason/evidence | Never a factual hook |

E0/E1 are hard-blocked from publication and activation. No matrix row overrides law, source rights, privacy, security, defamation, suppression, or human-review gates.
