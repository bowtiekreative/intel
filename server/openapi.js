/**
 * The OpenAPI 3.1 description of /v1.
 *
 * Built from the live corpus rather than kept as a static file, so enumerations that come
 * from the doctrine - collection names, rubric ids, library files, agent roles - are always
 * the ones the API will actually accept.
 */

import { corpus } from './corpus.js'
import { RUBRICS } from './scoring.js'

const ORIGIN = process.env.PUBLIC_ORIGIN ?? 'https://intel.bowtiekreative.com'

const ok = (description, schema) => ({
  200: { description, content: { 'application/json': { schema } } }
})

const notFound = {
  404: {
    description: 'No such record.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', const: 'not_found' },
            kind: { type: 'string' },
            id: { type: 'string' }
          }
        }
      }
    }
  }
}

const OBJECT = { type: 'object', additionalProperties: true }
const ARRAY = { type: 'array', items: OBJECT }

const pathParam = (name, description, extra = {}) => ({
  name, in: 'path', required: true, description, schema: { type: 'string', ...extra }
})

const queryParam = (name, description, extra = {}) => ({
  name, in: 'query', required: false, description, schema: { type: 'string', ...extra }
})

const PAGING = [
  { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 500, default: 50 } },
  { name: 'offset', in: 'query', required: false, schema: { type: 'integer', minimum: 0, default: 0 } }
]

/** The dimension keys a rubric accepts, as a request schema a caller can validate against. */
function rubricRequestSchema (rubric) {
  const properties = {}
  for (const d of rubric.dimensions) {
    properties[d.key] = {
      type: 'number',
      minimum: d.scale?.min ?? 0,
      maximum: d.scale?.max ?? 5,
      description: d.label + (d.weight ? ` (weight ${Math.round(d.weight * 100)}%)` : '') +
        (d.max_points ? ` (0-${d.max_points} points)` : '')
    }
  }

  if (rubric.id === 'opportunity') {
    return {
      type: 'object',
      description: 'Dimensions may be sent flat or nested under `dimensions`.',
      properties: {
        dimensions: { type: 'object', properties, required: Object.keys(properties) },
        confidence: { type: 'string', enum: Object.keys(rubric.confidence_factors) },
        risk_penalty: { type: 'number', minimum: 0, maximum: rubric.risk_penalty_max },
        gates: {
          type: 'object',
          description: 'Answer every hard gate. A failed gate blocks regardless of score.',
          properties: Object.fromEntries(rubric.hard_gates.map((g) => [g.id, { type: 'boolean', description: g.question }]))
        }
      }
    }
  }

  return { type: 'object', properties, required: Object.keys(properties) }
}

