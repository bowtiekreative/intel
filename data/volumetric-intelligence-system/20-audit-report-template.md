# 360° Volumetric Intelligence Audit

## Audit metadata

| Field | Value |
| --- | --- |
| Target company | `[TARGET_COMPANY]` |
| Canonical domain | `[TARGET_DOMAIN]` |
| Target executive / title | `[EXECUTIVE_NAME] — [EXECUTIVE_TITLE]` |
| Industry / vertical | `[INDUSTRY]` |
| Geographic scope / jurisdictions | `[REGION]` |
| Offered services | `[OFFERED_SERVICES]` |
| Audit as-of date | `[YYYY-MM-DD]` |
| Primary / comparison windows | `[START–END] / [START–END]` |
| Base currency / price year | `[CURRENCY] / [YEAR]` |
| Engagement / expansion | `[MODE] / [X-RAPID, X-STANDARD, X-DEEP]` |
| Run / registry version | `[RUN_ID] / [VERSION]` |
| QA status | `[DRAFT / PASS / PASS WITH LIMITATIONS / REVISE / BLOCK]` |

## Reading key

| Marker | Meaning |
| --- | --- |
| `[O]` | Direct observation |
| `[C]` | Deterministic calculation from identified inputs |
| `[I]` | Evidence-supported inference |
| `[H]` | Testable hypothesis |
| `[U]` | Unknown/not publicly verifiable |
| `[X]` | Contradicted/retracted |
| `E0–E5` | Canonical evidence level |
| `R / M / B / A / C` | Reported / measured / benchmark / assumption / calculated |
| `[L,B,H]` | Low/base/high scenario |

> This audit uses public, passive, non-invasive sources unless explicitly stated. It is not a penetration test, legal opinion, audited financial statement, or guarantee of results. Public evidence cannot establish private controls, internal costs, customer behavior, or executive intent without target-supplied evidence.

Template alternatives such as `[O/C/I/H]` mean **choose exactly one applicable claim state** in a completed report. Compound claim states are invalid; use a separate numeric result class such as `[C][SCENARIO]` when needed.

# Section 1: Executive Briefing & OSINT Digest

## 1.1 Decision briefing

**Primary diagnosis:** `[Separate the highest-confidence observation from interpretation.]`

**Highest-confidence opportunity:** `[Finding ID, mechanism, service fit, smallest useful test.]`

**Largest unresolved uncertainty:** `[Unknown and why it changes the decision.]`

**Recommended decision:** `[Measure / tune / redesign / defer / stop, plus evidence threshold.]`

## 1.2 Executive scorecard

