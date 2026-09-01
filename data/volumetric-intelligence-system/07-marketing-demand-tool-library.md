# Marketing, Demand and Conversion Tool Library

Research snapshot: 2026-09-01. Free proprietary services are connectors, not bundled dependencies. Never replace a missing official API with undocumented scraping.

Automation fit: **High** = documented API/bulk/CLI/feed; **Medium** = export/RSS/approval or operating burden; **Low** = manual UI evidence.

## 1. Ad transparency and creative intelligence

| Source | Status and fit | Inputs → outputs | Limitations | Useful measures | Official source |
| --- | --- | --- | --- | --- | --- |
| Meta Ad Library UI | free proprietary UI; low–medium | advertiser/page/keyword/geography/category → creative, status, dates, platforms, landing domain | fields vary by jurisdiction/category; presence ≠ spend; no undocumented endpoint automation | active creative count, launch/retirement velocity, run length, media/CTA/offer/domain mix | [Library](https://www.facebook.com/ads/library/) · [Transparency tools](https://transparency.meta.com/researchtools/ad-library-tools/) |
| Meta Ad Library API | gated proprietary Graph API; high within scope | identity/app/token → paginated ads with eligible creative/date/platform/payer/demographic/geography/impression/spend ranges | primarily political/social issue/election worldwide plus broader supported UK/EU scope; not universal commercial ads; Graph limits | range-preserving spend/impressions, concentration, payer relationship, creative survival | [Access](https://www.facebook.com/ads/library/api/) · [Reference](https://developers.facebook.com/docs/graph-api/reference/ads_archive/) |
| Google Ads Transparency Center UI | free proprietary UI; low–medium | advertiser/domain/date/location → Search, Display, Gmail, YouTube creatives and verified identity/payer | no documented global commercial REST API; filtered absence ≠ inactivity | format/channel mix, lifespan, offer/message themes, cadence, payer/domain mix | [Center](https://adstransparency.google.com/) · [Help](https://support.google.com/My-Ad-Center-Help/answer/12155361?hl=en) |
| Google ATC bulk data | official JSON shards/BigQuery; high | creative/removal tables → identity, format, regions, first/last shown, impression intervals, audience methods, payer/removal | primarily ads served in EEA/Turkey; impressions are intervals; BigQuery above free allowance costs money | regional corpus SOV, launches, survival, format share, targeting methods, removals | [README](https://storage.googleapis.com/ads-transparency-center/api-data/README.txt) · [BigQuery](https://console.cloud.google.com/marketplace/details/bigquery-public-data/google-ads-transparency-center) |
| Google Ads API | owned/authorized accounts; high | OAuth/developer token/customer → spend, search terms, audiences, assets, conversions/value | first-party truth only; access/service quotas; not competitor data | CTR, CPC, CVR, CPA, ROAS, impression share, budget loss, geo/device/daypart and asset performance | [API](https://developers.google.com/google-ads/api) · [Quotas](https://developers.google.com/google-ads/api/docs/best-practices/quotas) |
| TikTok Creative Center | free proprietary UI; low | country/industry/objective/keyword → top ads/trends/creative patterns | no documented commercial competitive API; no UI scraper dependency | creative patterns, media/CTA mix, visible engagement percentile, trend-response lag | [Center](https://ads.tiktok.com/business/creativecenter) |

## 2. Search demand and owned performance

| Source | Status/fit | Inputs → outputs | Limitations and interpretation | Official source |
| --- | --- | --- | --- | --- |
| Google Trends UI/CSV/Trending RSS | free proprietary; medium | term/topic/geography/time → normalized interest and related/rising queries | sampled relative 0–100, not volume/sales; standard comparison limits; preserve query type and scaling | [Trends](https://trends.google.com/trends/) · [Caveats](https://support.google.com/trends/answer/4365533?hl=en) · [Trending](https://support.google.com/trends/answer/3076011?hl=en) |
| Google Trends API alpha | application-only alpha; high if admitted | programmatic term/time/geography → consistently scaled series | not generally available/SLA; about five years rolling history; schema may change | [API](https://developers.google.com/search/apis/trends) |
| Google Trends BigQuery | official public dataset; high | SQL → top/rising query tables | top/rising queries, not arbitrary histories; country/US-DMA coverage differs | [Guide](https://support.google.com/trends/answer/12764470?hl=en) |
| Google Keyword Planner UI | no separate subscription but Ads account setup/billing required; medium | seeds/site/CSV + geography/language → ideas, modeled demand, competition/bids/forecasts | low/sensitive terms withheld; modeled/rounded auction data ≠ organic traffic | [Help](https://support.google.com/google-ads/answer/7337243?hl=en) |
| Keyword Planning API | Google Ads API; high after approval | seeds/site → ideas, historical metrics, themes and forecasts | access tier and per-customer planning rates; modeled auction estimates | [Overview](https://developers.google.com/google-ads/api/docs/keyword-planning/overview) |
| Google Search Console API | verified property; high | property/date/dimensions/filters → clicks, impressions, CTR, position, index/sitemap data | top-row prioritization, anonymized query omission; average position ≠ literal rank | [Reference](https://developers.google.com/webmaster-tools/v1/api_reference_index) · [Quotas](https://developers.google.com/webmaster-tools/limits) |
| Search Console BigQuery export | verified property; very high | daily site/URL performance tables and logs | enable before need; no backfill; anonymized queries absent; storage costs/retention | [Overview](https://support.google.com/webmasters/answer/12918484?hl=en) · [Schema](https://support.google.com/webmasters/answer/12917991?hl=en) |
| Search Console GenAI Performance | global UI rollout 2026-08-31; low | UI → GenAI Search/Discover impressions/cited pages/countries/devices/time | no dedicated public API field as of snapshot; citations/impressions ≠ visits/conversions | [Announcement](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) |
| Bing Webmaster Tools API | free verified-site REST/JSON; high | OAuth/key → page/query, crawl, links, keywords, sitemaps/submission | SOAP/POX retired 2026-08-31; use REST/JSON; no one universal read quota | [Overview](https://learn.microsoft.com/en-us/bingwebmaster/) · [Access](https://learn.microsoft.com/en-us/bingwebmaster/getting-access) |
| Bing AI Performance | public-preview UI; low | UI → Bing/Copilot citations, grounding queries and cited URLs | no matching documented API method; citations ≠ traffic | [Announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) |

Do not make [pytrends](https://github.com/GeneralMills/pytrends) a production dependency: it is archived and relies on undocumented endpoints. There is no official general Google Autocomplete or People Also Ask API.

## 3. Crawling, extraction and content velocity

| Tool | License | Role and outputs | Limitation | Official source |
| --- | --- | --- | --- | --- |
| SiteOne Crawler | MIT | Rust binary; URL/list → HTML/JSON/text/sitemap/Markdown/audit evidence | browser mode costs more; obey scope/robots/terms/rates | [Repo](https://github.com/janreges/siteone-crawler) |
| SEOnaut | MIT | Go/MySQL/Docker multi-project technical SEO dashboard | operations burden; no clearly documented general API | [Repo](https://github.com/StJudeWasHere/seonaut) |
| advertools | MIT | Python/Scrapy/DataFrames → crawl, sitemap, robots, log and candidate keyword datasets | combinations are candidates, not measured demand | [Repo](https://github.com/eliasdabbas/advertools) |
| Scrapy | BSD-3-Clause | custom spiders → JSON/JSONL/CSV/XML/local/object storage | generic, no JS/SEO rules by default; permission required | [Repo](https://github.com/scrapy/scrapy) |
| Crawlee | Apache-2.0 | JS/TS/Python HTTP + Playwright/Puppeteer, queues and datasets | browser mode expensive; checks must be built; source terms apply | [Repo](https://github.com/apify/crawlee) |
| Katana | MIT | Go standard/headless crawl and JS endpoint discovery → JSONL | security-oriented; omit intrusive/credential features | [Repo](https://github.com/projectdiscovery/katana) |
| Apache StormCrawler | Apache-2.0 | distributed crawl streams to Kafka/OpenSearch/Solr | high complexity and no marketing diagnosis; use only at scale | [Project](https://stormcrawler.apache.org/) |
| Trafilatura | Apache-2.0 current | URL/HTML → cleaned text/metadata/comments in structured formats | extraction ≠ crawl permission; dynamic/atypical pages can fail | [Repo](https://github.com/adbar/trafilatura) |
| changedetection.io | Apache-2.0 | permitted URL/selectors/PDF/browser steps → diffs/RSS/webhooks/screenshots | lawful allow-list; no stealth/CAPTCHA bypass | [Repo](https://github.com/dgtlmoon/changedetection.io) |
| WordPress REST API | WordPress GPL/public per site | posts/pages with date/search/taxonomy → records | sites can disable or omit custom types | [Docs](https://developer.wordpress.org/rest-api/) |
| Common Crawl | free corpus/index | CDX/WARC/WAT/WET → historical captures/content | sampled/lagged/incomplete; not ranking data; publisher rights persist | [Project](https://commoncrawl.org/) |
| KeyBERT | MIT | text → semantically relevant keyphrases | relevance ≠ search volume/difficulty/intent | [Repo](https://github.com/MaartenGr/KeyBERT) |
| SEO Macroscope | GPL-3.0; limited maintenance | Windows GUI → Excel/CSV audit | older desktop stack; assess before production | [Repo](https://github.com/nazuke/SEOMacroscope) |

## 4. Audience questions and public conversation

| Source | Status/fit | Best use | Limitation | Official source |
| --- | --- | --- | --- | --- |
| AnswerThePublic | proprietary free account; low | seed/region/platform → questions/comparisons/PAA/social/AI prompts | roughly three free searches/day and restricted export/metrics; no documented free API | [Limits](https://answerthepublic.zendesk.com/hc/en-us/articles/22617503900187-Is-There-a-Free-Version-of-AnswerThePublic) |
| Talkwalker Free Social Search | proprietary free UI; low | recent supported-source mentions/engagement/sentiment/themes | short window, no free API, proprietary sampling/models | [Search](https://www.talkwalker.com/social-media-analytics-search) |
| Talkwalker Alerts | free email/RSS/Slack alerts; medium | ongoing query discovery | not complete historical corpus; opaque coverage/dedupe | [Alerts](https://www.talkwalker.com/alerts) |
| GDELT DOC/Context | free HTTP/JSON/RSS; high | Boolean entity/geo/language/time → articles, timelines, tone, sentence context | rolling/search-window and news-bias/model limitations | [DOC](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/) · [Context](https://blog.gdeltproject.org/announcing-the-gdelt-context-2-0-api/) |
| Media Cloud | hosted API; client Apache-2.0; high | query/date/source collection → stories/counts/source data | curated online-news collections, not whole web/social; account quota | [Project](https://www.mediacloud.org/) · [Client](https://github.com/mediacloud/api-client) |
| Stack Exchange API | free REST/key; high | tags/date/score → questions/answers/engagement | about 10,000/day keyed default; cached; only SE communities | [API](https://api.stackexchange.com/docs) |
| YouTube Data API | proprietary free quota; high | search/channel/video/comment → metadata/statistics/comments | search expensive; higher quota audit; no arbitrary transcript access | [API](https://developers.google.com/youtube/v3) · [Costs](https://developers.google.com/youtube/v3/determine_quota_cost) |
| Bluesky Jetstream | dual MIT/Apache-2.0; high | public JSON stream → posts/profiles/reactions/deletes | process deletes/privacy changes and limits | [Docs](https://docs.bsky.app/blog/jetstream) |
| Mastodon APIs | AGPL software; medium | per-instance search/trends/stream | no global federation search; instance access/config differs | [API](https://docs.joinmastodon.org/api/) |
| Reddit Data API | proprietary/approval; conditional | permitted post/comment discovery | commercial monitoring may require agreement; no scraping/private groups | [Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) |
| LinkedIn Community Management API | proprietary/reviewed; owned pages | authorized organization posts/engagement | only roles/owned assets; no broad competitor OSINT | [Overview](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview?view=li-lms-2026-08) |

### Free-first composites

| Need | Composite |
| --- | --- |
| audience questions | first-party GSC/Bing + Stack Exchange + YouTube + Trends related/rising + KeyBERT over permitted corpora |
| news SOV | GDELT and Media Cloud, calculated separately then compared |
| emerging conversation | Bluesky + selected Mastodon + Google/Talkwalker RSS alerts |
| competitor content velocity | sitemaps/WordPress REST/Common Crawl/changedetection + YouTube |
| historical open web | Common Crawl + Trafilatura |
| short-form creative | manual TikTok Creative Center evidence; no unofficial scraper |

## 5. Analytics and conversion intelligence

| Tool | Status/license | Capability | Limitation | Official source |
| --- | --- | --- | --- | --- |
| GA4 Standard | free proprietary; 360 paid | SDK/GTM/Measurement Protocol/Data API/BigQuery → events and reports | Standard BigQuery daily export caps and API/retention limits; 2xx receipt ≠ event validity | [Data API](https://developers.google.com/analytics/devguides/reporting/data/v1) · [BigQuery](https://support.google.com/analytics/answer/9823238) |
| Matomo Community | GPL-3.0-or-later | self-host tracking/reporting APIs → structured analytics | operator owns infrastructure/security; some funnels/heatmaps/replay/forms are paid plugins | [Pricing](https://matomo.org/pricing/) · [APIs](https://matomo.org/guide/apis/) |
| Plausible CE | AGPL-3.0 | lightweight self-host aggregate analytics/Stats API | aggregates only; deliberately lacks replay/deep journey/retargeting | [Self-host](https://plausible.io/self-hosted-web-analytics) |
| PostHog | MIT core except proprietary `ee`; cloud free allowances | events, funnels, replay, experiments, surveys, flags, API/exports | user-level data raises privacy burden; cloud allowance/retention and bulk-query rules | [Repo](https://github.com/PostHog/posthog) · [API](https://posthog.com/docs/api) |
| Umami | MIT | self-host script/events/API → aggregate analytics | lighter experimentation/journey features; PostgreSQL/maintenance | [Repo](https://github.com/umami-software/umami) |
| Microsoft Clarity | free proprietary | recordings, heatmaps, frustration signals, narrow export | API only recent 1–3 days, small dimension/row/request limits; youth-site restriction | [Overview](https://learn.microsoft.com/en-us/clarity/setup-and-installation/about-clarity) |
| Open Web Analytics | GPL-2.0-or-later | self-host tracking and HMAC REST API | smaller ecosystem, operator security/maintenance | [Repo](https://github.com/Open-Web-Analytics/open-web-analytics) |

## 6. Performance, accessibility and experimentation

| Tool | License/status | Role | Limitations | Official source |
| --- | --- | --- | --- | --- |
| Lighthouse / Lighthouse CI | Apache-2.0 | lab performance/accessibility/best-practice/SEO reports and regression budgets | synthetic/variable and page-specific; repeat and version config; accessibility incomplete | [Lighthouse](https://github.com/GoogleChrome/lighthouse) · [LHCI](https://github.com/GoogleChrome/lighthouse-ci) |
| PageSpeed Insights API | free official API | URL/device/categories → Lighthouse JSON | one URL/request, less control; use CrUX directly for field data | [Docs](https://developers.google.com/speed/docs/insights/v5/get-started) |
| CrUX API/History | free official aggregate Chrome field data | eligible URL/origin/form factor → rolling distributions/history | insufficient-traffic gaps, lag, overlapping windows/no SLA | [API](https://developer.chrome.com/docs/crux/api) · [Methodology](https://developer.chrome.com/docs/crux/methodology/) |
| WebPageTest | current main Polyform Shield; older branch Apache | real-browser waterfall/filmstrip/video/Lighthouse | hosted free tier around 150 runs/month but no API/schedules; main is source-available, not unqualified OSS | [Plans](https://www.webpagetest.org/signup) · [Repo](https://github.com/catchpoint/WebPageTest) |
| axe-core | MPL-2.0 | automated structured accessibility results | detects only a portion of WCAG; incomplete/human interaction review required | [Repo](https://github.com/dequelabs/axe-core) |
| Pa11y/Pa11y CI | LGPL-3.0-only | scripted/sitemap accessibility checks → structured reports | engine/page state affects results; automated scan ≠ conformance | [Pa11y](https://github.com/pa11y/pa11y) · [CI](https://github.com/pa11y/pa11y-ci) |
| WAVE API | proprietary introductory credits | URL → accessibility JSON/XML | limited credits, concurrency/public-page constraints; not recurring free core | [API](https://wave.webaim.org/api/) |
| GrowthBook | MIT/open core with licensed enterprise areas | warehouse/API/SDK experiments and flags | needs correct exposure/randomization/MDE/sample/traffic; not a crawler | [Repo](https://github.com/growthbook/growthbook) |

## 7. Email and landing diagnostics

| Tool | License | Role | Limitation | Official source |
| --- | --- | --- | --- | --- |
| checkdmarc | Apache-2.0 | domains → SPF/DMARC/BIMI/MX/STARTTLS/DNSSEC/DANE/MTA-STS/TLS-RPT | DNS posture ≠ inbox placement; live SMTP checks are direct and can be blocked | [Repo](https://github.com/domainaware/checkdmarc) |
| parsedmarc | Apache-2.0 | authorized aggregate reports/mailbox → structured DMARC data/DB/webhook | requires target-controlled report stream; reports lag and do not show reads | [Repo](https://github.com/domainaware/parsedmarc) |
| Mailpit | MIT | test SMTP/MIME/HTML/link/image/spam/screenshot evidence | test environment only; not real inbox placement | [Repo](https://github.com/axllent/mailpit) |
| Can I Email | MIT | HTML/CSS feature → client support matrix | not a live render for every account/configuration | [Repo](https://github.com/hteumeuleu/caniemail) |
| Mautic | GPLv3 | self-host forms/campaigns/API/webhooks/reports | SMTP/cron/consent/maintenance; privacy proxies distort opens | [Repo](https://github.com/mautic/mautic) |
| listmonk | AGPL-3.0 | self-host newsletter/list API and delivery stats | newsletter-focused; needs SMTP; cache large aggregates | [Repo](https://github.com/knadh/listmonk) |

Prioritize delivered clicks, replies, qualified conversions, and contribution per delivered message. Opens are secondary because privacy features can prefetch tracking content.

## 8. Local/geographic intelligence

| Source | Status | Use | Limitation | Official source |
| --- | --- | --- | --- | --- |
| Google Business Profile | free claiming; owned OAuth APIs | authorized listing and performance metrics | not competitor review/mining API; quotas/access; call clicks ≠ completed calls | [Business API](https://developers.google.com/my-business/reference/businessinformation/rest) · [Performance](https://developers.google.com/my-business/reference/performance/rest/v1/DailyMetric) |
| Apple Business Connect | free portal; partner API | authorized brand/location management | API partner-gated; no competitor mining | [Guide](https://support.apple.com/guide/apple-business-connect/welcome/web) |
| Bing Places | free portal; partner API | listing management | production API needs trusted partner; full-record replacement semantics | [Portal](https://www.bingplaces.com/) |
| Overture Maps Places | monthly bulk open data; per-source CDLA-Permissive-2.0/Apache-2.0 | Parquet places/GERS → corpus presence | not reviews/rank/demand; coverage/conflation error; per-record license | [Guide](https://docs.overturemaps.org/guides/places/) |
| OpenStreetMap Overpass/Nominatim | ODbL data | geographic tags/entities/geocoding | public Nominatim 1 request/sec and Overpass fair use; tags inconsistent; ODbL obligations | [Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/) · [Overpass](https://wiki.openstreetmap.org/wiki/Overpass_API) |

## 9. Defensible measures

```text
Unanswered Demand Ratio = evidenced high-intent clusters without adequate owned answer
                        / all evidenced high-intent clusters

Owned Query Opportunity = GSC impressions
                        × max(0, attainable target-cohort CTR − actual CTR)

Corpus SOV = target qualifying mentions
           / target + competitor mentions in same corpus/query/window

Step conversion = next-step completions / eligible prior-step users

Qualified lead rate = accepted qualified leads / unique eligible visitors

DMARC alignment pass = aligned authenticated reported messages / total reported messages

GBP actions per impression = (website clicks + call clicks + directions + bookings/orders)
                           / GBP impressions
```

Because one impression can lead to more than one recorded action, this ratio can exceed 1 and is not a probability.

For every ratio, define the eligible denominator; if it is zero, report `not estimable` rather than zero or infinity.

Also measure content velocity, median content age, inter-publication variability, new/lost query cohorts, creative survival/novelty, trend-to-content response lag, p75 field LCP/INP/CLS, experiment intervals/MDE, accessibility results plus manual review, complaints/unsubscribes per delivered, listing consistency and geographic gaps.

## 10. Financial guardrail

Do not directly convert sentiment, potential reach, Trends indices, ad-creative counts, AI citations, DNS posture, or raw SOV into revenue. They are leading indicators unless target history establishes a relationship.

```text
Annual organic scenario = monthly eligible impressions
                        × validated CTR lift
                        × observed landing conversion
                        × contribution per conversion × 12

Landing leakage scenario = annual eligible sessions
                         × validated achievable conversion gap
                         × contribution per conversion
```

Label all public-only inputs as benchmark/assumption and show low/base/high.

## 11. Free-first stack

1. **Public competitor evidence:** Google ATC bulk, Trends RSS/BigQuery, GDELT, Media Cloud, YouTube, Bluesky/Mastodon, Common Crawl, Overture/OSM, public sitemaps/WordPress APIs.
2. **Authorized first-party truth:** Google Ads/Search Console/GA4/Business Profile, Bing Webmaster, owned LinkedIn analytics, target DMARC/email events.
3. **Self-host diagnostics:** SiteOne/advertools/Trafilatura/changedetection, Lighthouse CI/CrUX/axe/Pa11y, checkdmarc/parsedmarc/Mailpit, one analytics platform, GrowthBook.
4. **Manual lane:** Meta/Google ad UIs, TikTok Creative Center, AnswerThePublic, Talkwalker Free Search, non-partner local portals.

## 12. LAKA ladder

| State | Marketing intelligence capability |
| --- | --- |
| Baseline | manual creative/content/journey snapshot and source-ledger |
| Minor | scheduled official feeds/APIs, page change tracking, basic demand-to-asset map |
| Major | first-party analytics joined to public demand, creative cohorts and controlled tests |
| Structural | warehouse/event schema, identity/consent/governance, cross-channel feedback and experiment program |
| Paradigm | optimize for a new unit of value—qualified learning, intent debt repaid, or customer outcome—not media volume |
