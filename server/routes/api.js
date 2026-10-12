/**
 * The /v1 JSON API.
 *
 * The corpus is a static, versioned body of doctrine, so every read is public and cacheable.
 * The POST endpoints run the scoring rubrics; they compute, they never store.
 *
 * Two things every response preserves, because the system they describe insists on both:
 *   - provenance - each record carries `defined_in`, naming file, section and line;
 *   - the difference between absent and zero - a missing scoring input comes back under
 *     `needs_input`, never silently defaulted.
 */

import { corpus, lenses, slugify } from '../corpus.js'
import { RUBRICS, SCORERS } from '../scoring.js'
import { buildOpenApi } from '../openapi.js'
import { textOf } from '../markdown.js'

const CACHE = 'public, max-age=300, stale-while-revalidate=86400'

/** Every endpoint, in one place: the index, the OpenAPI document and the docs page read this. */
export const ENDPOINTS = [
  { method: 'GET', path: '/v1', summary: 'Service index' },
  { method: 'GET', path: '/v1/health', summary: 'Liveness, corpus counts and registry integrity' },
  { method: 'GET', path: '/v1/openapi.json', summary: 'OpenAPI 3.1 description of this API' },
  { method: 'GET', path: '/v1/manifest', summary: 'Version, research baseline, operating rules and inventory' },
  { method: 'GET', path: '/v1/integrity', summary: 'Which typed collections resolved against the corpus' },

  { method: 'GET', path: '/v1/docs', summary: 'The 23 source documents' },
  { method: 'GET', path: '/v1/docs/{slug}', summary: 'One document as blocks, or raw Markdown with format=markdown' },
  { method: 'GET', path: '/v1/docs/{slug}/sections', summary: 'Section outline for a document' },
  { method: 'GET', path: '/v1/docs/{slug}/sections/{anchor}', summary: 'One section with its blocks' },
  { method: 'GET', path: '/v1/tables', summary: 'Every table in the corpus' },
  { method: 'GET', path: '/v1/tables/{id}', summary: 'One table with headers and rows' },
  { method: 'GET', path: '/v1/code', summary: 'Every fenced block: grammars, formulas, contracts and prompts' },
  { method: 'GET', path: '/v1/code/{id}', summary: 'One fenced block' },

  { method: 'GET', path: '/v1/laka', summary: 'The four-layer grammar: states, variables, dynamics, execution impact' },
  { method: 'GET', path: '/v1/laka/lenses', summary: 'Enumerate the 216-lens expansion cube' },
  { method: 'GET', path: '/v1/collections', summary: 'The typed lookup collections' },
  { method: 'GET', path: '/v1/collections/{name}', summary: 'One collection with its records and source pointer' },

  { method: 'GET', path: '/v1/phases', summary: 'The nine audit phases, preflight and final synthesis' },
  { method: 'GET', path: '/v1/phases/{id}', summary: 'One phase with questions, method, controls and deliverables' },
  { method: 'GET', path: '/v1/workflows', summary: 'W0-W12, the end-to-end automation workflow' },
  { method: 'GET', path: '/v1/workflows/{id}', summary: 'One workflow stage' },
  { method: 'GET', path: '/v1/agents', summary: 'The multi-agent prompt pack' },
  { method: 'GET', path: '/v1/agents/{id}', summary: 'One agent prompt, verbatim' },
  { method: 'GET', path: '/v1/checklists', summary: 'Every acceptance checklist in the corpus' },
  { method: 'GET', path: '/v1/checklists/{id}', summary: 'One checklist' },

  { method: 'GET', path: '/v1/libraries', summary: 'The five tool libraries and their categories' },
  { method: 'GET', path: '/v1/tools', summary: 'Search and filter the tool registry' },
  { method: 'GET', path: '/v1/tools/{id}', summary: 'One tool or source with its attributes and official links' },

  { method: 'GET', path: '/v1/financial-models', summary: 'The twenty financial impact models' },
  { method: 'GET', path: '/v1/financial-models/{id}', summary: 'One model with its formula and constraints' },

  { method: 'GET', path: '/v1/scoring', summary: 'The four scoring rubrics and their input schemas' },
  { method: 'GET', path: '/v1/scoring/{rubric}', summary: 'One rubric: dimensions, weights, gates and bands' },
  { method: 'POST', path: '/v1/score/{rubric}', summary: 'Score a finding, opportunity, outreach draft or lead' },

  { method: 'GET', path: '/v1/search', summary: 'Search documents, sections, tools, phases, agents and records' }
]

