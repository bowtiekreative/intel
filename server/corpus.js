/**
 * The corpus: 23 Markdown files loaded once at boot into an addressable structure.
 *
 * Two layers sit on top of the raw documents:
 *
 *   1. A generic layer - every document, section, table and code block gets a stable id, so
 *      any part of the library is reachable without the API having to understand it.
 *   2. A typed layer - the collections the system actually reasons with (change states, tools,
 *      phases, financial models, agent prompts, ...) extracted from named sections by the
 *      registry below.
 *
 * The typed layer never invents a record. Each collection declares exactly which file and
 * section it reads, and every extracted record carries a `defined_in` pointer back to the
 * file, section anchor and source line. If a section moves, the collection empties rather
 * than silently producing something else - `integrity()` reports that, and a test asserts it.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse, sectionTree, flattenSections, slugify, plain, textOf } from './markdown.js'

const here = dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = join(here, '..', 'data', 'volumetric-intelligence-system')

/** "04-nine-phase-playbook.md" -> { num: "04", slug: "nine-phase-playbook" } */
function parseName (filename) {
  const base = filename.replace(/\.md$/, '')
  const m = base.match(/^(\d{2})-(.+)$/)
  return m ? { num: m[1], slug: m[2] } : { num: null, slug: slugify(base) }
}

/* ------------------------------------------------------------------ load -- */

function loadDocuments () {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.md')).sort()
  const docs = []

  for (const filename of files) {
    const { num, slug } = parseName(filename)
    const markdown = readFileSync(join(DATA_DIR, filename), 'utf8')
    const { title, blocks } = parse(markdown)
    const tree = sectionTree(blocks)
    const sections = flattenSections(tree)

    // Tables and code blocks get ids scoped to their section, so they stay stable when
    // unrelated parts of a file change.
    const tables = []
    const codeBlocks = []
    for (const section of sections) {
      let t = 0
      let c = 0
      for (const block of section.blocks) {
        if (block.type === 'table') {
          const id = `${num ?? slug}.${section.anchor}.t${++t}`
          block.id = id
          tables.push({
            id,
            file: num,
            file_slug: slug,
            section: section.anchor,
            section_title: section.title,
            caption: section.title,
            headers: block.headers,
            align: block.align,
            rows: block.rows,
            line: block.line
          })
        } else if (block.type === 'code') {
          const id = `${num ?? slug}.${section.anchor}.c${++c}`
          block.id = id
          codeBlocks.push({
            id,
            file: num,
            file_slug: slug,
            section: section.anchor,
            section_title: section.title,
            lang: block.lang,
            content: block.content,
            line: block.line
          })
        }
      }
    }

    docs.push({
      number: num,
      slug,
      filename,
      title: title || slug,
      markdown,
      sha256: createHash('sha256').update(markdown).digest('hex'),
      bytes: Buffer.byteLength(markdown),
      lines: markdown.split('\n').length,
      blocks,
      tree,
      sections,
      tables,
      code: codeBlocks
    })
  }
  return docs
}

const documents = loadDocuments().filter((d) => d.number !== '18')  // legal/ethical guardrail doc removed by operator request
const byNumber = new Map(documents.map((d) => [d.number, d]))
const bySlug = new Map(documents.map((d) => [d.slug, d]))
const allTables = documents.flatMap((d) => d.tables)
const allCode = documents.flatMap((d) => d.code)
const tableById = new Map(allTables.map((t) => [t.id, t]))
const codeById = new Map(allCode.map((c) => [c.id, c]))

/* ------------------------------------------------------------- accessors -- */

/** The nth table (1-based) inside a named section of a numbered file, or null. */
function tableAt (fileNum, anchor, n = 1) {
  const doc = byNumber.get(fileNum)
  if (!doc) return null
  const matches = doc.tables.filter((t) => t.section === anchor)
  return matches[n - 1] ?? null
}

/** The nth code block (1-based) inside a named section, or null. */
function codeAt (fileNum, anchor, n = 1) {
  const doc = byNumber.get(fileNum)
  if (!doc) return null
  const matches = doc.code.filter((c) => c.section === anchor)
  return matches[n - 1] ?? null
}

