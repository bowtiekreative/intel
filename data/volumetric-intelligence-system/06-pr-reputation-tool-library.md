# PR, Reputation and Narrative Tool Library

Research snapshot: 2026-09-01. “Free” describes access; “open source” describes code. Neither automatically authorizes commercial collection, retention, training, republication, or lead generation.

## 1. Access hierarchy

1. official API or first-party export;
2. publisher RSS/Atom/JSON Feed;
3. licensed archive/dataset;
4. publisher permission;
5. manual citation-only review;
6. skip the source.

```text
Source → purpose check → access authorization → collect → rights classify
→ normalize → deduplicate → verify → cluster → score → human review
→ evidence → outreach
```

## 2. News, media and web mentions

| Tool/source | Status | Interface and best use | Limits/cautions | Official source |
| --- | --- | --- | --- | --- |
| GDELT | free/open-access data service; not an OSI software license for corpus | APIs, bulk and BigQuery → URLs, events, GKG, timelines, tone/context; global discovery and history | broad but uneven; 15-minute updates; dedupe syndication; “tone” ≠ public opinion; publisher rights persist | [Project](https://www.gdeltproject.org/) · [Data](https://www.gdeltproject.org/data.html) |
| Media Cloud | account/API; official Python client Apache-2.0 | REST/Python → story counts/metadata/URLs/source collections; comparative panels/SOV | curated archive, not universal/social firehose; client license ≠ content rights | [API guide](https://www.mediacloud.org/documentation/search-api-guide) · [Client](https://github.com/mediacloud/api-client) |
| Guardian Open Platform | free developer key for noncommercial use | REST → Guardian search/metadata/text where enabled | 1 request/sec, 500/day; commercial mining/sentiment requires arrangement | [Access](https://open-platform.theguardian.com/access/) |
| NewsAPI | proprietary dev plan | REST → headlines/snippets/URLs | free: 100/day, 24-hour delay, one-month history, localhost/development only; not production/commercial | [Pricing](https://newsapi.org/pricing) |
| GNews API | proprietary dev/noncommercial plan | REST → article metadata/snippets/URLs | free: 100/day, 10 results/request, 12-hour delay, 30 days, truncated content | [Pricing](https://gnews.io/pricing) |
| Google Alerts | free UI/email | expressions → email discovery | no supported API/completeness/count; do not scrape search results | [Help](https://support.google.com/websearch/answer/4815696) |
| Talkwalker Alerts | free proprietary alert service | Boolean query → email/RSS across news/blogs/forums/web; vendor advertises X | not paid Talkwalker coverage; no general API, opaque sampling; validate source claims | [Alerts](https://www.talkwalker.com/alerts) |
| Google Trends | free UI/CSV/RSS; alpha API limited | search-interest series/trending queries → relative interest | sampled/relative, not volume/SOV/sales/sentiment; alpha not generally available | [Official API](https://developers.google.com/search/apis/trends) |
| Common Crawl | free corpus; downloader MIT/Apache-2.0 | WARC/WAT/WET/index → historic pages/metadata/text | incomplete/not live; inclusion does not erase copyright/privacy/deletion duties | [Project](https://commoncrawl.org/) |
| Wayback Machine | free public archive | URL/history → snapshots | incomplete/removable/throttled; source/capture time required; no bulk republication | [Developers](https://archive.org/developers/) · [Terms](https://archive.org/about/terms.php) |

## 3. Social and review sources

| Source | Status/interface | Appropriate use | Limits and stop rules | Official source |
| --- | --- | --- | --- | --- |
| Reddit Data API | OAuth API; free access conditional | approved-purpose subreddit/search/post/comment discovery | roughly 100 queries/min OAuth baseline but headers govern; commercial uses may need agreement; deletion synchronization; no private communities/web scraping/limit evasion | [Data API Terms](https://redditinc.com/policies/data-api-terms) · [Developer Terms](https://redditinc.com/policies/developer-terms) |
| Bluesky/AT Protocol Jetstream | dual MIT/Apache-2.0 code | WebSocket/repo stream → public JSON events; strong narrative discovery | rate rules and deletion handling; public does not erase privacy/context duties | [Jetstream](https://docs.bsky.app/blog/jetstream) · [Repo](https://github.com/bluesky-social/jetstream) |
| Mastodon | AGPL-3.0 server; per-instance APIs | public per-instance accounts/hashtags/statuses → JSON/stream | default around 300 requests/5 min but instance-specific; partial fediverse visibility; exclude private/unlisted targets | [API](https://docs.joinmastodon.org/api/) · [Limits](https://docs.joinmastodon.org/api/rate-limits/) |
| YouTube Data API | proprietary API with free quota | search/channel/video/comment metadata | search uses high quota; daily pool and endpoint costs apply; no general transcript scrape; caption download usually owner-authorized | [Getting started](https://developers.google.com/youtube/v3/getting-started) · [Costs](https://developers.google.com/youtube/v3/determine_quota_cost) |
| X API | proprietary pay-per-use | approved search/read use | no free core; policy restricts redistribution, deletion sync, benchmarking and some repurposing; never scrape x.com | [Pricing](https://docs.x.com/x-api/getting-started/pricing) · [Policy](https://docs.x.com/developer-terms/policy) |
| Meta Content Library/API | controlled research access | qualified academic/nonprofit public-interest research | not a general commercial connector; CrowdTangle discontinued 2024-08-14; no general FB/IG scraping | [Docs](https://developers.facebook.com/docs/content-library-and-api/) |
| TikTok Research API | controlled nonprofit research access | qualified research on public videos/users/comments | not commercial prospect profiling; eligibility and daily/request caps; no bypass via scraping | [Getting started](https://developers.tiktok.com/doc/research-api-get-started) |
| TikTok Commercial Content API | approval-gated transparency | ads/commercial-content metadata | jurisdiction scope (Europe-focused) and not a general comment/firehose source | [Docs](https://developers.tiktok.com/doc/commercial-content-api-getting-started) |
| Google Places API | billing required, monthly no-charge caps | place identity/rating and up to five review samples | tiny relevance-ranked sample; attribution/caching/display rules; not corpus sentiment | [Place resource](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) · [Pricing](https://developers.google.com/maps/billing-and-pricing/pricing) |
| Trustpilot APIs | key/OAuth and contractual terms | approved business-unit/review retrieval including replies | public access ≠ content license; deletion/refresh/rate rules; commercial partner use may require agreement; no scraping | [Portal](https://developers.trustpilot.com/) · [Limits](https://developers.trustpilot.com/rate-limiting/) |
| Yelp Places | trial/paid proprietary API | permitted business display/limited excerpts | ordinary integration not commercial review analysis; caching limits; site scraping prohibited; Yelp Insights for analysis | [Intro](https://docs.developer.yelp.com/docs/places-intro) · [Scraping policy](https://www.yelp-support.com/article/Can-I-copy-or-scrape-data-from-the-Yelp-site?l=en_US) |
| BBB | manual spot-check only unless licensed/permitted | narrow citation of public record | terms restrict aggregation/republication/sales use; submissions not necessarily verified; no scraping/lead database | [Terms](https://www.bbb.org/terms-of-use) |
| Glassdoor | manual citation or licensed data | qualitative employment-reputation context where relevant | 2026 terms restrict bots/scraping/mining/competitive use; do not automate or profile authors | [Terms](https://www.glassdoor.com/about/terms/) |
| LinkedIn | manual public business review; approved owned-asset APIs | current executive/company context from public business material | no broad people/listening API; user agreement prohibits scraping; do not harvest profiles/emails/relationships | [User Agreement](https://www.linkedin.com/legal/user-agreement) · [Developer docs](https://learn.microsoft.com/linkedin/) |

## 4. Narrative verification

| Tool | Status/license | Use | Limitation | Official source |
| --- | --- | --- | --- | --- |
| Google Fact Check Tools API | proprietary API-key service | query → ClaimReview records and reviewer ratings | publisher assessment, not universal truth; preserve reviewer/source | [API](https://developers.google.com/fact-check/tools/api) |
| InVID-WeVerify/vera.ai plugin | MIT | video keyframes/metadata/forensic launchers → analyst evidence bundle | does not autonomously prove truth; external services have terms | [Project](https://www.invid-project.eu/tools-and-services/invid-verification-plugin/) · [Repo](https://github.com/AFP-Medialab/verification-plugin) |
| Junkipedia | controlled public-interest platform | multi-platform narrative/actor research for eligible users | do not assume commercial eligibility or downstream rights | [Site](https://www.junkipedia.org/) |
| Hoaxy | GPL-3.0 frontend; archived 2023 | historical diffusion design pattern | X dependency and archive status make it unsuitable for production | [Repo](https://github.com/osome-iu/hoaxy-frontend) |

Keep these separate: observable statement, claim, named fact-check, corroboration, semantic narrative cluster, coordination indicator, verified fact. Similar timing/wording/hashtags do not prove coordinated inauthentic behavior.

## 5. Open-source ingestion and monitoring

| Component | License | Role | Rights/operations note | Official source |
| --- | --- | --- | --- | --- |
| RSSHub | AGPL-3.0 | route adapters → RSS/Atom | adapter code does not authorize target collection; allow-list reviewed routes | [Repo](https://github.com/DIYgod/RSSHub) |
| FreshRSS | AGPL-3.0 | feed/OPML → analyst inbox/API | preserve publisher links/rights; avoid unauthorized full-page fetch | [Repo](https://github.com/FreshRSS/FreshRSS) |
| Miniflux | Apache-2.0 | lightweight feed store/API on PostgreSQL | same publisher content/deletion constraints | [Repo](https://github.com/miniflux/v2) |
| changedetection.io | Apache-2.0 | permitted URL + selectors → diffs/webhooks/RSS | polite allow-list; no CAPTCHA/stealth bypass or login/personal pages | [Repo](https://github.com/dgtlmoon/changedetection.io) |
| Scrapy | BSD-3-Clause | permitted URLs + extraction rules → structured records | framework license is not scraping permission | [Repo](https://github.com/scrapy/scrapy) |
| Trafilatura | current Apache-2.0; older releases differ | allowed HTML/feeds/sitemaps → cleaned text/metadata | no paywall/auth/anti-bot bypass; pin/version license | [Repo](https://github.com/adbar/trafilatura) |

Use Miniflux or FreshRSS—not both—as the canonical feed store. Add RSSHub only for reviewed adapters.

## 6. NLP, clustering and network analysis

| Library | License | Best role | Limitation | Official source |
| --- | --- | --- | --- | --- |
| VADER | MIT | transparent English short-text sentiment baseline | poor on jargon, languages, sarcasm, quotations/mixed sentiment | [Repo](https://github.com/cjhutto/vaderSentiment) |
| spaCy | MIT library | NER, PII redaction, rules/classifiers | pipeline/model licenses and language quality vary | [Repo](https://github.com/explosion/spacy) |
| Transformers | Apache-2.0 library | selected sentiment/stance/NER/summarization models | each model has separate license/data/bias/compute; some noncommercial | [Repo](https://github.com/huggingface/transformers) |
| Sentence Transformers | Apache-2.0 library | embeddings, dedupe, clustering and semantic comparison | model license/threshold/language calibration | [Repo](https://github.com/huggingface/sentence-transformers) |
| BERTopic | MIT | complaint/narrative topic discovery | topics depend on corpus/model/parameters/seed | [Repo](https://github.com/MaartenGr/BERTopic) |
| KeyBERT | MIT | candidate keyphrases/query expansion | relevance ≠ demand/importance; human label review | [Repo](https://github.com/MaartenGr/KeyBERT) |
| scikit-learn | BSD-3-Clause | transparent calibrated domain classifiers/evaluation | needs representative labels and drift tests | [Repo](https://github.com/scikit-learn/scikit-learn) |
| NetworkX | BSD-3-Clause | citation/co-mention/diffusion graphs | centrality ≠ influence, intent or coordination | [Repo](https://github.com/networkx/networkx) |

Maintain a model registry: package/model version, license, intended use, languages, evaluation set, precision/recall/F1 and error slices, retirement date.

## 7. Sources not to scrape

Do not build automated commercial collectors for LinkedIn profiles/posts, Glassdoor reviews, BBB complaints, Yelp pages/reviews, Google Search/Maps HTML, general Facebook/Instagram content, general TikTok feed/comments, x.com, Reddit web pages/private communities, login-walled/private/deleted content, or leaked credential/dark-web dumps. Use official APIs/exports, permission/licensing, manual citation-only review, or exclusion.

## 8. PR metrics

```text
Comparison set = target + up to three selected comparators

Unweighted SOV = target deduplicated qualifying story clusters
               / all comparison-set qualifying story clusters

Weighted story value = source quality × prominence × capped reach proxy × relevance
Weighted SOV = target weighted story value / all comparison-set weighted story value

Net sentiment = (positive − negative) / (positive + negative + neutral + uncertain)

Issue share = negative items assigned to issue / all relevant negative items

Crisis velocity z = (current negative volume − baseline mean) / baseline standard deviation
                    only when baseline standard deviation > 0;
                    otherwise report absolute and percentage change without a z-score

Response gap = actionable negative items unresolved beyond SLA / actionable negative items
```

Bootstrap uncertainty over story clusters or source-days, not syndicated URLs. Report denominator, languages, source panel, duplicate rate, missing periods, classifier F1, false positives and likely blind spots.

When a metric denominator is zero, report `not estimable` rather than zero, infinity, or an imputed rate.

If issue coding is multi-label, call the metric `Issue prevalence in collected items`; its category shares may sum above 100%. Use `Issue share` only for a mutually exclusive coding scheme.

## 9. LAKA ladder

| State | Reputation intelligence system |
| --- | --- |
| Baseline | alerts/RSS and manual weekly evidence review |
| Minor | daily permitted APIs/feeds, canonicalization and duplicate clustering |
| Major | multilingual entity resolution, calibrated sentiment/stance, issue taxonomy and competitor panels |
| Structural | event-sourced evidence graph, rights registry, deletion sync, method versioning and CRM evidence links |
| Paradigm | narrative digital twin with scenario/intervention measurement; no causal claim without experimental/causal design |

Every opportunity carries four separate labels: observed fact, analytic inference, financial assumption and recommended action.
