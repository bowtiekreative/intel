/**
 * Shared page pieces.
 *
 * The important one is `renderBlocks`: it turns the parsed Markdown of any corpus document
 * into the design system's own markup, so a source file and a hand-built page look like the
 * same product. Nothing here trusts its input - every value passes through `esc` or the
 * inline renderer, which escapes before it adds markup.
 */

import { esc, attr } from './layout.js'
import { inline, plain } from '../markdown.js'

/* --------------------------------------------------------------- badges -- */

/** Truth labels carry a mark as well as a colour, so colour is never the only signal. */
const TRUTH_META = {
  O: { label: 'Observed', cls: 'badge--hard', mark: 'O' },
  C: { label: 'Calculated', cls: 'badge--default', mark: 'C' },
  I: { label: 'Inferred', cls: 'badge--heuristic', mark: 'I' },
  H: { label: 'Hypothesized', cls: 'badge--option', mark: 'H' },
  U: { label: 'Unknown', cls: '', mark: 'U' },
  X: { label: 'Contradicted', cls: 'badge--hard', mark: 'X' }
}

export function truthBadge (code) {
  const m = TRUTH_META[String(code).toUpperCase()]
  if (!m) return chip(code)
  return `<span class="badge ${m.cls}" data-mark="${attr(m.mark)}">${esc(m.label)}</span>`
}

/** Execution-impact states: I1-I2 are the passive default, I5-I6 are never prospecting tools. */
export function impactBadge (code) {
  const c = String(code).toUpperCase()
  const cls = ['I1', 'I2'].includes(c) ? 'badge--hard' : ['I3'].includes(c) ? 'badge--default' : ['I4'].includes(c) ? 'badge--heuristic' : 'badge--option'
  return `<span class="badge ${cls}" data-mark="${attr(c)}">${esc(c)}</span>`
}

export function chip (text) {
  return `<span class="badge">${esc(text)}</span>`
}

export function chips (values) {
  if (!values?.length) return ''
  return `<ul class="chips">${values.map((v) => `<li>${chip(v)}</li>`).join('')}</ul>`
}

/* ---------------------------------------------------------------- blocks -- */

/**
 * A pipe table, wrapped so wide tables scroll inside their own box rather than the page.
 *
 * Column alignment comes from the source Markdown's delimiter row. The stylesheet already
 * aligns cells left, so only right and centre need a class and no cell needs an inline style.
 */
export function table ({ headers, align = [], rows, caption }) {
  const alignClass = (i) => {
    const a = align[i]
    return a === 'right' ? ' class="ta-right"' : a === 'center' ? ' class="ta-center"' : ''
  }

  const head = headers.map((h, i) => `<th scope="col"${alignClass(i)}>${inline(h)}</th>`).join('')
  const body = rows.map((row) => {
    const cells = row.map((cell, i) => (i === 0
      ? `<th scope="row"${alignClass(i)}>${inline(cell)}</th>`
      : `<td${alignClass(i)}>${inline(cell)}</td>`)).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `<div class="table-scroll">
    <table>
      ${caption ? `<caption class="visually-hidden">${esc(caption)}</caption>` : ''}
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`
}

function list (block) {
  const tag = block.ordered ? 'ol' : 'ul'
  const cls = block.checklist ? 'stack' : 'stack'
  const items = block.items.map((item) => {
    const mark = item.checked === null ? '' : `<span class="verdict__mark" aria-hidden="true">${item.checked ? '&#10003;' : '&#9633;'}</span> `
    return `<li>${mark}${inline(item.text)}</li>`
  }).join('')
  return `<${tag} class="${cls}">${items}</${tag}>`
}

/**
 * Render parsed Markdown blocks as page markup.
 * @param {object[]} blocks
 * @param {{headingOffset?: number}} [options] shift heading levels so a document rendered
 *        inside a page keeps exactly one h1.
 */
export function renderBlocks (blocks, { headingOffset = 0 } = {}) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'heading': {
        const level = Math.min(6, Math.max(2, block.level + headingOffset))
        return `<h${level} id="${attr(block.anchor)}">${inline(block.text)}</h${level}>`
      }
      case 'paragraph':
        return `<p>${inline(block.text)}</p>`
      case 'list':
        return list(block)
      case 'table':
        return table({ ...block, caption: block.id })
      case 'code':
        return `<pre><code>${esc(block.content)}</code></pre>`
      case 'quote':
        return `<blockquote class="lead-statement">${inline(block.text)}</blockquote>`
      case 'rule':
        return '<hr>'
      default:
        return ''
    }
  }).join('\n')
}