function sectionAt (fileNum, anchor) {
  const doc = byNumber.get(fileNum)
  if (!doc) return null
  return doc.sections.find((s) => s.anchor === anchor) ?? null
}

/** Every list item in a section, flattened, with its checkbox state preserved. */
function listItemsAt (fileNum, anchor) {
  const section = sectionAt(fileNum, anchor)
  if (!section) return []
  return section.blocks
    .filter((b) => b.type === 'list')
    .flatMap((b) => b.items.map((it) => ({ text: plain(it.text), raw: it.text, checked: it.checked })))
}

/** Paragraph text in a section, joined. */
function proseAt (fileNum, anchor) {
  const section = sectionAt(fileNum, anchor)
  if (!section) return ''
  return section.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text)).join(' ')
}

const pointer = (table) => ({
  file: table.file,
  file_slug: table.file_slug,
  section: table.section,
  table: table.id,
  line: table.line
})

/**
 * Turn a table into records keyed by its first column.
 * Column headers become snake_case field names; the raw cells stay available under `cells`.
 */
function recordsFrom (table, { idColumn = 0, idPrefix = '' } = {}) {
  if (!table) return []
  const keys = table.headers.map((h) => slugify(h).replace(/-/g, '_') || 'column')
  const seen = new Map()
  return table.rows
    .filter((row) => row.some((c) => c.trim()))
    .map((row) => {
      const raw = plain(row[idColumn] ?? '')
      let id = idPrefix + (slugify(raw) || 'row')
      const n = seen.get(id) ?? 0
      seen.set(id, n + 1)
      if (n > 0) id = `${id}-${n + 1}`
      const record = { id, label: raw }
      keys.forEach((key, i) => { record[key] = row[i] ?? '' })
      return { ...record, cells: row, defined_in: pointer(table) }
    })
}

/* ---------------------------------------------------------- link parsing -- */

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

function linksIn (text) {
  const out = []
  for (const m of String(text ?? '').matchAll(LINK)) out.push({ label: m[1], url: m[2] })
  return out
}

/* ------------------------------------------------------- typed registry -- */

/**
 * Simple lookup tables. Each entry declares the file, section anchor and table index it
 * reads; nothing is guessed. Adding a collection here is the only way to add a typed
 * endpoint, which keeps the API and the corpus in step.
 */
