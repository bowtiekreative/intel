/**
 * Every page on the site.
 *
 * Each function returns `{ title, description, path, body }` for `layout()`. Interactive
 * pages are plain HTML forms - a GET form for the browsers and filters, a POST form for the
 * scorer - so the whole site works with JavaScript blocked.
 */

import { corpus, lenses } from '../corpus.js'
import { RUBRICS } from '../scoring.js'
import { ENDPOINTS } from '../routes/api.js'
import { esc, attr, icon, lattice, ORIGIN, MENU } from './layout.js'
import {
  chip, chips, table, renderBlocks, toc, statGrid, featureCard, pageHead, jsonBlock,
  provenance, collectionPanel, truthBadge, impactBadge
} from './components.js'
import { inline, plain } from '../markdown.js'

const inv = corpus.manifest.inventory

const section = (body, { cls = '' } = {}) => `
  <section class="${cls}">
    <div class="wrap stack">
${body}
    </div>
  </section>`

/* ------------------------------------------------------------------ home -- */

export function home () {
  const states = corpus.collections['change-states'].records
  const truth = corpus.collections['truth-states'].records

  const body = `
  <section class="hero">
    ${lattice()}
    <div class="wrap hero__content">
      <p class="eyebrow">${esc(corpus.manifest.short_name)} · version ${esc(corpus.manifest.version)} · baseline ${esc(corpus.manifest.research_baseline)}</p>
      <h1>Public evidence, turned into a claim you can defend.</h1>
      <p class="lede mt-7">
        This is an operating system for company intelligence, not a prompt. It takes lawful public
        evidence about a business and carries it through one unbroken chain &mdash; source, observation,
        claim state, confidence, mechanism, financial range, service fit, smallest useful next step.
      </p>
      <p class="lede muted">
        Every material sentence is labelled with how well it is known. Observed is not calculated,
        calculated is not inferred, and an inference never gets to wear an observation's clothes.
      </p>
      <div class="actions">
        <a class="pill pill--solid" href="/score">Score a finding</a>
        <a class="pill" href="/phases">Run the nine phases</a>
        <a class="pill" href="/api">Read the API</a>
      </div>
    </div>
  </section>

${section(`
      <h2>What the library contains</h2>
      ${statGrid([
        { value: inv.documents, label: 'Source documents' },
        { value: inv.tools, label: 'Catalogued tools and sources' },
        { value: inv.financial_models, label: 'Financial impact models' },
        { value: inv.query_patterns, label: 'Safe query families' }
      ])}
      <p class="muted t-14 mt-4">
        Counts are derived from the corpus at load time, not declared by hand. Source: the
        ${inv.documents} Markdown files served at <a href="/v1/docs">/v1/docs</a>, version
        ${esc(corpus.manifest.version)}, research baseline ${esc(corpus.manifest.research_baseline)}.
      </p>`)}

${section(`
      <p class="eyebrow">The discipline</p>
      <h2>Six labels, and no sentence escapes one</h2>
      <p class="tight">
        The label belongs on every material sentence, database claim, financial input and outreach
        fact. It is the difference between a finding an executive can act on and a guess that costs
        you the room.
      </p>
      <div class="grid grid--3 mt-7">
        ${truth.map((r) => `
        <article class="card feature">
          <span class="feature__icon">${icon('evidence')}</span>
          <div>
            <p class="meta-id">${esc(r.code)}</p>
            <h3 class="t-24">${esc(r.state)}</h3>
          </div>
          <p class="m-0">${inline(r.meaning)}</p>
        </article>`).join('')}
      </div>
      <p class="mt-7"><a href="/evidence">See the full evidence standard &rarr;</a></p>`)}

${section(`
      <p class="eyebrow">The grammar</p>
      <h2>Five change states, and a C4 is not a better C1</h2>
      <p class="tight">
        Change state describes how deep a change goes, not how good it is. Selection depends on
        evidence, fit, urgency, reversibility, capacity and time-to-useful-evidence &mdash; never on
        which state sounds most ambitious.
      </p>
      ${table({
        headers: corpus.collections['change-states'].headers,
        align: corpus.collections['change-states'].align,
        rows: states.map((r) => r.cells),
        caption: 'Five change states'
      })}
      <p class="mt-7"><a href="/laka">Read the four-layer grammar &rarr;</a></p>`)}

${section(`
      <p class="eyebrow">Three ways in</p>
      <h2>Read it, run it, or call it</h2>
      <div class="grid grid--3">
        ${featureCard({
          iconName: icon('phase'),
          title: 'Run the audit',
          body: 'Nine phases, each with its questions, collection lanes, required controls and deliverables. Preflight first; a phase is complete, N/A with a reason, unknown, or blocked.',
          href: '/phases',
          linkText: 'Open the playbook'
        })}
        ${featureCard({
          iconName: icon('score'),
          title: 'Score what you found',
          body: 'Four rubrics, executable. Weights come from the corpus, hard gates override the number, and a missing input is reported as missing rather than counted as a zero.',
          href: '/score',
          linkText: 'Open the scorer'
        })}
        ${featureCard({
          iconName: icon('api'),
          title: 'Call the API',
          body: `Every part of the library is public JSON: ${inv.documents} documents, ${inv.tools} tools, ${corpus.cube.size} expansion lenses, and the rubrics as POST endpoints.`,
          href: '/api',
          linkText: 'Read the reference'
        })}
      </div>`)}

${section(`
      <p class="eyebrow">Before anything else</p>
      <h2>The rules that bound every run</h2>
      <ol class="steps">
        ${corpus.manifest.operating_rules.slice(0, 6).map((r) => `<li><div>${inline(r)}</div></li>`).join('')}
      </ol>
      <div class="actions">
        <a class="pill" href="/guardrails">Legal and ethical guardrails</a>
        <a class="pill" href="/checklists">Acceptance checklists</a>
      </div>`)}`

  return {
    title: 'Public evidence, turned into a claim you can defend',
    description: corpus.manifest.purpose,
    path: '/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: corpus.manifest.title,
      description: corpus.manifest.purpose,
      url: ORIGIN,
      version: corpus.manifest.version,
      publisher: { '@type': 'Organization', name: 'Bow Tie Kreative', url: 'https://bowtiekreative.com' }
    }
  }
}

/* ------------------------------------------------------------------ laka -- */

export function lakaPage () {
  const c = corpus.collections
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 01',
        title: 'The LAKA grammar',
        lede: 'Four connected layers, not one flat grid. States say how deep a change goes, internal variables say what part of the system it touches, change variables say how it behaves over time, and the execution lens says what you are allowed to do about it.'
      })}
    </div>
  </section>

${section(`
      <h2 id="protocol">The canonical protocol</h2>
      <p class="tight">Every run walks the same seven stages. Elimination is recorded, not hidden &mdash; a discarded option with its reason is evidence too.</p>
      ${table({ headers: c.protocol.headers,
        align: c.protocol.align, rows: c.protocol.records.map((r) => r.cells), caption: 'Canonical protocol' })}
      ${provenance(c.protocol.records[0]?.defined_in)}`)}

