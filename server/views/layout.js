/**
 * The page shell.
 *
 * The header is the LAKA four-element contract (GET /v1/nav-contract on the design-system
 * API): the canonical Bow Tie seal, the uppercase site name with the second word in accent,
 * one MENU pill, one CTA pill. Nothing else goes in the bar; every destination lives in the
 * mega menu, which is a native <details> disclosure so it works with no JavaScript.
 */

import { corpus } from '../corpus.js'
import { ASSETS } from '../assets.js'

const BRAND = 'https://designsystem.bowtiekreative.com/brand'
export const ORIGIN = process.env.PUBLIC_ORIGIN ?? 'https://intel.bowtiekreative.com'

export const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export const attr = (v) => esc(v)

/** Icons: one stroke weight, one metaphor per concept. */
const ICON_PATHS = {
  grammar: '<path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  phase: '<path d="M3 20h18M6 20V9m6 11V4m6 16v-7"/>',
  workflow: '<path d="M3 7h6l3 5 3-5h6M3 17h6l3-5"/><circle cx="19" cy="17" r="2"/>',
  agent: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 1 5 5L21 13l-3 3-8.5-8.5 3-3z"/><path d="m9.5 7.5-6 6a2 2 0 0 0 0 3l4 4a2 2 0 0 0 3 0l6-6"/>',
  money: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  score: '<path d="M4 20V10m5 10V4m5 16v-7m5 7V8"/>',
  evidence: '<path d="M5 4h11l3 3v13H5z"/><path d="M9 10h7M9 14h7"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  check: '<path d="M4 5h16v14H4z"/><path d="m8 12 2.5 2.5L16 9"/>',
  api: '<path d="m9 16-4-4 4-4m6 0 4 4-4 4"/>',
  docs: '<path d="M5 5a2 2 0 0 1 2-2h12v18H7a2 2 0 0 1-2-2z"/><path d="M9 3v18"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  table: '<path d="M3 4h18v16H3zM3 9h18M9 9v11"/>'
}

export function icon (name, { size = 24 } = {}) {
  const path = ICON_PATHS[name]
  if (!path) return ''
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`
}

const inv = corpus.manifest.inventory

/** Every destination on the site. The bar carries none of these - the mega menu does. */
export const MENU = [
  {
    label: 'The grammar',
    items: [
      { href: '/laka', title: 'The LAKA layers', note: '5 states, 10 variables, 14 dynamics, 6 impact states' },
      { href: '/lenses', title: `The ${corpus.cube.size}-lens cube`, note: 'Who/What/When/Where/Why/How, expanded' },
      { href: '/evidence', title: 'Evidence and truth labels', note: 'O C I H U X, and E0 through E5' },
      { href: '/reference', title: 'Lookup tables', note: `${Object.keys(corpus.collections).length} typed collections` }
    ]
  },
  {
    label: 'The method',
    items: [
      { href: '/phases', title: 'Nine-phase audit', note: 'Questions, controls and deliverables per phase' },
      { href: '/workflows', title: 'Automation workflows', note: `W0 through W${corpus.workflows.length - 1}, intake to deletion` },
      { href: '/agents', title: 'Agent prompt pack', note: `${inv.agents} prompts, verbatim` },
      { href: '/financial-models', title: 'Financial impact models', note: `${inv.financial_models} models with visible formulas` }
    ]
  },
  {
    label: 'The registry',
    items: [
      { href: '/tools', title: 'Tool and source registry', note: `${inv.tools} entries across five libraries` },
      { href: '/tools?library=05', title: 'Technical and OSINT', note: 'Passive collection only' },
      { href: '/tools?library=07', title: 'Marketing and demand', note: 'Ads, search, crawling, analytics' },
      { href: '/tools?library=08', title: 'Economic and financial', note: 'Filings, official statistics, modeling' }
    ]
  },
  {
    label: 'Running it safely',
    items: [
      { href: '/score', title: 'Score something', note: 'Findings, opportunities, outreach, leads' },
      { href: '/guardrails', title: 'Legal and ethical guardrails', note: 'CASL, PIPEDA, CAN-SPAM, GDPR' },
      { href: '/checklists', title: 'Acceptance checklists', note: `${inv.checklist_items} gate items` },
      { href: '/scoring', title: 'How the scores work', note: 'Weights, gates and bands' }
    ]
  },
  {
    label: 'Reference',
    items: [
      { href: '/api', title: 'API reference', note: 'Every endpoint, with examples' },
      { href: '/docs', title: 'Source documents', note: `All ${inv.documents} files, verbatim` },
      { href: '/search', title: 'Search', note: 'Documents, tools, phases, agents, records' },
      { href: '/privacy', title: 'Privacy', note: 'What this site does and does not collect' }
    ]
  }
]

function header () {
  const groups = MENU.map((g) => `
        <div class="mega__group">
          <h2>${esc(g.label)}</h2>
          <ul>${g.items.map((i) => `
            <li><a href="${attr(i.href)}">${esc(i.title)}<span>${esc(i.note)}</span></a></li>`).join('')}
          </ul>
        </div>`).join('')

  return `
  <header class="bar">
    <div class="wrap bar__inner">
      <a class="bar__left" href="/">
        <img class="bar__seal" src="${BRAND}/btk-seal-white.png" alt="Bow Tie Kreative" width="34" height="34">
        <span class="bar__name">Intel <b>System</b></span>
      </a>
      <div class="bar__right">
        <details class="menu" id="menu">
          <summary class="pill" aria-label="Menu">
            <svg class="menu__icon menu__icon--open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            <svg class="menu__icon menu__icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
            <span>MENU</span>
          </summary>
          <nav class="mega" aria-label="All pages">
            <div class="wrap mega__grid">${groups}
            </div>
          </nav>
        </details>
        <a class="pill pill--solid" href="/score">Score<span class="cta-rest">something</span></a>
      </div>
    </div>
  </header>`
}

function footer () {
  const cols = MENU.map((g) => `
        <div>
          <h2>${esc(g.label)}</h2>
          <ul>${g.items.map((i) => `<li><a href="${attr(i.href)}">${esc(i.title)}</a></li>`).join('')}</ul>
        </div>`).join('')

  return `
  <footer class="foot">
    <div class="wrap">
      <div class="foot__grid">${cols}
      </div>
      <div class="foot__legal">
        <p class="m-0">${esc(corpus.manifest.title)} v${esc(corpus.manifest.version)} · research baseline ${esc(corpus.manifest.research_baseline)} · ${inv.documents} documents</p>
        <p class="m-0"><a href="/privacy">Privacy</a> · <a href="/api">API</a> · <a href="/sitemap.xml">Sitemap</a> · <a href="https://github.com/bowtiekreative/intel" rel="noopener">Source</a></p>
        <p class="m-0">Powered by <a href="https://bowtiekreative.com">Bow Tie Kreative</a></p>
      </div>
      <p class="muted mt-6 t-13 wide">Strategic and technical guidance, not legal, investment or penetration-testing advice. Tool entries were catalogued at the ${esc(corpus.manifest.research_baseline)} research baseline; verify licences, tiers and source terms before deployment.</p>
    </div>
  </footer>`
}

/** Trim to a whole word at or under `max` characters. */
export function clampText (text, max) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}...`
}

