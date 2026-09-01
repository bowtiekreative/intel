# LAKA Query and Alternative Atlas

## 1. The volumetric manifest

The canonical LAKA cross-product contains:

\[
5\ \text{change states}
\times 10\ \text{internal variables}
\times 14\ \text{dynamics}
\times 6\ \text{interrogatives}
\times 6\ \text{relational modifiers}
\times 6\ \text{execution-impact states}
=151{,}200\ \text{atomic lenses}
\]

The manifest is enumerable. It is not permission to issue 151,200 web searches. The engine groups lenses that the same source can resolve, applies a covering schedule, deduplicates, and stops at evidence saturation.

### Canonical lens sentence

```text
At [change state], how does [dynamic] alter [internal variable] for [entity],
viewed through [Who/What/When/Where/Why/How] and [Direction/Scope/Depth/
Duration/Frequency/Reversibility], and what is the permitted [I1–I6]
research or action state, compared with [benchmark] during [window]?
```

### Canonical finding sentence

```text
[Claim state] Evidence shows/suggests [bounded condition].
This could affect [business effect] through [mechanism], with [L/B/H or not estimable].
Strongest support: [source]. Strongest counterevidence: [source/none found].
Confidence: [band]. Smallest test: [action + metric + guardrail + stop rule].
```

## 2. Two cubes—do not confuse them

### Canonical LAKA execution cube

```text
Interrogatives:
Who | What | When | Where | Why | How

Relational modifiers:
Direction | Scope | Depth | Duration | Frequency | Reversibility

Execution impact:
I1 read-only | I2 verify | I3 local change | I4 remote persistent change
| I5 destructive | I6 security/policy boundary
```

### Optional business-coverage cube

This is a Volumetric Intelligence extension, not a replacement for the canonical LAKA execution cube.

```text
Stakeholder relationship:
Internal | Upstream | Downstream | Lateral | Competitive | Institutional

Business effect:
Demand/Revenue | Cost/Margin | Risk/Resilience | Speed/Capacity
| Trust/Legitimacy | Option Value/Defensibility
```

Use the business cube to check decision coverage; use the execution cube to control what the system may do.

## 3. Bound alternative vocabularies

| Family | Alternatives |
| --- | --- |
| Entity | company, business unit, brand, product, offer, public executive role, customer segment, geography, channel, competitor, supplier, partner, regulator |
| Funnel stage | unaware, problem-aware, comparison, evaluation, conversion, onboarding, adoption, support, retention, expansion, referral, win-back, exit |
| Signal pattern | presence, absence, excess, shortage, delay, inconsistency, fragmentation, concentration, duplication, mismatch, decay, volatility |
| Trigger | launch, price change, outage, complaint spike, leadership change, hiring shift, acquisition, funding, regulation, competitor move, seasonal event, macro shock |
| Customer job | reduce cost, reduce risk, save time, earn revenue, simplify, comply, learn, integrate, recover, gain status/confidence |
| Window | 30 days, 90 days, 12 months, three years, pre/post event, comparable season/cohort |
| Geography | global, country, province/state, metro, service area, location cluster |
| Benchmark | self-history, direct rival, category leader, adjacent leader, regulatory minimum, demonstrated practice, no-change counterfactual |
| Evidence polarity | supporting, contradicting, neutral, stale, ambiguous, missing |
| Intervention | observe, instrument, eliminate, reduce, standardize, clarify, automate, integrate, personalize, localize, reprice, bundle, partner, govern, retire |
| Monetization | acquisition, conversion, price realization, retention, expansion, cost, risk, capacity, asset reuse, option value |
| Authority artifact | one-page brief, evidence map, benchmark, cost-leak model, narrative map, 90-day roadmap, pilot specification |
| Outreach angle | recent trigger, competitor gap, unserved demand, economic leak, narrative gap, operating friction, deadline, underused asset |
| Counterfactual | do nothing, measure first, local optimization, outsource, buy, build, automate, partner, redesign, stop |
| Decision horizon | containment, 30-day test, 90-day pilot, annual plan, multi-year architecture |

Review every family; expand only options supported by a signal or necessary to test a counterfactual.

## 4. Safe public-source query atlas

These bounded `site:`, `filetype:`, phrase, date, and exclusion patterns are the safe subset of what is often called **Google Dorking**. They are discovery queries only: never use search operators to seek credentials, private files, access tokens, exposed admin panels, or data outside a lawful business-research purpose.

Placeholders:

- `{T}` target company
- `{D}` domain
- `{E}` executive
- `{K}` product/category/problem keyword
- `{C}` competitor
- `{G}` geography
- `{DATE}` supported ISO date

Operators vary. A search result is a lead; open and preserve the primary source.