${section(collectionPanel(c['change-states']))}
${section(collectionPanel(c['internal-variables']))}
${section(collectionPanel(c['change-variables']))}

${section(`
      <h2 id="execution-impact">Six execution-impact states</h2>
      <p class="tight">In passive research most valid collection actions stay in I1&ndash;I2. I3 produces the audit artifact, I4 needs explicit authorization, and I5&ndash;I6 are not prospecting tools at all.</p>
      <div class="grid grid--3">
        ${c['execution-impact'].records.map((r) => `
        <article class="card feature">
          ${impactBadge(r.code)}
          <h3 class="t-24">${esc(r.state)}</h3>
          <p class="m-0">${inline(r.permission_rule_in_this_system ?? r.cells[2] ?? '')}</p>
        </article>`).join('')}
      </div>
      ${provenance(c['execution-impact'].records[0]?.defined_in)}
      <p class="mt-7"><a href="/lenses">Expand the ${corpus.cube.size}-lens cube &rarr;</a></p>`)}

${section(collectionPanel(c.operators))}

${section(`
      <h2 id="structural-matrix">The fifty-cell structural matrix</h2>
      <p class="tight">Ten internal variables against five change states. The cell is the prompt: what does this variable look like at this depth of change?</p>
      ${table({ headers: c['structural-matrix'].headers,
        align: c['structural-matrix'].align, rows: c['structural-matrix'].records.map((r) => r.cells), caption: 'Fifty-cell structural matrix' })}
      ${provenance(c['structural-matrix'].records[0]?.defined_in)}
      <div class="actions">
        <a class="pill" href="/docs/laka-core-grammar">Read file 01 in full</a>
        <a class="pill" href="/v1/laka">GET /v1/laka</a>
      </div>`)}`

  return {
    title: 'The LAKA grammar',
    description: 'Five change states, ten internal variables, fourteen change variables and six execution-impact states - the four layers every finding is expressed in.',
    path: '/laka',
    body
  }
}

/* ---------------------------------------------------------------- lenses -- */

export function lensesPage (query = {}) {
  const cube = corpus.cube
  const selected = {
    interrogative: query.interrogative ?? '',
    modifier: query.modifier ?? '',
    impact: query.impact ?? ''
  }
  const results = lenses(selected)

  const option = (value, current) => `<option value="${attr(value)}"${value === current ? ' selected' : ''}>${esc(value)}</option>`

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 01, layer D',
        title: `The ${cube.size}-lens expansion cube`,
        lede: `Six interrogatives against six relational modifiers against six execution-impact states. Each lens is a question you can ask of a target, carrying the permission rule that says what you may do with the answer.`
      })}
    </div>
  </section>

${section(`
      <form class="panel" method="get" action="/lenses">
        <div class="filters">
          <div class="field">
            <label for="interrogative">Interrogative</label>
            <select id="interrogative" name="interrogative">
              <option value="">All six</option>
              ${cube.interrogatives.map((v) => option(v, selected.interrogative)).join('')}
            </select>
          </div>
          <div class="field">
            <label for="modifier">Relational modifier</label>
            <select id="modifier" name="modifier">
              <option value="">All six</option>
              ${cube.modifiers.map((v) => option(v, selected.modifier)).join('')}
            </select>
          </div>
          <div class="field">
            <label for="impact">Execution impact</label>
            <select id="impact" name="impact">
              <option value="">All six</option>
              ${cube.impacts.map((i) => option(i.code, selected.impact)).join('')}
            </select>
          </div>
          <div class="field">
            <label class="visually-hidden" for="apply">Apply</label>
            <button class="pill pill--solid" id="apply" type="submit">Apply</button>
          </div>
        </div>
      </form>

      <p class="muted t-14">${results.length} of ${cube.size} lenses. ${results.filter((l) => l.passive_default).length} sit in the passive default (I1&ndash;I2).</p>

      ${table({
        headers: ['Lens', 'Interrogative', 'Modifier', 'Impact', 'Permission'],
        rows: results.slice(0, 216).map((l) => [
          `\`${l.id}\``,
          l.interrogative,
          l.modifier,
          `${l.impact} ${l.impact_state}`,
          l.permission
        ]),
        caption: 'Expansion lenses'
      })}`)}

${section(`
      <h2>The canonical lens sentence</h2>
      <p class="tight">A lens becomes a question by filling this frame. The permitted research state is part of the sentence, not an afterthought.</p>
      <pre><code>${esc(cube.lens_sentence ?? '')}</code></pre>
      <h2 class="mt-9">The canonical finding sentence</h2>
      <pre><code>${esc(cube.finding_sentence ?? '')}</code></pre>
      <div class="actions">
        <a class="pill" href="/docs/query-pattern-library">Read the query atlas</a>
        <a class="pill" href="/v1/laka/lenses">GET /v1/laka/lenses</a>
      </div>`)}`

  return {
    title: `The ${cube.size}-lens expansion cube`,
    description: 'Six interrogatives, six relational modifiers and six execution-impact states, enumerated with the permission rule attached to each.',
    path: '/lenses',
    body
  }
}

/* -------------------------------------------------------------- evidence -- */

export function evidencePage () {
  const c = corpus.collections
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Files 00 and 03',
        title: 'Evidence, truth labels and what you may say',
        lede: 'A source is not a finding. Preserve the URL, the publication and retrieval times, the excerpt, and the hash &mdash; then say exactly how well the resulting claim is known, and what that permits you to do with it.'
      })}
    </div>
  </section>

${section(`
      <h2 id="truth-states">Six truth labels</h2>
      <div class="grid grid--3">
        ${c['truth-states'].records.map((r) => `
        <article class="card feature">
          ${truthBadge(r.code)}
          <h3 class="t-24">${esc(r.state)}</h3>
          <p class="m-0">${inline(r.meaning)}</p>
        </article>`).join('')}
      </div>
      ${provenance(c['truth-states'].records[0]?.defined_in)}`)}

${section(collectionPanel(c['evidence-levels']))}
${section(collectionPanel(c.layers))}

${section(`
      <h2 id="evidence-use-matrix">What each claim type may be used for</h2>
      <p class="tight">Report use and outreach use are separate permissions. A claim strong enough for an internal ledger is not automatically fit to put in front of an executive.</p>
      ${table({ headers: c['evidence-use-matrix'].headers,
        align: c['evidence-use-matrix'].align, rows: c['evidence-use-matrix'].records.map((r) => r.cells), caption: 'Evidence use matrix' })}
      ${provenance(c['evidence-use-matrix'].records[0]?.defined_in)}`)}