const TABLE_COLLECTIONS = {
  // 00 - System charter
  protocol: { file: '00', anchor: '2-canonical-protocol', title: 'Canonical LAKA protocol' },
  layers: { file: '00', anchor: '4-separation-of-layers', title: 'Separation of layers' },
  'truth-states': { file: '00', anchor: '6-output-truth-labels', title: 'Output truth labels' },
  'audit-modes': { file: '00', anchor: '9-audit-modes', title: 'Audit modes' },

  // 01 - LAKA core grammar
  'change-states': { file: '01', anchor: 'layer-a-change-states', title: 'Five change states' },
  'internal-variables': { file: '01', anchor: 'layer-b-internal-system-variables', title: 'Ten internal system variables' },
  'change-variables': { file: '01', anchor: 'layer-c-fourteen-change-variables', title: 'Fourteen change variables' },
  'execution-impact': { file: '01', anchor: 'execution-impact', title: 'Six execution-impact states' },
  operators: { file: '01', anchor: '2-operators', title: 'Grammar operators' },
  'structural-matrix': { file: '01', anchor: '5-fifty-cell-structural-matrix', title: 'Fifty-cell structural matrix' },

  // 02 - Investigation grammar
  modules: { file: '02', anchor: '5-nine-domain-modules', title: 'Nine domain modules' },
  'hypothesis-families': { file: '02', anchor: '7-symptom-to-hypothesis-branching', title: 'Symptom-to-hypothesis families' },
  'intervention-patterns': { file: '02', anchor: '8-intervention-branching', title: 'Intervention patterns by change state' },

  // 03 - Evidence and provenance
  'evidence-levels': { file: '03', anchor: '1-evidence-states', title: 'Evidence states E0-E5' },
  'security-rewrites': { file: '03', anchor: '9-security-evidence', title: 'Evidence-safe security phrasing' },
  'evidence-use-matrix': { file: '03', anchor: '13-evidence-use-matrix', title: 'Report and outreach use by claim type' },

  // 05 - Technical OSINT
  'collection-modes': { file: '05', anchor: '1-mode-legend', title: 'Collection modes CM0-CM3' },
  'passive-core': { file: '05', anchor: '6-recommended-passive-core', title: 'Recommended passive core' },
  'claim-gates': { file: '05', anchor: '8-claim-gates-and-freshness', title: 'Claim gates and freshness' },

  // 10 - Query atlas
  'alternative-families': { file: '10', anchor: '3-bound-alternative-vocabularies', title: 'Bound alternative vocabularies' },
  'query-patterns': { file: '10', anchor: '4-safe-public-source-query-atlas', title: 'Safe public-source query atlas' },
  'coverage-modes': { file: '10', anchor: '6-bounded-coverage-modes', title: 'Bounded coverage modes' },

  // 11 - Scoring
  'finding-dimensions': { file: '11', anchor: '2-finding-quality-score', title: 'Finding quality dimensions' },
  'opportunity-dimensions': { file: '11', anchor: '3-opportunity-priority-score', title: 'Opportunity priority dimensions' },
  'lead-dimensions': { file: '11', anchor: '5-lead-qualification-score', title: 'Lead qualification dimensions' },
  'model-confidence': { file: '11', anchor: '8-economic-model-confidence', title: 'Economic model confidence classes' },
  'portfolio-rules': { file: '11', anchor: '9-portfolio-rules', title: 'Portfolio horizon rules' },

  // 08 - Economic and financial. This table is keyed by modeling layer rather than by tool,
  // so it is a lookup collection rather than a tool-registry section.
  'modeling-stack': { file: '08', anchor: '7-open-source-modeling-library', title: 'Open-source modeling stack by layer' },
  'financial-evidence-rules': { file: '08', anchor: '8-evidence-and-uncertainty', title: 'Financial treatment by evidence condition' },

  // 12 - Financial models
  'input-labels': { file: '12', anchor: '2-input-labels', title: 'Financial input labels' },

  // 13 - Competitor benchmark
  'benchmark-dimensions': { file: '13', anchor: '3-benchmark-dimensions', title: 'Benchmark dimensions' },
  'trajectory-matrix': { file: '13', anchor: '10-laka-trajectory-matrix', title: 'LAKA trajectory matrix' },

  // 14 - Outreach
  'role-angles': { file: '14', anchor: '3-role-to-angle-routing', title: 'Role-to-angle routing' },
  objections: { file: '14', anchor: '9-objection-handling', title: 'Evidence-safe objection handling' },

  // 15 - CRM
  'crm-entities': { file: '15', anchor: '2-normalized-entities', title: 'Normalized CRM entities' },
  'contact-statuses': { file: '15', anchor: '5-contact-statuses', title: 'Contact statuses and export rules' },

  // 16 - Architecture
  planes: { file: '16', anchor: '1-architectural-rule', title: 'Six architectural planes' },
  'api-boundaries': { file: '16', anchor: '5-api-boundaries', title: 'Service write authority' },
  'privacy-tables': { file: '16', anchor: '6-privacy-and-deletion-architecture', title: 'Privacy and deletion records' },
  'deployment-stages': { file: '16', anchor: '8-deployment-stages', title: 'Deployment stages ARCH0-ARCH4' },

  // 17 - Automation
  controls: { file: '17', anchor: '3-operational-controls', title: 'Operational controls' },
  schedules: { file: '17', anchor: '4-schedules-and-triggers', title: 'Schedules and triggers' },
  responsibility: { file: '17', anchor: '6-human-responsibility-matrix', title: 'Human responsibility matrix' },

  // 21 - Quality control
  verdicts: { file: '21', anchor: '1-release-verdicts', title: 'Release verdicts' },
  'phase-minimums': { file: '21', anchor: '4-nine-phase-completeness', title: 'Minimum output per phase' }
}

