# LAKA Core Grammar

## 1. The four-layer engine

LAKA is implemented here as four connected layers rather than one flat grid.

### Layer A — Change states

| Code | State | Meaning | Audit question |
| --- | --- | --- | --- |
| C0 | Baseline | Current/default state; no meaningful change | What exists now and how does it normally behave? |
| C1 | Minor Change | Local, low-depth adjustment; limited dependencies | What can improve through tuning or one-step repair? |
| C2 | Major Change | Material change across several components or outcomes | What requires coordinated redesign or meaningful investment? |
| C3 | Structural Change | Rules, architecture, incentives, ownership, or feedback loops change | What must be rebuilt at the system level? |
| C4 | Paradigm Change | Unit of value, category, business model, or governing assumption changes | What new demand curve makes the old comparison less relevant? |

These are not maturity grades. A C4 idea is not automatically better than a C1 intervention. Selection depends on evidence, fit, urgency, reversibility, capacity, and time-to-useful-evidence.

### Layer B — Internal system variables

| Code | Variable | Definition | Diagnostic prompt |
| --- | --- | --- | --- |
| S1 | Object | What is acted upon | What entity, asset, message, process, or relationship changes? |
| S2 | Conditions | Operating circumstances | Under what market, technical, temporal, geographic, or regulatory conditions? |
| S3 | Actions | What the system does | What actions create, move, transform, measure, or stop value? |
| S4 | Tools | Mechanisms | Which human, software, channel, model, contract, or machine performs the action? |
| S5 | Resources | Required inputs | What information, people, capital, energy, permission, time, or assets are needed? |
| S6 | Outcomes | Produced states | What measurable output or outcome results? |
| S7 | Feedback | Learning and control | How does the result change the next decision or system state? |
| S8 | Constraints | Limits | What limits performance, legality, adoption, reliability, or scale? |
| S9 | Value | Beneficiary and benefit | For whom is value created, of what type, and at whose cost? |
| S10 | Failure Mode | Breakdown | How does the system fail, become misleading, or create harm at this state? |

The standard structural matrix is `10 variables × 5 change states = 50 cells`.

### Layer C — Fourteen change variables

| Code | Variable | Core question | Useful measures |
| --- | --- | --- | --- |
| D1 | Magnitude | How much change? | absolute delta, percentage delta, severity |
| D2 | Rate | How quickly? | change per day/week/quarter |
| D3 | Direction | Moving toward what? | improving, degrading, diverging, converging |
| D4 | Scope | How broadly? | entities, teams, regions, products, channels affected |
| D5 | Depth | How fundamentally? | surface symptom through governing rule |
| D6 | Duration | For how long? | transient, seasonal, persistent, permanent |
| D7 | Frequency | How often? | event count per period |
| D8 | Acceleration | Is the rate changing? | second difference, slope change |
| D9 | Variability | How consistent or unpredictable? | range, variance, coefficient of variation |
| D10 | Detectability | How visible or measurable? | signal latency, observability, false-negative risk |
| D11 | Reversibility | Can it be undone? | recovery time, switching cost, data persistence |
| D12 | Propagation | How does it spread? | dependency paths, affected nodes, time to spread |
| D13 | Amplification | What increases or dampens it? | multipliers, network effects, feedback gain |
| D14 | Accumulation | What builds over time? | backlog, technical debt, reputation memory, compounding value |

For every critical feature, opportunity, or risk: evaluate all fourteen variables; record `N/A` with a reason; and test baseline, boundary, contradiction, and failure states.

### Layer D — 6×6×6 expansion and execution lens

#### Interrogatives

`Who | What | When | Where | Why | How`

#### Relational modifiers

`Direction | Scope | Depth | Duration | Frequency | Reversibility`

#### Execution impact

