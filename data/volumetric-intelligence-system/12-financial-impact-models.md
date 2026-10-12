# Financial Impact Models

## 1. Core rule

A visible gap is not automatically a financial loss. Build a mechanism from a measurable unit to contribution margin, cash, capacity, or risk. Use target-reported or authorized measured inputs where possible. Otherwise show low/base/high scenarios and the missing inputs.

## 2. Input labels

| Tag | Source |
| --- | --- |
| R | reported by the target, filing, or regulator |
| M | measured from authorized internal/first-party data |
| B | external benchmark with comparable context |
| A | explicit analyst assumption |
| C | calculated from tagged inputs |

Example: `Monthly visits = 80,000 [B/A]`, not `Monthly visits = 80,000`.

## 3. Scenario convention

```yaml
currency: CAD
period: annual
model_class: M0|M1|M2|M3|M4|M5
result_class: REPORTED_OR_MEASURED|DETERMINISTIC_CALCULATION|ESTIMATE|SCENARIO
low: {}
base: {}
high: {}
attribution_factor: [0, 1]
realization_factor: [0, 1]
confidence_band: low|moderate|high|very-high
excluded_effects: []
overlap_group: ""
```

Model classes M0–M5 are defined in `11-scoring-prioritization.md`. The high case is plausible, not aspirational. Use sensitivity analysis on the two most uncertain inputs.

## 4. Conversion-gap contribution

```text
Incremental customers = Eligible visits
                      × (Proposed conversion − Baseline conversion)
                      × Lead-to-customer rate

Annual contribution = Incremental customers
                    × Contribution margin per new customer
                    × Realization factor
                    × Attribution factor
```

If conversion or traffic is unobserved, mark M1 scenario. Do not substitute a benchmark without showing it.

## 5. Lead-form friction

```text
Recovered qualified leads = Form starts
                          × (Proposed completion − Baseline completion)
                          × Qualification rate

Value = Recovered qualified leads
      × Close rate
      × Contribution margin per customer
```

Measure completion and lead quality together; shorter forms can increase low-quality volume.

## 6. Paid-media waste

```text
Addressable inefficient spend = Annual media spend
                              × Inefficient-spend share
                              × Addressable share

Cash-saving case = Budget actually removed
                 − termination/transition cost
                 − incremental measurement cost

Reinvestment case = Incremental conversions attributable to redeployment
                  × contribution per conversion
                  − incremental creative/operating cost
```

Do not count reallocated media dollars as savings: the spend continues. Keep cash reduction and reinvestment contribution as mutually exclusive cases unless the budget is split explicitly. Public ad libraries show creative/activity signals, not spend efficiency for most advertisers. Without account data, output a diagnostic scenario, not “ad waste.”

## 7. Organic demand gap

```text
Incremental qualified visits = Search demand
                             × attainable CTR/share
                             × content coverage
                             × ramp factor

Contribution = Incremental qualified visits
             × conversion rate
             × contribution margin per conversion
```

Deduplicate branded and non-branded demand; model ranking probability and time-to-rank. Search volume estimates are vendor estimates, not census counts.

## 8. Churn reduction

```text
Retained accounts = Active accounts
                  × (Baseline churn − Proposed churn)

Retained contribution = Retained accounts
                      × Remaining-period contribution per account
                      × Realization
```

Do not multiply by full customer LTV if another model already includes future-period retention; state gross vs net revenue retention.

## 9. Activation/onboarding improvement

```text
Additional activated customers = New customers
                               × (Proposed activation − Baseline activation)

Value = Additional activated customers
      × Activation-to-retention lift
      × Contribution margin over chosen horizon
```

Cost savings from automation are modeled separately unless labor is truly removed or redeployed.

## 9A. CAC, contribution LTV, LTV/CAC, and payback

Use one acquisition cohort, attribution rule, currency, and observation window throughout.

```text
CAC = Attributable acquisition cost for cohort
    / Acquired customers in the same cohort

Contribution LTV = Σ expected cohort contribution_t / (1 + discount rate)^t

LTV/CAC = Contribution LTV / CAC

CAC payback period = first period where cumulative realized cohort contribution
                     ≥ cohort acquisition cost
```

State whether CAC is blended, channel-specific, new-logo, or marginal. Acquisition cost includes the defined media, sales, tooling, agency, incentive, and labor components consistently. Acquired customers—not leads or signups—must use the chosen cohort definition.

Contribution LTV is net of cost to serve, fulfillment, support, refunds/credits, payment costs, and expected retention/churn over the chosen horizon. Do not mix revenue LTV with contribution CAC economics.

The shortcut below is illustrative only when average revenue, contribution margin, and churn are approximately stationary and the timing convention is explicit:

```text
Illustrative contribution LTV ≈ ARPA per period × contribution margin / churn per period
```

Use survival/cohort curves for non-stationary retention, contractual terms, expansion, or censoring. Do not compare LTV from mature cohorts with CAC from a different period/channel. Show observation maturity, payback censoring, and sensitivity to retention.

## 10. Workflow automation and capacity

```text
Gross hours released = Annual transaction volume
                     × Minutes saved per transaction / 60
                     × Adoption

Capacity value = Gross hours released
               × Loaded labor cost per hour
               × Realizable/redeployable share

Net annual value = Capacity value
                 + Avoided error/rework contribution
                 − Recurring software/operations cost
```