/* ------------------------------------------------------------- helpers -- */

function paging (q) {
  const limit = Math.min(Math.max(parseInt(q.limit ?? '50', 10) || 50, 1), 500)
  const offset = Math.max(parseInt(q.offset ?? '0', 10) || 0, 0)
  return { limit, offset }
}

const page = (arr, { limit, offset }) => ({
  count: arr.length,
  limit,
  offset,
  results: arr.slice(offset, offset + limit)
})

const notFound = (reply, kind, id) => reply.code(404).send({ error: 'not_found', kind, id })

/** A document summary without the 20-30KB of blocks. */
const docSummary = (d) => ({
  number: d.number,
  slug: d.slug,
  filename: d.filename,
  title: d.title,
  bytes: d.bytes,
  lines: d.lines,
  sha256: d.sha256,
  sections: d.sections.length,
  tables: d.tables.length,
  code_blocks: d.code.length,
  href: `/v1/docs/${d.slug}`
})

/** A tool summary: enough to choose one, without the full attribute set. */
const toolSummary = (t) => ({
  id: t.id,
  name: t.name,
  library: t.library,
  library_file: t.library_file,
  category: t.category,
  status: t.status,
  sources: t.sources,
  href: `/v1/tools/${t.id}`
})

/** Strip the section tree down to an outline. */
function outline (sections) {
  return sections
    .filter((s) => s.level > 1)
    .map((s) => ({
      anchor: s.anchor,
      level: s.level,
      title: s.title,
      line: s.line,
      tables: s.blocks.filter((b) => b.type === 'table').map((b) => b.id),
      code: s.blocks.filter((b) => b.type === 'code').map((b) => b.id)
    }))
}