| Code | State | Permission rule in this system |
| --- | --- | --- |
| I1 | Read-only | Public-source retrieval and passive observation; default allowed |
| I2 | Verify | Recheck, corroborate, calculate, or reproduce without changing target state; default allowed |
| I3 | Local change | Create local notes, models, reports, and exports; allowed within project scope |
| I4 | Remote/persistent change | Save externally, update CRM, post, email, or mutate remote history; explicit authorization and human review required |
| I5 | Destructive change | Delete, overwrite, mass-contact, disrupt, exploit, or irreversibly alter; blocked unless separately and explicitly authorized for a legitimate administrative task |
| I6 | Security/policy boundary | Authentication, credentials, protected systems, sensitive data, policy exceptions; stop and route to an authorized specialist |

The query engine can form `6 × 6 × 6 = 216` first-order lenses. In passive research, most valid collection actions remain I1–I2. I3 is used for the audit artifact; I4 only for specifically approved CRM/outreach actions; I5–I6 are not prospecting tools.

## 2. Operators

| Symbol | Meaning | Example |
| --- | --- | --- |
| `+` | compose required parts | `Claim + Evidence + Time` |
| `×` | generate combinations | `Channel × Persona × Funnel Stage` |
| `→` | state transition | `manual intake → instrumented intake` |
| `\|` | mutually exclusive alternatives | `Observed \| Inferred \| Unknown` |
| `?` | optional only when justified | `Executive?` |
| `{…}` | repeat zero or more | `{Evidence}` |
| `[…]` | gate or constraint | `[E3+ required]` |
| `~` | inference, never direct fact | `slow response ~ queue friction` |
| `!` | contradiction or stop | `! recipient unresolved` |
| `@` | source/provenance pointer | `@source-0042` |
| `$[L,B,H]` | low/base/high financial range | `$[25k,60k,140k]` |
| `Δ` | measured change | `ΔSOV = current − prior` |

## 3. Primitive record grammar

```ebnf
Audit          = ScopeContract, Target, { ResearchModule }, EvidenceLedger,
                 OpportunityPortfolio, Report, QualityReview ;

Target         = Organization, [ Executive ], Industry, Geography, TimeWindow ;

ResearchModule = Question, SourcePlan, { EvidenceRecord }, { Claim },
                 LakaAnalysis, [ FinancialModel ], Limitations ;

EvidenceRecord = SourceID, SourceType, CanonicalURL, Publisher,
                 PublishedAt, RetrievedAt, Extract, ContentFingerprint,
                 CollectionMethod, AccessClass, EvidenceState ;

Claim          = ClaimID, Subject, Predicate, Object, TimeQualifier,
                 ClaimState, { EvidenceLink }, Confidence, Contradictions,
                 ReviewStatus ;

LakaAnalysis   = ChangeState, InternalVariable, { ChangeVariable },
                 Interrogative, RelationalModifier, ImpactState ;

Opportunity    = Observation, Counterfactual, Mechanism, Beneficiary,
                 Intervention, ValueRange, Assumptions, Risks,
                 ReversibleTest, StopRule ;

Outreach       = PublicBusinessContext, OneFinding, BusinessEffect,
                 CredibilityBoundary, UsefulOffer, PermissionCTA ;
```

## 4. Canonical intelligence sentences

### Observation

```text
[O] As of {retrieval time}, {source} shows {inspectable fact} within {scope/time window}. @source
```

### Calculation

```text
[C] Using {cited inputs} and {formula}, the result is {value/range}; rounding and exclusions: {notes}. @inputs
```

### Inference

```text
[I] {Evidence set} is consistent with {explanation}, but {alternative explanations} remain plausible.
```

### Hypothesis and test

```text
[H] If {mechanism} is material, then {small reversible change} should move {leading metric}
from {baseline} toward {threshold} within {window}; stop if {guardrail}.
```

### Financial scenario

```text
[C][SCENARIO] At {low/base/high inputs}, {formula} yields {range}. This is a calculated scenario, not reported revenue or guaranteed ROI.
```

### Outreach-safe finding