${section(`
      <h2 id="security-rewrites">Saying security findings safely</h2>
      <p class="tight">A passive signal is not a vulnerability, and an outreach email is never the place to raise one. Route material security observations to a published security contact or a responsible-disclosure process.</p>
      ${table({ headers: c['security-rewrites'].headers,
        align: c['security-rewrites'].align, rows: c['security-rewrites'].records.map((r) => r.cells), caption: 'Evidence-safe security phrasing' })}
      ${provenance(c['security-rewrites'].records[0]?.defined_in)}
      <div class="actions">
        <a class="pill" href="/docs/evidence-provenance-standard">Read file 03 in full</a>
        <a class="pill" href="/guardrails">Legal and ethical guardrails</a>
      </div>`)}`

  return {
    title: 'Evidence and truth labels',
    description: 'The six truth labels, the E0-E5 evidence states, and the matrix that decides what each claim type may be used for in a report and in outreach.',
    path: '/evidence',
    body
  }
}

/* -------------------------------------------------------------- phases -- */

export function phasesPage () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 04',
        title: 'The nine-phase audit',
        lede: 'Preflight resolves the scope contract and the ledgers. Then nine phases, each with its own questions, method, required controls and deliverables. A phase is complete, N/A with a reason, unknown with the evidence named, or blocked by a control.'
      })}
      ${toc(corpus.phases.map((p) => ({ level: 2, anchor: p.id, title: p.title })))}
    </div>
  </section>

  ${corpus.phases.map((phase) => section(`
      <p class="eyebrow">${phase.number ? `Phase ${phase.number}` : 'Stage'}</p>
      <h2 id="${attr(phase.id)}">${esc(phase.name)}</h2>
      ${phase.summary ? `<p class="tight">${inline(phase.summary)}</p>` : ''}
      ${phase.minimum_output ? `<p class="lead-statement">Minimum output: ${inline(phase.minimum_output)}</p>` : ''}
      ${phase.items.length ? `<ol class="steps">${phase.items.map((i) => `<li><div>${inline(i)}</div></li>`).join('')}</ol>` : ''}
      ${Object.entries(phase.parts).filter(([, v]) => v.length).map(([key, values]) => `
      <div class="finding">
        <div class="finding__head"><h3 class="t-20 m-0">${esc(key.replace(/_/g, ' '))}</h3></div>
        <ul class="stack">${values.map((v) => `<li>${inline(v)}</li>`).join('')}</ul>
      </div>`).join('')}
      ${phase.code.map((b) => `<pre><code>${esc(b.content)}</code></pre>`).join('')}
      ${provenance(phase.defined_in)}`)).join('')}

${section(`
      <h2>Completeness</h2>
      <p class="tight">An audit is complete only when every one of these holds. Anything short of that is a partial audit that says so.</p>
      <ul class="stack">${corpus.manifest.completion_definition.map((c) => `<li>${inline(c)}</li>`).join('')}</ul>
      <div class="actions">
        <a class="pill" href="/agents">The agent prompt pack</a>
        <a class="pill" href="/checklists">Acceptance checklists</a>
        <a class="pill" href="/v1/phases">GET /v1/phases</a>
      </div>`)}`

  return {
    title: 'The nine-phase audit',
    description: 'Preflight plus nine phases, from passive technical OSINT through financial impact to executive outreach - each with its questions, controls and deliverables.',
    path: '/phases',
    body
  }
}

/* ------------------------------------------------------------ workflows -- */

export function workflowsPage () {
  const machine = corpus.codeById.get('17.1-workflow-state-machine.c1')
  const c = corpus.collections

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 17',
        title: 'Automation workflows',
        lede: 'Thirteen stages from intake to deletion. Every transition is an append-only event, and a blocked or failed state is a valid outcome that must preserve its reason, evidence, owner and next eligible action.'
      })}
    </div>
  </section>

${section(`
      <h2>The state machine</h2>
      <pre><code>${esc(machine?.content ?? '')}</code></pre>`)}

  ${corpus.workflows.map((w) => section(`
      <p class="eyebrow">${esc(w.id)}</p>
      <h2 id="${attr(w.id)}">${esc(w.name)}</h2>
      ${Object.entries(w.parts).filter(([, v]) => v.length).map(([key, values]) => `
      <div class="finding">
        <div class="finding__head"><h3 class="t-20 m-0">${esc(key.replace(/_/g, ' '))}</h3></div>
        <ul class="stack">${values.map((v) => `<li>${inline(v)}</li>`).join('')}</ul>
      </div>`).join('')}
      ${provenance(w.defined_in)}`)).join('')}

${section(collectionPanel(c.controls))}
${section(collectionPanel(c.schedules))}
${section(`
      ${collectionPanel(c.responsibility)}
      <div class="actions">
        <a class="pill" href="/docs/automation-workflows">Read file 17 in full</a>
        <a class="pill" href="/v1/workflows">GET /v1/workflows</a>
      </div>`)}`

  return {
    title: 'Automation workflows',
    description: 'W0 to W12: intake, rights gate, collection, resolution, claims, analysis, modeling, human review, release, activation, monitoring and deletion.',
    path: '/workflows',
    body
  }
}

/* --------------------------------------------------------------- agents -- */

export function agentsPage () {
  const groups = [...new Set(corpus.agents.map((a) => a.role))]

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 19',
        title: 'The agent prompt pack',
        lede: `${inv.agents} prompts sharing one runtime contract and one handoff schema. A coordinator routes the phase specialists, a contradiction critic argues with them, and a QA reviewer and integrator gate what reaches the report.`
      })}
    </div>
  </section>

  ${groups.map((role) => section(`
      <p class="eyebrow">${esc(role.replace(/-/g, ' '))}</p>
      <h2 id="${attr(role)}">${esc(role === 'contract' ? 'Shared contracts' : role === 'coordinator' ? 'The coordinator' : role === 'review' ? 'Review and integration' : 'Phase specialists')}</h2>
      <div class="grid grid--2">
        ${corpus.agents.filter((a) => a.role === role).map((a) => featureCard({
          iconName: icon('agent'),
          title: a.name,
          meta: a.phases.length ? `Phase ${a.phases.join(' and ')}` : null,
          body: esc(plain(a.prompt.split('\n').find((l) => l.trim().length > 30) ?? '').slice(0, 180)),
          href: `/agents/${a.id}`,
          linkText: 'Read the prompt'
        })).join('')}
      </div>`)).join('')}

${section(`
      <div class="actions">
        <a class="pill" href="/phases">The phases these prompts run</a>
        <a class="pill" href="/v1/agents">GET /v1/agents</a>
      </div>`)}`

  return {
    title: 'The agent prompt pack',
    description: `${inv.agents} prompts: shared runtime contract, coordinator, phase specialists, contradiction critic, QA reviewer and final integrator.`,
    path: '/agents',
    body
  }
}

export function agentPage (agent) {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: `File 19 · ${agent.role.replace(/-/g, ' ')}`,
        title: agent.name,
        lede: agent.notes.length ? inline(agent.notes[0]) : 'Use this prompt verbatim; it carries the constraints the rest of the system depends on.'
      })}
    </div>
  </section>