| Intelligence family | Safe query patterns |
| --- | --- |
| corporate identity | `site:{D} (about OR company OR leadership OR locations)` |
| products/offers | `site:{D} (products OR services OR solutions OR industries)` |
| pricing | `site:{D} (pricing OR plans OR fees OR "request a quote")`; repeat for `{C}` |
| proof assets | `site:{D} ("case study" OR customers OR testimonials OR results)` |
| public reports | `site:{D} filetype:pdf ("annual report" OR investor OR sustainability OR brochure)` |
| release velocity | `site:{D} (changelog OR "release notes" OR roadmap OR updates)` |
| executive priorities | `"{E}" "{T}" (interview OR podcast OR keynote OR transcript)` |
| public executive claims | `site:{D} "{E}"`; `"{E}" "{K}" after:{DATE}` |
| media footprint | `"{T}" (news OR interview OR profile) after:{DATE}` |
| press-room velocity | `site:{D} (newsroom OR press OR media) after:{DATE}` |
| complaint discovery | `"{T}" (complaint OR refund OR outage OR cancellation OR support)` |
| Reddit discovery | `site:reddit.com "{T}" (problem OR switched OR alternative OR review)`; use API only if permitted for automation |
| review discovery | manual official platform search or `site:trustpilot.com/review "{D}"`; BBB manual only under terms |
| narrative misunderstanding | `"{T}" (misleading OR confusion OR misunderstood OR correction OR clarification)` |
| material disputes | `"{T}" (recall OR regulator OR lawsuit OR investigation)`; verify with regulator/court/company |
| active advertising | search `{T}`/`{D}` in Meta Ad Library and Google Ads Transparency Center; official bulk/API only where supported |
| high-intent demand | `"{K}" (cost OR pricing OR quote OR demo)` |
| comparison demand | `"{K}" (best OR versus OR vs OR alternative)` |
| problem demand | `"{K}" ("how to" OR problem OR issue OR troubleshoot)` |
| target topic coverage | `site:{D} "{K}"`; `site:{D} (blog OR resources OR guides) "{K}"` |
| conversion paths | `site:{D} (demo OR trial OR assessment OR consultation OR "get started")` |
| support content | `site:{D} (help OR support OR FAQ OR documentation) "{K}"` |
| public hiring/capability | `site:{D} (careers OR jobs) (operations OR automation OR data OR security OR "customer support")` |
| trust/compliance | `site:{D} ("trust center" OR security OR privacy OR accessibility OR compliance OR "responsible disclosure")` |
| incident history | `"{T}" ("security incident" OR "data breach" OR outage)` plus official status/regulatory sources |
| archived positioning | public home/pricing/product/newsroom pages in Wayback/Common Crawl/Arquivo.pt |
| competitor migration | `"{T}" "{C}" (vs OR alternative OR migration OR switched)` |
| competitor proof | `site:{C} ("case study" OR customers OR results OR pricing)` |
| regulation | `site:{regulator-domain} "{K}" (guidance OR rule OR enforcement OR consultation)` |
| macro | official central-bank/statistical/labor/trade/regulator sources for `{K}` and `{G}` |
| local | `"{K}" "{G}" (directory OR association OR event)` plus official/open map/listing sources |
| published email pattern | derive only from business addresses the company has itself published; store pattern-only, never invented verification |

### Safe query expansions

For every material query, branch across:

```text
exact name | former/brand/product name | canonical domain
current window | prior comparable window | pre/post trigger
target | each competitor | category term
supporting language | counterevidence language | intentional-strategy language
official/primary source | independent source | archive
```

Counterevidence terms include `resolved`, `fixed`, `improved`, `expanded`, `certified`, `renewed`, `accurate`, `intentional`, `pilot`, `deprecated`, and target-specific language.

## 5. Passive OSINT boundary

- Allowed core: public pages, official registries/APIs/feeds, search leads, certificate transparency, public archives, ordinary DNS/RDAP, ordinary browser retrieval under terms, local analysis of intentionally published documents.
- Excluded: port scanning, brute forcing, fuzzing, exploit/version testing, authentication/credential testing, breach dumps, rate/CAPTCHA evasion, private groups/accounts, accidentally exposed sensitive files, hidden personal data.
- Domain-level breach checking requires ownership verification or explicit authorization.
- A technology/CT/cached-service result is a clue, not a current vulnerability.
- Do not put suspected security details in a pitch. Use a responsible-disclosure route.
- Executive research is role/public-business only; no family, home, private routine, protected/sensitive trait or personal contact enrichment.

## 6. Bounded coverage modes

| Mode | Required offline coverage | Retrieval cap | Source cap | Final gaps |
| --- | --- | ---: | ---: | ---: |
| X-Rapid | 50 state×variable cells plus a 36 relationship×business-effect screen | 60 query families | 150 | 10 |
| X-Standard | 50 state×variable + 140 variable×dynamic + canonical 216 execution cube | 240 | 600 | 24 |
| X-Deep | 700 state×variable×dynamic + canonical 216 cube | 480 | 1,200 | 50 |
| X-Full | 151,200 atoms generated offline for novelty/counterfactual testing | no automatic-search entitlement | N/A | promoted atoms only |

These are **expansion coverage profiles**, not engagement types or maturity grades. The engagement modes in `00-system-charter.md` describe the client deliverable. Default mapping: Signal scan → X-Rapid; Authority brief → X-Standard; Standard audit → X-Standard; Deep audit → X-Deep; Monitoring program → the last approved profile. X-Full is an offline manifest for novelty testing, never automatic permission for 151,200 searches.