Do not call all time saved “cash savings.” Label it capacity unless staffing/vendor cost is actually avoided.

## 11. Support/service cost

```text
Avoided contacts = Annual contacts
                 × Deflection rate
                 × Quality-adjustment factor

Cost value = Avoided contacts × Fully loaded cost per resolved contact
```

Quality checks: repeat contact rate, customer satisfaction, escalation, accessibility, and error severity.

## 12. Error and rework

```text
Annual error cost = Unit volume × Error rate × Cost per error
Avoided cost = Annual error cost × Preventable share × Realization
```

Cost per error can include labor, refunds, penalties, lost contribution, and recovery—but remove overlap.

## 13. Pricing-power scenario

```text
Incremental revenue = (Proposed price × Proposed units)
                    − (Baseline price × Baseline units)

Incremental contribution = Incremental revenue
                         − change in total variable/service cost
                         − transition/churn cost
```

Elasticity relationship:

```text
%ΔQuantity ≈ Elasticity × %ΔPrice
```

Elasticity is segment- and context-specific. Public competitor prices do not reveal target elasticity. Recommend a controlled price/packaging test.

## 14. Upsell/cross-sell

```text
Incremental contribution = Eligible accounts
                         × Incremental attach rate
                         × Contribution per add-on
                         × Realization
```

Subtract cannibalization, discounting, sales effort, and added support burden.

## 15. Vendor/supply concentration

```text
Expected annual loss = Probability of disruption
                     × Duration
                     × Contribution at risk per period
                     × Unmitigated exposure

Mitigation value = Baseline expected loss − Post-control expected loss
```

Use scenario probabilities, not false frequencies, when data is sparse. Include dual-sourcing or redundancy cost.

## 16. Performance/availability

```text
Expected contribution loss = Affected sessions/transactions
                           × Failure or abandonment delta
                           × contribution per successful transaction
```

Public performance tests are samples. Do not infer annual loss without representative traffic, conversion, geography, device, and incident duration.

## 17. Reputation/narrative scenario

There is no universal dollar conversion from sentiment or SOV.

Use an exposure model only with an explicit causal path:

```text
At-risk contribution = Exposed qualified demand/accounts
                     × behavior-change scenario
                     × contribution per unit
                     × attribution
```

Prefer a measurement plan: branded-search trend, direct traffic, win/loss reasons, cancellation themes, referral rate, share-of-search, survey trust, and response-time experiment.

## 18. PR share-of-voice opportunity

```text
Comparison set = target + up to three selected comparators
SOV = target qualifying mentions / all qualifying comparison-set mentions
```

SOV is an attention metric, not revenue. A commercial scenario additionally needs outlet relevance, audience overlap, message penetration, referral/brand-search lift, conversion, and margin.

## 19. Security and compliance risk

Use expected-loss ranges only after authorization and appropriate expertise:

```text
Expected annual loss = Event probability range × Impact range
Mitigation value = reduction in expected loss − control cost
```

Passive observations cannot reliably determine event probability. Public outreach should not quantify breach loss from an unverified fingerprint.

## 20. Cost of inaction

```text
COI(t) = Lost contribution
       + Incremental operating cost
       + Expected risk cost
       + Opportunity delay cost
       − avoided intervention cost
```

Model delay over a declared period. Do not add overlapping conversion, acquisition, and revenue effects.

## 21. ROI, NPV, and payback

```text
ROI = (Realized benefit − Total cost) / Total cost

NPV = Σ from t=0 to T of CashFlow_t / (1 + discount rate)^t

Payback month = first month cumulative net cash flow ≥ 0
```

State whether benefit is cash, contribution margin, capacity, avoided expected loss, or strategic option value.

## 22. Break-even

```text
Required incremental units = Total intervention cost / contribution per incremental unit

Required conversion lift = Total intervention cost
                         / (eligible volume × contribution per conversion)
```

Break-even is often the most credible outreach number because it asks whether a small lift would justify a diagnostic.

## 23. Double-counting map

Assign overlapping models to an `overlap_group`:

- acquisition/conversion/content/PR demand;
- retention/support/reputation;
- labor/automation/capacity;
- availability/conversion/service failure;
- pricing/upsell/revenue expansion.

Use the maximum justified effect within a group or build one integrated funnel model. Do not sum independent-looking estimates that affect the same customers.

## 24. Financial impact matrix

| Gap / blind spot | Evidence | Mechanism and unit | Loss/value range | Model class | Proposed solution | Investment range | ROI/payback scenario | Key missing inputs |
| --- | --- | --- | ---: | --- | --- | ---: | --- | --- |
|  |  |  | not estimable or L/B/H | M0–M5 |  | L/B/H |  |  |

## 25. Model review checklist

- units and currency consistent;
- period consistent;
- reported vs measured vs benchmark vs assumption labeled;
- low/base/high monotonic and plausible;
- gross revenue not confused with contribution or cash;
- attribution and realization applied;
- implementation and recurring cost included;
- time-to-value and ramp included;
- overlap/double count checked;
- sensitivity shown;
- downside and stop rule shown;
- scenario language used in outreach.