/**
 * @param {object} page
 * @param {string} page.title       the <title>, without the site suffix
 * @param {string} page.description meta description
 * @param {string} page.path        canonical path
 * @param {string} page.body        page markup, starting with its single <h1>
 * @param {object} [page.jsonLd]    structured data describing content visible on the page
 */
export function layout (page) {
  const suffix = ' · Intel System'
  const title = `${clampText(page.title, 60 - suffix.length)}${suffix}`
  const description = clampText(page.description, 158)
  const canonical = `${ORIGIN}${page.path}`

  // Every page carries structured data describing content that is visible on it.
  const structured = page.jsonLd ?? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: corpus.manifest.title, url: ORIGIN },
    publisher: { '@type': 'Organization', name: 'Bow Tie Kreative', url: 'https://bowtiekreative.com' }
  }
  const jsonLd = `\n  <script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${attr(canonical)}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="LAKA Volumetric Intelligence System">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${attr(canonical)}">
  <meta property="og:image" content="https://media.publit.io/file/SEO-thumbnails/intel-bowtiekreative-com.png">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="720">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(description)}">
  <meta name="twitter:image" content="https://media.publit.io/file/SEO-thumbnails/intel-bowtiekreative-com.png">
  <meta name="theme-color" content="#07090D">



  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="${ASSETS.css.url}">
  <link rel="stylesheet" href="${ASSETS.appCss.url}">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/json" href="${ORIGIN}/v1">${jsonLd}








<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header()}
  <main id="main" tabindex="-1">
${page.body}
  </main>
${footer()}
  <script src="${ASSETS.js.url}" defer></script>
</body>
</html>`
}

/** The environmental-motion anchor for hero sections. */
export function lattice () {
  const cols = 14
  const rows = 7
  let lines = ''
  let dots = ''
  for (let r = 0; r <= rows; r++) {
    lines += `<line x1="0" y1="${r * 60}" x2="1400" y2="${r * 60 - 120}" stroke-width="1" opacity="0.16"/>`
  }
  for (let c = 0; c <= cols; c++) {
    lines += `<line x1="${c * 100}" y1="0" x2="${c * 100 - 140}" y2="420" stroke-width="1" opacity="0.16"/>`
  }
  for (let r = 1; r < rows; r += 2) {
    for (let c = 1; c < cols; c += 3) {
      dots += `<circle class="pulse" cx="${c * 100}" cy="${r * 60}" r="3" fill="currentColor" stroke="none" opacity="0.4"/>`
    }
  }
  return `<div class="lattice"><svg viewBox="0 0 1400 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" role="presentation" class="lattice__svg"><g class="drift">${lines}${dots}</g></svg></div>`
}
