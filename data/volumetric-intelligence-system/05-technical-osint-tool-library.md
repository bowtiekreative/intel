# Technical and Passive OSINT Tool Library

Research snapshot: 2026-09-01. Verify licenses, free-tier limits, API schemas, and source terms again before deployment. An open-source collector does not grant rights to collect from an upstream source.

## 1. Mode legend

| Mode | Meaning |
| --- | --- |
| CM0 | query third-party/open datasets or analyze already obtained artifacts; passive core |
| CM1 | low-impact direct retrieval such as an ordinary public page/DNS lookup or permitted rendered-page capture; policy and rate review required |
| CM2 | active resolution/probing, port/service interaction, or third-party scan submission; excluded and routed to a separately scoped security engagement |
| CM3 | authentication, credential validation, exploitation, disruption, or alteration; prohibited in this system |

Many tools support several modes. The connector profile—not the product name—determines whether use is passive.

## 2. Deployable open-source components

| Tool | License/status | Purpose and I/O | Integration fit | Passive profile and limitations | Official source |
| --- | --- | --- | --- | --- | --- |
| OWASP Amass v5 | Apache-2.0; components may vary | domain/org seeds → asset graph, names, IPs, ASNs, relationships, provenance | Go CLI/library, Docker, PostgreSQL | source allow-list; disable active enumeration, brute force, probing and alteration; discovery does not prove ownership | [Repository](https://github.com/owasp-amass/amass) · [Docs](https://owasp-amass.github.io/docs/) |
| SpiderFoot | MIT | multi-source OSINT aggregation and relationship exploration from approved targets | Python CLI/web UI; many independent modules and upstream APIs | create a module-level CM profile; allow only reviewed passive providers, disable active scan/breach/credential modules, and review every upstream key/term/quota separately; aggregator output is a lead, not proof | [Repository and license](https://github.com/smicallef/spiderfoot) |
| ProjectDiscovery Subfinder | MIT | domains → candidate subdomains from passive providers | Go CLI/library, JSON, streams | providers and quotas vary; optional DNS resolution is CM1; keep upstream provenance | [Repository](https://github.com/projectdiscovery/subfinder) |
| Findomain | GPL-3.0 | domains → CT/archive/provider candidates, SQLite/monitor outputs | Rust binary, Docker | disable DNS/HTTP/screenshot/port-scan features; review each provider's terms | [Repository](https://github.com/Findomain/Findomain) |
| assetfinder | MIT | domain → related domains/subdomains | small Go streaming CLI | aging provider integrations; lead generator only | [Repository](https://github.com/tomnomnom/assetfinder) |
| Cert Spotter | MPL-2.0 | watched domains → new certificate-transparency events | Go CLI/hooks | certificate issuance is historical evidence, not current deployment or ownership | [Repository](https://github.com/SSLMate/certspotter) |
| openrdap/rdap | MIT | domain/IP/ASN/entity → authoritative current registration records | Go CLI/library | redaction and registry rate limits; current, not historical WHOIS | [Repository](https://github.com/openrdap/rdap) · [IANA bootstrap](https://www.iana.org/assignments/rdap-dns/) |
| gau | MIT | domains → URLs known to Wayback, Common Crawl, OTX and urlscan | Go CLI, JSON, filters | URLs may be stale; do not automatically fetch/test them | [Repository](https://github.com/lc/gau) |
| WappalyzerGo | MIT | previously fetched headers/body → possible technology/version map | embedded Go library | heuristic; record matched rule/evidence; never jump to vulnerability claim | [Repository](https://github.com/projectdiscovery/wappalyzergo) |
| webappanalyzer fingerprints | GPL-3.0 | headers/HTML/scripts/cookies/DNS → technology matches | versioned fingerprint JSON | license review before embedding; heuristic and version-sensitive | [Repository](https://github.com/enthec/webappanalyzer) |
| WhatWeb | GPL-2.0 | public URL → technology fingerprint; JSON/XML/SQL | Ruby CLI, large plugin set | makes direct requests; CM1 with explicit rate/terms profile; aggression level 1 only | [Repository](https://github.com/urbanadventurer/WhatWeb) |
| ExifTool | Artistic License or GPL, same terms as Perl | local document/media → metadata, JSON/CSV | mature CLI/Perl API | isolate untrusted files; metadata can be false; redact author/GPS/PII | [Repository](https://github.com/exiftool/exiftool) · [Site](https://exiftool.org/) |
| Apache Tika | Apache-2.0 | local files → MIME, text and metadata | Java library/CLI/REST | containerize without network; file/page/time/memory limits; stay patched | [Project](https://tika.apache.org/) |
| oletools | BSD-style package; bundled parts vary | Office/OLE/RTF/OOXML → macros, objects, DDE/XLM indicators | Python library/CLIs | never execute documents/macros; indicators are not proof of maliciousness | [Repository](https://github.com/decalage2/oletools) |
| FOCA | GPL-3.0 | public documents → metadata, paths, names and relationships | Windows GUI/.NET/SQL Server | weaker unattended Linux fit; prefer local analysis and avoid search-engine scraping | [Repository](https://github.com/ElevenPaths/FOCA) |
| Metagoofil maintained fork | GPL-3.0-or-later | domain/query → public document discovery/download | Python/Docker | Google scraping is brittle; no proxies/CAPTCHA/rate evasion; prefer official/archive discovery | [Repository](https://github.com/opsdisk/metagoofil) |
| Gitleaks | MIT | authorized/public repository history → possible secrets, SARIF/JSON/CSV | Go CLI/CI | never validate/use secrets; retain redacted type/path/commit/fingerprint only | [Repository](https://github.com/gitleaks/gitleaks) |
| detect-secrets | Apache-2.0 | local files/repos → heuristic secret baseline | Python CLI/library/plugins | use `--no-verify`; detector output is “possible secret,” not proof | [Repository](https://github.com/Yelp/detect-secrets) |
| TruffleHog | AGPL-3.0 | repos/files/cloud connectors → secret candidates/provenance | CLI/container | credential verification is CM3 and excluded; use only after validating a no-verification configuration and license fit | [Repository](https://github.com/trufflesecurity/trufflehog) |
| OSV-Scanner | Apache-2.0 | authorized manifests/lockfiles/SBOMs/images → package advisory matches | CLI/Go, offline DB, JSON/SARIF/SBOM | public artifact must be confidently attributed; package match does not prove deployed/reachable code | [Repository](https://github.com/google/osv-scanner) |

### Conditional aggregator

[theHarvester](https://github.com/laramies/theHarvester) distinguishes passive, DNS, and active HTTP/TLS/scan sources and can emit JSONL/SQLite with provenance. Only passive and ordinary DNS profiles map to CM0/CM1 here; its active modes map to excluded CM2. The repository's licensing should be rechecked before vendoring, and every upstream provider must pass its own commercial-use review.

## 3. Hosted free/open-data sources

| Service | Status/access | I/O and fit | Current limitations and safe interpretation | Official source |
| --- | --- | --- | --- | --- |
| crt.sh | no-key hosted CT search | domain/pattern → certificate/name records; commonly JSON | no formal API SLA/quota; throttle/cache; issuance ≠ current asset | [crt.sh](https://crt.sh/) |
| Censys Free | hosted account/PAT | host/web/certificate search and lookups; official SDKs/CLI | about 100 credits/month; standard query 5, lookup 1; limited pages/concurrency; no Free vuln/history timeline | [Entitlements](https://docs.censys.com/docs/data-access-tiers-entitlements) · [API](https://docs.censys.com/reference/get-started) |
| BuiltWith Free API | key, hosted free endpoint | root domain → technology group/category counts and first/last indexed dates | 1 request/second; not the paid detailed technology inventory; root domains only | [Free API](https://api.builtwith.com/free-api) |
| GreyNoise Community | keyless limited or free key | IP → noise/RIOT/classification/last-seen context | limited; free-key allowance documented around 50 searches/week; does not find target assets or prove compromise | [Docs](https://docs.greynoise.io/docs/using-the-greynoise-community-api) |
| urlscan.io Search | API key | existing scan index → page/network/screenshot metadata | search-only is CM0; submitting scans is CM2 and can leak URLs/tokens; dynamic quotas and visibility classes | [Search API](https://docs.urlscan.io/apis/urlscan-openapi/search) · [MIT client](https://github.com/urlscan/urlscan-python) |
| AlienVault OTX | community API | domain/IP/URL/hash → community IOC/pulse context | community data needs corroboration; IOC association ≠ compromise/ownership | [API](https://otx.alienvault.com/api) · [Apache-2.0 SDK](https://github.com/AlienVault-OTX/OTX-Python-SDK) |
| Common Crawl | free CDXJ/JSON index and WARC | URL/domain → captures/status/MIME/WARC; strong offline history | incomplete/stale; source copyright/privacy persists; prefer bulk data to hammering index | [Index](https://commoncrawl.org/cdxj-index) · [Terms](https://commoncrawl.org/terms-of-use) |
| Wayback Machine | public archive | URL → captures and snapshots | incomplete/excluded/throttled; capture date ≠ publication; Save Page Now is an external write | [Wayback](https://wayback.archive.org/) · [Help](https://help.archive.org/help/using-the-wayback-machine/) |
| Arquivo.pt | free archive APIs, GPL-3.0 stack | full-text/images/history/Memento → captures | coverage weighted toward Portuguese/selected international web; historical evidence only | [Repository](https://github.com/arquivo/pwa-technologies) |
| GitHub REST Code Search | authenticated public-code search | org/repo/query → repo/path/SHA/fragments | max 1,000 results, default branch and query/file limits, search rate limits; never validate secrets | [Docs](https://docs.github.com/en/rest/search/search#search-code) |
| Have I Been Pwned (HIBP) Pwned Passwords | no-key k-anonymity API/downloads | hash prefix → suffix/count | for authorized password hygiene, not prospect discovery; never send/store plaintext | [API](https://haveibeenpwned.com/API/v3#PwnedPasswords) |
| NVD | free feeds/API | CVE/CPE/CVSS/references → vulnerability knowledge | no-key 5 requests/30s; key 50/30s; banner CPE ≠ target vulnerability | [API](https://nvd.nist.gov/developers/vulnerabilities) |
| CISA KEV | free JSON/CSV | CVE → known-exploited status/dates | exploitation observed somewhere, not evidence target is affected/exploited | [Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) |
| FIRST EPSS | free daily CSV/API | CVE → estimated 30-day exploitation probability | probability ≠ exposure/impact; do not multiply blindly by CVSS; treat KEV separately | [FAQ/API](https://www.first.org/epss/faq) |
| OSV API | free | package/version/commit → advisories | needs reliable package/version; no deployment/reachability proof | [API](https://google.github.io/osv.dev/api/) |
| GitHub Advisory Database | CC-BY-4.0 data | cloneable OSV JSON advisories | same applicability limits; attribution required | [Repository](https://github.com/github/advisory-database) |
| ProjectDiscovery Chaos | account/API | domain → known subdomains; MIT client | commercial/free entitlement is not guaranteed; fail closed until recorded | [Site](https://chaos.projectdiscovery.io/) · [Client](https://github.com/projectdiscovery/chaos-client) |
| LeakIX API | free key advertised for researchers | domain/IP → indexed services/leak records | researcher access may not authorize commercial prospecting; obtain terms clarity; cached records need corroboration | [Docs](https://leakix.net/api-documentation) |

## 4. Not a commercial free core

| Tool/source | Why excluded from the default |
| --- | --- |
| [Shodan InternetDB](https://internetdb.shodan.io/) | free access is non-commercial; commercial audits need licensing; cached `vulns` are heuristic |
| [Netlas Community](https://netlas.io/pricing/) | free Community plan is explicitly personal-use |
| [VirusTotal Public API](https://docs.virustotal.com/reference/public-vs-premium-api) | public API is noncommercial/academic and restricted for business/product use |
| [SecurityTrails API](https://securitytrails.com/corp/api) | API/historical passive DNS/WHOIS access is paid; do not call it free |
| [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview) | closed to new customers; legacy users must transition before 2027-01-01 |
| HIBP email/domain search | account lookups require subscription; domain enumeration requires proof of control; not a free “dark web scan” |
| Nmap, Masscan, Naabu, Nuclei, sqlmap, testssl.sh, scan submissions | direct active interaction; separate written-authorization workflow |
| credential-verification features | prohibited in prospect research; do not authenticate, redeem, or call detected secrets |
| private dark-web database claims | no legitimate comprehensive free/OSS source; licensed specialist plus explicit client authority required |

## 5. Gaps a free passive stack cannot solve

1. Comprehensive historical WHOIS and passive DNS are largely commercial.
2. Current TLS protocols/ciphers require a recent cached observation or an authorized direct assessment; CT cannot show them.
3. Public breach sources cannot prove a password still works, MFA is absent, or the target itself was breached.
4. A passive technology fingerprint cannot establish reachable exploitability.
5. Shared cloud/CDN IPs cannot establish asset ownership.

## 6. Recommended passive core

| Need | First choice | Secondary/conditional |
| --- | --- | --- |
| entity/domain registration | RDAP + official company/registry records | current DNS under CM1 profile |
| subdomain/certificate history | crt.sh/Cert Spotter + Subfinder passive sources | Amass passive graph |
| historical URLs/pages | Common Crawl + Wayback + Arquivo.pt | gau as adapter |
| technology hints | WappalyzerGo on permitted/cached HTML | BuiltWith free group signal |
| public documents | ordinary permitted discovery + Tika/ExifTool in isolated local worker | FOCA/manual review |
| public code/dependencies | GitHub official search + OSV-Scanner | Gitleaks/detect-secrets with redaction/no verification |
| advisory enrichment | OSV + NVD + CISA KEV + EPSS | GitHub Advisory DB offline mirror |
| cached service context | Censys Free/urlscan search under quota and terms | OTX/GreyNoise context |

## 7. LAKA implementation ladder

| Change state | Technical intelligence capability |
| --- | --- |
| Baseline | manual official-domain/registry/CT/archive snapshot with source ledger |
| Minor | scheduled passive adapters, normalization, provenance and change alerts |
| Major | asset graph, attribution confidence, SBOM/advisory enrichment and human triage |
| Structural | event-sourced evidence, terms registry, redaction/quarantine, responsible-disclosure route |
| Paradigm | client-authorized continuous exposure-management product where evidence is tied to business dependencies and interventions—not sales scare tactics |

## 8. Claim gates and freshness

| Claim | Minimum gate |
| --- | --- |
| owned asset | current RDAP/DNS/client inventory or strong target-controlled linkage; shared IP never enough |
| current exposed service | recent provider last-seen plus current linkage or authorized validation |
| vulnerable system | exact product/version/config applicability + authoritative advisory + confirmed reachable authorized asset |
| breach exposure | “identifier appeared in named corpus”; never current password/MFA/company breach claim |
| secret exposure | “possible exposed secret”; redacted fingerprint and provenance; no validation |
| negative result | “not observed in sources checked as of [UTC],” never “secure/none” |

Refresh DNS/RDAP used in outreach within 24–72 hours, technology hints within 30 days, and NVD/KEV/EPSS/OSV daily. Always show the last-seen date of cached service evidence.

## 9. Mandatory connector fields

```yaml
connector_id: ""
mode: CM0|CM1|CM2|CM3
commercial_ok: true|false|unknown
automation_ok: true|false|unknown
redistribution_ok: true|false|unknown
authentication: none|key|oauth|verified-domain|contract
quota: ""
cache_rule: ""
deletion_rule: ""
attribution_rule: ""
license: ""
terms_url: ""
terms_reviewed_at: ""
fail_closed: true
```

Unknown rights fail closed.