| Domain | Current public signal | State / evidence | Materiality | Direction | Confidence | Next evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Digital footprint | `[ ]` | `[O/I][E#][SRC-]` | `[ ]` | `[↑/→/↓/Mixed]` | `[ ]` | `[ ]` |
| Technical debt | `[ ]` | `[O/I/H][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Security hygiene | `[ ]` | `[O/U][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| PR / reputation | `[ ]` | `[O/C/I][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Demand / acquisition | `[ ]` | `[O/C/I/H][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Unit economics | `[ ]` | `[C][ESTIMATE/SCENARIO][MOD-]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Competitive position | `[ ]` | `[O/C/I][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Macro / regulatory | `[ ]` | `[O/I/H][E#]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

## 1.3 Scope and entity resolution

| Entity | Resolved identity | Status | Effective date | Evidence | Ambiguity |
| --- | --- | --- | --- | --- | --- |
| Organization | `[ ]` | `[Exact/Probable/Ambiguous]` | `[ ]` | `[SRC-]` | `[ ]` |
| Canonical domain | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Parent / subsidiary | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Executive / role | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Product / geography | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |

## 1.4 Phase 1 — public technical and executive footprint

### Asset and dependency map

| Asset / dependency | Relationship | First seen | Last confirmed | Evidence | Level | Limitation |
| --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[Owned/Vendor/Shared/Former/Unknown]` | `[ ]` | `[ ]` | `[SRC-]` | `[E#]` | `[ ]` |

### Technical and IT-debt signals

| Finding | Public observation | Bounded interpretation | Strongest alternative | LAKA state | Confidence | Diagnostic |
| --- | --- | --- | --- | --- | --- | --- |
| `FND-` | `[O][E#]` | `[I/H]` | `[ ]` | `[C0–C4]` | `[ ]` | `[ ]` |

### Passive security hygiene

| Topic | Evidence-safe finding | State | Evidence | Sensitive handling | Route |
| --- | --- | --- | --- | --- | --- |
| Certificate / TLS history | `[ ]` | `[O/U]` | `[SRC-]` | `[Redacted/N/A]` | `[Normal/Disclosure]` |
| Existing public index | `[ ]` | `[O/U]` | `[SRC-]` | `[ ]` | `[ ]` |
| Authorized breach notification | `[Result or U]` | `[O/U]` | `[SRC-]` | `[No identity/credential content]` | `[ ]` |
| MFA / patch status | `[U: not publicly verifiable]` | `[U]` | `[ ]` | `[ ]` | `[ ]` |

> No active connection, probing, scan submission, exploitation, credential validation, or protected-system access was attempted.

### Public-document and executive footprint

`[Summarize organization-level metadata patterns. Exclude personal usernames, private contacts, paths, tokens, and unnecessary security detail.]`

| Publicly stated priority | Business context | Date/window | Evidence | Messaging opportunity | Limitation |
| --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[ ]` | `[SRC-][E#]` | `[ ]` | `[No personality inference]` |

## 1.5 Executive limitations

- `[Unresolved ownership or identity]`
- `[Unavailable/restricted source]`
- `[Internal control/process not publicly verifiable]`
- `[Temporal/geographic coverage gap]`

# Section 2: Marketing, PR & Overlooked Opportunities Audit

## 2.1 Phase 2 — PR, media, sentiment, and reputation

### Sampling contract

| Dimension | Definition |
| --- | --- |
| Window / geography / languages | `[ ]` |
| Source universe | `[ ]` |
| Entity aliases | `[ ]` |
| Inclusion / exclusion | `[ ]` |
| Duplicate / syndication policy | `[ ]` |
| Known sample/platform bias | `[ ]` |

### Share of voice

Comparison set = target + up to three selected comparators. Leave unused rows blank and explain why fewer passed the comparison contract.

| Organization | Qualifying deduplicated items | SOV | Source universe / window | Weighting | Query / evidence |
| --- | ---: | ---: | --- | --- | --- |
| Target | `[ ]` | `[ ]%` | `[ ]` | `[Count/Relevance/Prominence]` | `[QRY-/SRC-]` |
| Competitor 1 | `[ ]` | `[ ]%` | `[ ]` | `[ ]` | `[ ]` |
| Competitor 2 | `[ ]` | `[ ]%` | `[ ]` | `[ ]` | `[ ]` |
| Competitor 3 | `[ ]` | `[ ]%` | `[ ]` | `[ ]` | `[ ]` |

`SOV = company qualifying items ÷ all comparison-set qualifying items.`

### Media, sentiment, and themes

| Topic / narrative | Target coverage | Competitor ownership | Evidence | Public-proof gap | Recommended asset |
| --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[ ]` | `[E# / SRC-]` | `[ ]` | `[ ]` |

| Source/sample | Denominator | Positive | Neutral | Negative | Uncertain | Human validation | Bias |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `[ ]` | `[n=]` | `[ ]%` | `[ ]%` | `[ ]%` | `[ ]%` | `[n=/metric]` | `[ ]` |

> Required wording: “X% of the collected items in the defined sample were classified as negative,” not “X% of customers are negative.”

| Issue theme | Items in collected sample | Trend | Severity | Response observed | Evidence | Limitation |
| --- | ---: | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[↑/→/↓/U]` | `[ ]` | `[Yes/No/Partial/U]` | `[SRC-]` | `[Experience/allegation, not adjudicated fact]` |

> If theme coding is multi-label, call this `Issue prevalence in collected items`; shares may exceed 100%.

### Narrative and misinformation risk

| Narrative | Classification | Supporting evidence | Corrective/counterevidence | Propagation | Response | Stop rule |
| --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[Misunderstanding/Allegation/False/Ambiguous/Criticism]` | `[SRC-]` | `[SRC-]` | `[ ]` | `[ ]` | `[ ]` |

## 2.2 Phase 3 — marketing and acquisition

### Public ad / creative audit

| Platform | Creative / offer | First / last seen | Format | CTA | Landing match | Public gap | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[Strong/Mixed/Weak]` | `[ ]` | `[SRC-]` |

> Ad transparency does not establish actual spend, reach, targeting, conversion, or profitability. “No records found” applies only to the searched library, query, and window.

### SEO, content velocity, and demand

| Demand cluster | Intent | Demand proxy/direction | Target coverage | Competitor coverage | Freshness | Gap/test |
| --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[Info/Commercial/Transactional/Support]` | `[ ]` | `[Strong/Partial/Absent/U]` | `[ ]` | `[ ]` | `[ ]` |

| Owned metric | Current observation | Comparison | Evidence | Limitation |
| --- | --- | --- | --- | --- |
| Publication cadence | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Indexable page types | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Topic / internal-link coverage | `[ ]` | `[ ]` | `[SRC-]` | `[ ]` |
| Structured data | `[ ]` | `[ ]` | `[SRC-]` | `[Presence ≠ quality]` |
| Performance / accessibility | `[ ]` | `[ ]` | `[Measurement]` | `[Test conditions]` |

| Public question/job | Source/window | Sample evidence | Current target answer | Competitor answer | Relevance | Asset/test |
| --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[SRC-]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

### Public funnel hypotheses

| Step | Observation | Hypothesized friction | Alternative | Internal metric needed | Reversible test |
| --- | --- | --- | --- | --- | --- |
| `[ ]` | `[O][SRC-]` | `[H]` | `[ ]` | `[ ]` | `[ ]` |

## 2.3 Phase 4 — top three overlooked levers

| Rank | Lever | Evidence | Mechanism | LAKA state | Time to evidence | Required input | Risk |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `[ ]` | `[SRC-/CLM-]` | `[ ]` | `[C0–C4]` | `[ ]` | `[ ]` | `[ ]` |
| 2 | `[ ]` | `[SRC-/CLM-]` | `[ ]` | `[C0–C4]` | `[ ]` | `[ ]` | `[ ]` |
| 3 | `[ ]` | `[SRC-/CLM-]` | `[ ]` | `[C0–C4]` | `[ ]` | `[ ]` | `[ ]` |

For each lever include symptom, unmet job, beneficiary, value mechanism, unknowns, C0–C4 alternatives, elimination logic, smallest test, baseline, metric, threshold, guardrail, stop rule, service fit, and financial handoff.

# Section 3: Micro & Macroeconomic Diagnostic

## 3.1 Phase 5 — pricing power and elasticity

| Company / offer | Public price | Equivalent unit | Included value | Exclusions/minimums | Currency/date | Evidence |
| --- | ---: | --- | --- | --- | --- | --- |
| Target | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Competitor 1 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Competitor 2 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Competitor 3 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |

**Diagnosis:** `[I/H: differentiation, substitution, segmentation, bundling, or transparency.]`

**Elasticity limitation:** `[Public prices do not establish target demand elasticity.]`

**Test:** `[Segment, design, metric, window, guardrail, stop rule.]`

## 3.2 Marginal-cost and operational friction

| Work unit | Evidence | Volume | Time | Error/rework | Unit cost | Bottleneck hypothesis | Evidence needed |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| `[ ]` | `[R/M/B/A + source]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[H]` | `[ ]` |

## 3.3 LTV/CAC and funnel risk

| Metric | Low | Base | High | Unit/period | Tag | Source/assumption | Confidence |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| CAC | `[ ]` | `[ ]` | `[ ]` | `[currency/customer]` | `[R/M/B/A]` | `[ ]` | `[ ]` |
| Activation / conversion | `[ ]` | `[ ]` | `[ ]` | `[%]` | `[ ]` | `[ ]` | `[ ]` |
| Contribution margin | `[ ]` | `[ ]` | `[ ]` | `[%]` | `[ ]` | `[ ]` | `[ ]` |
| Retention / churn | `[ ]` | `[ ]` | `[ ]` | `[%/period]` | `[ ]` | `[ ]` | `[ ]` |
| Contribution LTV | `[ ]` | `[ ]` | `[ ]` | `[currency/customer]` | `C` | `[MOD-]` | `[ ]` |
| LTV/CAC / payback | `[ ]` | `[ ]` | `[ ]` | `[ratio/months]` | `C` | `[MOD-]` | `[ ]` |

**Public-data boundary:** `[Which values are assumptions/benchmarks and must be replaced.]`

## 3.4 Supply/vendor exposure

| Dependency/input | Evidence | Concentration state | Driver | Switching friction | Scenario | Limitation |
| --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[SRC-]` | `[O/H/U]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

## 3.5 Phase 7 — macro and regulatory pressures

| Driver | Current official measure | Reference period | Direction | Target transmission hypothesis | Indicator | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Rates / credit | `[ ]` | `[ ]` | `[ ]` | `[I/H]` | `[ ]` | `[SRC-]` |
| Inflation / inputs | `[ ]` | `[ ]` | `[ ]` | `[I/H]` | `[ ]` | `[SRC-]` |
| Labor / wages | `[ ]` | `[ ]` | `[ ]` | `[I/H]` | `[ ]` | `[SRC-]` |
| Demand / output | `[ ]` | `[ ]` | `[ ]` | `[I/H]` | `[ ]` | `[SRC-]` |
| Supply / trade / FX | `[ ]` | `[ ]` | `[ ]` | `[I/H]` | `[ ]` | `[SRC-]` |

| Requirement | Jurisdiction | Status | Effective/deadline | Threshold | Target exposure | Effect | Source | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[Law/Rule/Guidance/Standard/Proposal]` | `[ ]` | `[ ]` | `[O/H/U]` | `[ ]` | `[SRC-]` | `[Legal/Privacy/Security]` |

> This is issue spotting for qualified review, not legal advice.

| Scenario | Key assumptions | Revenue | Margin | Cash/capacity | Trigger | Response |
| --- | --- | --- | --- | --- | --- | --- |
| Downside | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Base | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Upside | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

# Section 4: Competitor Benchmark

## 4.1 Phase 6 — comparability contract

| Dimension | Definition |
| --- | --- |
| Customer / job | `[ ]` |
| Product / geography / language | `[ ]` |
| Business model / scale / channel | `[ ]` |
| Observation window | `[ ]` |
| Pricing normalization | `[ ]` |
| SOV source universe / dedupe | `[ ]` |

| Candidate | Classification | Comparable? | Evidence | Acceptance/rejection reason |
| --- | --- | --- | --- | --- |
| `[ ]` | `[Direct/Substitute/Aspirational/Adjacent/Regional]` | `[Yes/No]` | `[SRC-]` | `[ ]` |

## 4.2 Target versus selected comparators

| Dimension | Target | Competitor 1 | Competitor 2 | Competitor 3 | Evidence / limitation |
| --- | --- | --- | --- | --- | --- |
| Core customer/job | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Public features/integrations | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Public tech/delivery signals | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Equivalent-unit pricing | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Pricing transparency | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Offer / proof | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Demand/content coverage | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Media/topic SOV | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SOV]` |
| Spokesperson/trade presence | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[SRC-]` |
| Public unit economics | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[Reported/U]` |
| Differentiation | `[I]` | `[I]` | `[I]` | `[I]` | `[Evidence]` |
| Material unknown | `[U]` | `[U]` | `[U]` | `[U]` | `[ ]` |

| Gap | Dimension | Type | Evidence | Material mechanism | Alternative | Response |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-` | `[ ]` | `[Parity/Differentiation/Messaging/Proof/Unknown/Irrelevant]` | `[SRC-]` | `[I/H]` | `[ ]` | `[ ]` |

Recommended positions: **Defend** `[advantage]`; **Close** `[material parity/proof gap]`; **Differentiate** `[unowned job/narrative/model]`.

# Section 5: Financial Impact Matrix (Dollar Metrics)

## 5.1 Phase 8 — financial impact matrix

| Identified Gap / Blindspot | OSINT / PR / Economic Evidence | Estimated Annual Financial Loss | Proposed Service Solution | Projected ROI / Value Delivered |
| :--- | :--- | :--- | :--- | :--- |
| `[FND-/OPP-]` | `[O/C/I/H][E#][SRC-/CLM-]` | `$[L,B,H] [currency/year] — [ESTIMATE/SCENARIO], not reported loss` **or** `not estimable — [missing inputs]` | `[Service + reversible first scope]` | `$[L,B,H]; [ROI/payback]; not guaranteed` **or** `not estimable` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

## 5.2 Model and input register

| Model | Mechanism | Formula | Result class | Low | Base | High | Confidence | Overlap group |
| --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| `MOD-` | `[ ]` | `[ ]` | `[DETERMINISTIC_CALCULATION/ESTIMATE/SCENARIO]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

| Model | Variable | Low | Base | High | Unit/period | Tag | Source/rationale | Replacement data |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| `MOD-` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[R/M/B/A]` | `[SRC-/assumption]` | `[ ]` |

For each model show business mechanism, dimensional check, low/base/high arithmetic, break-even, implementation/ongoing cost, lag/ramp/adoption, downside/zero case, attribution, exclusions, sensitivity, and falsifier.

## 5.3 Sensitivity, overlap, and value types

| Model | Most sensitive input | Break-even | −20% | Base | +20% | Interpretation |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `MOD-` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

| Overlap group | Models | Stand-alone base | Overlap removed | Portfolio base | Rationale |
| --- | --- | ---: | ---: | ---: | --- |
| `[ ]` | `[MOD-]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

| Value type | Low | Base | High | Meaning |
| --- | ---: | ---: | ---: | --- |
| Cost-of-inaction scenario | `[ ]` | `[ ]` | `[ ]` | `[Modeled exposure, not reported loss]` |
| De-duplicated client value | `[ ]` | `[ ]` | `[ ]` | `[Gross modeled benefit]` |
| Risk-adjusted realized value | `[ ]` | `[ ]` | `[ ]` | `[After probability/adoption/ramp]` |
| Proposed fee | `[ ]` | `[ ]` | `[ ]` | `[Commercial price]` |
| CRM estimated deal value | `[ ]` | `[ ]` | `[ ]` | `[Expected contract value, not client loss]` |

# Section 6: C-Suite Outreach Blueprint

## 6.1 Phase 9 — eligibility

| Field | Approved value |
| --- | --- |
| Finding / recipient remit | `[FND-] / [ ]` |
| Eligible hook | `[O][E3+][SRC-] or [C][reviewed public-corpus calculation]` |
| Bounded mechanism / alternative | `[I/H] / [ ]` |
| Internal unknown | `[U]` |
| Scenario / break-even | `[C][SCENARIO][MOD-]` |
| Service fit | `[ ]` |
| Sensitive-data check | `[Pass/Fail]` |
| Jurisdiction/contact/suppression | `[Pending/Pass/Fail]` |
| Human send approval | `[Required; not granted by this report]` |

If the gate fails: `NO SAFE OUTREACH FINDING`.

## 6.2 Subject line options

1. `[Specific public asset/metric + bounded question]`
2. `[Company + calculated public pattern]`
3. `[Topic/SOV gap + window]`
4. `[Small diagnostic + business outcome]`
5. `[Question about public initiative]`

## 6.3 Authority-first pitch

```text
Hi [First Name]—I reviewed [specific public business scope] across
[defined window/source class]. One pattern stood out: [eligible public hook].
[Optional public source.]

That does not prove [internal diagnosis], but it is consistent with [bounded
mechanism]. [Strongest alternative] may also explain it. Using [tagged inputs],
the break-even/scenario is [range], not a claim about actual performance.

I mapped a [small reversible diagnostic] that could confirm or reject the mechanism
within [window]. Would it be useful if I sent the one-page evidence map? If not,
I will leave it there.
```

## 6.4 Discovery agenda

1. Confirm context, scope, definitions, and what public evidence misses.
2. Review three source-to-claim chains and contradictions.
3. Replace assumptions with target data and reconcile units.
4. Compare C0–C4 alternatives, including measure-first and do-nothing.
5. Agree the next evidence-producing test, owner, metric, guardrail, and stop rule.

## 6.5 Pre-send checklist

- [ ] Identity and role reverified on send date.
- [ ] Hook passes the evidence-use matrix and is role-relevant.
- [ ] Inferences/unknowns are explicit; no sensitive security/personal data.
- [ ] No guessed named email is used; contact provenance is lawful.
- [ ] Dollar figure is a labeled scenario or break-even.
- [ ] Sender identity, subject, contact/postal details, and disclosures are accurate.
- [ ] Jurisdiction, consent/lawful-use, suppression, and opt-out controls pass.
- [ ] Human approves the exact message.
- [ ] No message has been sent by this audit system.

# Section 7: CRM Import CSV / Table

## 7.1 Required import view

| Company Name | Domain | Industry | First Name | Last Name | Title | Email Pattern | Primary Technical/PR Gap | Microeconomic/Margin Leak | Estimated Deal Value | Custom Pitch Angle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[pattern-only or blank]` | `[Evidence-bounded gap]` | `[Scenario/hypothesis]` | `[Expected contract value or TBD]` | `[Hook → mechanism → test]` |

## 7.2 Governance view

| Field | Value |
| --- | --- |
| Organization / person IDs | `[ORG-] / [PER-]` |
| Role verification source/date | `[URL] / [date]` |
| Contact status/source | `[Published/Verified/Pattern-only/Unknown/Opted-out] / [URL]` |
| Jurisdiction / outreach basis | `[ ] / [ ]` |
| Suppression | `[ ]` |
| Primary claim / evidence / state | `[CLM-] / [E#] / [O/C/I/H/U/X]` |
| Numeric result / model class / deal range | `[REPORTED_OR_MEASURED/DETERMINISTIC_CALCULATION/ESTIMATE/SCENARIO] / [M0–M5] / [L,B,H]` |
| Currency / service fit / score | `[ ] / [ ] / [ ]` |
| Human review | `[ ]` |
| Last / next review / delete at | `[ ] / [ ] / [ ]` |

## 7.3 CRM quality controls

- [ ] Email Pattern is a pattern, not a generated personal address.
- [ ] Unknown values are blank, not invented.
- [ ] Deal value is expected contract value, not modeled client loss.
- [ ] Company/role/contact provenance are current.
- [ ] Opt-outs and invalid contacts are suppressed.
- [ ] CSV formula injection is neutralized at export only.
- [ ] Currency, numeric, and date fields are typed.
- [ ] Organization/person/opportunity dedupe keys pass.
- [ ] A non-production sample import was reviewed.
- [ ] No CRM mutation occurred without explicit authorization.

# Appendix A: Nine-phase completion

| Phase | Scope | Status | Evidence coverage | Key output | Limitation / N/A reason |
| ---: | --- | --- | ---: | --- | --- |
| 1 | Technical / executive OSINT | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 2 | PR / reputation | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 3 | Marketing / demand | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 4 | Opportunities / blind spots | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 5 | Microeconomics | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 6 | Competitors / SOV | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 7 | Macro / regulation | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 8 | Financial impact | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |
| 9 | Outreach / CRM | `[ ]` | `[ ]%` | `[ ]` | `[ ]` |

# Appendix B: LAKA coverage

| System variable | C0 Baseline | C1 Minor | C2 Major | C3 Structural | C4 Paradigm |
| --- | --- | --- | --- | --- | --- |
| Object | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Conditions | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Actions | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Tools | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Resources | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Outcomes | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Feedback | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Constraints | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Value | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Failure Mode | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

| Finding | Magnitude | Rate | Direction | Scope | Depth | Duration | Frequency | Acceleration | Variability | Detectability | Reversibility | Propagation | Amplification | Accumulation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `FND-` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

Every blank is completed or `N/A — [reason]`.

## Expansion coverage summary

| Coverage object | Required for selected profile | Completed | Reasoned N/A | Promoted to evidence search | Manifest pointer |
| --- | ---: | ---: | ---: | ---: | --- |
| 5×10 structural cells | `[50 or profile subset]` | `[ ]` | `[ ]` | `[ ]` | `[URI/hash]` |
| 10×14 variable–dynamic cells | `[140 or profile subset]` | `[ ]` | `[ ]` | `[ ]` | `[URI/hash]` |
| Canonical 6×6×6 execution cube | `[216 or profile subset]` | `[ ]` | `[ ]` | `[ ]` | `[URI/hash]` |
| Optional 36-cell business-coverage cube | `[36 or N/A]` | `[ ]` | `[ ]` | `[ ]` | `[URI/hash]` |
| X-Full offline manifest | `[151,200 or N/A]` | `[ ]` | `[ ]` | `[promoted atoms only]` | `[URI/hash]` |

Coverage generation is not automatic authorization for searches. Record deduplication, saturation, budget, rights, and risk stops in the manifest.

# Appendix C: Evidence and claim ledgers

The tables below are report views. The full evidence ledger also retains content hash, exact locator, access/terms decision, rights class, personal-data class, retention/deletion rule, archive/object pointer where authorized, collection/tool version, and reviewer.

| Source | Publisher/title | URL | Type | Valid/event | Published | Retrieved | Method/access | Level | Extract/fact | Limitation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SRC-` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[E#]` | `[ ]` | `[ ]` |

| Claim | Claim text | State | Scope | Supports | Refutes | Confidence | Materiality | Verdict | Resolution evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CLM-` | `[ ]` | `[O/C/I/H/U/X]` | `[ ]` | `[SRC-]` | `[SRC-]` | `[ ]` | `[ ]` | `[Keep/Narrow/Downgrade/Challenge/Retract]` | `[ ]` |

# Appendix D: Sources, rights, and reproducibility

| Source/tool | Version/access date | Mode | License/terms class | Commercial use | Query/request | Retention | Limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[API/RSS/Public page/Download/Passive index]` | `[ ]` | `[Allowed/Conditional/Restricted/U]` | `[No secrets]` | `[ ]` | `[ ]` |

| Failed/blocked request | Date | Reason | Impact | Alternative | Remaining unknown |
| --- | --- | --- | --- | --- | --- |
| `[ ]` | `[ ]` | `[Unavailable/Restricted/Rate/Unsafe]` | `[ ]` | `[ ]` | `[ ]` |

# Appendix E: Legal, ethical, privacy, and security review

| Issue | Jurisdiction/policy | Applicability | Evidence | Risk | Required control | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Outreach basis | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Data minimization | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Platform terms / copyright | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Security disclosure | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Suppression / deletion | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

# Appendix F: Opportunity and elimination portfolio

| Opportunity | Symptom | Mechanism | C0 | C1 | C2 | C3 | C4 | Selected option | Eliminated options / reasons | Test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `OPP-` | `[O/I/H]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[metric/window/guardrail/stop]` |

| Elimination ID | Candidate action | Evidence considered | Elimination reason | Re-entry trigger | Reviewer/date |
| --- | --- | --- | --- | --- | --- |
| `ELM-` | `[ ]` | `[SRC-/CLM-]` | `[Dominated/Unsafe/Unlawful/No fit/Dependency/Insufficient evidence]` | `[ ]` | `[ ]` |

# Appendix G: Limitations, unknowns, and research backlog

| ID | Limitation / unknown | Why it matters | Current treatment | Evidence needed | Owner / trigger / due |
| --- | --- | --- | --- | --- | --- |
| `LIM-` | `[ ]` | `[ ]` | `[Excluded/Scenario/Deferred/Blocked]` | `[ ]` | `[ ]` |

| Backlog ID | Question | Expected decision value | Safe source/test | Priority | Stop condition |
| --- | --- | --- | --- | --- | --- |
| `RBK-` | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

# Appendix H: QA and release

| Test | Result | Reviewer | Timestamp | Defect/note |
| --- | --- | --- | --- | --- |
| Scope / phase completeness | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |
| Evidence / contradiction | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |
| Financial calculations | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |
| Security / privacy / legal | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |
| Opportunity / backlog | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |
| Outreach / CRM | `[Pass/Fail/N/A]` | `[ ]` | `[ ]` | `[ ]` |
| Links / rendering / manifest | `[Pass/Fail]` | `[ ]` | `[ ]` | `[ ]` |

**Final verdict:** `[PASS / PASS WITH NON-MATERIAL LIMITATIONS / REVISE / BLOCK]`

**Release approver / timestamp:** `[Human] / [RFC3339]`

**External actions performed:** `None unless separately documented and explicitly authorized.`
