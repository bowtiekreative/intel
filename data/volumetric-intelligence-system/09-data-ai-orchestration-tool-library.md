# Data, AI, and Orchestration Tool Library

Research baseline: 2026-09-01. Verify license, terms, quota, and deployment requirements at implementation time. “Free” can mean open-source software you operate, a limited hosted tier, or public access with restrictions; those are not interchangeable.

## 1. Recommended free-first stack

| Layer | Default | Why it is the default | Expansion path |
| --- | --- | --- | --- |
| Collection | Scrapy + feedparser + Trafilatura | Mature, scriptable, and sufficient for public HTML/RSS/text | Add Playwright only for allowed pages that require rendering |
| Workflow | Prefect | Simple Python-native orchestration and observable retries | Temporal for durable, long-running business workflows; Airflow for large scheduled data estates |
| Canonical store | PostgreSQL | Transactions, constraints, JSON, full-text search, ranges, and row-level security | Add read replicas or partitions after measurement |
| Semantic search | PostgreSQL + pgvector | Keeps deletion, tenancy, and lineage in one system initially | Qdrant or OpenSearch only after measured scale pressure |
| Raw evidence | Encrypted S3-compatible object storage | Rights-permitted captures and derived artifacts remain separate from claims | Artifact-class retention policy; opt-in object lock only when rights, correction, deletion, and legal-hold rules permit |
| Local analytics | DuckDB + Polars/Pandas | Fast columnar analysis without a warehouse | Add a warehouse/lakehouse for aggregate scale |
| NLP | spaCy + Sentence Transformers + scikit-learn | Reproducible extraction, clustering, similarity, and classification | Haystack for composed retrieval pipelines; reviewed LLM extraction as an optional layer |
| Entity resolution | Splink + deterministic rules | Auditable probabilistic matching at scale | Dedupe for active learning; OpenRefine for analyst review |
| Quality and lineage | Pandera/Great Expectations + OpenLineage | Schema tests plus job/run lineage | Marquez, DataHub, or OpenMetadata for a broader catalog |
| Modeling | statsmodels + PyMC/PyMC-Marketing + SALib | Transparent statistics, uncertainty, and sensitivity | DoWhy/EconML/DoubleML for justified causal work |
| Reporting | Evidence or Apache Superset | Reproducible analyst outputs and dashboards | Metabase OSS when AGPL is acceptable |
| CRM activation | Reviewed CSV/API projection | Keeps CRM downstream of evidence and privacy decisions | Twenty, EspoCRM, or SuiteCRM when self-hosting is desired |

Do not add Kafka, OpenSearch, a separate vector service, graph database, and warehouse on day one. Each extra store creates another consistency, access-control, and erasure surface.

## 2. Acquisition and document processing