function buildTableCollections () {
  const out = {}
  for (const [name, spec] of Object.entries(TABLE_COLLECTIONS)) {
    const table = tableAt(spec.file, spec.anchor, spec.index ?? 1)
    out[name] = {
      id: name,
      title: spec.title,
      source: table ? pointer(table) : { file: spec.file, section: spec.anchor, table: null, missing: true },
      headers: table?.headers ?? [],
      align: table?.align ?? [],
      count: table ? table.rows.length : 0,
      records: recordsFrom(table)
    }
  }
  return out
}

/* ------------------------------------------------------------------ tools -- */

/**
 * The tool libraries (files 05-09). Every listed section is a catalogue table whose first
 * column names a tool or source; the remaining columns differ per table and are preserved
 * verbatim under `attributes`. Status/licence and official-source columns are recognised by
 * their header so a caller can filter without knowing which table a row came from.
 */
const TOOL_SECTIONS = [
  ['05', '2-deployable-open-source-components', 'Open-source components'],
  ['05', '3-hosted-free-open-data-sources', 'Hosted free and open-data sources'],
  ['06', '2-news-media-and-web-mentions', 'News, media and web mentions'],
  ['06', '3-social-and-review-sources', 'Social and review sources'],
  ['06', '4-narrative-verification', 'Narrative verification'],
  ['06', '5-open-source-ingestion-and-monitoring', 'Ingestion and monitoring'],
  ['06', '6-nlp-clustering-and-network-analysis', 'NLP, clustering and network analysis'],
  ['07', '1-ad-transparency-and-creative-intelligence', 'Ad transparency and creative intelligence'],
  ['07', '2-search-demand-and-owned-performance', 'Search demand and owned performance'],
  ['07', '3-crawling-extraction-and-content-velocity', 'Crawling, extraction and content velocity'],
  ['07', '4-audience-questions-and-public-conversation', 'Audience questions and public conversation'],
  ['07', '5-analytics-and-conversion-intelligence', 'Analytics and conversion intelligence'],
  ['07', '6-performance-accessibility-and-experimentation', 'Performance, accessibility and experimentation'],
  ['07', '7-email-and-landing-diagnostics', 'Email and landing diagnostics'],
  ['07', '8-local-geographic-intelligence', 'Local and geographic intelligence'],
  ['08', '1-company-identity-and-financial-evidence', 'Company identity and financial evidence'],
  ['08', '2-canada-official-sources', 'Canada official sources'],
  ['08', '3-united-states-official-sources', 'United States official sources'],
  ['08', '4-international-trade-and-supply-chain', 'International, trade and supply chain'],
  ['08', '5-regulatory-compliance-monitoring', 'Regulatory and compliance monitoring'],
  ['08', '6-public-price-and-competitor-normalization', 'Price and competitor normalization'],
  ['09', '2-acquisition-and-document-processing', 'Acquisition and document processing'],
  ['09', '3-workflow-orchestration', 'Workflow orchestration'],
  ['09', '4-storage-search-and-analysis', 'Storage, search and analysis'],
  ['09', '5-nlp-retrieval-and-knowledge-extraction', 'NLP, retrieval and knowledge extraction'],
  ['09', '6-entity-resolution-and-graph-analysis', 'Entity resolution and graph analysis'],
  ['09', '7-quality-provenance-observability-and-governance', 'Quality, provenance and governance'],
  ['09', '7a-api-identity-and-secrets', 'API, identity and secrets'],
  ['09', '8-reporting-and-crm-options', 'Reporting and CRM options']
]

const LIBRARY_NAMES = {
  '05': 'Technical and passive OSINT',
  '06': 'PR, reputation and narrative',
  '07': 'Marketing, demand and conversion',
  '08': 'Economic and financial',
  '09': 'Data, AI and orchestration'
}

const STATUS_HEADER = /license|licence|status|access/i

/**
 * Find the column holding official links.
 *
 * Several catalogue tables name their first column `Source` - that is the tool's own name,
 * not a link column - and carry the real links in a later `Official source` column. So the
 * search is ordered, and column 0 is never eligible.
 */
function sourceColumn (headers) {
  for (const pattern of [/official source/i, /repository/i, /^source$/i]) {
    const i = headers.findIndex((h, idx) => idx > 0 && pattern.test(h))
    if (i > 0) return i
  }
  return -1
}

