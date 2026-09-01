# Nine-Phase Audit Playbook

## Preflight

1. Complete the scope contract.
2. Resolve the organization, executive, and region.
3. Identify applicable privacy, outreach, and source-use rules.
4. Set passive-only as the default authorization.
5. Choose audit mode and time box.
6. Create source, claim, calculation, opportunity, and contact ledgers.
7. Define the three decisions the audit must improve.

## Phase 1 — Technical and passive OSINT fingerprint

### Questions

- What official domains, subdomains, certificates, public services, repositories, documents, vendors, and technology signals are observable?
- Which signals indicate complexity, aging, inconsistency, or missing controls without requiring active testing?
- Which findings are verified facts, passive hints, or unknown?
- What business outcome could the technical condition affect?

### Collection lanes

1. official domains, DNS, RDAP/WHOIS and certificate transparency;
2. passive technology fingerprinting and historical snapshots;
3. public status, security, privacy, trust, API and developer pages;
4. public repositories and dependency manifests;
5. public documents and metadata, collected under source terms;
6. authorized breach-notification/domain-monitoring sources;
7. executive speeches, filings, posts, interviews, board and association biographies.

### Required controls

- No port scanning, directory brute force, authentication attempts, exploit checks, or payloads.
- Do not infer MFA status.
- Do not collect credential material.
- Treat version fingerprints as unverified until corroborated.
- Separate target-owned assets from third-party/CDN/shared infrastructure.

### Deliverables

- asset and dependency map;
- technical-change timeline;
- evidence-safe risk register;
- business-mechanism hypotheses;
- private responsible-disclosure route for material security signals.

## Phase 2 — PR, brand sentiment, and reputation

### Questions

- What themes recur, where, and over what window?
- Is the company responding? How quickly and consistently?
- Which narratives are customer misunderstandings, service failures, contested claims, or information gaps?
- Who owns share of voice by topic and outlet tier?

### Method

1. declare sources, window, queries, languages, and sample denominator;
2. collect platform-permitted records and RSS/news indexes;
3. normalize entity, topic, stance target, sentiment, engagement, and response;
4. deduplicate syndication and copied posts;
5. human-code a stratified sample to test the classifier;
6. compare target and competitors using identical rules;
7. map narrative propagation using the fourteen change variables.

### Deliverables

- topic-by-source sentiment table;
- complaint/response matrix;
- earned-media and SOV benchmark;
- narrative risk/opportunity map;
- crisis-information gaps.

## Phase 3 — Marketing, advertising, and audience engagement

### Questions

- What current creatives, promises, proof, formats, offers, and calls to action are visible?
- Where is high-intent demand not matched by a relevant page, ad, answer, or offer?
- Where does the journey lose clarity, trust, performance, accessibility, or message match?
- Which gaps are observable and which require internal analytics?

### Method

1. inspect official ad-transparency libraries manually or through permitted interfaces;
2. inventory target and competitor content over an equivalent window;
3. group search demand into problems, comparisons, alternatives, costs, risk, implementation, and local intent;
4. map each topic to journey stage and existing asset;
5. test public pages for performance, accessibility, structured data, indexability, and broken flows without submitting forms;
6. identify missing measurements that prevent CAC/conversion conclusions.

### Deliverables

- creative/message matrix;
- content velocity and topic-coverage matrix;
- demand-to-asset gap map;
- journey friction register;
- measurement plan.

## Phase 4 — Overlooked opportunities and blind spots

Generate across:

```text
Stakeholder × Job × Journey × Channel × Format × Offer × Geography × Time
× Ownership × Feedback × Five change states
```

Candidate families:

- unused owned/earned/paid/partner channels;
- under-monetized audiences, content, data, proof, expertise, integrations, or locations;
- missing follow-up, activation, expansion, referral, or win-back loops;
- regional listings, associations, events, awards, trade media, and co-marketing;
- operational assets that can become a productized diagnostic or trust signal;
- a new unit of value that creates a C4 demand curve.