${section(`
      ${agent.phases.length ? `<p class="muted t-14">Covers phase ${agent.phases.join(' and ')}.</p>` : ''}
      <pre><code>${esc(agent.prompt)}</code></pre>
      ${provenance(agent.defined_in)}
      <div class="actions">
        <a class="pill" href="/agents">All prompts</a>
        <a class="pill" href="/v1/agents/${attr(agent.id)}">GET /v1/agents/${esc(agent.id)}</a>
      </div>`)}`

  return {
    title: agent.name,
    description: `${agent.name} - one of the ${inv.agents} prompts in the LAKA intelligence agent pack.`,
    path: `/agents/${agent.id}`,
    body
  }
}

/* ---------------------------------------------------------------- tools -- */

export function toolsPage ({ query, results, total }) {
  const libraries = corpus.libraries
  const categories = [...new Set(corpus.tools.map((t) => t.category))].sort()

  const option = (value, label, current) =>
    `<option value="${attr(value)}"${String(value) === String(current ?? '') ? ' selected' : ''}>${esc(label)}</option>`

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Files 05 to 09',
        title: 'The tool and source registry',
        lede: `${inv.tools} tools, datasets and official sources across five libraries. Each entry keeps its licence or access tier, its honest limitation, and its official link. An open-source collector does not grant rights to collect from an upstream source.`
      })}
    </div>
  </section>

${section(`
      <h2>Browse the registry</h2>
      <form class="panel" method="get" action="/tools">
        <div class="filters">
          <div class="field">
            <label for="q">Search</label>
            <input type="search" id="q" name="q" value="${attr(query.q ?? '')}" placeholder="certificate transparency, SEC, orchestration...">
          </div>
          <div class="field">
            <label for="library">Library</label>
            <select id="library" name="library">
              ${option('', 'All five', query.library)}
              ${libraries.map((l) => option(l.file, `${l.name} (${l.count})`, query.library)).join('')}
            </select>
          </div>
          <div class="field">
            <label for="category">Category</label>
            <select id="category" name="category">
              ${option('', 'Any category', query.category)}
              ${categories.map((cat) => option(cat, cat, query.category)).join('')}
            </select>
          </div>
          <div class="field">
            <label class="visually-hidden" for="apply">Apply filters</label>
            <button class="pill pill--solid" id="apply" type="submit">Filter</button>
          </div>
        </div>
      </form>

      <p class="muted t-14">${results.length} of ${total} entries${query.q ? ` matching &ldquo;${esc(query.q)}&rdquo;` : ''}.</p>

      <div class="grid grid--2">
        ${results.map((t) => `
        <article class="card feature">
          <span class="feature__icon">${icon('tool')}</span>
          <div>
            <p class="meta-id">${esc(t.library)} &middot; ${esc(t.category)}</p>
            <h3 class="t-24">${esc(t.name)}</h3>
          </div>
          ${t.status ? `<p class="m-0">${chip(t.status)}</p>` : ''}
          <p class="m-0"><a href="/tools/${attr(t.id)}">Details &rarr;</a></p>
        </article>`).join('')}
      </div>
      ${results.length === 0 ? '<p class="muted">No entry matches those filters.</p>' : ''}`)}

${section(`
      <h2>Collection modes</h2>
      <p class="tight">The connector profile decides whether a use is passive, not the product name. CM2 is routed to a separately scoped security engagement; CM3 is prohibited in this system.</p>
      ${table({
        headers: corpus.collections['collection-modes'].headers,
        align: corpus.collections['collection-modes'].align,
        rows: corpus.collections['collection-modes'].records.map((r) => r.cells),
        caption: 'Collection modes'
      })}`)}`

  return {
    title: 'The tool and source registry',
    description: `${inv.tools} catalogued tools, datasets and official sources with licences, limitations and official links.`,
    path: '/tools',
    body
  }
}

export function toolPage (tool) {
  const attrRows = Object.entries(tool.attributes).filter(([, v]) => v)

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: `${tool.library} · ${tool.category}`,
        title: tool.name,
        lede: tool.status ? `Licence or access: ${esc(tool.status)}` : null
      })}
    </div>
  </section>

${section(`
      <dl class="deflist">
        ${attrRows.map(([k, v]) => `<dt>${esc(k.replace(/_/g, ' '))}</dt><dd>${inline(v)}</dd>`).join('')}
      </dl>

      ${tool.sources.length ? `
      <h2 class="mt-9">Official sources</h2>
      <ul class="stack">${tool.sources.map((s) => `<li><a href="${attr(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a> <span class="muted t-13">${esc(s.url)}</span></li>`).join('')}</ul>` : ''}

      <p class="muted t-14 mt-7">
        Catalogued at the ${esc(corpus.manifest.research_baseline)} research baseline. Verify the licence,
        free-tier limits, API schema and source terms again before deployment, and record a
        version-pinned registry entry for whatever you select.
      </p>
      ${provenance(tool.defined_in)}
      <div class="actions">
        <a class="pill" href="/tools?library=${attr(tool.library_file)}">More from this library</a>
        <a class="pill" href="/v1/tools/${attr(tool.id)}">GET /v1/tools/${esc(tool.id)}</a>
      </div>`)}`

  return {
    title: tool.name,
    description: `${tool.name} - ${tool.category} in the ${tool.library} library. ${tool.status ?? ''}`.trim(),
    path: `/tools/${tool.id}`,
    body
  }
}

/* ----------------------------------------------------- financial models -- */

export function financialModelsPage () {
  const convention = corpus.codeById.get('12.3-scenario-convention.c1')

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 12',
        title: 'Financial impact models',
        lede: 'Every dollar output is a low, base and high scenario with visible formulas and inputs. When the inputs are not available the answer is <strong class="ink">not estimable</strong> plus the list of what is missing &mdash; never a number with a confident face on it.'
      })}
      ${toc(corpus.financialModels.map((m) => ({ level: 2, anchor: m.id, title: `${m.number}. ${m.name}` })))}
    </div>
  </section>

${section(`
      <h2 id="input-labels">Input labels</h2>
      ${table({
        headers: corpus.collections['input-labels'].headers,
        align: corpus.collections['input-labels'].align,
        rows: corpus.collections['input-labels'].records.map((r) => r.cells),
        caption: 'Financial input labels'
      })}
      <h2 class="mt-9" id="scenario-convention">Scenario convention</h2>
      <pre><code>${esc(convention?.content ?? '')}</code></pre>`)}

  ${corpus.financialModels.map((m) => section(`
      <p class="eyebrow">Model ${esc(m.number)}</p>
      <h2 id="${attr(m.id)}">${esc(m.name)}</h2>
      ${m.notes.map((n) => `<p class="tight">${inline(n)}</p>`).join('')}
      ${m.formulas.map((f) => `<pre><code>${esc(f.content)}</code></pre>`).join('')}
      ${m.constraints.length ? `<ul class="stack">${m.constraints.map((c) => `<li>${inline(c)}</li>`).join('')}</ul>` : ''}
      ${provenance(m.defined_in)}`)).join('')}

${section(`
      <div class="actions">
        <a class="pill" href="/docs/financial-impact-models">Read file 12 in full</a>
        <a class="pill" href="/v1/financial-models">GET /v1/financial-models</a>
      </div>`)}`

  return {
    title: 'Financial impact models',
    description: `${inv.financial_models} models with visible formulas and named inputs, each producing low, base and high scenarios rather than a single confident number.`,
    path: '/financial-models',
    body
  }
}

