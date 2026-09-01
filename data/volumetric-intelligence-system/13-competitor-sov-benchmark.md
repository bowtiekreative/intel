# Competitor and Share-of-Voice Benchmark

## 1. Comparison contract

```yaml
target: ""
competitors:
  - name: ""
    comparison_reason: ""
window: ""
geography: ""
customer_segment: ""
offer_class: ""
currency_and_tax_basis: ""
source_types: []
outlet_tiers: []
languages: []
```

Use a common contract for all firms. Do not compare one company's global enterprise offer with another's local SMB offer.

## 2. Competitor archetypes

Use these as optional labels or diversity aids when useful; they are not quotas:

- direct incumbent;
- fast-growing challenger;
- low-cost/substitute;
- premium specialist;
- platform/bundle entrant;
- local/regional leader;
- non-consumption or internal workaround.

Select up to three comparators that are most useful to the decision, not simply the largest brands. Using three genuine direct rivals is valid. If fewer than three pass the comparison contract, use fewer and preserve the mismatch reason.

## 3. Benchmark dimensions

| Domain | Measure | Fact or proxy? |
| --- | --- | --- |
| Offer | jobs, segments, packaging, price unit, guarantees, proof | usually observable fact |
| Technology | public capabilities, integrations, status, performance samples, job-stack signals | mixture; label passive signals |
| Distribution | search coverage, ads, partners, marketplaces, local listings | observable within declared sources |
| Content | items/window, topic coverage, format diversity, update cadence | calculated inventory |
| PR | qualifying mentions, outlet tiers, topics, spokespersons, links | calculated sample |
| Reputation | rating distribution, themes, response rate/time, source coverage | sample/proxy |
| Economics | public price, contract shape, delivery promise, hiring/capacity signals | mostly proxy |
| Trajectory | launches, partnerships, hiring, narrative, geographic moves | evidence-backed inference |

## 4. Feature parity table

Use states:

`Yes | Partial | No public evidence | Not comparable | Unknown`

Never use blank or interpret “No public evidence” as absent.

| Capability | Target | Competitor A | Competitor B | Competitor C | Evidence/notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 5. Price normalization

Normalize:

- billing period;
- minimum seats/units;
- included volume;
- setup/implementation;
- usage overage;
- contract term;
- service/support level;
- geography/currency/tax;
- discounts visible to the public;
- feature/quality differences.

```text
Effective comparable price = (mandatory recurring + amortized mandatory one-time + expected usage charges)
                           / comparable service units
```

State when a custom quote makes comparison impossible.

## 6. Share-of-voice method

### Define a qualifying mention

A record counts only if it:

- falls in the time/geography/language window;
- resolves to the correct entity;
- meets source/outlet inclusion rules;
- is an original item or deduplicated syndication cluster;
- discusses the declared topic when topic SOV is used.

### Basic SOV

```text
Unweighted SOV_company = qualifying mentions_company
                       / qualifying mentions_all_companies
```

### Weighted attention index

```text
Weighted mentions = Σ OriginalityWeight × OutletRelevance × TopicRelevance × Prominence
Comparison set = target + up to three selected comparators
Weighted SOV = company weighted mentions / all comparison-set weighted mentions
```

Weights are analyst-defined proxies. Publish the rubric and sensitivity; do not call the result audience reach.

If the comparison-set denominator is zero, SOV is `not estimable`, not 0%.

### Narrative ownership

```text
Topic ownership(company, topic) = company qualifying topic mentions
                                / all qualifying mentions of that topic
```

Add stance/sentiment and spokesperson presence rather than treating all mentions as positive.

## 7. Outlet tiers

Define per industry before collection:

- T1: regulator/government/major mainstream/most influential trade outlets;
- T2: credible trade, regional, analyst, association and large niche outlets;
- T3: blogs, newsletters, podcasts, communities with relevant audiences;
- T4: low-authority aggregators or syndication—usually leads only.

Tier is relevance/authority for the target decision, not a universal status judgment.

## 8. Content velocity

```text
Velocity = original relevant assets / complete periods
Update rate = materially updated priority assets / priority assets / period
Coverage = demand clusters with adequate assets / priority demand clusters
```

Volume without relevance, originality, discoverability, or conversion path is not advantage.

## 9. Review benchmark

Compare by source, product/location, and period:

- rating distribution and count;
- verified/published status when supplied by platform;
- theme prevalence in the collected sample; when coding is multi-label, label it `Issue prevalence in collected items` and note that category shares can sum above 100%;
- median company response time where timestamps allow;
- response rate;
- resolution signal;
- recency and trend;
- sample and platform bias.

## 10. LAKA trajectory matrix

| Variable | Target C0 | Target likely transition | Competitor evidence | Strategic implication |
| --- | --- | --- | --- | --- |
| Object |  |  |  |  |
| Conditions |  |  |  |  |
| Actions |  |  |  |  |
| Tools |  |  |  |  |
| Resources |  |  |  |  |
| Outcomes |  |  |  |  |
| Feedback |  |  |  |  |
| Constraints |  |  |  |  |
| Value |  |  |  |  |
| Failure Mode |  |  |  |  |

## 11. Whitespace grammar

```text
Whitespace = important customer job
           × weak satisfaction across competitor set
           × feasible differentiating mechanism
           × credible proof path
           × sustainable economics
```

Generate whitespace across the five change states. The best C4 opportunity may change the unit of value rather than adding a competitor feature.

## 12. Comparison output

| Dimension | Target | Competitor A | Competitor B | Competitor C | Target advantage/gap | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

End with:

- three target advantages worth protecting;
- three high-confidence gaps;
- three unknowns that could reverse the conclusion;
- three whitespace tests;
- one “do not copy competitors” warning.
