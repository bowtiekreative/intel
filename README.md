# Intel System

API and documentation application for the **LAKA Volumetric Intelligence System** — the
23-file library that turns lawful public evidence about a company into evidence-backed
commercial insight and respectful executive outreach.

Live at **[intel.bowtiekreative.com](https://intel.bowtiekreative.com)**.

The corpus lives in [`data/volumetric-intelligence-system/`](data/volumetric-intelligence-system/)
as Markdown and is the single source of truth. Nothing in this application restates it: the
server parses those files at boot and derives every page, every endpoint and every number from
them. Change a file, restart, and the site and API change with it.

## What it serves

- **A documentation site** — the grammar, the nine-phase playbook, the workflows, the agent
  prompts, the tool registry, the financial models, the guardrails and every source document,
  rendered in the LAKA design system.
- **A JSON API** at `/v1` — 36 endpoints, no key, fully cacheable.
- **Four executable scoring rubrics** — finding quality, opportunity priority, authority and
  lead qualification, as both a web form and `POST /v1/score/{rubric}`.

```
GET  /v1                        service index
GET  /v1/health                 liveness, corpus counts, registry integrity
GET  /v1/openapi.json           OpenAPI 3.1, generated from the live corpus
GET  /v1/docs/{slug}            one document; ?format=markdown for the file verbatim
GET  /v1/laka                   the four-layer grammar
GET  /v1/laka/lenses            the 216-lens expansion cube
GET  /v1/collections/{name}     45 typed lookup tables
GET  /v1/phases/{id}            the nine audit phases
GET  /v1/workflows/{id}         W0 through W12
GET  /v1/agents/{id}            the agent prompts, verbatim
GET  /v1/tools?library=05       268 catalogued tools and sources
GET  /v1/financial-models/{id}  20 impact models with visible formulas
GET  /v1/guardrails?jurisdiction=CA
GET  /v1/search?q=
POST /v1/score/{rubric}         finding | opportunity | authority | lead
```

`GET /llms.txt` is the agent-facing summary.

## Two design rules

The library it serves is unusually strict about epistemics, so the application is too.

**Provenance survives extraction.** Every record the API returns carries `defined_in` — the
file, section anchor and source line it was read from. Every typed collection declares the
section it reads; if a section moves, the collection empties rather than quietly producing
something else. `GET /v1/integrity` reports that, and a test asserts it.

**Absent is not zero.** A scoring dimension you did not supply comes back under `needs_input`
with `complete: false`. It is never defaulted to zero, because an absent judgement and a
judgement of zero are different claims. Likewise a failed hard gate blocks regardless of the
number above it — a 100 with an unresolved identity is still `BLOCK`.

Scoring weights, point ceilings and dimension labels are read out of the corpus at boot rather
than restated in code, so the numbers the API computes cannot drift from the numbers the
documentation shows.

## Architecture

Fastify 5 on Node 22, server-rendered HTML, no build step and no client framework. The one
JavaScript file is progressive enhancement only: the menu is a native `<details>`, the filters
are GET forms and the scorer is a POST form, so every page works with JavaScript blocked.

```
server/
  markdown.js      a deterministic reader for the corpus's Markdown vocabulary
  corpus.js        loads 23 documents, then the typed layer over named sections
  scoring.js       the four rubrics from file 11, made executable
  openapi.js       the OpenAPI document, generated from the live corpus
  routes/api.js    the /v1 JSON API
  routes/site.js   the HTML site, robots, sitemap, llms.txt
  views/           the LAKA page shell, components and pages
public/
  laka.css         the LAKA design system stylesheet
  site.js          progressive enhancement
data/              the corpus — the source of truth
test/              41 tests over the parser, the extraction and the rubrics
```

Design comes from the [LAKA design system](https://api.designsystem.bowtiekreative.com/v1):
dark canvas `#07090D`, one accent `#3F6EE9`, Inter, the ten-step spacing scale, and the
four-element header contract (seal, site name, MENU pill, one CTA pill). Brand assets are
loaded from the design-system CDN — never a local copy.

## Running it

```bash
npm install
npm start            # http://localhost:3000
npm run dev          # with --watch
npm test             # 41 tests
```

Configuration is three environment variables, all optional — see [`.env.example`](.env.example).
`PUBLIC_ORIGIN` sets the canonical URLs, Open Graph tags, sitemap and `llms.txt`.

## Deployment

Dockerfile builds a `node:22-alpine` image that runs unprivileged with a `/v1/health`
healthcheck. Deployed on Dokploy as a Dockerfile application behind Traefik with a Let's
Encrypt certificate; `docker-compose.yml` carries the equivalent Traefik labels for a
standalone Docker host.

## Privacy

No analytics, no cookies, no accounts, no third-party scripts beyond Google Fonts and the
brand CDN. Nothing submitted to the scorer is stored — it is computed on the request and gone
with the response, which is why those responses carry `cache-control: no-store`.

## Scope

This application publishes and computes over strategic and technical guidance. It is not
legal, investment or penetration-testing advice, it collects nothing about anyone, and it
performs no research of its own. Tool entries were catalogued at the corpus's stated research
baseline; verify licences, free-tier limits, API schemas and source terms before relying on
any of them.

---

Built by [Bow Tie Kreative](https://bowtiekreative.com).
