/**
 * The HTML site.
 *
 * Every page is server-rendered and every interaction is a plain form, so the whole site
 * works with JavaScript blocked: the menu is a native <details>, the browsers are GET forms,
 * and the scorer is a POST form that redisplays itself with the result.
 */

import { corpus } from '../corpus.js'
import { RUBRICS, SCORERS } from '../scoring.js'
import { search } from './api.js'
import { layout, ORIGIN } from '../views/layout.js'
import {
  home, lakaPage, lensesPage, evidencePage, phasesPage, workflowsPage, agentsPage, agentPage,
  toolsPage, toolPage, financialModelsPage, scoringPage, scorePage, guardrailsPage,
  checklistsPage, referenceIndex, referencePage, docsPage, docPage, apiPage, searchPage,
  privacyPage, notFoundPage
} from '../views/pages.js'

const CACHE = 'public, max-age=300, stale-while-revalidate=86400'

function page (reply, built, { status = 200, cache = CACHE } = {}) {
  return reply.code(status).type('text/html; charset=utf-8').header('cache-control', cache).send(layout(built))
}

const notFound = (reply, message) => page(reply, notFoundPage(message), { status: 404, cache: 'no-store' })

/** Read a rubric submission out of a posted form body. */
function readScoreForm (rubric, body) {
  const values = {}
  for (const d of rubric.dimensions) {
    const raw = body[d.key]
    if (raw !== undefined && raw !== '') values[d.key] = raw
  }

  if (rubric.id !== 'opportunity') return { values, input: values }

  const gates = {}
  for (const g of rubric.hard_gates) {
    const raw = body[`gate_${g.id}`]
    if (raw === 'true') gates[g.id] = true
    else if (raw === 'false') gates[g.id] = false
  }

  const input = { dimensions: values, gates }
  if (body.confidence) input.confidence = body.confidence
  if (body.risk_penalty) input.risk_penalty = Number(body.risk_penalty)

  // Keep the raw form values so the redisplayed form remembers what was selected.
  const echoed = { ...values }
  for (const g of rubric.hard_gates) if (body[`gate_${g.id}`]) echoed[`gate_${g.id}`] = body[`gate_${g.id}`]
  if (body.confidence) echoed.confidence = body.confidence
  if (body.risk_penalty) echoed.risk_penalty = body.risk_penalty

  return { values: echoed, input }
}

