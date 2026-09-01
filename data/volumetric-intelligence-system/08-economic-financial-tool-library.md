# Economic and Financial Intelligence Tool Library

Research snapshot: 2026-09-01. A private company's actual revenue, CAC, churn, LTV, payroll, debt exposure, contribution margin, and cash flow are unknown unless disclosed or supplied through authorized internal data.

For numeric outputs, use `REPORTED_OR_MEASURED`, `DETERMINISTIC_CALCULATION`, `ESTIMATE`, or `SCENARIO`. This result class is separate from the canonical claim states O/C/I/H/U/X. Exact arithmetic is permitted only for reconciled historical inputs; forecasts and causal projections remain estimates or scenarios. Never present a benchmark scenario as an exact annual loss.

## 1. Company identity and financial evidence

| Source/tool | Coverage and interface | Access/license | Defensibility rule | Official source |
| --- | --- | --- | --- | --- |
| SEC EDGAR APIs | US issuer submissions/XBRL company facts/frames/filings; JSON and nightly ZIPs | no key; fair access 10 requests/sec; identify User-Agent | reconcile units, periods, contexts, dimensions, amendments and footnotes; 10-K usually audited, 10-Q interim | [APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) · [Developer rules](https://www.sec.gov/about/developer-resources) |
| Arelle | XBRL/iXBRL parse/validate for SEC/ESEF | Apache-2.0 | validate before trusting extracted facts | [Repo](https://github.com/Arelle/Arelle) |
| EdgarTools | Python filing/statement/ownership/13F/ADV layer | MIT | preserve accession and filing URL as primary provenance | [Repo](https://github.com/dgunning/edgartools) |
| sec-edgar-downloader | reproducible filing download/archive | MIT | obey SEC access policy | [Repo](https://github.com/jadchaar/sec-edgar-downloader) |
| SEDAR+ | Canadian issuer financials/MD&A/AIF/prospectus/material changes | free public search/download; mostly documents; no documented public bulk API | do not call browser automation an API; cite document/page and extraction; legacy XBRL availability is limited | [CSA overview](https://www.securities-administrators.ca/about-sedar/) |
| Corporations Canada open data | federal name/status/registered office/directors/IDs | CSV/open data; Open Government Licence Canada | registration only—not revenue, solvency or complete provincial identity | [Dataset](https://open.canada.ca/data/en/dataset/0032ce54-c5dd-4b66-99a0-320a7b5e99f2) |
| Companies House API | UK profiles/officers/PSC/filings/charges/insolvency | free key; 600 requests/5 minutes; OGL/bulk data | micro/abridged accounts may omit detail and may be unaudited | [API](https://developer.company-information.service.gov.uk/) |
| GLEIF LEI | legal names/addresses/status/parent relationships | free API/bulk; CC0 | excellent entity resolution; no financial performance | [API](https://www.gleif.org/en/lei-data/gleif-lei-look-up-api/access-the-api) |
| Alpha Vantage | selected market/fundamental convenience data | free key; standard free around 25 requests/day | secondary convenience only; verify against filings/market rights | [Support](https://www.alphavantage.co/support/) |
| Nasdaq Data Link | dataset-specific market/economic data | anonymous/authenticated free quotas; dataset entitlements vary | preserve dataset rights, adjustment and timestamp | [Limits](https://docs.data.nasdaq.com/docs/rate-limits-1) |
| OpenBB | provider integration layer | AGPL-3.0 code; provider rights/keys/costs separate | AGPL and provider data review before proprietary hosting | [Repo](https://github.com/OpenBB-finance/OpenBB) |
| Yahoo Finance via yfinance | unofficial Yahoo data wrapper | unofficial/research convenience | discovery/spot-check only; not auditable client evidence; cite the issuer filing, exchange, or official series for material claims | [yfinance docs](https://ranaroussi.github.io/yfinance/) |

### Public/private rule

Public issuer figures come from the appropriate filing with period, currency, units, amendment, consolidation and audit status. Private-company figures are facts only when supplied through reliable statements, ledger, tax/bank/contract records or authenticated systems. Traffic/headcount/job-post estimates are scenarios, never company revenue facts.

## 2. Canada official sources

| Source | Metrics/interface | Proper use | Official source |
| --- | --- | --- | --- |
| Statistics Canada WDS/SDMX | CPI, labor, wages, vacancies, productivity, GDP/industry, business counts, input-output, trade, revenues/expenses; JSON/CSV/SDMX, no key | preserve table/vector, release/vintage, geography, NAICS, seasonal adjustment and units | [WDS](https://www.statcan.gc.ca/en/developers/wds/user-guide) · [SDMX](https://www.statcan.gc.ca/en/developers/sdmx/user-guide) |
| Bank of Canada Valet | rates, yields, FX, financial statistics/surveys; JSON/CSV/XML, no key | CAD discount/borrowing/FX/monetary scenarios | [API](https://www.bankofcanada.ca/valet-api-how-to/) |
| ISED Financial Performance Data | SME industry statements, balance sheets and ratios by NAICS/province/revenue band/incorporation | strong prior from sampled tax data; not target P&L; lag/suppression apply | [Site](https://ised-isde.canada.ca/site/financial-performance-data/en) |
| ISED Canadian Industry Statistics | establishments, employment, average revenue/expenses/profitability/trends | market structure/broad comparison | [Site](https://ised-isde.canada.ca/site/canadian-industry-statistics/en) |
| Key Small Business Statistics | SME counts/employment/financing/contribution | contextual benchmark; preserve year/definition | [Site](https://ised-isde.canada.ca/site/sme-research-statistics/en/key-small-business-statistics) |
| Merchandise trade explorer | imports/exports by HS/partner/province/period | product/industry exposure, not company shipments | [Explorer](https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2021004-eng.htm) |
| Canadian Importers Database | companies associated with products/origins/locations | presence signal only; incomplete shipment value | [Database](https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database) |
| CanadaBuys | tenders, awards, standing offers, contracts | observed procurement benchmark after deliverable/term/option normalization | [Data](https://canadabuys.canada.ca/en/procurement-and-contracting-data) |

## 3. United States official sources

| Source | Metrics/access | Proper use | Official source |
| --- | --- | --- | --- |
| BLS Public Data API | CPI/PPI/employment/wages/hours/JOLTS/ECI/ECEC/productivity; JSON; free key increases quota/history | loaded-labor and price priors with seasonal/footnote controls | [FAQ](https://www.bls.gov/developers/api_faqs.htm) |
| BLS QCEW | establishments/employment/wages by geography/NAICS/size; CSV/bulk | labor and market denominator; note exclusions/lag | [Open data](https://www.bls.gov/cew/additional-resources/open-data/) |
| Census Data API | Economic Census/CBP/ZIP/Nonemployer/ACS/business surveys; JSON | market size, payroll and demographic context | [Guide](https://www.census.gov/data/developers/guidance/api-user-guide/query-components.html) |
| County Business Patterns | establishments/employment/payroll by geography/NAICS/size | local competition/labor concentration | [Program](https://www.census.gov/programs-surveys/cbp.html) |
| BEA API / beaapi | GDP/regional/industry/fixed assets/international/input-output | free key; official Python client CC0; national input-output needs target exposure bridge | [API](https://apps.bea.gov/api/signup/) · [Client](https://github.com/us-bea/beaapi) |
| FRED/ALFRED | rates, prices, labor, production, credit and publisher series | free key; terms/rate throttling; cite origin when possible; ALFRED for vintages/backtests | [API](https://fred.stlouisfed.org/docs/api/fred/) |
| Treasury Fiscal Data | rates, debt, receipts/spending/fiscal balances; no key JSON/CSV/XML | primary fiscal/risk-free-rate input | [API](https://fiscaldata.treasury.gov/api-documentation/) |
| EIA API v2 | energy prices/production/consumption; free key | convert shock only with target energy/freight exposure | [Docs](https://www.eia.gov/opendata/documentation.php) |
| IRS SOI business tables | aggregate receipts/deductions/payroll/net income by industry/entity | lagged private-business prior, not target facts | [Statistics](https://www.irs.gov/statistics/soi-tax-stats-business-tax-statistics) |
| USAspending API | federal contracts/grants/loans/transactions; no auth | observed award benchmark with coverage/delay/threshold notes | [API](https://api.usaspending.gov/) |
| SAM.gov Opportunities | solicitations/awards/NAICS/dates/place; free account/key | demand/intent signal; ceiling/estimate ≠ realized revenue | [API](https://open.gsa.gov/api/get-opportunities-public-api/) |
| SAM Entity | UEI/CAGE/registration/public entity; free key with role-dependent quota | identity/eligibility only | [API](https://open.gsa.gov/api/entity-api/) |

## 4. International, trade and supply chain

| Source | Coverage/access | Use and caution | Official source |
| --- | --- | --- | --- |
| World Bank Indicators | broad country indicators, no-key JSON/XML | cross-country context; dataset terms/attribution | [API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation) |
| OECD SDMX | prices/labor/productivity/trade/tax/industry/regulation/outlooks | preserve flags/breaks/projections and terms; rate limiting | [API](https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html) |
| IMF APIs/DataMapper | WEO/financial/fiscal/trade/BOP; SDMX/JSON | distinguish actuals, estimates and forecasts | [API](https://data.imf.org/en/Resource-Pages/IMF-API) |
| Eurostat APIs/bulk | EU HICP/labor/demography/production/trade; SDMX/TSV | preferred EU source; attribution/dataset checks | [Intro](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction) |
| ILOSTAT | employment/unemployment/wages/hours/informality; bulk/R/SDMX | country definitions/modelled estimates vary | [Data](https://ilostat.ilo.org/data/) |
| UN Comtrade | bilateral HS trade/value/weight/quantity; account tier | mirror/revision/re-export/CIF-FOB differences; not company shipments | [Portal](https://comtradeplus.un.org/TradeFlow) |
| BIS Data Portal | rates/credit/property/EER/banking; SDMX/bulk | financial conditions/FX/credit context; terms apply | [Portal](https://data.bis.org/) |
| NY Fed GSCPI | standardized global supply-chain pressure index | shock indicator only; translate through target lead-time/freight/inventory exposure | [Index](https://www.newyorkfed.org/research/policy/gscpi) |
| US Census International Trade API | monthly HS/NAICS/end-use/port/geography | product/route exposure, not company shipments | [API](https://www.census.gov/data/developers/data-sets/international-trade.html) |
| BTS Freight Analysis Framework | origin/destination/commodity/mode/weight/value downloads | modeled regional flow baseline, not lane quote | [FAF](https://www.bts.gov/faf) |
| TED API/bulk | EU procurement notices/awards | observed procurement after scope normalization | [API](https://docs.ted.europa.eu/api/latest/index.html) |
| Open Contracting Data Registry | multi-country OCDS publishers, JSON/CSV/XLSX | discovery layer; verify originating authority/license/freshness | [Registry](https://data.open-contracting.org/) |
| Official tariff schedules | Canadian Customs, US HTS, EU TARIC | correct HS/origin/customs value/effective date/exclusions required | [Canada](https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html) · [US](https://hts.usitc.gov/) · [EU](https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff/eu-customs-tariff-taric_en) |

## 5. Regulatory/compliance monitoring

| Source/tool | Interface/use | Critical rule | Official source |
| --- | --- | --- | --- |
| Federal Register API | public JSON proposed/final rules/notices/agencies/dockets | verify dispositive official PDF through GovInfo | [API](https://www.federalregister.gov/developers/documentation/api/v1) |
| eCFR API | JSON/XML current/point-in-time CFR | track title/part/section/amendment/effective date and legal-status notice | [API](https://www.ecfr.gov/developers/documentation/api/v1) |
| Regulations.gov API | key, dockets/documents/comments | do not automate comment submission in passive system | [API](https://open.gsa.gov/api/regulationsgov/) |
| Congress.gov API | key, bills/laws/actions/committees | bill ≠ obligation; retain stage | [Repo/docs](https://github.com/LibraryOfCongress/api.congress.gov/) |
| Canada Gazette RSS | Parts I/II/III | store proposal/final/statute, deadline, registration/effective dates separately | [RSS](https://gazette.gc.ca/rss/sc-rb-eng.html) |
| Justice Laws XML | Canadian federal acts/regulations/diffs | reproduce accurately; consolidated text may lag some changes | [Repo](https://github.com/justicecanada/laws-lois-xml) |
| LEGISinfo | Canadian bill stages/votes/enactment, JSON/XML | proposal vs enacted state | [Site](https://www.parl.ca/legisinfo/) |
| EUR-Lex/Cellar | EU legislation/preparatory/case law via XML/SOAP/REST/SPARQL/RSS | consolidated/original/transposition/territory/corrigenda | [Reuse](https://eur-lex.europa.eu/content/help/data-reuse/reuse-contents-eurlex-details.html) · [Cellar](https://op.europa.eu/en/web/cellar/cellar-data) |
| UK legislation API | OGL XML/RDF/Atom | known unapplied/incomplete update limitations; verify current status | [Developer](https://www.legislation.gov.uk/developer) |
| NIST OSCAL/oscal-cli | Apache-2.0 machine-readable controls/SSP/assessment validation | encodes evidence, does not decide legal applicability | [OSCAL](https://pages.nist.gov/OSCAL/) · [CLI](https://github.com/usnistgov/oscal-cli) |
| ComplianceAsCode | BSD-3-Clause SCAP/Ansible/Bash policy tests | technical tests only; false positives/vendor content rights | [Repo](https://github.com/ComplianceAsCode/content) |
| Open Policy Agent | Apache-2.0 Rego engine | policy execution, not legal interpretation | [Repo](https://github.com/open-policy-agent/opa) |
| pyfair | MIT Monte Carlo FAIR tool | input quality and FAIR trademark/terminology obligations | [Repo](https://github.com/Hive-Systems/pyfair) |

Do not redistribute SOC 2, ISO, CIS, PCI or other copyrighted control catalogs merely because a copy is accessible. Use client-licensed copies or official free crosswalks.

## 6. Public price and competitor normalization

| Component | License/use | Role | Official source |
| --- | --- | --- | --- |
| public pricing/checkout/terms | public observation under source terms | observed list/checkout offer; not realized net price | target source |
| Schema.org Offer | vocabulary | price/currency/availability/unit metadata | [Offer](https://schema.org/Offer) |
| Scrapy | BSD-3-Clause | permitted scheduled retrieval | [Repo](https://github.com/scrapy/scrapy) |
| Playwright | Apache-2.0 | render permitted JS pricing pages | [Repo](https://github.com/microsoft/playwright) |
| extruct | BSD family | JSON-LD/microdata/RDFa/OpenGraph extraction | [Repo](https://github.com/scrapinghub/extruct) |
| price-parser | BSD family | parse locale/currency strings | [Repo](https://github.com/scrapinghub/price-parser) |
| Common Crawl/Wayback | public historical evidence | price-change history; incomplete/stale and source rights | [Common Crawl](https://commoncrawl.org/get-started) · [CDX](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server) |

Comparable fingerprint: region, currency, tax, billing/term, quantity band, included units/features, overage, implementation, mandatory add-ons, support/SLA, cancellation and promotion. Use matched pairs or median/IQR; no unqualified competitor mean.

```text
Monthly equivalent =
(recurring contract + mandatory one-time − unconditional discounts)
/ contract months + expected monthly overage
```

## 7. Open-source modeling library

| Layer | Tools | License | Role |
| --- | --- | --- | --- |
| tabular/analytics | pandas, Polars, DuckDB, Apache Arrow | BSD-3, MIT, MIT, Apache-2.0 | joins, dimensional models, local SQL/Parquet |
| schema | Pandera | MIT | units/currencies/evidence/null rules |
| official statistics | sdmx1, pandas-datareader | Apache-2.0, BSD-3 | SDMX and convenient provider clients |
| filings | Arelle, EdgarTools, sec-edgar-downloader, beaapi | Apache-2.0, MIT, MIT, CC0 | primary acquisition/validation |
| econometrics | statsmodels, linearmodels | BSD-3, NCSA | regression/time series/panel/IV |
| survival/churn | lifelines | MIT | Kaplan-Meier/Cox/censoring |
| Bayesian uncertainty | PyMC | Apache-2.0 | hierarchical priors/posterior simulation |
| marketing/CLV | PyMC-Marketing | Apache-2.0 | MMM/CLV/choice/diffusion/incrementality |
| MMM | Google Meridian, Meta Robyn | Apache-2.0, MIT | Bayesian geo and ridge/evolutionary MMM |
| causal | DoWhy, EconML, DoubleML, CausalPy | MIT, MIT, BSD-3, Apache-2.0 | graphs/refutation, HTE, debiased ML, DiD/synthetic/RD/ITS |
| sensitivity | SALib | MIT | Sobol/Morris/FAST |
| operations | SimPy | MIT | queue/service/onboarding/logistics simulation |
| finance | numpy-financial | BSD-3 | NPV/IRR/cash flows |
| cyber risk | pyfair | MIT | FAIR frequency/loss distributions |
| aggregation | DBnomics client | AGPL-3.0 client | many official providers; retain origin provenance |

A conservative proprietary stack starts with DuckDB/Polars/Arrow, Pandera, sdmx1, filing tools, statsmodels, linearmodels, lifelines, SALib and SimPy. Add Bayesian/causal tooling only when data supports it; review AGPL separately.

## 8. Evidence and uncertainty

Use the canonical E0–E5 evidence levels from `03-evidence-provenance-standard.md`, plus the financial input tags `R` reported, `M` measured, `B` benchmark, `A` assumption, and `C` calculated. They answer different questions: evidence level describes support strength; the financial tag describes the number's origin.

| Evidence condition | Financial treatment |
| --- | --- |
| E5 = E4 plus audited/reconciled target data or a valid controlled test | May support a target-specific estimate; still expose formula and time scope |
| E4 corroborated official or reproducible evidence | Suitable for material inputs with scope and caveats |
| E3 current official source | Use as reported/observed, not as proof of private operating performance |
| E2 single-source, user-generated, or secondary support | Use only in bounded scenarios or as a research lead for high-impact models |
| E0–E1 unsupported or unverified lead | Never use as a factual model input; an explicit analyst assumption may appear only in an illustrative scenario |

If any material input is a benchmark or assumption, show low/base/high or P10/P50/P90. If two or more critical inputs are assumptions, do not label the output an estimated annual loss. Round modeled outputs to a precision justified by the inputs—normally two significant figures—and show probability NPV > 0 when simulated.

Use empirical distributions first; otherwise Beta for rates, lognormal/gamma for positive skew, negative binomial for overdispersed counts, triangular/PERT for elicited ranges, bootstrap for cohorts, survival models for lifetimes. Encode material correlations. Run enough simulation for stable percentiles and expose dominant assumptions.

## 9. Red-line tests

Reject/downgrade any model that converts sentiment/SOV/review count directly to dollars; uses maximum fines as expected loss; treats all saved time as cash; treats market-cap movement as operating loss; double-counts revenue and contribution; treats list price as realized price; claims private revenue from traffic/headcount; mixes currency/real/nominal/period/classifications; hides assumptions; or omits source, retrieval/vintage, formula and range.

## 10. LAKA ladder

| State | Economic intelligence capability |
| --- | --- |
| Baseline | sourced company/public macro facts and explicit unknowns |
| Minor | normalized official-source connectors and formula registry |
| Major | target-authorized cohort/unit models, scenario ranges and sensitivity |
| Structural | causal/experiment design, lineage, overlap reconciliation and rolling forecast governance |
| Paradigm | optimize the unit of value and option portfolio rather than headline revenue; uncertainty becomes a managed asset |
