# Investigation Grammar

## 1. Root instruction

```text
INVESTIGATE(
  target,
  executive?,
  industry,
  geography,
  time_window,
  offered_services,
  mode,
  authorization
)
→ resolve
→ plan sources
→ collect passively
→ normalize
→ corroborate
→ analyze with LAKA
→ generate alternatives
→ model ranges
→ rank
→ report
→ prepare outreach and CRM record
→ review
```

Missing target fields are not permission to guess. Produce an intake checklist and reusable research plan.

## 2. Entity resolution

```ebnf
Organization = LegalName, TradingNames, CanonicalDomain,
               [ RegistryID ], [ Ticker ], [ Parent ], [ Subsidiaries ],
               Headquarters, OperatingRegions ;

Executive    = PublicName, PublicRole, OrganizationLink,
               EffectiveDates, PublicBusinessSources ;

Competitor   = Organization, ComparisonReason, SimilarityDimensions,
               InclusionEvidence ;
```

Resolve the company before collecting. Match at least two of domain, legal name, registry identifier, headquarters, ticker, or official profile. For a named person, match the role and company using official or reputable public business sources. Do not merge people on name alone.

### Competitor selection grammar

```text
Candidate pool = direct substitutes
               | same customer/job-to-be-done
               | same geography/price band
               | adjacent entrants with plausible substitution

Up to three primary comparators = maximize comparability across:
  customer + offer + geography + scale + channel + business model
```

If three firms are not truly comparable, disclose the mismatch and use fewer. Archetypes are optional labels/diversity aids, not a quota; three genuine direct rivals may all be selected.

## 3. Question grammar

Every research question contains:

```yaml
question_id: Q-0001
decision_supported: ""
subject: ""
property_or_relationship: ""
time_window: ""
geography: ""
comparison: "baseline|competitor|prior period|benchmark|none"
claim_threshold: ""
disconfirming_evidence: ""
allowed_sources: []
excluded_methods: []
stop_condition: ""
```

Good questions can be falsified. Replace “Does the company have bad PR?” with “Within the declared 12-month window, what complaint themes recur across at least two independent source types, and how did company responses differ?”

## 4. Source-plan grammar

```text
Question
→ preferred primary sources
→ independent corroboration
→ historical comparison
→ competitor equivalent
→ missing-evidence route
→ stop rule
```

Source order:

1. government, regulator, court, standards body, official registry;
2. company-controlled source, filing, status page, repository, published policy;
3. platform-provided transparency source or first-party review record;
4. reputable reporting, trade publication, or research organization;
5. public community discussion or user-generated review;
6. aggregator/snippet used only as a lead to the original.

Company-controlled sources are authoritative about what the company publicly claims, not proof that the claim is true.

## 5. Nine domain modules

| Code | Module | Unit of analysis |
| --- | --- | --- |
| P1 | Technical and passive OSINT | public asset, configuration signal, dependency, document, change |
| P2 | PR, reputation, narrative | mention, story, review, theme, response, outlet |
| P3 | Marketing and demand | creative, keyword/topic, content item, journey step, conversion signal |
| P4 | Blind spots and assets | unused channel, audience, content, data, partnership, region, offer |
| P5 | Microeconomics | unit, price, volume, variable cost, acquisition, retention, capacity |
| P6 | Competitors | like-for-like feature, offer, narrative, channel, performance proxy |
| P7 | Macroeconomics | external driver, exposure path, lag, leading indicator, scenario |
| P8 | Financial impact | gap, mechanism, inputs, range, attribution, timing, confidence |
| P9 | Authority and CRM | relevant finding, offer match, decision-maker, compliant contact route |

Each module uses the same evidence and LAKA grammar. This makes cross-domain findings comparable.

## 6. Volumetric decomposition

For each material signal, expand across these dimensions:

```text
Entity × Asset × Stakeholder × Journey Stage × Channel × Geography
× Time × Event × Narrative × Metric × Source Type × Evidence State
```

Then apply the ten internal variables and five change states. Use all fourteen change variables on signals that could affect the recommendation or dollar model.

### Entity alternatives