export default async function siteRoutes (app) {
  // ---- the model ------------------------------------------------------------
  app.get('/', async (req, reply) => page(reply, home()))
  app.get('/laka', async (req, reply) => page(reply, lakaPage()))
  app.get('/lenses', async (req, reply) => page(reply, lensesPage(req.query)))
  app.get('/evidence', async (req, reply) => page(reply, evidencePage()))

  // ---- the method -----------------------------------------------------------
  app.get('/phases', async (req, reply) => page(reply, phasesPage()))
  app.get('/workflows', async (req, reply) => page(reply, workflowsPage()))
  app.get('/financial-models', async (req, reply) => page(reply, financialModelsPage()))

  app.get('/agents', async (req, reply) => page(reply, agentsPage()))
  app.get('/agents/:id', async (req, reply) => {
    const agent = corpus.agentsById.get(String(req.params.id))
    if (!agent) return notFound(reply, 'No agent prompt with that id.')
    return page(reply, agentPage(agent))
  })

  // ---- the registry ---------------------------------------------------------
  app.get('/tools', async (req, reply) => {
    const q = String(req.query.q ?? '').trim().toLowerCase()
    const library = req.query.library ? String(req.query.library) : ''
    const category = req.query.category ? String(req.query.category) : ''

    const results = corpus.tools
      .filter((t) => !library || t.library_file === library)
      .filter((t) => !category || t.category === category)
      .filter((t) => !q || `${t.name} ${t.status ?? ''} ${JSON.stringify(t.attributes)}`.toLowerCase().includes(q))

    return page(reply, toolsPage({
      query: { q: req.query.q ?? '', library, category },
      results: results.slice(0, 120),
      total: corpus.tools.length
    }))
  })

  app.get('/tools/:id', async (req, reply) => {
    const tool = corpus.toolsById.get(String(req.params.id))
    if (!tool) return notFound(reply, 'No tool or source with that id.')
    return page(reply, toolPage(tool))
  })

  // ---- running it safely ----------------------------------------------------
  app.get('/scoring', async (req, reply) => page(reply, scoringPage()))

  app.get('/score', async (req, reply) => {
    const rubric = RUBRICS[String(req.query.rubric ?? 'finding')] ? String(req.query.rubric ?? 'finding') : 'finding'
    return page(reply, scorePage({ rubric }))
  })

  app.post('/score', async (req, reply) => {
    const body = req.body ?? {}
    const name = RUBRICS[String(body.rubric)] ? String(body.rubric) : 'finding'
    const rubric = RUBRICS[name]
    const { values, input } = readScoreForm(rubric, body)

    let result
    try {
      result = SCORERS[name](input)
    } catch (err) {
      // A 400 from the scorer is a user-input problem, so it is shown on the form, not as an error page.
      if (err.statusCode !== 400) throw err
      result = { rubric: name, complete: false, needs_input: [], note: err.message }
    }
    return page(reply, scorePage({ rubric: name, values, result }), { cache: 'no-store' })
  })

  app.get('/guardrails', async (req, reply) => page(reply, guardrailsPage()))
  app.get('/checklists', async (req, reply) => page(reply, checklistsPage()))

  // ---- reference ------------------------------------------------------------
  app.get('/reference', async (req, reply) => page(reply, referenceIndex()))
  app.get('/reference/:name', async (req, reply) => {
    const collection = corpus.collections[String(req.params.name)]
    if (!collection) return notFound(reply, 'No lookup table with that name.')
    return page(reply, referencePage(collection))
  })

  app.get('/docs', async (req, reply) => page(reply, docsPage()))
  app.get('/docs/:slug', async (req, reply) => {
    const doc = corpus.bySlug.get(String(req.params.slug)) ?? corpus.byNumber.get(String(req.params.slug))
    if (!doc) return notFound(reply, 'No document with that slug.')
    return page(reply, docPage(doc))
  })

  app.get('/api', async (req, reply) => page(reply, apiPage()))
  app.get('/privacy', async (req, reply) => page(reply, privacyPage()))

  app.get('/search', async (req, reply) => {
    const q = String(req.query.q ?? '').trim()
    return page(reply, searchPage({ q, results: q ? search(q, { limit: 60 }) : [] }), {
      cache: q ? 'no-store' : CACHE
    })
  })

  // ---- machine files --------------------------------------------------------
  app.get('/robots.txt', async (req, reply) => reply
    .type('text/plain; charset=utf-8')
    .header('cache-control', 'public, max-age=86400')
    .send(`User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`))

  app.get('/sitemap.xml', async (req, reply) => {
    const paths = [
      '/', '/laka', '/lenses', '/evidence', '/phases', '/workflows', '/agents', '/tools',
      '/financial-models', '/scoring', '/score', '/guardrails', '/checklists', '/reference',
      '/docs', '/api', '/search', '/privacy',
      ...corpus.documents.map((d) => `/docs/${d.slug}`),
      ...corpus.agents.map((a) => `/agents/${a.id}`),
      ...corpus.tools.map((t) => `/tools/${t.id}`),
      ...Object.keys(corpus.collections).map((n) => `/reference/${n}`)
    ]
    const lastmod = corpus.manifest.research_baseline ?? new Date().toISOString().slice(0, 10)
    const urls = paths.map((p) =>
      `  <url><loc>${ORIGIN}${p}</loc><lastmod>${lastmod}</lastmod>${p === '/' ? '<priority>1.0</priority>' : ''}</url>`).join('\n')
    return reply
      .type('application/xml; charset=utf-8')
      .header('cache-control', 'public, max-age=86400')
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  })

  app.get('/site.webmanifest', async (req, reply) => reply
    .type('application/manifest+json; charset=utf-8')
    .header('cache-control', 'public, max-age=86400')
    .send({
      name: corpus.manifest.title,
      short_name: 'Intel System',
      description: corpus.manifest.purpose,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#07090D',
      theme_color: '#07090D',
      icons: [
        { src: 'https://designsystem.bowtiekreative.com/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'https://designsystem.bowtiekreative.com/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'https://designsystem.bowtiekreative.com/brand/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    }))

  app.get('/llms.txt', async (req, reply) => reply
    .type('text/plain; charset=utf-8')
    .header('cache-control', 'public, max-age=3600')
    .send(llmsTxt()))

  // ---- 404 ------------------------------------------------------------------
  app.setNotFoundHandler((req, reply) => {
    if (req.url.startsWith('/v1/')) {
      return reply.code(404).send({ error: 'not_found', path: req.url })
    }
    return notFound(reply, 'That page does not exist.')
  })
}

function llmsTxt () {
  const m = corpus.manifest
  const inv = m.inventory
  return `# ${m.title}

> ${m.purpose}

Version ${m.version}, research baseline ${m.research_baseline}. ${inv.documents} documents,
${inv.tools} catalogued tools and sources, ${inv.financial_models} financial models,
${inv.query_patterns} safe query families, ${inv.checklist_items} acceptance items.

This is an operating grammar for company intelligence, not a prompt library. Every output must
preserve one chain:

  source -> observation -> claim state -> confidence -> mechanism -> financial range
  -> service fit -> smallest useful next step

## The rules that bound every run
${m.operating_rules.map((r) => `- ${r}`).join('\n')}

## What the system will not do
${m.non_goals.map((r) => `- ${r}`).join('\n')}

## Stop conditions
${m.stop_conditions.map((r) => `- ${r}`).join('\n')}

## API
Base URL: ${ORIGIN}
OpenAPI: ${ORIGIN}/v1/openapi.json
Index: ${ORIGIN}/v1

Read the doctrine:
- ${ORIGIN}/v1/docs - the ${inv.documents} source documents; add /{slug}?format=markdown for the file verbatim
- ${ORIGIN}/v1/laka - the four-layer grammar
- ${ORIGIN}/v1/laka/lenses - the ${corpus.cube.size}-lens expansion cube, each lens carrying its permission rule
- ${ORIGIN}/v1/collections - ${Object.keys(corpus.collections).length} typed lookup tables
- ${ORIGIN}/v1/phases - the nine audit phases
- ${ORIGIN}/v1/workflows - W0 to W${corpus.workflows.length - 1}
- ${ORIGIN}/v1/agents - the ${inv.agents} agent prompts, verbatim
- ${ORIGIN}/v1/tools?library=05 - the tool and source registry
- ${ORIGIN}/v1/financial-models - the ${inv.financial_models} impact models
- ${ORIGIN}/v1/guardrails?jurisdiction=CA - legal and ethical guardrails
- ${ORIGIN}/v1/search?q= - search everything

Compute:
- POST ${ORIGIN}/v1/score/finding - finding quality, 0-100
- POST ${ORIGIN}/v1/score/opportunity - opportunity priority with hard gates
- POST ${ORIGIN}/v1/score/authority - outreach eligibility
- POST ${ORIGIN}/v1/score/lead - lead qualification band

## How the scorers behave
Weights and point ceilings are read from the corpus, so the API and the documentation cannot
drift apart. Two rules hold everywhere:

- a hard gate overrides the numeric score, never the other way round;
- a missing input comes back under \`needs_input\`, never defaulted to zero, because an absent
  judgement and a judgement of zero are different claims.

Send \`GET ${ORIGIN}/v1/scoring/{rubric}\` first for the exact dimension keys and scales.

## Provenance
Every record carries \`defined_in\` naming the file, section anchor and source line it was read
from. ${ORIGIN}/v1/integrity reports whether every typed collection still resolves.

## Boundaries
Passive public-source research is the default. This library does not perform penetration
testing, defeat access controls, trade leaked credentials, infer protected characteristics, or
auto-send outreach. It is strategic and technical guidance, not legal, investment or
penetration-testing advice. Tool entries were catalogued at the ${m.research_baseline} research
baseline and must be re-verified before deployment.
`
}
