# Scoring and Prioritization

## 1. Why score

Scoring makes triage reproducible; it does not turn uncertain public evidence into certainty. Preserve raw evidence, component scores, reviewer notes, and overrides.

## 2. Finding quality score

Score 0–5:

| Dimension | 0 | 3 | 5 |
| --- | --- | --- | --- |
| Evidence | no support | credible single source/corroborated secondary | E4–E5, reproducible and current |
| Entity resolution | unresolved | probable match | exact legal/domain/person-role match |
| Recency | obsolete/unknown | relevant but aging | current for the decision/window |
| Directness | rumor | proxy | direct observation/measurement |
| Independence | copied origin | uncertain origins | independent origins |
| Contradiction check | none | basic check | strong alternatives actively tested |

```text
FindingQuality = weighted mean of dimensions × 20
```

Recommended weights: Evidence 30%, Entity resolution 15%, Recency 15%, Directness 15%, Independence 10%, Contradiction 15%.

## 3. Opportunity priority score

Score 0–5:

| Dimension | Weight | Meaning |
| --- | ---: | --- |
| Evidence strength | 15% | quality of the underlying finding |
| Economic materiality | 15% | plausible contribution margin, cash, risk, or capacity effect |
| Service fit | 15% | ability of the offered service to address the mechanism |
| Executive relevance | 10% | connection to named role and public priority |
| Strategic differentiation | 10% | moves beyond table-stakes improvement |
| Time to useful evidence | 10% | how quickly a test can confirm/refute value |
| Reversibility | 5% | ability to stop or recover |
| Capacity fit | 5% | likely operational feasibility |
| Urgency | 5% | cost/risk of delay or time-bound window |
| Novelty without intrusiveness | 5% | non-obvious but appropriate |
| Data sufficiency | 5% | inputs available to size or test |

```text
BaseOpportunityScore = weighted sum × 20
RiskAdjustedPriority = BaseOpportunityScore × ConfidenceFactor × (1 − RiskPenalty)
```

Use ConfidenceFactor 0.4/0.6/0.8/0.95 for low/moderate/high/very-high evidence. RiskPenalty ranges 0–0.6 and includes legal, privacy, security, execution, brand, and dependency risk.

Hard gates override the numeric score:

- unresolved identity;
- prohibited source/use;
- sensitive-personal-data dependence;
- exploit or credential dependence;
- misleading financial claim;
- no plausible service-to-mechanism fit.

## 4. Authority score

Use this outreach suitability rubric. Positive terms score 0 = absent/poor and 5 = strong. Penalty terms score 0 = none and 5 = severe.

```text
AuthorityScore =
  EvidenceSpecificity
+ BusinessRelevance
+ EconomicMechanismClarity
+ Novelty
+ UsefulnessOfNextStep
+ RespectfulBoundary
− Intrusiveness
− UnsupportedCertainty
− RequiredReadingFriction
```

An outreach draft is ineligible unless all hard gates pass:

- `EvidenceSpecificity ≥ 3` and every factual hook meets the evidence-use matrix;
- `BusinessRelevance ≥ 3` for the recipient's verified remit;
- `RespectfulBoundary ≥ 4`;
- `Intrusiveness ≤ 1`;
- `UnsupportedCertainty ≤ 1`;
- `RequiredReadingFriction ≤ 2`;
- `AuthorityScore ≥ 18`;
- jurisdiction, contact provenance, suppression, and human approval gates pass.

The score never overrides a legal, privacy, security, evidence, or opt-out block.

## 5. Lead qualification score

Lead qualification is company/opportunity fit—not personal profiling.

| Dimension | Points |
| --- | ---: |
| target fits chosen industry/region/size constraints | 0–15 |
| public signal maps to offered service | 0–20 |
| evidence quality | 0–15 |
| plausible materiality | 0–15 |
| timing/trigger | 0–10 |
| responsible executive role resolved | 0–10 |
| lawful contact route and basis | 0–10 |
| small useful diagnostic can be offered | 0–5 |

Suggested bands:

- 80–100: research-complete, human outreach review;
- 60–79: nurture or resolve missing evidence;
- 40–59: monitor;
- under 40: archive/disqualify.

Do not award points for personal wealth, family information, protected traits, vulnerability, or private contact details.

## 6. PR/narrative scoring

For each narrative theme:

```text
NarrativePressure = Prevalence × Velocity × SourceDiversity × Credibility
                  × StakeholderRelevance × Persistence × Propagation
```

Score components on defined ordinal scales and report raw counts. Include response quality and rebuttal evidence separately; do not label a narrative “misinformation” merely because it is adverse.

Suggested propagation states:

- N0 isolated;
- N1 repeated within one source/community;
- N2 crosses communities/platforms;
- N3 reaches trade media/influencers;
- N4 reaches mainstream/regulatory/investor discourse.

## 7. Technical-debt scoring

Passive signals cannot establish exploitability. Score the business diagnostic opportunity:

```text
TechnicalPriority = Evidence × AssetCriticality × BusinessDependency
                  × Persistence × PropagationPotential
                  × (1 − ExistingControlEvidence)
```

Use `Unknown` for unobservable controls. Do not turn absence of public proof into proof of absence.

## 8. Economic model confidence

| Model class | Inputs | Label |
| --- | --- | --- |
| M0 | no volume/value inputs | not estimable |
| M1 | benchmarks/assumptions only | illustrative scenario |
| M2 | one reported/measured anchor plus benchmarks | anchored scenario |
| M3 | several target-reported/measured inputs | planning estimate |
| M4 | reconciled internal financial/operational data | decision model |
| M5 | controlled result/finance-confirmed | validated realized value |

External prospect audits are normally M0–M2. Outreach should state ranges only when useful and clearly labeled.

## 9. Portfolio rules

Do not return a single ranked list that favors quick fixes. Create horizons:

| Horizon | Typical state | Objective |
| --- | --- | --- |
| Now | C0–C1 | resolve uncertainty and capture low-risk value |
| Next | C1–C2 | coordinate a material improvement |
| Build | C2–C3 | change architecture/process/governance |
| New curve | C4 | test a new unit of value/category thesis |

Select at least one measurement-first option when evidence is below E4 or model class below M3.

## 10. Override log

```yaml
item_id: ""
automated_score: 0
reviewer_score: 0
override_reason: ""
evidence_added_or_removed: []
risk_gate: ""
reviewer: ""
reviewed_at: ""
```

No silent score changes.