export function buildOpenApi () {
  const collectionNames = Object.keys(corpus.collections)
  const rubricNames = Object.keys(RUBRICS)
  const searchTypes = [...new Set(corpus.searchIndex.map((e) => e.type))]

  const paths = {
    '/v1': {
      get: {
        tags: ['Index'],
        summary: 'Service index',
        description: 'Version, inventory, operating rules and every endpoint.',
        responses: ok('The service index.', OBJECT)
      }
    },
    '/v1/health': {
      get: {
        tags: ['Index'],
        summary: 'Liveness and corpus integrity',
        responses: ok('Health, corpus counts and the number of unresolved collections.', {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'degraded'] },
            version: { type: 'string' },
            documents: { type: 'integer' },
            tools: { type: 'integer' },
            collections: { type: 'integer' },
            unresolved: { type: 'integer' },
            uptime_s: { type: 'integer' }
          }
        })
      }
    },
    '/v1/openapi.json': {
      get: { tags: ['Index'], summary: 'This document', responses: ok('OpenAPI 3.1 document.', OBJECT) }
    },
    '/v1/manifest': {
      get: {
        tags: ['Index'],
        summary: 'Version, baseline, operating rules and inventory',
        responses: ok('The corpus manifest.', OBJECT)
      }
    },
    '/v1/integrity': {
      get: {
        tags: ['Index'],
        summary: 'Which typed collections resolved against the corpus',
        description: 'Each typed collection declares the file and section it reads. This reports any that no longer resolve.',
        responses: ok('Registry integrity.', OBJECT)
      }
    },

    '/v1/docs': {
      get: { tags: ['Corpus'], summary: 'The source documents', responses: ok('Document summaries.', OBJECT) }
    },
    '/v1/docs/{slug}': {
      get: {
        tags: ['Corpus'],
        summary: 'One document',
        description: 'Parsed blocks by default; `format=markdown` returns the file verbatim as text/markdown.',
        parameters: [
          pathParam('slug', 'Document slug or two-digit file number.', { examples: ['nine-phase-playbook', '04'] }),
          queryParam('format', 'Response format.', { enum: ['blocks', 'markdown'], default: 'blocks' })
        ],
        responses: { ...ok('The document.', OBJECT), ...notFound }
      }
    },
    '/v1/docs/{slug}/sections': {
      get: {
        tags: ['Corpus'],
        summary: 'Section outline for a document',
        parameters: [pathParam('slug', 'Document slug or file number.')],
        responses: { ...ok('The outline.', OBJECT), ...notFound }
      }
    },
    '/v1/docs/{slug}/sections/{anchor}': {
      get: {
        tags: ['Corpus'],
        summary: 'One section with its blocks',
        parameters: [
          pathParam('slug', 'Document slug or file number.'),
          pathParam('anchor', 'Section anchor, as returned by the outline.')
        ],
        responses: { ...ok('The section.', OBJECT), ...notFound }
      }
    },
    '/v1/tables': {
      get: {
        tags: ['Corpus'],
        summary: 'Every table in the corpus',
        parameters: [queryParam('file', 'Two-digit file number or slug.'), queryParam('q', 'Match section title or headers.'), ...PAGING],
        responses: ok('Table summaries.', OBJECT)
      }
    },
    '/v1/tables/{id}': {
      get: {
        tags: ['Corpus'],
        summary: 'One table',
        parameters: [pathParam('id', 'Table id, e.g. 01.layer-c-fourteen-change-variables.t1')],
        responses: { ...ok('Headers, alignment and rows.', OBJECT), ...notFound }
      }
    },
    '/v1/code': {
      get: {
        tags: ['Corpus'],
        summary: 'Every fenced block: grammars, formulas, contracts and prompts',
        parameters: [
          queryParam('lang', 'Fence language.', { enum: [...new Set(corpus.code.map((c) => c.lang))] }),
          queryParam('file', 'Two-digit file number or slug.'),
          queryParam('q', 'Match section title or block content.'),
          ...PAGING
        ],
        responses: ok('Code block summaries.', OBJECT)
      }
    },
    '/v1/code/{id}': {
      get: {
        tags: ['Corpus'],
        summary: 'One fenced block',
        parameters: [pathParam('id', 'Block id, e.g. 00.3-scope-contract.c1')],
        responses: { ...ok('The block.', OBJECT), ...notFound }
      }
    },

    '/v1/laka': {
      get: {
        tags: ['Grammar'],
        summary: 'The four-layer LAKA grammar',
        description: 'Change states, internal variables, change variables, execution impact, operators, the fifty-cell matrix and the expansion cube.',
        responses: ok('The grammar.', OBJECT)
      }
    },
    '/v1/laka/lenses': {
      get: {
        tags: ['Grammar'],
        summary: `Enumerate the ${corpus.cube.size}-lens expansion cube`,
        parameters: [
          queryParam('interrogative', 'One interrogative axis value.', { enum: corpus.cube.interrogatives }),
          queryParam('modifier', 'One relational modifier.', { enum: corpus.cube.modifiers }),
          queryParam('impact', 'One execution-impact state.', { enum: corpus.cube.impacts.map((i) => i.code) }),
          ...PAGING
        ],
        responses: ok('Lenses, each carrying the permission rule for its impact state.', OBJECT)
      }
    },
    '/v1/collections': {
      get: { tags: ['Grammar'], summary: 'The typed lookup collections', responses: ok('Collection summaries.', OBJECT) }
    },
    '/v1/collections/{name}': {
      get: {
        tags: ['Grammar'],
        summary: 'One collection with its records and source pointer',
        parameters: [pathParam('name', 'Collection name.', { enum: collectionNames })],
        responses: { ...ok('The collection.', OBJECT), ...notFound }
      }
    },

    '/v1/phases': {
      get: { tags: ['Method'], summary: 'The nine audit phases', responses: ok('Phase summaries.', OBJECT) }
    },
    '/v1/phases/{id}': {
      get: {
        tags: ['Method'],
        summary: 'One phase',
        parameters: [pathParam('id', 'Phase id.', { enum: corpus.phases.map((p) => p.id) })],
        responses: { ...ok('Questions, method, controls and deliverables.', OBJECT), ...notFound }
      }
    },
    '/v1/workflows': {
      get: { tags: ['Method'], summary: 'W0-W12 with controls and schedules', responses: ok('Workflow stages.', OBJECT) }
    },
    '/v1/workflows/{id}': {
      get: {
        tags: ['Method'],
        summary: 'One workflow stage',
        parameters: [pathParam('id', 'Workflow id.', { enum: corpus.workflows.map((w) => w.id) })],
        responses: { ...ok('The stage.', OBJECT), ...notFound }
      }
    },
    '/v1/agents': {
      get: {
        tags: ['Method'],
        summary: 'The multi-agent prompt pack',
        parameters: [queryParam('role', 'Filter by role.', { enum: [...new Set(corpus.agents.map((a) => a.role))] })],
        responses: ok('Agent summaries.', OBJECT)
      }
    },
    '/v1/agents/{id}': {
      get: {
        tags: ['Method'],
        summary: 'One agent prompt, verbatim',
        parameters: [pathParam('id', 'Agent id.', { enum: corpus.agents.map((a) => a.id) })],
        responses: { ...ok('The prompt and its handoff contract.', OBJECT), ...notFound }
      }
    },
    '/v1/guardrails': {
      get: {
        tags: ['Governance'],
        summary: 'Legal, privacy and safety guardrails',
        description: 'Guidance, not legal advice. Jurisdiction coverage is bounded.',
        parameters: [queryParam('jurisdiction', 'Filter to a jurisdiction; sections that apply everywhere are always included.', { enum: ['CA', 'US', 'EU'] })],
        responses: ok('Guardrail summaries.', OBJECT)
      }
    },
    '/v1/guardrails/{id}': {
      get: {
        tags: ['Governance'],
        summary: 'One guardrail section',
        parameters: [pathParam('id', 'Guardrail id.', { enum: corpus.guardrails.map((g) => g.id) })],
        responses: { ...ok('The guardrail.', OBJECT), ...notFound }
      }
    },
    '/v1/checklists': {
      get: { tags: ['Governance'], summary: 'Every acceptance checklist', responses: ok('Checklist summaries.', OBJECT) }
    },
    '/v1/checklists/{id}': {
      get: {
        tags: ['Governance'],
        summary: 'One checklist',
        parameters: [pathParam('id', 'Checklist id, e.g. 21.3-intake-and-scope')],
        responses: { ...ok('The checklist items.', OBJECT), ...notFound }
      }
    },

    '/v1/libraries': {
      get: { tags: ['Tools'], summary: 'The five tool libraries and the collection-mode legend', responses: ok('Libraries.', OBJECT) }
    },
    '/v1/tools': {
      get: {
        tags: ['Tools'],
        summary: 'Search and filter the tool registry',
        description: `${corpus.tools.length} tools and sources catalogued at the ${corpus.manifest.research_baseline} research baseline. Verify licences, tiers and terms again before deployment.`,
        parameters: [
          queryParam('library', 'Library file number or name fragment.', { enum: corpus.libraries.map((l) => l.file) }),
          queryParam('category', 'Category fragment.'),
          queryParam('q', 'Free-text match over name, status and attributes.'),
          ...PAGING
        ],
        responses: ok('Tool summaries.', OBJECT)
      }
    },
    '/v1/tools/{id}': {
      get: {
        tags: ['Tools'],
        summary: 'One tool or source',
        parameters: [pathParam('id', 'Tool id.')],
        responses: { ...ok('Attributes, limitations and official links.', OBJECT), ...notFound }
      }
    },

    '/v1/financial-models': {
      get: {
        tags: ['Economics'],
        summary: 'The financial impact models',
        description: 'Every dollar output is a low/base/high scenario with visible inputs. Missing inputs produce `not estimable`, not a number.',
        responses: ok('Model summaries with the scenario convention.', OBJECT)
      }
    },
    '/v1/financial-models/{id}': {
      get: {
        tags: ['Economics'],
        summary: 'One model',
        parameters: [pathParam('id', 'Model id.', { enum: corpus.financialModels.map((m) => m.id) })],
        responses: { ...ok('Formula, notes and constraints.', OBJECT), ...notFound }
      }
    },

    '/v1/scoring': {
      get: { tags: ['Scoring'], summary: 'The scoring rubrics', responses: ok('Rubric summaries.', OBJECT) }
    },
    '/v1/scoring/{rubric}': {
      get: {
        tags: ['Scoring'],
        summary: 'One rubric: dimensions, weights, gates and bands',
        parameters: [pathParam('rubric', 'Rubric id.', { enum: rubricNames })],
        responses: { ...ok('The rubric.', OBJECT), ...notFound }
      }
    },
    '/v1/score/{rubric}': {
      post: {
        tags: ['Scoring'],
        summary: 'Score a finding, opportunity, outreach draft or lead',
        description: 'Stateless. A missing dimension comes back under `needs_input` rather than counting as zero, and a failed hard gate blocks regardless of the number.',
        parameters: [pathParam('rubric', 'Rubric id.', { enum: rubricNames })],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { oneOf: rubricNames.map((n) => ({ title: RUBRICS[n].name, ...rubricRequestSchema(RUBRICS[n]) })) }
            }
          }
        },
        responses: {
          ...ok('The score, its components and its gates.', OBJECT),
          400: { description: 'A dimension value was not a number or fell outside its scale.', content: { 'application/json': { schema: OBJECT } } },
          ...notFound
        }
      }
    },

    '/v1/search': {
      get: {
        tags: ['Search'],
        summary: 'Search the corpus',
        parameters: [
          queryParam('q', 'Query. All terms must match.'),
          queryParam('type', `Comma-separated result types: ${searchTypes.join(', ')}.`),
          ...PAGING
        ],
        responses: ok('Ranked results.', OBJECT)
      }
    }
  }

  return {
    openapi: '3.1.0',
    info: {
      title: corpus.manifest.title,
      version: corpus.manifest.version,
      summary: 'Read the LAKA Volumetric Intelligence System, and run its scoring rubrics.',
      description: [
        corpus.manifest.purpose,
        '',
        `Research baseline ${corpus.manifest.research_baseline}. ${corpus.manifest.inventory.documents} documents, ` +
        `${corpus.manifest.inventory.tools} catalogued tools and sources, ${corpus.manifest.inventory.financial_models} financial models.`,
        '',
        'This API serves doctrine and computes scores. It does not collect, store or contact anyone,',
        'and it is strategic and technical guidance rather than legal, investment or penetration-testing advice.'
      ].join('\n'),
      contact: { name: 'Bow Tie Kreative', url: 'https://bowtiekreative.com' }
    },
    servers: [{ url: ORIGIN, description: 'Production' }],
    tags: [
      { name: 'Index', description: 'Service metadata and integrity.' },
      { name: 'Corpus', description: 'The source documents, their sections, tables and fenced blocks.' },
      { name: 'Grammar', description: 'The LAKA layers, the expansion cube and the typed lookup collections.' },
      { name: 'Method', description: 'Phases, workflows and agent prompts.' },
      { name: 'Governance', description: 'Guardrails and acceptance checklists.' },
      { name: 'Tools', description: 'The tool and source registry.' },
      { name: 'Economics', description: 'Financial impact models.' },
      { name: 'Scoring', description: 'The four rubrics, executable.' },
      { name: 'Search', description: 'Cross-corpus search.' }
    ],
    paths
  }
}