/** A section tree as a nested table of contents. */
export function toc (sections, { max = 3 } = {}) {
  const items = sections
    .filter((s) => s.level > 1 && s.level <= max)
    .map((s) => `<li class="${s.level > 2 ? 'indent' : ''}"><a href="#${attr(s.anchor)}">${esc(s.title)}</a></li>`)
    .join('')
  if (!items) return ''
  return `<nav class="panel" aria-label="On this page">
    <p class="eyebrow mb-3">On this page</p>
    <ul class="stack plain t-14">${items}</ul>
  </nav>`
}

/* ----------------------------------------------------------------- cards -- */

export function statGrid (stats) {
  return `<div class="grid grid--4">${stats.map((s) => `
    <div class="card stat">
      <span class="stat__value">${esc(s.value)}</span>
      <span class="stat__label">${esc(s.label)}</span>
    </div>`).join('')}</div>`
}

export function featureCard ({ iconName, title, body, href, linkText, meta }) {
  return `<article class="card feature">
    ${iconName ? `<span class="feature__icon">${iconName}</span>` : ''}
    <h3 class="t-24">${esc(title)}</h3>
    ${meta ? `<p class="muted m-0 t-13">${esc(meta)}</p>` : ''}
    <p class="m-0">${body}</p>
    ${href ? `<p class="m-0"><a href="${attr(href)}">${esc(linkText ?? 'Open')} &rarr;</a></p>` : ''}
  </article>`
}

export function pageHead ({ eyebrow, title, lede, id = 'top' }) {
  return `<div id="${attr(id)}">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1>${esc(title)}</h1>
    ${lede ? `<p class="lede mt-6">${lede}</p>` : ''}
  </div>`
}

/** A JSON block with a caption naming where the data came from. */
export function jsonBlock (value, caption) {
  return `<figure class="m-0">
    ${caption ? `<figcaption class="muted t-13 mb-2">${esc(caption)}</figcaption>` : ''}
    <pre><code>${esc(JSON.stringify(value, null, 2))}</code></pre>
  </figure>`
}

/** Where a record came from, rendered as a link into the source document. */
export function provenance (defined_in, { label = 'Source' } = {}) {
  if (!defined_in?.file) return ''
  const slug = defined_in.file_slug
  const href = slug ? `/docs/${slug}${defined_in.section ? `#${defined_in.section}` : ''}` : null
  const text = `file ${defined_in.file}${defined_in.section ? ` &middot; ${esc(defined_in.section)}` : ''}${defined_in.line ? ` &middot; line ${defined_in.line}` : ''}`
  return `<p class="muted t-13 m-0">${esc(label)}: ${href ? `<a href="${attr(href)}">${text}</a>` : text}</p>`
}

/** Render one typed collection as a titled table with its provenance. */
export function collectionPanel (collection, { headingLevel = 2 } = {}) {
  if (!collection?.records?.length) return ''
  const source = collection.records[0]?.defined_in
  return `<div class="stack">
    <h${headingLevel} id="${attr(collection.id)}">${esc(collection.title)}</h${headingLevel}>
    ${table({
      headers: collection.headers,
      align: collection.align,
      rows: collection.records.map((r) => r.cells),
      caption: collection.title
    })}
    ${provenance(source)}
  </div>`
}

export { plain }
