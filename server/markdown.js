/**
 * A small, deterministic Markdown reader for the corpus.
 *
 * The corpus is 23 hand-written Markdown files with a narrow, consistent vocabulary:
 * ATX headings, paragraphs, bullet/ordered/checklist lists, pipe tables, fenced code and
 * blockquotes. Rather than pull a general-purpose parser and then fight its AST, this reads
 * exactly that vocabulary into blocks the API can serve as JSON and the site can render as HTML.
 *
 * Nothing here invents structure. Every block records the source line it started on, so any
 * API response can be traced back to a line in a file.
 */

export const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function slugify (s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

/** Split a table row on unescaped pipes. An escaped pipe inside a cell stays literal. */
function cells (line) {
  const out = []
  let cur = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '\\' && line[i + 1] === '|') { cur += '|'; i++; continue }
    if (ch === '|') { out.push(cur); cur = ''; continue }
    cur += ch
  }
  out.push(cur)
  // A pipe table opens and closes with a delimiter, producing empty edge cells.
  if (out.length && out[0].trim() === '') out.shift()
  if (out.length && out[out.length - 1].trim() === '') out.pop()
  return out.map((c) => c.trim())
}

const isDelimiterRow = (line) => /^\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes('-')

/** Column alignment from the delimiter row: trailing colon right, both colons centre, else left. */
function alignments (line) {
  return cells(line).map((c) => {
    const left = c.startsWith(':')
    const right = c.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
}

const CODE_SENTINEL = (i) => `LAKACODE${i}ENDCODE`

/**
 * Inline Markdown to HTML. Code spans are extracted first so their contents are never
 * re-parsed as emphasis or links, then restored after escaping.
 */
export function inline (text) {
  const code = []
  let s = String(text ?? '').replace(/`([^`]+)`/g, (_, c) => {
    code.push(c)
    return CODE_SENTINEL(code.length - 1)
  })

  s = esc(s)

  // Only http(s), mailto and in-document targets become links; anything else stays as text.
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, href) => {
    if (/^(https?:\/\/|mailto:|\/|#)/i.test(href)) {
      const external = /^https?:\/\//i.test(href)
      const rel = external ? ' rel="noopener" target="_blank"' : ''
      return `<a href="${esc(href)}"${rel}>${label}</a>`
    }
    return whole
  })

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="ink">$1</strong>')
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')

  return s.replace(/LAKACODE(\d+)ENDCODE/g, (_, i) => `<code>${esc(code[Number(i)])}</code>`)
}

/** Plain text of an inline string, for search indexes and meta descriptions. */
export function plain (text) {
  return String(text ?? '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .trim()
}

/**
 * Parse one Markdown document into a flat, ordered block list.
 * @returns {{title: string, blocks: object[]}}
 */
export function parse (markdown) {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let title = ''
  let i = 0

  const seenAnchors = new Map()
  const anchorFor = (text) => {
    const base = slugify(text) || 'section'
    const n = seenAnchors.get(base) ?? 0
    seenAnchors.set(base, n + 1)
    return n === 0 ? base : `${base}-${n + 1}`
  }

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    // ---- fenced code ----
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) {
      const lang = fence[1] || 'text'
      const start = i
      const body = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { body.push(lines[i]); i++ }
      i++ // closing fence
      blocks.push({ type: 'code', lang, content: body.join('\n'), line: start + 1 })
      continue
    }

    // ---- heading ----
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const text = heading[2].trim()
      if (level === 1 && !title) title = plain(text)
      blocks.push({ type: 'heading', level, text, anchor: anchorFor(text), line: i + 1 })
      i++
      continue
    }

    // ---- table ----
    if (line.trim().startsWith('|') && i + 1 < lines.length && isDelimiterRow(lines[i + 1])) {
      const start = i
      const headers = cells(line)
      const align = alignments(lines[i + 1])
      i += 2
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(cells(lines[i])); i++ }
      blocks.push({ type: 'table', headers, align, rows, line: start + 1 })
      continue
    }

    // ---- blockquote ----
    if (/^>\s?/.test(line)) {
      const start = i
      const body = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { body.push(lines[i].replace(/^>\s?/, '')); i++ }
      blocks.push({ type: 'quote', text: body.join(' ').trim(), line: start + 1 })
      continue
    }

    // ---- list ----
    const listItem = line.match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/)
    if (listItem) {
      const start = i
      const ordered = /\d/.test(listItem[2])
      const items = []
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/)
        if (!m) {
          // A wrapped continuation line is indented and is not a new block.
          if (items.length && lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && !/^\s*```/.test(lines[i])) {
            items[items.length - 1].text += ` ${lines[i].trim()}`
            i++
            continue
          }
          break
        }
        const depth = Math.floor(m[1].length / 2)
        let text = m[3]
        let checked = null
        const box = text.match(/^\[([ xX])\]\s+(.*)$/)
        if (box) { checked = box[1].toLowerCase() === 'x'; text = box[2] }
        items.push({ text, depth, checked })
        i++
      }
      const checklist = items.length > 0 && items.every((it) => it.checked !== null)
      blocks.push({ type: 'list', ordered, checklist, items, line: start + 1 })
      continue
    }

    // ---- horizontal rule ----
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'rule', line: i + 1 })
      i++
      continue
    }

    // ---- paragraph ----
    const start = i
    const para = []
    while (
      i < lines.length && lines[i].trim() &&
      !/^#{1,6}\s/.test(lines[i]) && !/^```/.test(lines[i]) && !/^>/.test(lines[i]) &&
      !/^(\s*)([-*]|\d+[.)])\s+/.test(lines[i]) &&
      !(lines[i].trim().startsWith('|') && i + 1 < lines.length && isDelimiterRow(lines[i + 1]))
    ) { para.push(lines[i].trim()); i++ }
    if (para.length) blocks.push({ type: 'paragraph', text: para.join(' '), line: start + 1 })
    else i++ // guard: never spin on a line no rule consumed
  }

  return { title, blocks }
}

/**
 * Group a block list into a section tree by heading level. Every non-heading block belongs
 * to the nearest preceding heading, which is what makes section-level API access and the
 * on-page table of contents possible.
 */
export function sectionTree (blocks) {
  const root = { anchor: null, level: 0, heading: null, blocks: [], sections: [] }
  const stack = [root]

  for (const block of blocks) {
    if (block.type !== 'heading') {
      stack[stack.length - 1].blocks.push(block)
      continue
    }
    while (stack.length > 1 && stack[stack.length - 1].level >= block.level) stack.pop()
    const node = {
      anchor: block.anchor,
      level: block.level,
      heading: block.text,
      title: plain(block.text),
      line: block.line,
      blocks: [],
      sections: []
    }
    stack[stack.length - 1].sections.push(node)
    stack.push(node)
  }
  return root
}

/** Every section in the tree, depth-first, flattened. */
export function flattenSections (node, out = []) {
  for (const s of node.sections) {
    out.push(s)
    flattenSections(s, out)
  }
  return out
}

/** Every leaf string in a value, joined - used to build the search index. */
export function textOf (value, out = []) {
  if (value == null) return out.join(' ')
  if (Array.isArray(value)) { for (const v of value) textOf(v, out); return out.join(' ') }
  if (typeof value === 'object') { for (const v of Object.values(value)) textOf(v, out); return out.join(' ') }
  out.push(String(value))
  return out.join(' ')
}