function buildTools () {
  const tools = []
  const seen = new Map()

  for (const [file, anchor, category] of TOOL_SECTIONS) {
    const table = tableAt(file, anchor)
    if (!table) continue
    const statusIdx = table.headers.findIndex((h, i) => i > 0 && STATUS_HEADER.test(h))
    const sourceIdx = sourceColumn(table.headers)

    for (const row of table.rows) {
      if (!row.some((c) => c.trim())) continue
      const name = plain(row[0] ?? '')
      if (!name) continue

      let id = slugify(name)
      const n = seen.get(id) ?? 0
      seen.set(id, n + 1)
      if (n > 0) id = `${id}-${n + 1}`

      const attributes = {}
      table.headers.forEach((h, i) => {
        if (i === 0) return
        attributes[slugify(h).replace(/-/g, '_')] = plain(row[i] ?? '')
      })

      const links = row.flatMap((cell) => linksIn(cell))

      tools.push({
        id,
        name,
        library: LIBRARY_NAMES[file] ?? file,
        library_file: file,
        category,
        status: statusIdx > 0 ? plain(row[statusIdx] ?? '') : null,
        sources: sourceIdx >= 0 ? linksIn(row[sourceIdx] ?? '') : links,
        links,
        attributes,
        defined_in: pointer(table)
      })
    }
  }
  return tools
}

/* ----------------------------------------------------------------- phases -- */

/** The nine phases plus preflight and final synthesis, read from file 04's headings. */
function buildPhases () {
  const doc = byNumber.get('04')
  if (!doc) return []
  const top = doc.tree.sections[0]?.sections ?? []

  return top.map((section, order) => {
    const m = section.title.match(/^Phase\s+(\d+)\s*[-—]\s*(.*)$/)
    const parts = {}
    for (const sub of section.sections) {
      parts[slugify(sub.title).replace(/-/g, '_')] = sub.blocks
        .filter((b) => b.type === 'list')
        .flatMap((b) => b.items.map((it) => plain(it.text)))
    }
    return {
      id: m ? `phase-${m[1]}` : slugify(section.title),
      number: m ? Number(m[1]) : null,
      order,
      title: section.title,
      name: m ? m[2] : section.title,
      summary: section.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text)).join(' '),
      items: section.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))),
      parts,
      code: section.sections.flatMap((s) => s.blocks).concat(section.blocks)
        .filter((b) => b.type === 'code').map((b) => ({ id: b.id, lang: b.lang, content: b.content })),
      minimum_output: null, // filled in from file 21 below
      defined_in: { file: '04', file_slug: doc.slug, section: section.anchor, line: section.line }
    }
  })
}

/* -------------------------------------------------------------- workflows -- */

/** W0-W12, read from the third-level headings of file 17 section 2. */
function buildWorkflows () {
  const section = sectionAt('17', '2-end-to-end-workflow')
  if (!section) return []
  return section.sections.map((sub, order) => {
    const m = sub.title.match(/^(W\d+)\s*[-—]\s*(.*)$/)
    const parts = {}
    let currentLabel = null
    for (const block of sub.blocks) {
      if (block.type === 'paragraph' && /:$/.test(block.text.trim())) {
        currentLabel = slugify(block.text).replace(/-/g, '_')
        parts[currentLabel] = parts[currentLabel] ?? []
        continue
      }
      if (block.type === 'list') {
        const key = currentLabel ?? 'steps'
        parts[key] = (parts[key] ?? []).concat(block.items.map((it) => plain(it.text)))
      }
    }
    return {
      id: m ? m[1] : slugify(sub.title),
      order,
      title: sub.title,
      name: m ? m[2] : sub.title,
      parts,
      defined_in: { file: '17', section: sub.anchor, line: sub.line }
    }
  })
}

/* ----------------------------------------------------------------- agents -- */