Rank three levers for the executive brief, but preserve the full option register.

## Phase 5 — Microeconomic and unit-economic analysis

### Unit definition

Name the unit before calculating: lead, qualified opportunity, new customer, active account, order, project, seat, transaction, service ticket, location, or retained customer.

### Questions

- What price and packaging are public? What is genuinely comparable?
- Where might willingness-to-pay differ by segment or use case?
- Which manual or vendor-dependent steps raise marginal cost?
- Where might acquisition, activation, churn, support, or expansion leak contribution margin?
- What capacity constraint makes the next unit more expensive or slower?

### Required outputs

- unit-economics tree;
- public pricing comparison with scope/feature normalization;
- operational-friction hypotheses;
- LTV/CAC model template with missing inputs;
- low/base/high scenario ranges.

Private-company economics usually remain hypotheses until the target supplies volume, margin, conversion, churn, and labor data.

## Phase 6 — Competitor benchmark and gap analysis

1. select up to three comparable organizations with reasons, using fewer when comparability fails;
2. freeze a common window, geography, customer, and offer class;
3. compare facts separately from proxies;
4. normalize features, price units, content counts, outlets, reviews, and delivery claims;
5. identify target advantage, parity, disadvantage, and unknown;
6. find whitespace—not just missing features.

Required dimensions:

- technology and delivery;
- offer, packaging, price and proof;
- discovery/content/ad presence;
- media SOV and narrative ownership;
- customer experience and response;
- operating/economic proxies;
- strategic trajectory across five LAKA change states.

## Phase 7 — Macro and industry mapping

For each driver record:

```text
Driver → exposure path → affected unit → direction → magnitude range
→ lag → leading indicator → management lever → source
```

Driver families:

- interest rates and credit;
- inflation, wages, productivity and labor availability;
- currency, trade, shipping, input costs and supply concentration;
- regulation, privacy, accessibility, security, sector rules and deadlines;
- demographic, geographic, technology and demand shifts;
- platform/API/policy dependencies;
- climate/energy exposure where material.

Use primary statistical and regulatory sources. Do not turn national averages into company-specific impact without an exposure mechanism.

## Phase 8 — Financial impact and dollar metrics

For every proposed number:

1. identify observed/reported/measured/benchmark/assumed inputs;
2. state formula and unit;
3. calculate low/base/high;
4. apply attribution and realization factors;
5. state time-to-value, one-time cost, recurring cost, and risk;
6. test overlap with other gaps to prevent double counting;
7. show sensitivity and break-even;
8. label scenario vs target-reported fact.

The matrix includes `not estimable` when appropriate. It is better than a fabricated dollar value.

## Phase 9 — Executive pitch and CRM output

### Pitch selection

Choose findings that score high on:

- evidence strength;
- relevance to the executive's public business remit;
- economic mechanism clarity;
- service fit;
- novelty without creepiness;
- reversible next step;
- low legal/reputation risk.

### CRM record

Use published business contact details or pattern-only/unknown status. Resolve identities, deduplicate companies and people, sanitize CSV cells, and preserve provenance and lawful-use basis.

### Human approval

Before outbound use, a reviewer confirms:

- correct company and person;
- current title;
- finding and source accuracy;
- no sensitive security or personal detail;
- no misleading subject line or certainty;
- applicable consent/identification/unsubscribe requirements;
- suppression and opt-out lists;
- appropriate send volume and channel.

## Final synthesis

The report contains seven user-facing sections:

1. Executive briefing and OSINT digest
2. Marketing, PR and overlooked opportunities
3. Micro- and macroeconomic diagnostic
4. Competitor benchmark
5. Financial impact matrix
6. C-suite outreach blueprint
7. CRM import table

Appendices contain the evidence ledger, calculations, tool/source registry, full alternatives, limitations, and research backlog.