/* -------------------------------------------------------------- scoring -- */

export function scoringPage () {
  const c = corpus.collections
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 11',
        title: 'How the scores work',
        lede: 'Scoring makes triage reproducible; it does not turn uncertain public evidence into certainty. Preserve the raw evidence, the component scores, the reviewer notes and the overrides.'
      })}
    </div>
  </section>

${section(`
      <h2>The four rubrics</h2>
      <div class="grid grid--2">
        ${Object.values(RUBRICS).map((r) => featureCard({
          iconName: icon('score'),
          title: r.name,
          meta: `${r.dimensions.length} dimensions · ${r.output}`,
          body: `<code>${esc(r.formula)}</code>`,
          href: `/score?rubric=${r.id}`,
          linkText: 'Score with this rubric'
        })).join('')}
      </div>`)}

${section(collectionPanel(c['finding-dimensions']))}
${section(`
      ${collectionPanel(c['opportunity-dimensions'])}
      <p class="tight mt-6">Hard gates override the numeric score: unresolved identity, prohibited source or use, sensitive-personal-data dependence, exploit or credential dependence, a misleading financial claim, or no plausible service-to-mechanism fit.</p>`)}
${section(collectionPanel(c['lead-dimensions']))}
${section(`
      ${collectionPanel(c['model-confidence'])}
      <div class="actions">
        <a class="pill pill--solid" href="/score">Open the scorer</a>
        <a class="pill" href="/docs/scoring-prioritization">Read file 11 in full</a>
        <a class="pill" href="/v1/scoring">GET /v1/scoring</a>
      </div>`)}`

  return {
    title: 'How the scores work',
    description: 'Finding quality, opportunity priority, authority and lead qualification - their dimensions, weights, hard gates and bands.',
    path: '/scoring',
    body
  }
}

/* ---------------------------------------------------------- the scorer -- */

function scaleSelect (name, dim, value) {
  const min = dim.scale?.min ?? 0
  const max = dim.scale?.max ?? 5
  const options = []
  for (let i = min; i <= max; i++) {
    options.push(`<option value="${i}"${String(value) === String(i) ? ' selected' : ''}>${i}</option>`)
  }
  const anchors = dim.anchors
    ? Object.entries(dim.anchors).filter(([, v]) => v).map(([k, v]) => `${k} = ${plain(v)}`).join(' · ')
    : dim.meaning ? plain(dim.meaning) : ''
  return `
    <div class="field">
      <label for="${attr(name)}">${esc(dim.label)}${dim.weight ? ` <span class="muted t-13">(${Math.round(dim.weight * 100)}%)</span>` : ''}</label>
      <select id="${attr(name)}" name="${attr(name)}">
        <option value=""${value === undefined || value === '' ? ' selected' : ''}>&mdash; not scored &mdash;</option>
        ${options.join('')}
      </select>
      ${anchors ? `<span class="hint">${esc(anchors)}</span>` : ''}
    </div>`
}

function resultPanel (result) {
  if (!result) return ''

  if (result.complete === false) {
    return `
      <div id="result" class="verdict verdict--blocked">
        <span class="verdict__mark" aria-hidden="true">!</span>
        <div>
          <p class="m-0"><strong class="ink">Incomplete</strong> &mdash; ${esc(result.note ?? '')}</p>
          <p class="m-0 muted t-14">Still needed: ${result.needs_input.map((n) => esc(n.label)).join(', ')}.</p>
        </div>
      </div>`
  }

  const headline = result.score ?? result.base_score
  const blocked = result.blocked === true || result.eligible === false
  const verdictText = result.verdict ?? result.action ?? 'Scored.'

  return `
    <div id="result" class="stack">
      <div class="verdict ${blocked ? 'verdict--blocked' : 'verdict--clear'}">
        <span class="verdict__mark" aria-hidden="true">${blocked ? '!' : '&#10003;'}</span>
        <div>
          <p class="m-0"><strong class="ink t-24">${esc(headline)}</strong> <span class="muted">/ ${esc(result.scale ?? '')}</span></p>
          <p class="m-0">${esc(verdictText)}</p>
          ${result.risk_adjusted_priority != null ? `<p class="m-0 muted t-14">Risk-adjusted priority: ${esc(result.risk_adjusted_priority)} (confidence factor ${esc(result.confidence_factor)}, risk penalty ${esc(result.risk_penalty)}).</p>` : ''}
        </div>
      </div>

      ${table({
        headers: ['Dimension', 'Value', result.components?.[0]?.weight !== undefined ? 'Weight' : result.components?.[0]?.max_points !== undefined ? 'Max' : 'Sign', 'Contribution'],
        rows: (result.components ?? []).map((c) => [
          c.label,
          String(c.value),
          c.weight !== undefined ? `${Math.round(c.weight * 100)}%` : c.max_points !== undefined ? String(c.max_points) : (c.sign > 0 ? '+' : '&minus;'),
          String(c.contribution ?? c.value)
        ]),
        caption: 'Score components'
      })}

      ${result.gates?.length ? `
      <h3 class="t-24 mt-7">Hard gates</h3>
      ${table({
        headers: ['Gate', 'Status'],
        rows: result.gates.map((g) => [g.requirement, g.status.toUpperCase()]),
        caption: 'Hard gates'
      })}
      <p class="muted t-14">${esc(result.note ?? 'A hard gate overrides the numeric score.')}</p>` : ''}

      <details class="disclose mt-6">
        <summary>The same result as JSON</summary>
        <div>${jsonBlock(result, `POST /v1/score/${result.rubric}`)}</div>
      </details>
    </div>`
}

export function scorePage ({ rubric = 'finding', values = {}, result = null } = {}) {
  const r = RUBRICS[rubric] ?? RUBRICS.finding
  const tabs = Object.values(RUBRICS).map((x) =>
    `<a class="pill${x.id === r.id ? ' pill--solid' : ''}" href="/score?rubric=${attr(x.id)}">${esc(x.name)}</a>`).join('')

  const gateFields = r.hard_gates && r.id === 'opportunity'
    ? `
      <h2 class="mt-9">Hard gates</h2>
      <p class="tight">Answer every one. A failed gate blocks the opportunity regardless of the number.</p>
      <div class="fields">
        ${r.hard_gates.map((g) => `
        <div class="field">
          <label for="gate_${attr(g.id)}">${esc(g.question)}</label>
          <select id="gate_${attr(g.id)}" name="gate_${attr(g.id)}">
            <option value=""${!values[`gate_${g.id}`] ? ' selected' : ''}>&mdash; unanswered &mdash;</option>
            <option value="true"${values[`gate_${g.id}`] === 'true' ? ' selected' : ''}>Yes</option>
            <option value="false"${values[`gate_${g.id}`] === 'false' ? ' selected' : ''}>No</option>
          </select>
          <span class="hint">Fails when: ${esc(g.fails_when)}</span>
        </div>`).join('')}
      </div>

      <div class="fields mt-7">
        <div class="field">
          <label for="confidence">Evidence confidence</label>
          <select id="confidence" name="confidence">
            <option value="">&mdash; not set &mdash;</option>
            ${Object.entries(r.confidence_factors).map(([k, v]) =>
              `<option value="${attr(k)}"${values.confidence === k ? ' selected' : ''}>${esc(k.replace(/_/g, ' '))} (${v})</option>`).join('')}
          </select>
          <span class="hint">Sets the confidence factor in the risk-adjusted priority.</span>
        </div>
        <div class="field">
          <label for="risk_penalty">Risk penalty</label>
          <select id="risk_penalty" name="risk_penalty">
            ${[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((v) =>
              `<option value="${v}"${String(values.risk_penalty ?? '0') === String(v) ? ' selected' : ''}>${v}</option>`).join('')}
          </select>
          <span class="hint">Legal, privacy, security, execution, brand and dependency risk. Maximum ${r.risk_penalty_max}.</span>
        </div>
      </div>`
    : ''

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 11, executable',
        title: 'Score something',
        lede: 'Weights and point ceilings come from the corpus, so the number here is the number the documentation describes. A dimension you leave unscored is reported as missing &mdash; it is never counted as a zero.'
      })}
      <div class="actions">${tabs}</div>
    </div>
  </section>

${section(`
      <h2>${esc(r.name)}</h2>
      <p class="tight"><code>${esc(r.formula)}</code> &middot; output ${esc(r.output)}</p>

      <form method="post" action="/score#result">
        <input type="hidden" name="rubric" value="${attr(r.id)}">
        <div class="fields">
          ${r.dimensions.map((d) => scaleSelect(d.key, d, values[d.key])).join('')}
        </div>
        ${gateFields}
        <div class="actions">
          <button class="pill pill--solid" type="submit">Calculate</button>
          <a class="pill" href="/score?rubric=${attr(r.id)}">Reset</a>
        </div>
      </form>

      ${resultPanel(result)}`)}

${section(`
      <h2>What this does not do</h2>
      <p class="tight">
        ${r.id === 'lead'
          ? 'Lead qualification is company and opportunity fit, not personal profiling. No points are ever awarded for personal wealth, family information, protected traits, vulnerability or private contact details.'
          : r.id === 'authority'
            ? 'The score never overrides a legal, privacy, security, evidence or opt-out block. Passing every gate makes a draft eligible for review - it does not make it sendable.'
            : 'A high score never overrides a hard gate, and nothing here stores what you type. The calculation happens on this request and is gone when the response ends.'}
      </p>
      <div class="actions">
        <a class="pill" href="/scoring">How the rubrics are defined</a>
        <a class="pill" href="/v1/scoring/${attr(r.id)}">GET /v1/scoring/${esc(r.id)}</a>
      </div>`)}`

  return {
    title: `Score: ${r.name}`,
    description: `Run the ${r.name.toLowerCase()} from the LAKA intelligence system. ${r.formula}`,
    path: '/score',
    body
  }
}