/** Every agent prompt in file 19: one per section that carries a fenced prompt block. */
function buildAgents () {
  const doc = byNumber.get('19')
  if (!doc) return []
  const out = []
  for (const section of doc.sections) {
    const code = section.blocks.find((b) => b.type === 'code')
    if (!code) continue
    const name = section.title.replace(/^\d+\.\s*/, '')
    out.push({
      id: slugify(name),
      name,
      section_title: section.title,
      role: /coordinator/i.test(name) ? 'coordinator'
        : /critic|qa|reviewer|integrator/i.test(name) ? 'review'
          : /^phase/i.test(name) ? 'phase-specialist' : 'contract',
      phases: [...name.matchAll(/Phases?\s+(\d+)(?:\s+and\s+(\d+))?/gi)]
        .flatMap((m) => [m[1], m[2]].filter(Boolean).map(Number)),
      notes: section.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text)),
      prompt: code.content,
      lang: code.lang,
      defined_in: { file: '19', section: section.anchor, line: section.line }
    })
  }
  return out
}

/* ------------------------------------------------------- financial models -- */

/** Sections 4-22 of file 12: each is one named model with a formula block. */
function buildFinancialModels () {
  const doc = byNumber.get('12')
  if (!doc) return []
  const out = []
  for (const section of doc.sections) {
    const n = section.title.match(/^(\d+[A-Z]?)\.\s*(.*)$/)
    if (!n) continue
    const index = parseInt(n[1], 10)
    if (!(index >= 4 && index <= 22)) continue
    const codes = section.blocks.filter((b) => b.type === 'code')
    if (!codes.length) continue
    out.push({
      id: slugify(n[2]),
      number: n[1],
      name: n[2],
      formulas: codes.map((c) => ({ id: c.id, lang: c.lang, content: c.content })),
      notes: section.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text)),
      constraints: section.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))),
      defined_in: { file: '12', section: section.anchor, line: section.line }
    })
  }
  return out
}

/* -------------------------------------------------------------- checklists -- */

/** Every checkbox list in the corpus, grouped by the section that owns it. */
function buildChecklists () {
  const out = []
  for (const doc of documents) {
    for (const section of doc.sections) {
      const boxes = section.blocks.filter((b) => b.type === 'list' && b.checklist)
      if (!boxes.length) continue
      out.push({
        id: `${doc.number}.${section.anchor}`,
        file: doc.number,
        file_slug: doc.slug,
        file_title: doc.title,
        title: section.title,
        items: boxes.flatMap((b) => b.items.map((it) => plain(it.text))),
        defined_in: { file: doc.number, section: section.anchor, line: section.line }
      })
    }
  }
  return out
}

/* ------------------------------------------------------------- guardrails -- */

/** Named guardrail sections from file 18, kept whole because their force is in the prose. */
function buildGuardrails () {
  const doc = byNumber.get('18')
  if (!doc) return []
  return doc.sections
    .filter((s) => s.level === 2)
    .map((section) => ({
      id: slugify(section.title.replace(/^\d+[A-Z]?\.\s*/, '')),
      title: section.title,
      jurisdiction: /canada|canadian|casl|pipeda/i.test(section.title) ? 'CA'
        : /united states|can-spam|us state/i.test(section.title) ? 'US'
          : /eu|eea|gdpr|eprivacy/i.test(section.title) ? 'EU' : 'any',
      prose: section.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text)),
      rules: section.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))),
      code: section.blocks.filter((b) => b.type === 'code').map((b) => ({ id: b.id, lang: b.lang, content: b.content })),
      subsections: section.sections.map((s) => ({
        title: s.title,
        rules: s.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))),
        prose: s.blocks.filter((b) => b.type === 'paragraph').map((b) => plain(b.text))
      })),
      defined_in: { file: '18', section: section.anchor, line: section.line }
    }))
}

/* --------------------------------------------------------------- cube -- */

/**
 * The 6x6x6 expansion lens from file 01 layer D. Two of its three axes are stated as an
 * inline-code list in a paragraph rather than a table; the third is the execution-impact
 * table, so it comes from the collection above.
 */
function axisFrom (fileNum, anchor) {
  const section = sectionAt(fileNum, anchor)
  const para = section?.blocks.find((b) => b.type === 'paragraph' && b.text.includes('|'))
  if (!para) return []
  return plain(para.text).split('|').map((s) => s.trim()).filter(Boolean)
}