```text
I noticed {public business fact}. It may be creating {bounded business effect}; I have not seen your internal data.
I mapped a {small next step} that would confirm or reject it within {time/evidence threshold}.
```

## 5. Fifty-cell structural matrix

For each row, describe the state rather than simply listing an idea.

| Variable | C0 Baseline | C1 Minor | C2 Major | C3 Structural | C4 Paradigm |
| --- | --- | --- | --- | --- | --- |
| Object | current unit | locally adjusted unit | materially redesigned unit | relationships/rules become the object | unit of value/category changes |
| Conditions | normal operating context | one bounded condition changes | several important conditions change | governing conditions are redesigned | old conditions become irrelevant or inverted |
| Actions | current workflow | tune/repair one action | coordinate new action set | change decision rights and feedback | introduce a new value-producing behavior |
| Tools | incumbent tools | configure/augment | replace/integrate a major toolset | redesign architecture/tool ownership | tool becomes a new platform or market mechanism |
| Resources | current inputs | small incremental input | meaningful new capacity | reallocate capital/people/data rights | resource model changes or new resource is created |
| Outcomes | current result | local KPI lift | material multi-KPI change | durable system performance change | new category outcome/demand curve |
| Feedback | current reporting | add a signal/alert | closed-loop experimentation | feedback changes governance/incentives | learning system continuously redefines value |
| Constraints | current limits | remove one friction | overcome a material bottleneck | change policy/architecture/incentive constraint | constraint becomes advantage or disappears |
| Value | current beneficiary/value | more of same value | new value mix or segment | value distribution changes | new beneficiary or unit of value |
| Failure Mode | current breakdown | local side effect | coordination/capacity failure | systemic lock-in or transition failure | category error, adoption discontinuity, new externality |

## 6. Alternative-generation grammar

For each material symptom, generate at least one option from each intervention family:

```text
Observe only
Measure better
Clarify/communicate
Tune/configure
Remove friction
Automate
Reallocate
Redesign process
Redesign offer/pricing
Redesign architecture/governance
Partner/buy/build
Create new unit of value
Stop/retire
Defer with trigger
```

Cross each family with:

```text
Target stakeholder × journey stage × channel × time horizon × ownership × reversibility
```

Then deduplicate alternatives that share the same mechanism and outcome. Preserve discarded options and the elimination reason.

## 7. Selection grammar

```text
Eligible(option) = lawful
                 ∧ evidence-sufficient-for-next-step
                 ∧ service-fit
                 ∧ capacity-fit
                 ∧ risk-within-tolerance

Priority(option) = ExpectedValue
                 × Confidence
                 × StrategicFit
                 × Reversibility
                 × TimeToEvidenceFactor
                 ÷ ((1 + CostFactor)
                    × (1 + RiskFactor)
                    × (1 + DependencyLoad))
```

Use ordinal factors normalized from 0 to 1, or use the weighted model in `11-scoring-prioritization.md`. The additive constants prevent division by zero. Do not pretend the expression is a precise economic equation. A C1 test can outrank a C4 transformation.

## 8. Coverage grammar

```text
Applicable cells = Required cells − reasoned N/A cells
Coverage = completed applicable cells / applicable cells
Evidence coverage = claims with evidence / material claims
Contradiction coverage = material claims actively checked for disconfirming evidence / material claims
```

Do not count a blank as `N/A`. A reason is mandatory. Do not average away a failed security, privacy, evidence, or legal gate.

## 9. Change-memory grammar

Every monitoring event uses:

```yaml
entity: ""
property: ""
prior_state: ""
current_state: ""
delta: ""
first_seen: ""
last_confirmed: ""
source_ids: []
change_variables:
  magnitude: ""
  rate: ""
  direction: ""
  scope: ""
  depth: ""
  duration: ""
  frequency: ""
  acceleration: ""
  variability: ""
  detectability: ""
  reversibility: ""
  propagation: ""
  amplification: ""
  accumulation: ""
confidence: ""
```

The engine stores change as a first-class record. It does not silently overwrite prior observations.