export function search (query, { limit = 25, types = null } = {}) {
  const q = String(query ?? '').trim().toLowerCase()
  if (!q) return []
  const wanted = types ? new Set(types) : null
  const terms = q.split(/\s+/).filter(Boolean)

  return corpus.searchIndex
    .filter((e) => (!wanted || wanted.has(e.type)) && terms.every((t) => e.hay.includes(t)))
    .map((e) => ({
      type: e.type,
      id: e.id,
      title: e.title,
      href: e.href,
      // An id or title hit ranks above a body hit; earlier hits rank above later ones.
      rank: (e.id.toLowerCase().includes(q) ? 0 : 10) +
        (e.title.toLowerCase().includes(q) ? 0 : 5) +
        Math.max(e.hay.indexOf(q), 0) / 1e6
    }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(({ rank, ...rest }) => rest)
}

/* -------------------------------------------------------------- routes -- */

export default async function apiRoutes (app) {
  app.addHook('onSend', async (req, reply, payload) => {
    // HEAD is included so a cache probe sees the same directives as the GET it stands in for.
    if ((req.method === 'GET' || req.method === 'HEAD') && !reply.getHeader('cache-control')) {
      reply.header('cache-control', CACHE)
    }
    return payload
  })

  // ---- index, health, spec --------------------------------------------------
  app.get('/v1', async () => ({
    service: 'laka-intelligence-system-api',
    title: corpus.manifest.title,
    version: corpus.manifest.version,
    research_baseline: corpus.manifest.research_baseline,
    documentation: 'https://intel.bowtiekreative.com/',
    agent_guide: 'https://intel.bowtiekreative.com/llms.txt',
    openapi: 'https://intel.bowtiekreative.com/v1/openapi.json',
    design_system: 'https://api.designsystem.bowtiekreative.com/v1',
    inventory: corpus.manifest.inventory,
    endpoints: ENDPOINTS,
    operating_rules: corpus.manifest.operating_rules,
    note: 'Read-only doctrine plus four scoring rubrics. Nothing here collects, stores or contacts anyone.'
  }))

  app.get('/v1/health', async () => {
    const { integrity } = await import('../corpus.js')
    const state = integrity()
    return {
      status: state.ok ? 'ok' : 'degraded',
      version: corpus.manifest.version,
      documents: corpus.documents.length,
      tools: corpus.tools.length,
      collections: state.collections,
      unresolved: state.unresolved_collections.length + state.unresolved_tool_sections.length,
      uptime_s: Math.round(process.uptime())
    }
  })

  app.get('/v1/openapi.json', async () => buildOpenApi())

  app.get('/v1/manifest', async () => corpus.manifest)

  app.get('/v1/integrity', async () => {
    const { integrity } = await import('../corpus.js')
    return integrity()
  })

  // ---- documents ------------------------------------------------------------
  app.get('/v1/docs', async () => ({
    count: corpus.documents.length,
    results: corpus.documents.map(docSummary)
  }))

  app.get('/v1/docs/:slug', async (req, reply) => {
    const key = String(req.params.slug).replace(/\.(md|json)$/, '')
    const doc = corpus.bySlug.get(key) ?? corpus.byNumber.get(key)
    if (!doc) return notFound(reply, 'document', key)

    if (req.query.format === 'markdown') {
      return reply.type('text/markdown; charset=utf-8').send(doc.markdown)
    }
    return {
      ...docSummary(doc),
      outline: outline(doc.sections),
      blocks: doc.blocks
    }
  })

  app.get('/v1/docs/:slug/sections', async (req, reply) => {
    const doc = corpus.bySlug.get(String(req.params.slug)) ?? corpus.byNumber.get(String(req.params.slug))
    if (!doc) return notFound(reply, 'document', req.params.slug)
    return { document: doc.slug, count: doc.sections.length - 1, results: outline(doc.sections) }
  })

  app.get('/v1/docs/:slug/sections/:anchor', async (req, reply) => {
    const doc = corpus.bySlug.get(String(req.params.slug)) ?? corpus.byNumber.get(String(req.params.slug))
    if (!doc) return notFound(reply, 'document', req.params.slug)
    const section = doc.sections.find((s) => s.anchor === String(req.params.anchor))
    if (!section) return notFound(reply, 'section', req.params.anchor)
    return {
      document: doc.slug,
      file: doc.number,
      anchor: section.anchor,
      level: section.level,
      title: section.title,
      line: section.line,
      blocks: section.blocks,
      subsections: section.sections.map((s) => ({ anchor: s.anchor, title: s.title, level: s.level }))
    }
  })

  // ---- tables and code ------------------------------------------------------
  app.get('/v1/tables', async (req) => {
    const q = String(req.query.q ?? '').trim().toLowerCase()
    const file = req.query.file ? String(req.query.file) : null
    const results = corpus.tables
      .filter((t) => !file || t.file === file || t.file_slug === file)
      .filter((t) => !q || `${t.section_title} ${t.headers.join(' ')}`.toLowerCase().includes(q))
      .map((t) => ({
        id: t.id,
        file: t.file,
        file_slug: t.file_slug,
        section: t.section,
        caption: t.caption,
        headers: t.headers,
        rows: t.rows.length,
        href: `/v1/tables/${t.id}`
      }))
    return page(results, paging(req.query))
  })

  app.get('/v1/tables/:id', async (req, reply) => {
    const table = corpus.tableById.get(String(req.params.id))
    if (!table) return notFound(reply, 'table', req.params.id)
    return table
  })

  app.get('/v1/code', async (req) => {
    const q = String(req.query.q ?? '').trim().toLowerCase()
    const lang = req.query.lang ? String(req.query.lang).toLowerCase() : null
    const file = req.query.file ? String(req.query.file) : null
    const results = corpus.code
      .filter((c) => !lang || c.lang.toLowerCase() === lang)
      .filter((c) => !file || c.file === file || c.file_slug === file)
      .filter((c) => !q || `${c.section_title} ${c.content}`.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        file: c.file,
        file_slug: c.file_slug,
        section: c.section,
        section_title: c.section_title,
        lang: c.lang,
        bytes: Buffer.byteLength(c.content),
        href: `/v1/code/${c.id}`
      }))
    return page(results, paging(req.query))
  })

  app.get('/v1/code/:id', async (req, reply) => {
    const block = corpus.codeById.get(String(req.params.id))
    if (!block) return notFound(reply, 'code', req.params.id)
    return block
  })

  // ---- LAKA grammar ---------------------------------------------------------
  app.get('/v1/laka', async () => ({
    protocol: corpus.collections.protocol,
    change_states: corpus.collections['change-states'],
    internal_variables: corpus.collections['internal-variables'],
    change_variables: corpus.collections['change-variables'],
    execution_impact: corpus.collections['execution-impact'],
    operators: corpus.collections.operators,
    structural_matrix: corpus.collections['structural-matrix'],
    truth_states: corpus.collections['truth-states'],
    cube: {
      ...corpus.cube,
      href: '/v1/laka/lenses'
    }
  }))

  app.get('/v1/laka/lenses', async (req) => {
    const all = lenses({
      interrogative: req.query.interrogative,
      modifier: req.query.modifier,
      impact: req.query.impact
    })
    return {
      cube_size: corpus.cube.size,
      axes: {
        interrogatives: corpus.cube.interrogatives,
        modifiers: corpus.cube.modifiers,
        impacts: corpus.cube.impacts.map((i) => i.code)
      },
      lens_sentence: corpus.cube.lens_sentence,
      note: 'In passive research most valid collection actions remain I1-I2.',
      ...page(all, paging(req.query))
    }
  })

  // ---- typed collections ----------------------------------------------------
  app.get('/v1/collections', async () => ({
    count: Object.keys(corpus.collections).length,
    results: Object.values(corpus.collections).map((c) => ({
      id: c.id,
      title: c.title,
      count: c.count,
      headers: c.headers,
      source: c.source,
      href: `/v1/collections/${c.id}`
    }))
  }))

  app.get('/v1/collections/:name', async (req, reply) => {
    const collection = corpus.collections[String(req.params.name)]
    if (!collection) {
      return reply.code(404).send({
        error: 'not_found',
        kind: 'collection',
        id: req.params.name,
        available: Object.keys(corpus.collections)
      })
    }
    return collection
  })

  // ---- phases ---------------------------------------------------------------
  app.get('/v1/phases', async () => ({
    count: corpus.phases.length,
    results: corpus.phases.map((p) => ({
      id: p.id,
      number: p.number,
      title: p.title,
      name: p.name,
      minimum_output: p.minimum_output,
      parts: Object.keys(p.parts),
      href: `/v1/phases/${p.id}`
    }))
  }))

  app.get('/v1/phases/:id', async (req, reply) => {
    const phase = corpus.phasesById.get(String(req.params.id))
    if (!phase) return notFound(reply, 'phase', req.params.id)
    return phase
  })

  // ---- workflows ------------------------------------------------------------
  app.get('/v1/workflows', async () => ({
    count: corpus.workflows.length,
    state_machine: corpus.codeById.get('17.1-workflow-state-machine.c1')?.content ?? null,
    results: corpus.workflows.map((w) => ({ id: w.id, name: w.name, title: w.title, href: `/v1/workflows/${w.id}` })),
    controls: corpus.collections.controls.records,
    schedules: corpus.collections.schedules.records
  }))

  app.get('/v1/workflows/:id', async (req, reply) => {
    const workflow = corpus.workflowsById.get(String(req.params.id).toUpperCase()) ??
      corpus.workflowsById.get(String(req.params.id))
    if (!workflow) return notFound(reply, 'workflow', req.params.id)
    return workflow
  })

  // ---- agents ---------------------------------------------------------------
  app.get('/v1/agents', async (req) => {
    const role = req.query.role ? String(req.query.role) : null
    const results = corpus.agents
      .filter((a) => !role || a.role === role)
      .map((a) => ({ id: a.id, name: a.name, role: a.role, phases: a.phases, href: `/v1/agents/${a.id}` }))
    return { count: results.length, roles: [...new Set(corpus.agents.map((a) => a.role))], results }
  })

  app.get('/v1/agents/:id', async (req, reply) => {
    const agent = corpus.agentsById.get(String(req.params.id))
    if (!agent) return notFound(reply, 'agent', req.params.id)
    return agent
  })

  // ---- checklists -----------------------------------------------------------


  app.get('/v1/checklists', async () => ({
    count: corpus.checklists.length,
    total_items: corpus.checklists.reduce((n, c) => n + c.items.length, 0),
    results: corpus.checklists.map((c) => ({
      id: c.id, file: c.file, file_title: c.file_title, title: c.title, items: c.items.length, href: `/v1/checklists/${c.id}`
    }))
  }))

  app.get('/v1/checklists/:id', async (req, reply) => {
    const checklist = corpus.checklists.find((c) => c.id === String(req.params.id))
    if (!checklist) return notFound(reply, 'checklist', req.params.id)
    return checklist
  })

  // ---- tools ----------------------------------------------------------------
  app.get('/v1/libraries', async () => ({
    count: corpus.libraries.length,
    collection_modes: corpus.collections['collection-modes'].records,
    results: corpus.libraries
  }))

  app.get('/v1/tools', async (req) => {
    const q = String(req.query.q ?? '').trim().toLowerCase()
    const library = req.query.library ? String(req.query.library).toLowerCase() : null
    const category = req.query.category ? String(req.query.category).toLowerCase() : null

    const results = corpus.tools
      .filter((t) => !library || t.library_file === library || t.library.toLowerCase().includes(library))
      .filter((t) => !category || t.category.toLowerCase().includes(category))
      .filter((t) => !q || `${t.name} ${t.status ?? ''} ${textOf(t.attributes)}`.toLowerCase().includes(q))
      .map(toolSummary)

    return {
      libraries: corpus.libraries.map((l) => ({ file: l.file, name: l.name, count: l.count })),
      ...page(results, paging(req.query))
    }
  })

  app.get('/v1/tools/:id', async (req, reply) => {
    const tool = corpus.toolsById.get(String(req.params.id))
    if (!tool) return notFound(reply, 'tool', req.params.id)
    return tool
  })

  // ---- financial models -----------------------------------------------------
  app.get('/v1/financial-models', async () => ({
    count: corpus.financialModels.length,
    input_labels: corpus.collections['input-labels'].records,
    scenario_convention: corpus.codeById.get('12.3-scenario-convention.c1')?.content ?? null,
    core_rule: corpus.byNumber.get('12')?.sections.find((s) => s.anchor === '1-core-rule')?.blocks
      .filter((b) => b.type === 'paragraph').map((b) => b.text).join(' ') ?? null,
    results: corpus.financialModels.map((m) => ({
      id: m.id, number: m.number, name: m.name, formulas: m.formulas.length, href: `/v1/financial-models/${m.id}`
    }))
  }))

  app.get('/v1/financial-models/:id', async (req, reply) => {
    const model = corpus.modelsById.get(String(req.params.id))
    if (!model) return notFound(reply, 'financial model', req.params.id)
    return model
  })

  // ---- scoring --------------------------------------------------------------
  app.get('/v1/scoring', async () => ({
    count: Object.keys(RUBRICS).length,
    note: 'A hard gate overrides the numeric score. A missing input is reported, never defaulted to zero.',
    results: Object.values(RUBRICS).map((r) => ({
      id: r.id,
      name: r.name,
      output: r.output,
      formula: r.formula,
      dimensions: r.dimensions.length,
      source: r.section,
      href: `/v1/scoring/${r.id}`,
      score_with: `POST /v1/score/${r.id}`
    }))
  }))

  app.get('/v1/scoring/:rubric', async (req, reply) => {
    const rubric = RUBRICS[String(req.params.rubric)]
    if (!rubric) {
      return reply.code(404).send({ error: 'not_found', kind: 'rubric', id: req.params.rubric, available: Object.keys(RUBRICS) })
    }
    return rubric
  })

  app.post('/v1/score/:rubric', async (req, reply) => {
    const name = String(req.params.rubric)
    const scorer = SCORERS[name]
    if (!scorer) {
      return reply.code(404).send({ error: 'not_found', kind: 'rubric', id: name, available: Object.keys(SCORERS) })
    }
    reply.header('cache-control', 'no-store')
    return scorer(req.body ?? {})
  })

  // ---- search ---------------------------------------------------------------
  app.get('/v1/search', async (req) => {
    const q = String(req.query.q ?? '')
    const types = req.query.type ? String(req.query.type).split(',').map((s) => s.trim()).filter(Boolean) : null
    const { limit } = paging(req.query)
    const results = search(q, { limit, types })
    return {
      query: q,
      types: types ?? [...new Set(corpus.searchIndex.map((e) => e.type))],
      count: results.length,
      results
    }
  })
}

export { slugify }