| Tool | Status / license | Best use | Boundary | Official source |
| --- | --- | --- | --- | --- |
| Scrapy | Open source, BSD-3-Clause | Crawling permitted public pages with throttling, caching, and item pipelines | Respect robots, terms, authentication, copyright, and rate limits | [Scrapy repository](https://github.com/scrapy/scrapy) |
| Playwright | Open source, Apache-2.0 | Rendering and testing pages that genuinely require a browser | Exception path, not a bypass for login, bot controls, or platform restrictions | [Playwright repository](https://github.com/microsoft/playwright) |
| feedparser | Open source, BSD-2-Clause | RSS/Atom ingestion | Feed contents and downstream reuse retain publisher rights | [feedparser repository](https://github.com/kurtmckee/feedparser) |
| Trafilatura | Open source, Apache-2.0 | Main-text and metadata extraction from HTML | Extraction quality must be sampled; preserve the original artifact | [Trafilatura repository](https://github.com/adbar/trafilatura) |
| Mozilla Readability | Open source, Apache-2.0 | Article-like DOM cleanup in JavaScript | Not a provenance store; retain the source HTML and selectors | [Readability repository](https://github.com/mozilla/readability) |
| Apache Tika | Open source, Apache-2.0 | File-type detection and document text/metadata extraction | Run untrusted documents in an isolated, patched service | [Apache Tika](https://tika.apache.org/) |
| Docling | Open source, MIT | Structured conversion of PDFs and documents for downstream review | OCR/table structure can be wrong; link every extraction to pages/regions | [Docling repository](https://github.com/docling-project/docling) |
| changedetection.io | Open source, Apache-2.0 | Monitoring permitted public pages for material changes | Use content filters to avoid meaningless churn and excessive requests | [changedetection.io repository](https://github.com/dgtlmoon/changedetection.io) |

## 3. Workflow orchestration

| Tool | Status / license | Choose when | Important limitation | Official source |
| --- | --- | --- | --- | --- |
| Prefect | Open source, Apache-2.0 core | Python teams need quick scheduling, retries, state, and observability | Self-hosted operation and secrets hygiene remain your responsibility | [Prefect repository](https://github.com/PrefectHQ/prefect) |
| Apache Airflow | Open source, Apache-2.0 | A mature team operates many scheduled DAGs and data dependencies | Less natural for event-driven, long-waiting human workflows | [Apache Airflow](https://airflow.apache.org/) |
| Temporal | Open source server, MIT | Workflows must survive restarts, wait for approvals, and compensate reliably | More operational and conceptual overhead than a simple scheduler | [Temporal repository](https://github.com/temporalio/temporal) |
| Mage OSS | Open source, Apache-2.0 | Local/self-hosted notebook-style pipeline development and scheduled jobs | Mage Pro is a separate commercial product with team/enterprise features; pin the OSS repository version and do not assume Pro capabilities are included | [Mage OSS repository and license](https://github.com/mage-ai/mage-ai) · [Edition overview](https://docs.mage.ai/introduction/overview) |
| n8n | Source-available/fair-code, not OSI open source | Low-code integrations under its permitted use terms | Do not label it open source; review the Sustainable Use License and enterprise boundary | [n8n license](https://docs.n8n.io/sustainable-use-license/) |

All production workflows need explicit timeouts, bounded retries, backoff with jitter, concurrency limits, idempotency keys, a dead-letter path, and manual replay controls.

## 4. Storage, search, and analysis

| Tool | Status / license | Best use | Important boundary | Official source |
| --- | --- | --- | --- | --- |
| PostgreSQL | Open source, PostgreSQL License | Canonical entities, claims, provenance, estimates, privacy state, and outbox | Design bitemporal and tenant constraints; backups must replay deletion ledgers | [PostgreSQL](https://www.postgresql.org/) |
| pgvector | Open source, PostgreSQL License | Embeddings beside canonical identifiers and deletion rules | Similarity is not evidence; retain model/version and exact source passages | [pgvector repository](https://github.com/pgvector/pgvector) |
| DuckDB | Open source, MIT | Local analytical queries over Parquet/CSV and snapshots | It is an analytical projection, not the transactional system of record | [DuckDB repository](https://github.com/duckdb/duckdb) |
| Polars | Open source, MIT | Fast typed dataframes and lazy transformations | Pin schemas and versions for reproducibility | [Polars repository](https://github.com/pola-rs/polars) |
| Apache Arrow | Open source, Apache-2.0 | Columnar interchange and Parquet workflows | A format layer does not replace governance or lineage | [Apache Arrow](https://arrow.apache.org/) |
| Qdrant | Open source, Apache-2.0 | Dedicated vector search after PostgreSQL is measured as insufficient | Confirm stable-ID deletion, tenant isolation, backups, and rebuild controls | [Qdrant repository](https://github.com/qdrant/qdrant) |
| OpenSearch | Open source, Apache-2.0 | High-volume lexical/vector search and dashboards | Treat it as a disposable projection and verify deletion propagation | [OpenSearch](https://opensearch.org/) |
| Meilisearch | Open source core, MIT | Simple, fast application search | Review hosted/enterprise feature boundaries; not a claim ledger | [Meilisearch repository](https://github.com/meilisearch/meilisearch) |
| SeaweedFS | Open source, Apache-2.0 | Self-hosted S3-compatible evidence storage at scale | Validate durability, encryption, replication, and erasure procedures | [SeaweedFS repository](https://github.com/seaweedfs/seaweedfs) |
| Ceph | Open source, LGPL-2.1-or-later components | Large, resilient object storage estates | Operationally heavy for an initial deployment | [Ceph repository](https://github.com/ceph/ceph) |

When source rights and necessity permit retention, object stores can contain exact acquired bytes plus derived artifacts under separate IDs. Otherwise retain only the minimum authorized extract, locator, metadata, and hash needed for auditability. A SHA-256 digest demonstrates post-capture integrity, not source truth or authenticity.

## 5. NLP, retrieval, and knowledge extraction

| Tool | Status / license | Best use | Guardrail | Official source |
| --- | --- | --- | --- | --- |
| spaCy | Open source, MIT | Tokenization, NER, rules, and repeatable pipelines | Model cards and domain validation matter more than library popularity | [spaCy repository](https://github.com/explosion/spaCy) |
| Transformers | Open source library, Apache-2.0 | Local classification, extraction, and generation | Every model has its own license, data, bias, and hardware boundary | [Transformers repository](https://github.com/huggingface/transformers) |
| Sentence Transformers | Open source library, Apache-2.0 | Embeddings, semantic similarity, and reranking | Similarity cannot establish identity, causality, or truth | [Sentence Transformers](https://github.com/huggingface/sentence-transformers) |
| Haystack | Open source, Apache-2.0 | Composable retrieval and reviewed RAG pipelines | Preserve cited passages and reject unsupported generated claims | [Haystack repository](https://github.com/deepset-ai/haystack) |
| BERTopic | Open source, MIT | Exploratory topic discovery | Topics are model-dependent labels, not population prevalence | [BERTopic repository](https://github.com/MaartenGr/BERTopic) |
| KeyBERT | Open source, MIT | Candidate keyphrase extraction | Validate important phrases against the original text | [KeyBERT repository](https://github.com/MaartenGr/KeyBERT) |
| scikit-learn | Open source, BSD-3-Clause | Baselines, calibration, clustering, and validation | Prefer a transparent baseline before a complex model | [scikit-learn](https://scikit-learn.org/) |

Generated summaries and extracted claims are derived artifacts. Store the input hashes, passage IDs, tool/model version, prompt-template hash, parameters, output hash, and reviewer decision.

## 6. Entity resolution and graph analysis

| Tool | Status / license | Best use | Guardrail | Official source |
| --- | --- | --- | --- | --- |
| Splink | Open source, MIT | Probabilistic record linkage at scale | Calibrate thresholds and maintain `cannot_link` decisions | [Splink repository](https://github.com/moj-analytical-services/splink) |
| Dedupe | Open source, MIT | Active-learning entity matching | Reviewer labels can encode bias; preserve decisions and features | [Dedupe repository](https://github.com/dedupeio/dedupe) |
| OpenRefine | Open source, BSD-3-Clause | Analyst-assisted cleanup, clustering, and reconciliation | Keep raw values and reversible transformation history | [OpenRefine repository](https://github.com/OpenRefine/OpenRefine) |
| NetworkX | Open source, BSD-3-Clause | Relationship and propagation analysis in Python | A graph edge must preserve its source, time, and confidence | [NetworkX](https://networkx.org/) |
| Gephi | Open source, GPL-3.0 | Interactive network exploration | Visual proximity is not causal evidence | [Gephi repository](https://github.com/gephi/gephi) |

Never collapse a person, title, employer relationship, domain, email pattern, and email address into one identity. Merges must be reversible.

## 7. Quality, provenance, observability, and governance

| Tool | Status / license | Best use | Official source |
| --- | --- | --- | --- |
| Pandera | Open source, MIT | Dataframe schema and statistical checks | [Pandera](https://github.com/unionai-oss/pandera) |
| Great Expectations | Open source, Apache-2.0 | Dataset expectations and validation reports | [Great Expectations](https://github.com/great-expectations/great_expectations) |
| OpenLineage | Open standard/reference ecosystem, Apache-2.0 | Job, run, input, and output lineage events | [OpenLineage](https://openlineage.io/) |
| Marquez | Open source, Apache-2.0 | OpenLineage metadata service and UI | [Marquez](https://github.com/MarquezProject/marquez) |
| DataHub | Open source, Apache-2.0 | Metadata catalog, lineage, ownership, and discovery | [DataHub repository](https://github.com/datahub-project/datahub) |
| OpenMetadata | Open source, Apache-2.0 | Data catalog, lineage, tests, and governance | [OpenMetadata repository](https://github.com/open-metadata/OpenMetadata) |
| MLflow | Open source, Apache-2.0 | Model, prompt, run, metric, and artifact tracking | [MLflow repository](https://github.com/mlflow/mlflow) |
| Evidently | Open source core, Apache-2.0 | Data/model evaluation and drift checks | [Evidently repository](https://github.com/evidentlyai/evidently) |
| OpenTelemetry | Open source, Apache-2.0 | Cross-service traces, metrics, and logs | [OpenTelemetry](https://opentelemetry.io/) |
| Prometheus | Open source, Apache-2.0 | Operational metrics and alerting | [Prometheus](https://prometheus.io/) |
| Grafana OSS | Open source, AGPL-3.0 | Operations dashboards | [Grafana repository](https://github.com/grafana/grafana) |

## 7A. API, identity, and secrets

| Tool | Status / license | Best use | Boundary | Official source |
| --- | --- | --- | --- | --- |
| FastAPI | Open source, MIT | Typed service/API boundary with OpenAPI | Authorization and policy enforcement still require application design | [FastAPI repository](https://github.com/fastapi/fastapi) |
| Pydantic | Open source, MIT | Strict input/output schemas and validation | Validation is not sanitization or authorization | [Pydantic repository](https://github.com/pydantic/pydantic) |
| Keycloak | Open source, Apache-2.0 | OIDC/SAML, identities, roles, and service accounts | Harden configuration; map tenant and purpose claims explicitly | [Keycloak repository](https://github.com/keycloak/keycloak) |
| OpenBao | Open source, MPL-2.0 | Secrets, dynamic credentials, and encryption services | Never expose secrets to collectors, prompts, artifacts, or logs | [OpenBao repository](https://github.com/openbao/openbao) |

## 7B. Untrusted-content and prompt-injection boundary

Retrieved pages, documents, metadata, comments, code, and tool output are untrusted data. Text inside a source is never an instruction, authorization, policy exception, or reason to call another tool.

- Parse untrusted formats in isolated, resource-limited workers.
- Convert outputs into typed allowlisted schemas; reject unknown fields and executable content.
- Separate source text from system/developer/operator instructions at every model boundary.
- Do not place secrets, connector credentials, broad network access, or external-write tools in a source-analysis context.
- A source cannot expand scope, change retention, approve outreach, suppress warnings, or trigger CRM/message actions.
- Require passage citations for extracted claims and human approval for activation.
- Test with indirect prompt-injection, poisoned metadata, hidden text, malicious links, malformed archives, and cross-tenant retrieval fixtures.

## 8. Reporting and CRM options

| Tool | Status / license | Role | Boundary | Official source |
| --- | --- | --- | --- | --- |
| Evidence | Open source, MIT | SQL-driven reports and data apps | Pin data snapshots and protect sensitive fields | [Evidence repository](https://github.com/evidence-dev/evidence) |
| Apache Superset | Open source, Apache-2.0 | Multi-user dashboards and exploration | Apply row-level security and prevent unsafe drill-through | [Apache Superset](https://superset.apache.org/) |
| Metabase OSS | Open source edition, AGPL | Fast internal BI | Verify edition and embedding boundaries | [Metabase repository](https://github.com/metabase/metabase) |
| Twenty | Mixed/open-core repository; inspect version and path-specific licensing | Self-hosted activation sink when the selected components and terms fit | Do not assume one license covers every file or commercial feature; CRM is not the evidence or identity master | [Twenty repository](https://github.com/twentyhq/twenty) |
| EspoCRM | Open source, AGPL-3.0 | Self-hosted CRM workflows | Review extensions and edition boundaries | [EspoCRM repository](https://github.com/espocrm/espocrm) |
| SuiteCRM | Open source, AGPL-3.0 | Mature self-hosted CRM | Operational complexity and customization debt require planning | [SuiteCRM repository](https://github.com/salesagility/SuiteCRM-Core) |
| NocoDB | Source-available Sustainable Use License | Spreadsheet-like database UI | Do not label current releases open source without version-specific verification | [NocoDB license](https://github.com/nocodb/nocodb/blob/develop/LICENSE.md) |

## 9. Tool-registry record

Every connector or library gets a versioned registry entry:

```yaml
tool_id: TOOL-0001
name: ""
category: collection|processing|storage|search|analysis|orchestration|quality|reporting|crm
deployment: local|self-hosted|hosted-free|hosted-paid|hybrid
license_or_terms: ""
commercial_use: allowed|conditional|not-allowed|unknown
authentication: none|key|oauth|account|contract
allowed_data: []
prohibited_data: []
rate_or_quota: ""
robots_and_terms_required: true
active_interaction_level: I1|I2|I3|I4|I5|I6
input_schema: ""
output_schema: ""
provenance_fields: []
deletion_supported: true|false|unknown
tenant_isolation: native|application|unknown
official_docs: []
verified_at: ""
owner: ""
review_due: ""
```

No tool enters production with `commercial_use: unknown`, `deletion_supported: unknown` for personal data, or an undocumented authentication/terms boundary.