/* ----------------------------------------------------------- guardrails -- */

export function guardrailsPage () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'File 18',
        title: 'Legal, ethical and safety guardrails',
        lede: 'Public does not mean unrestricted. Visibility is not permission, permission is not relevance, and relevance is not consent. This is guidance rather than legal advice, and its jurisdiction coverage is deliberately bounded.'
      })}
      ${toc(corpus.guardrails.map((g) => ({ level: 2, anchor: g.id, title: g.title })))}
    </div>
  </section>

  ${corpus.guardrails.map((g) => section(`
      ${g.jurisdiction !== 'any' ? `<p class="eyebrow">${esc(g.jurisdiction)}</p>` : ''}
      <h2 id="${attr(g.id)}">${esc(g.title.replace(/^\d+[A-Z]?\.\s*/, ''))}</h2>
      ${g.prose.map((p) => `<p class="tight">${inline(p)}</p>`).join('')}
      ${g.rules.length ? `<ul class="stack">${g.rules.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : ''}
      ${g.code.map((b) => `<pre><code>${esc(b.content)}</code></pre>`).join('')}
      ${g.subsections.map((s) => `
      <div class="finding">
        <div class="finding__head"><h3 class="t-20 m-0">${esc(s.title)}</h3></div>
        ${s.prose.map((p) => `<p>${inline(p)}</p>`).join('')}
        ${s.rules.length ? `<ul class="stack">${s.rules.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : ''}
      </div>`).join('')}
      ${provenance(g.defined_in)}`)).join('')}`

  return {
    title: 'Legal and ethical guardrails',
    description: 'CASL, PIPEDA, CAN-SPAM, GDPR, platform terms, copyright, responsible disclosure, data minimization, retention and the human-review triggers.',
    path: '/guardrails',
    body
  }
}

/* ---------------------------------------------------------- checklists -- */

export function checklistsPage () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Across the corpus',
        title: 'Acceptance checklists',
        lede: `${inv.checklist_items} gate items, grouped by the section that owns them. A high score never overrides a hard gate, and a release verdict of BLOCK is a legal, privacy, security, identity, suppression, source-rights or material truth defect.`
      })}
      ${toc(corpus.checklists.map((c) => ({ level: 2, anchor: c.id, title: `${c.file_title}: ${c.title}` })))}
    </div>
  </section>

${section(`
      <h2>Release verdicts</h2>
      ${table({
        headers: corpus.collections.verdicts.headers,
        align: corpus.collections.verdicts.align,
        rows: corpus.collections.verdicts.records.map((r) => r.cells),
        caption: 'Release verdicts'
      })}`)}

  ${corpus.checklists.map((c) => section(`
      <p class="eyebrow">File ${esc(c.file)} &middot; ${esc(c.file_title)}</p>
      <h2 id="${attr(c.id)}">${esc(c.title.replace(/^\d+[A-Z]?\.\s*/, ''))}</h2>
      <ul class="stack">${c.items.map((i) => `<li><span class="verdict__mark" aria-hidden="true">&#9633;</span> ${inline(i)}</li>`).join('')}</ul>
      ${provenance(c.defined_in)}`)).join('')}`

  return {
    title: 'Acceptance checklists',
    description: `${inv.checklist_items} acceptance items across package integrity, intake, phase completeness, evidence, economics, privacy and release.`,
    path: '/checklists',
    body
  }
}

/* ------------------------------------------------------------ reference -- */

export function referenceIndex () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Typed collections',
        title: 'Lookup tables',
        lede: `Every collection names the file and section it reads. If a section moves, the collection empties rather than quietly producing something else &mdash; <a href="/v1/integrity">/v1/integrity</a> reports that, and a test asserts it.`
      })}
    </div>
  </section>