For standard completion:

- 50/50 state×internal-variable pairs covered;
- 140/140 internal-variable×dynamic pairs covered;
- 216/216 interrogative×modifier×execution-state cells classified;
- each internal variable and business effect has at least one tested hypothesis;
- every final material claim satisfies the claim-type evidence-use matrix in `03-evidence-provenance-standard.md`;
- every estimate exposes inputs and low/base/high;
- zero prohibited I5/I6 research actions.

A strength-2 covering array may replace the schedule if it reports zero uncovered pairs.

## 7. Query consolidation

Multiple atoms can share one retrieval plan when they use the same:

```text
entity + source family + intent + time window + geography + access class
```

One official filing can resolve many object/resource/outcome/value cells. One public crawl can resolve many page/content/conversion cells. Do not hit the source separately for every hypothesis.

## 8. Deduplication

1. Resolve legal name, brand, acronym, former name, product and domain to stable IDs.
2. Canonicalize URLs while retaining publication/capture dates.
3. Cluster syndicated/copied material; the root origin counts once.
4. Claim key: `subject + predicate + object + geography + time window`.
5. Query-family key: entity + intent + source family + window; merge high token/semantic similarity after review.
6. Cross-posted customer statement remains one witness.
7. An archive is one source with temporal observations unless the content materially changes.
8. Never merge contradictions.
9. Do not average differently defined traffic/reach/sentiment/CAC/revenue estimates.
10. Aggregators citing one root are not independent corroboration.

## 9. Stop and saturation rules

Stop expanding a hypothesis when:

- the applicable claim-type evidence rule is satisfied and a real contradiction check is complete;
- two targeted counterqueries find no stronger contradiction;
- three materially different query formulations find nothing useful—mark `Unknown`;
- the last 20 queries yield under 5% new material claims and coverage passes;
- two research batches add no new high-priority gap;
- the declared cap is reached;
- results are circular, syndicated, stale, or speculative;
- continuation requires an access or authority expansion.

Saturation means diminishing returns in the declared public-source space, not proof of universal truth.

## 10. DSL

```text
VIG/1
TARGET "{company}" <{domain}>
EXEC "{name}" ROLE "{title}"
INDUSTRY "{industry}"
REGION "{region}"
OFFER ["{service}"]
MODE PASSIVE_PUBLIC

SCAN {C0|C1|C2|C3|C4}.{S1..S10}.{D1..D14}
LENS {WHO|WHAT|WHEN|WHERE|WHY|HOW}.{DIRECTION|SCOPE|DEPTH|DURATION|FREQUENCY|REVERSIBILITY}.{I1..I6}
REL {INTERNAL|UPSTREAM|DOWNSTREAM|LATERAL|COMPETITIVE|INSTITUTIONAL}
EFFECT {DEMAND|MARGIN|RISK|CAPACITY|TRUST|OPTION}
ENTITY {company|unit|product|offer|executive_role|segment|channel|competitor}
WINDOW {P30D|P90D|P1Y|P3Y|PRE_POST:event}
BENCH {SELF|DIRECT|CATEGORY|ADJACENT|REGULATORY|NO_CHANGE}
EVIDENCE {E1..E5}
COUNTERQUERY REQUIRED
OUTPUT {HYPOTHESIS|EVIDENCE|FINANCE|INTERVENTION|AUTHORITY_ASSET|OUTREACH}
```

Example:

```text
SCAN C3.S7.D2
LENS HOW.RATE.I2
REL DOWNSTREAM
EFFECT DEMAND
ENTITY product
WINDOW P1Y
BENCH DIRECT
EVIDENCE E3,E4
COUNTERQUERY REQUIRED
OUTPUT EVIDENCE,FINANCE,INTERVENTION,OUTREACH
```

Meaning: verify how quickly a structural change in customer-facing feedback affects product demand over one year versus direct competitors.

## 11. DSL grammar

```ebnf
investigation = scan, lens, relation, effect, entity, window,
                benchmark, evidence, counterquery, output ;
scan          = "SCAN", change_state, ".", internal_variable, ".", dynamic ;
lens          = "LENS", interrogative, ".", relational_modifier, ".", impact_state ;
hypothesis    = entity, signal_pattern, internal_variable, "under", conditions,
                "causing", mechanism, "relative to", benchmark, "during", window ;
finding       = claim_state, claim, evidence_list, counterevidence,
                financial_range, confidence, next_test ;
```

## 12. Full-manifest row schema

```yaml
atom_id: "C0-S1-D01-WHO-DIRECTION-I1"
change_state: C0
internal_variable: S1
dynamic: D01
interrogative: WHO
relational_modifier: DIRECTION
impact_state: I1
business_relationship: ""
business_effect: ""
hypothesis: ""
consolidated_query_family: ""
applicable: true
na_reason: ""
status: untested|testing|supported|contradicted|unknown|blocked
source_ids: []
```

## 13. Authority-first compression

```text
Trigger → outreach-eligible public observation/calculation → bounded economic mechanism
→ explicit unknown → relevant capability → reversible validation request
```

Authority comes from evidence quality and model transparency—not surveillance language, fear, or an inflated exact loss.