function buildCube () {
  const interrogatives = axisFrom('01', 'interrogatives')
  const modifiers = axisFrom('01', 'relational-modifiers')
  const impacts = tableAt('01', 'execution-impact')?.rows.map((r) => ({
    code: plain(r[0]), state: plain(r[1]), permission: plain(r[2])
  })) ?? []
  return {
    interrogatives,
    modifiers,
    impacts,
    size: interrogatives.length * modifiers.length * impacts.length,
    lens_sentence: codeAt('10', 'canonical-lens-sentence')?.content ?? null,
    finding_sentence: codeAt('10', 'canonical-finding-sentence')?.content ?? null,
    defined_in: { file: '01', section: 'layer-d-6-6-6-expansion-and-execution-lens' }
  }
}

/**
 * Enumerate lenses from the cube, optionally filtered on any axis.
 * Passive research lives in I1-I2; the permission text travels with every lens so a caller
 * cannot pick a lens without seeing what it authorises.
 */
export function lenses ({ interrogative, modifier, impact } = {}) {
  const c = corpus.cube
  const match = (want, value) => !want || String(value).toLowerCase() === String(want).toLowerCase()
  const out = []
  for (const i of c.interrogatives) {
    if (!match(interrogative, i)) continue
    for (const m of c.modifiers) {
      if (!match(modifier, m)) continue
      for (const s of c.impacts) {
        if (impact && ![s.code, s.state].some((v) => match(impact, v))) continue
        out.push({
          id: `${i}.${m}.${s.code}`.toLowerCase(),
          interrogative: i,
          modifier: m,
          impact: s.code,
          impact_state: s.state,
          permission: s.permission,
          passive_default: ['I1', 'I2'].includes(s.code)
        })
      }
    }
  }
  return out
}

/* ------------------------------------------------------------- assembly -- */

const collections = buildTableCollections()
const tools = buildTools()
const phases = buildPhases()
const workflows = buildWorkflows()
const agents = buildAgents()
const financialModels = buildFinancialModels()
const checklists = buildChecklists()
const guardrails = buildGuardrails().filter(() => false)  // guardrails removed by operator request

// Cross-reference: the minimum output each phase must produce (file 21) onto the phase itself.
for (const record of collections['phase-minimums'].records) {
  const n = record.phase?.match(/^(\d+)/)
  if (!n) continue
  const phase = phases.find((p) => p.number === Number(n[1]))
  if (phase) phase.minimum_output = plain(record.minimum_output ?? '')
}

const toolsById = new Map(tools.map((t) => [t.id, t]))
const phasesById = new Map(phases.map((p) => [p.id, p]))
const agentsById = new Map(agents.map((a) => [a.id, a]))
const workflowsById = new Map(workflows.map((w) => [w.id, w]))
const modelsById = new Map(financialModels.map((m) => [m.id, m]))
const guardrailsById = new Map(guardrails.map((g) => [g.id, g]))

/* ---------------------------------------------------------------- README -- */

/** Version and research baseline come from the README, not from a hand-kept constant. */
function buildManifest () {
  const readme = documents.find((d) => d.filename === 'README.md')
  const line = readme?.markdown.match(/Version\s+([\d.]+)\s*[-—]\s*research baseline:\s*([\d-]+)/i)
  const purpose = readme?.blocks.find((b) => b.type === 'paragraph' && b.text.length > 80)
  return {
    title: readme?.title ?? 'LAKA Volumetric Intelligence System',
    short_name: 'LVIS',
    version: line?.[1] ?? '1.0',
    research_baseline: line?.[2] ?? null,
    purpose: purpose ? plain(purpose.text) : '',
    inventory: {
      documents: documents.length,
      sections: documents.reduce((n, d) => n + d.sections.length, 0),
      tables: allTables.length,
      code_blocks: allCode.length,
      tools: tools.length,
      phases: phases.filter((p) => p.number != null).length,
      workflows: workflows.length,
      agents: agents.length,
      financial_models: financialModels.length,
      query_patterns: collections['query-patterns'].count,
      checklist_items: checklists.reduce((n, c) => n + c.items.length, 0)
    },
    operating_rules: (() => {
      const s = readme?.sections.find((x) => /mandatory operating rules/i.test(x.title))
      return s ? s.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))) : []
    })(),
    completion_definition: (() => {
      const s = readme?.sections.find((x) => /completion definition/i.test(x.title))
      return s ? s.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))) : []
    })(),
    output_bundle: (() => {
      const s = readme?.sections.find((x) => /output bundle/i.test(x.title))
      return s ? s.blocks.filter((b) => b.type === 'list').flatMap((b) => b.items.map((it) => plain(it.text))) : []
    })(),
    non_goals: listItemsAt('00', '7-non-goals').map((i) => i.text),
    stop_conditions: listItemsAt('00', '10-stop-conditions').map((i) => i.text),
    scope_contract: codeAt('00', '3-scope-contract')?.content ?? null,
    authority_model: proseAt('00', '8-authority-model')
  }
}