`parent | subsidiary | brand | product | location | executive | board | employee role | customer segment | partner | supplier | investor | regulator | association | competitor`

### Asset alternatives

`domain | site | app | API | repository | document | dataset | ad | landing page | email flow | review profile | listing | press room | event | patent/trademark | policy | price | offer | job post | status page`

### Stakeholder alternatives

`buyer | user | champion | approver | blocker | employee | applicant | partner | vendor | regulator | investor | journalist | community`

### Journey alternatives

`unaware | problem-aware | solution-aware | comparison | evaluation | purchase | onboarding | adoption | support | renewal | expansion | advocacy | exit`

### Time alternatives

`current snapshot | prior snapshot | pre-event | event | post-event | seasonal | launch cycle | reporting period | rolling trend | leading indicator | lagging outcome`

## 7. Symptom-to-hypothesis branching

Never jump from signal to diagnosis. Generate at least these hypothesis families:

| Family | Example explanation |
| --- | --- |
| Measurement artifact | collection bias, missing pages, source outage, changed taxonomy |
| Demand | intent shifted, segment changed, seasonality, category decline/growth |
| Offer | value proposition, packaging, pricing, proof, differentiation |
| Acquisition | targeting, creative fatigue, channel mix, discoverability |
| Conversion | message match, trust, usability, accessibility, latency, form friction |
| Retention | activation, value realization, support, product reliability |
| Operations | manual work, queue, ownership, capacity, vendor dependency |
| Technology | architecture, performance, observability, integration, technical debt |
| Reputation | service failure, expectation gap, narrative vacuum, slow response |
| Competitive | entrant, imitation, bundling, distribution advantage, switching |
| Macro | rates, inflation, labor, regulation, currency, supply chain |
| Intentional strategy | premium positioning, controlled demand, channel exit, focus |

Actively seek evidence that the apparent “gap” is intentional or immaterial.

## 8. Intervention branching

For each preferred hypothesis, generate state-distinct alternatives:

| Change state | Intervention pattern |
| --- | --- |
| C0 | observe, preserve, benchmark, instrument |
| C1 | clarify, tune, repair, add one missing control, run one test |
| C2 | coordinate campaign/process redesign, integrate tools, repackage offer |
| C3 | change architecture, operating model, governance, incentives, data loop |
| C4 | redefine category, beneficiary, unit of value, delivery model, or demand curve |

Also generate `do nothing`, `defer until trigger`, `buy`, `build`, `partner`, and `stop/retire` where relevant.

## 9. Elimination record

```yaml
option_id: OPT-0001
mechanism: ""
change_state: C0|C1|C2|C3|C4
evidence_fit: 0-5
strategic_fit: 0-5
urgency: 0-5
reversibility: 0-5
capacity_fit: 0-5
time_to_useful_evidence: ""
estimated_cost_range: [low, base, high]
estimated_value_range: [low, base, high]
risk: 0-5
dependencies: []
decision: keep|defer|discard|needs-data
reason: ""
```

Do not discard a high-value structural option merely because it is slow; route it to a portfolio horizon while selecting a smaller near-term test.

## 10. Immediate-authority compression

The full research volume is compressed into:

```text
One decision-maker
+ One public business priority
+ One non-obvious evidence chain
+ One bounded economic mechanism
+ One reversible diagnostic or intervention
+ One permission-based CTA
```

The outreach message must not expose the full surveillance trail. Use the minimum relevant evidence and link to public sources when helpful.

## 11. Unknown-handling grammar

```text
Unknown(input)
→ state why it matters
→ identify lawful source or question that could resolve it
→ show which conclusions depend on it
→ keep model as range or not estimable
→ never fill with an uncited benchmark silently
```

## 12. Audit run state machine

```text
DRAFT_SCOPE
→ RESOLVED_TARGET
→ APPROVED_SOURCE_PLAN
→ COLLECTING
→ NORMALIZING
→ ANALYZING
→ HUMAN_REVIEW
→ REPORT_READY
→ OUTREACH_READY
→ ARCHIVED_OR_MONITORED
```

Any policy, privacy, identity, or evidence failure moves the run to `BLOCKED_REVIEW`.