${section(`
      ${table({
        headers: ['Collection', 'Records', 'Source', 'API'],
        rows: Object.values(corpus.collections).map((c) => [
          `[${c.title}](/reference/${c.id})`,
          String(c.count),
          `file ${c.source.file} &middot; \`${c.source.section}\``,
          `\`/v1/collections/${c.id}\``
        ]),
        caption: 'Typed collections'
      })}`)}`

  return {
    title: 'Lookup tables',
    description: `The ${Object.keys(corpus.collections).length} typed collections the API exposes, each pointing back at the file and section it was read from.`,
    path: '/reference',
    body
  }
}

export function referencePage (collection) {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: `File ${collection.source.file}`,
        title: collection.title,
        lede: `${collection.count} records, read from <code>${esc(collection.source.section)}</code>.`
      })}
    </div>
  </section>

${section(`
      ${table({ headers: collection.headers,
        align: collection.align, rows: collection.records.map((r) => r.cells), caption: collection.title })}
      ${provenance(collection.records[0]?.defined_in)}
      <div class="actions">
        <a class="pill" href="/reference">All lookup tables</a>
        <a class="pill" href="/v1/collections/${attr(collection.id)}">GET /v1/collections/${esc(collection.id)}</a>
      </div>`)}`

  return {
    title: collection.title,
    description: `${collection.title} - ${collection.count} records from file ${collection.source.file} of the LAKA Volumetric Intelligence System.`,
    path: `/reference/${collection.id}`,
    body
  }
}

/* ------------------------------------------------------------------ docs -- */

export function docsPage () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'The library',
        title: 'Source documents',
        lede: `All ${inv.documents} files, rendered here and served verbatim as Markdown or as parsed blocks over the API. ${inv.sections} sections, ${inv.tables} tables and ${inv.code_blocks} fenced blocks.`
      })}
    </div>
  </section>

${section(`
      <h2>All ${inv.documents} files</h2>
      <div class="grid grid--2">
        ${corpus.documents.map((d) => `
        <article class="card feature">
          <span class="feature__icon">${icon('docs')}</span>
          <div>
            <p class="meta-id">${d.number ? esc(d.number) : 'README'}</p>
            <h3 class="t-24">${esc(d.title)}</h3>
          </div>
          <p class="muted m-0 t-13">${d.sections.length - 1} sections &middot; ${d.tables.length} tables &middot; ${d.code.length} fenced blocks</p>
          <p class="m-0"><a href="/docs/${attr(d.slug)}">Read &rarr;</a></p>
        </article>`).join('')}
      </div>`)}`

  return {
    title: 'Source documents',
    description: `All ${inv.documents} files of the LAKA Volumetric Intelligence System, rendered and downloadable as Markdown.`,
    path: '/docs',
    body
  }
}

export function docPage (doc) {
  const first = doc.blocks.find((b) => b.type === 'paragraph')
  // The h1 is rendered from the page head, so the document body starts at its first h2.
  const rest = doc.blocks.filter((b) => !(b.type === 'heading' && b.level === 1))

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: doc.number ? `File ${doc.number}` : 'Library index',
        title: doc.title,
        lede: first ? inline(first.text) : null
      })}
      ${toc(doc.sections)}
    </div>
  </section>

${section(`
      ${renderBlocks(rest.filter((b) => b !== first))}
      <hr>
      <p class="muted t-13">
        ${esc(doc.filename)} &middot; ${doc.lines} lines &middot; ${doc.bytes} bytes &middot;
        SHA-256 <code>${esc(doc.sha256.slice(0, 16))}</code>
      </p>
      <div class="actions">
        <a class="pill" href="/v1/docs/${attr(doc.slug)}?format=markdown">Raw Markdown</a>
        <a class="pill" href="/v1/docs/${attr(doc.slug)}">Parsed blocks (JSON)</a>
        <a class="pill" href="/docs">All documents</a>
      </div>`, { cls: 'pb-9' })}`

  return {
    title: doc.title,
    description: first ? plain(first.text) : `${doc.title} - file ${doc.number} of the LAKA Volumetric Intelligence System.`,
    path: `/docs/${doc.slug}`,
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: doc.title,
      description: first ? plain(first.text).slice(0, 300) : doc.title,
      url: `${ORIGIN}/docs/${doc.slug}`,
      isPartOf: { '@type': 'Book', name: corpus.manifest.title, version: corpus.manifest.version },
      publisher: { '@type': 'Organization', name: 'Bow Tie Kreative', url: 'https://bowtiekreative.com' }
    }
  }
}

/* ------------------------------------------------------------------- api -- */

export function apiPage () {
  const groups = new Map()
  for (const e of ENDPOINTS) {
    const group = e.path.split('/')[2] ?? 'index'
    const key = ['health', 'openapi.json', 'manifest', 'integrity'].includes(group) ? 'index' : group
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(e)
  }

  const example = (title, request, response) => `
    <div class="finding">
      <div class="finding__head"><h3 class="t-20 m-0">${esc(title)}</h3></div>
      <pre><code>${esc(request)}</code></pre>
      <pre><code>${esc(response)}</code></pre>
    </div>`

  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Public JSON, no key',
        title: 'API reference',
        lede: 'Every read is public and cacheable, because the corpus is a static versioned body of doctrine. The four POST endpoints run the scoring rubrics: they compute, they never store.'
      })}
      <div class="actions">
        <a class="pill pill--solid" href="/v1/openapi.json">OpenAPI 3.1</a>
        <a class="pill" href="/v1">Service index</a>
        <a class="pill" href="/llms.txt">llms.txt</a>
      </div>
    </div>
  </section>

${section(`
      <h2>Base URL</h2>
      <pre><code>${esc(ORIGIN)}</code></pre>
      <p class="tight">
        Responses are JSON unless you ask for <code>format=markdown</code>. Reads carry
        <code>cache-control: public, max-age=300, stale-while-revalidate=86400</code>; scoring
        responses carry <code>no-store</code>. CORS is open for GET and POST.
      </p>`)}

${section(`
      <h2>Endpoints</h2>
      ${[...groups.entries()].map(([group, endpoints]) => `
      <h3 class="t-24 mt-7">${esc(group === 'index' ? 'Index and health' : group.replace(/-/g, ' '))}</h3>
      ${table({
        headers: ['Method', 'Path', 'Purpose'],
        rows: endpoints.map((e) => [`\`${e.method}\``, `\`${e.path}\``, e.summary]),
        caption: group
      })}`).join('')}`)}