const manifest = buildManifest()

/* ----------------------------------------------------------- search index -- */

function buildSearchIndex () {
  const index = []
  const push = (type, id, title, body, href) =>
    index.push({ type, id, title, href, hay: `${id} ${title} ${body}`.toLowerCase() })

  for (const d of documents) push('document', d.slug, d.title, plain(textOf(d.blocks).slice(0, 6000)), `/docs/${d.slug}`)
  for (const d of documents) {
    for (const s of d.sections) {
      if (s.level === 1) continue
      push('section', `${d.number}.${s.anchor}`, s.title, `${d.title} ${plain(textOf(s.blocks).slice(0, 3000))}`, `/docs/${d.slug}#${s.anchor}`)
    }
  }
  for (const t of tools) push('tool', t.id, t.name, `${t.library} ${t.category} ${t.status ?? ''} ${textOf(t.attributes)}`, `/tools/${t.id}`)
  for (const p of phases) push('phase', p.id, p.title, `${p.summary} ${p.items.join(' ')}`, `/phases#${p.id}`)
  for (const a of agents) push('agent', a.id, a.name, a.prompt.slice(0, 3000), `/agents/${a.id}`)
  for (const m of financialModels) push('model', m.id, m.name, `${m.notes.join(' ')} ${m.formulas.map((f) => f.content).join(' ')}`, `/financial-models#${m.id}`)
  for (const w of workflows) push('workflow', w.id, `${w.id} ${w.name}`, textOf(w.parts), `/workflows#${w.id}`)
  for (const g of guardrails) push('guardrail', g.id, g.title, `${g.prose.join(' ')} ${g.rules.join(' ')}`, `/guardrails#${g.id}`)
  for (const [name, c] of Object.entries(collections)) {
    for (const r of c.records) push('record', `${name}:${r.id}`, `${r.label} - ${c.title}`, textOf(r.cells), `/reference/${name}#${r.id}`)
  }
  return index
}

const searchIndex = buildSearchIndex()

/**
 * Which declared collections actually resolved. A missing section means the corpus changed
 * under the registry; the endpoint reports it rather than pretending the collection is empty
 * by design.
 */
export function integrity () {
  const missing = Object.entries(collections)
    .filter(([, c]) => c.source.missing || c.count === 0)
    .map(([name, c]) => ({ collection: name, expected_file: c.source.file, expected_section: c.source.section }))
  const emptyToolSections = TOOL_SECTIONS
    .filter(([file, anchor]) => !tableAt(file, anchor))
    .map(([file, anchor]) => ({ file, section: anchor }))
  return {
    ok: missing.length === 0 && emptyToolSections.length === 0,
    documents: documents.length,
    collections: Object.keys(collections).length,
    unresolved_collections: missing,
    unresolved_tool_sections: emptyToolSections
  }
}

export const corpus = {
  manifest,
  cube: buildCube(),
  documents,
  byNumber,
  bySlug,
  tables: allTables,
  tableById,
  code: allCode,
  codeById,
  collections,
  tools,
  toolsById,
  phases,
  phasesById,
  workflows,
  workflowsById,
  agents,
  agentsById,
  financialModels,
  modelsById,
  checklists,
  guardrails,
  guardrailsById,
  searchIndex,
  libraries: Object.entries(LIBRARY_NAMES).map(([file, name]) => ({
    file,
    name,
    slug: bySlug.get(byNumber.get(file)?.slug)?.slug ?? null,
    categories: [...new Set(tools.filter((t) => t.library_file === file).map((t) => t.category))],
    count: tools.filter((t) => t.library_file === file).length
  }))
}

export { slugify, plain }