${section(`
      <h2>Worked examples</h2>

      ${example(
        'Which lenses stay inside passive collection?',
        `curl "${ORIGIN}/v1/laka/lenses?impact=I1&interrogative=Why"`,
        JSON.stringify({
          cube_size: corpus.cube.size,
          count: 6,
          results: [lenses({ interrogative: 'Why', impact: 'I1' })[0]]
        }, null, 2))}

      ${example(
        'Find a passive certificate-transparency source',
        `curl "${ORIGIN}/v1/tools?library=05&q=certificate"`,
        JSON.stringify({
          count: 2,
          results: corpus.tools
            .filter((t) => t.library_file === '05' && `${t.name} ${JSON.stringify(t.attributes)}`.toLowerCase().includes('certificate'))
            .slice(0, 1)
            .map((t) => ({ id: t.id, name: t.name, library: t.library, category: t.category, status: t.status }))
        }, null, 2))}

      ${example(
        'Score a finding, with one dimension left unscored',
        `curl -X POST "${ORIGIN}/v1/score/finding" \\
  -H 'content-type: application/json' \\
  -d '{"evidence":5,"entity_resolution":5,"recency":3,"directness":5,"independence":3}'`,
        JSON.stringify({
          rubric: 'finding',
          complete: false,
          score: null,
          needs_input: [{ key: 'contradiction_check', label: 'Contradiction check', scale: { min: 0, max: 5 } }],
          note: 'Supply every dimension; an absent dimension is not a zero.'
        }, null, 2))}

      ${example(
        'An opportunity that scores well and is blocked anyway',
        `curl -X POST "${ORIGIN}/v1/score/opportunity" \\
  -H 'content-type: application/json' \\
  -d '{"dimensions":{...},"confidence":"high","gates":{"identity_resolved":false}}'`,
        JSON.stringify({
          rubric: 'opportunity',
          blocked: true,
          base_score: 78,
          verdict: 'BLOCK - a hard gate failed; the numeric score does not apply'
        }, null, 2))}`)}

${section(`
      <h2>Errors</h2>
      ${table({
        headers: ['Status', 'Shape', 'When'],
        rows: [
          ['`404`', '`{ error: "not_found", kind, id }`', 'No record with that id. Collection and rubric 404s also list what is available.'],
          ['`400`', '`{ error: "request_error", message, details }`', 'A scoring dimension was not a number, or fell outside its scale.'],
          ['`500`', '`{ error: "internal_error", message }`', 'Unexpected failure; the request id is in the server log.']
        ],
        caption: 'Error responses'
      })}
      <p class="tight">
        A missing scoring input is not an error. It comes back as <code>complete: false</code> with
        the outstanding dimensions under <code>needs_input</code>, because an absent judgement and a
        judgement of zero are different claims.
      </p>`)}`

  return {
    title: 'API reference',
    description: `Public JSON for the LAKA Volumetric Intelligence System: ${ENDPOINTS.length} endpoints covering the corpus, the grammar, the tool registry, the financial models and the scoring rubrics.`,
    path: '/api',
    body
  }
}

/* ---------------------------------------------------------------- search -- */

export function searchPage ({ q, results }) {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({ eyebrow: 'Search', title: 'Search the library', lede: 'Documents, sections, tools, phases, agents, financial models, workflows, guardrails and every lookup record.' })}
      <form method="get" action="/search">
        <div class="filters">
          <div class="field">
            <label for="q">Query</label>
            <input type="search" id="q" name="q" value="${attr(q ?? '')}" placeholder="share of voice, CASL, pgvector, churn...">
          </div>
          <div class="field">
            <label class="visually-hidden" for="go">Search</label>
            <button class="pill pill--solid" id="go" type="submit">Search</button>
          </div>
        </div>
      </form>
    </div>
  </section>

${section(q
    ? `<p class="muted t-14">${results.length} result${results.length === 1 ? '' : 's'} for &ldquo;${esc(q)}&rdquo;.</p>
      ${results.length
        ? `<ul class="stack plain">${results.map((r) => `
        <li class="finding">
          <div class="finding__head">
            ${chip(r.type)}
            <a class="t-18" href="${attr(r.href)}">${esc(r.title)}</a>
          </div>
          <p class="meta-id m-0">${esc(r.id)}</p>
        </li>`).join('')}</ul>`
        : '<p>Nothing matched. Every term has to appear, so try fewer of them.</p>'}`
    : `<p class="tight">Enter a query above, or start from one of the sections in the menu.</p>`)}`

  return {
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search the LAKA Volumetric Intelligence System: documents, sections, tools, phases, agents, models and records.',
    path: '/search',
    body
  }
}

/* --------------------------------------------------------------- privacy -- */

export function privacyPage () {
  const body = `
  <section>
    <div class="wrap stack">
      ${pageHead({
        eyebrow: 'Privacy',
        title: 'What this site collects',
        lede: 'A library that spends twenty-three files insisting on data minimization should practise it.'
      })}
    </div>
  </section>

${section(`
      <h2>The short version</h2>
      <ul class="stack">
        <li>No analytics, no advertising tags, no third-party scripts, and no cookies are set.</li>
        <li>Nothing you type into the scorer is stored. It is scored on that request and gone with the response, which is why scoring responses carry <code>cache-control: no-store</code>.</li>
        <li>The API needs no key and no account, so there is nothing to register and nothing to sign in to.</li>
        <li>The only external requests a page makes are for the Inter typeface from Google Fonts and the Bow Tie brand assets from the design-system CDN.</li>
        <li>Ordinary web-server logs record request lines and are kept for operational troubleshooting only.</li>
      </ul>

      <h2 class="mt-9">The library itself</h2>
      <p class="tight">
        The documents published here describe how to conduct passive, lawful public-source research.
        They are strategic and technical guidance &mdash; not legal, investment or penetration-testing
        advice &mdash; and their jurisdiction coverage is explicitly bounded. If you are running an audit
        with them, the obligations in
        <a href="/guardrails">the guardrails</a> are yours, not this site's.
      </p>

      <h2 class="mt-9">Contact</h2>
      <p class="tight">This site is published by <a href="https://bowtiekreative.com">Bow Tie Kreative</a>.</p>`)}`

  return {
    title: 'Privacy',
    description: 'No analytics, no cookies, no accounts. Nothing typed into the scorer is stored.',
    path: '/privacy',
    body
  }
}

/* ------------------------------------------------------------------ 404 -- */

export function notFoundPage (message = 'That page does not exist.') {
  const body = `
  <section>
    <div class="wrap stack">
      <p class="eyebrow">404</p>
      <h1>Not found</h1>
      <p class="lede">${esc(message)}</p>
      <div class="actions">
        <a class="pill pill--solid" href="/">Home</a>
        <a class="pill" href="/docs">Source documents</a>
        <a class="pill" href="/search">Search</a>
      </div>
    </div>
  </section>`

  return { title: 'Not found', description: message, path: '/404', body }
}

export { MENU }
