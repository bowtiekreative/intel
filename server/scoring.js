/**
 * The four scoring rubrics from `11-scoring-prioritization.md`, made executable.
 *
 * Weights, point ceilings and dimension names are read out of the corpus at boot, not
 * restated here, so the numbers the API computes cannot drift from the numbers the
 * documentation shows. Only the things the Markdown states in prose rather than in a table -
 * the confidence factors, the qualification bands, the hard gates - are declared in code,
 * and each one names the section it came from.
 *
 * Two rules from the source govern every function here:
 *   - a hard gate overrides the numeric score, never the other way round;
 *   - a missing input is reported as missing, never defaulted to zero.
 */

import { corpus, slugify } from './corpus.js'

const key = (label) => slugify(label).replace(/-/g, '_')

const pct = (s) => {
  const m = String(s ?? '').match(/([\d.]+)\s*%/)
  return m ? Number(m[1]) / 100 : null
}

const range = (s) => {
  const m = String(s ?? '').match(/(\d+)\s*[-–—]\s*(\d+)/)
  return m ? { min: Number(m[1]), max: Number(m[2]) } : null
}

/* ------------------------------------------------ finding quality (11.2) -- */

/**
 * The table gives the 0/3/5 anchors per dimension; the weights sit in the sentence under
 * the formula ("Recommended weights: Evidence 30%, ..."). Weight labels are shorter than
 * the table labels ("Contradiction" vs "Contradiction check"), so they match on prefix.
 */
function findingDimensions () {
  const collection = corpus.collections['finding-dimensions']
  const prose = corpus.byNumber.get('11')?.sections
    .find((s) => s.anchor === '2-finding-quality-score')?.blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => b.text)
    .find((t) => /recommended weights/i.test(t)) ?? ''

  const weights = [...prose.matchAll(/([A-Za-z][A-Za-z\s]*?)\s+(\d+)%/g)]
    .map((m) => ({ label: m[1].trim(), weight: Number(m[2]) / 100 }))

  return collection.records.map((record) => {
    const label = record.label
    const found = weights.find((w) =>
      label.toLowerCase().startsWith(w.label.toLowerCase()) ||
      w.label.toLowerCase().startsWith(label.toLowerCase()))
    return {
      key: key(label),
      label,
      weight: found?.weight ?? null,
      anchors: { 0: record['0'] ?? '', 3: record['3'] ?? '', 5: record['5'] ?? '' },
      scale: { min: 0, max: 5 }
    }
  })
}

/* ------------------------------------------- opportunity priority (11.3) -- */

function opportunityDimensions () {
  return corpus.collections['opportunity-dimensions'].records.map((record) => ({
    key: key(record.label),
    label: record.label,
    weight: pct(record.weight),
    meaning: record.meaning ?? '',
    scale: { min: 0, max: 5 }
  }))
}

// Section 11.3: "Use ConfidenceFactor 0.4/0.6/0.8/0.95 for low/moderate/high/very-high evidence."
export const CONFIDENCE_FACTORS = { low: 0.4, moderate: 0.6, high: 0.8, very_high: 0.95 }

// Section 11.3: risk penalty spans 0-0.6 and covers these risk classes.
export const RISK_PENALTY_MAX = 0.6
export const RISK_CLASSES = ['legal', 'privacy', 'security', 'execution', 'brand', 'dependency']

// Section 11.3: "Hard gates override the numeric score."
export const OPPORTUNITY_GATES = [
  { id: 'identity_resolved', question: 'Is the target identity resolved?', fails_when: 'unresolved identity' },
  { id: 'source_use_permitted', question: 'Is every source and use permitted?', fails_when: 'prohibited source/use' },
  { id: 'no_sensitive_personal_data', question: 'Is the opportunity free of sensitive personal data?', fails_when: 'sensitive-personal-data dependence' },
  { id: 'no_exploit_or_credential', question: 'Is it free of exploit or credential dependence?', fails_when: 'exploit or credential dependence' },
  { id: 'financial_claim_supportable', question: 'Is every financial claim supportable?', fails_when: 'misleading financial claim' },
  { id: 'service_to_mechanism_fit', question: 'Does an offered service address the mechanism?', fails_when: 'no plausible service-to-mechanism fit' }
]

/* -------------------------------------------------- authority score (11.4) -- */

// Section 11.4 states the rubric as a formula rather than a table, so its terms are declared here.
export const AUTHORITY_TERMS = [
  { key: 'evidence_specificity', label: 'Evidence specificity', sign: 1 },
  { key: 'business_relevance', label: 'Business relevance', sign: 1 },
  { key: 'economic_mechanism_clarity', label: 'Economic mechanism clarity', sign: 1 },
  { key: 'novelty', label: 'Novelty', sign: 1 },
  { key: 'usefulness_of_next_step', label: 'Usefulness of next step', sign: 1 },
  { key: 'respectful_boundary', label: 'Respectful boundary', sign: 1 },
  { key: 'intrusiveness', label: 'Intrusiveness', sign: -1 },
  { key: 'unsupported_certainty', label: 'Unsupported certainty', sign: -1 },
  { key: 'required_reading_friction', label: 'Required reading friction', sign: -1 }
]

export const AUTHORITY_GATES = [
  { id: 'evidence_specificity', test: (v, total) => v.evidence_specificity >= 3, requirement: 'EvidenceSpecificity >= 3' },
  { id: 'business_relevance', test: (v) => v.business_relevance >= 3, requirement: 'BusinessRelevance >= 3' },
  { id: 'respectful_boundary', test: (v) => v.respectful_boundary >= 4, requirement: 'RespectfulBoundary >= 4' },
  { id: 'intrusiveness', test: (v) => v.intrusiveness <= 1, requirement: 'Intrusiveness <= 1' },
  { id: 'unsupported_certainty', test: (v) => v.unsupported_certainty <= 1, requirement: 'UnsupportedCertainty <= 1' },
  { id: 'required_reading_friction', test: (v) => v.required_reading_friction <= 2, requirement: 'RequiredReadingFriction <= 2' },
  { id: 'total', test: (v, total) => total >= 18, requirement: 'AuthorityScore >= 18' }
]

/* --------------------------------------------- lead qualification (11.5) -- */

/**
 * The corpus labels these dimensions as full sentences. Short aliases keep the API usable;
 * each alias is anchored to a keyword in the corpus label so a reordered table cannot
 * silently remap the points.
 */
const LEAD_ALIASES = [
  { alias: 'industry_fit', match: /industry/i },
  { alias: 'service_signal_fit', match: /maps to offered service/i },
  { alias: 'evidence_quality', match: /evidence quality/i },
  { alias: 'materiality', match: /materiality/i },
  { alias: 'timing', match: /timing|trigger/i },
  { alias: 'role_resolved', match: /executive role/i },
  { alias: 'contact_route', match: /contact route/i },
  { alias: 'diagnostic_offer', match: /diagnostic/i }
]

function leadDimensions () {
  return corpus.collections['lead-dimensions'].records.map((record) => {
    const label = record.label
    const alias = LEAD_ALIASES.find((a) => a.match.test(label))
    const points = range(record.points)
    return {
      key: alias?.alias ?? key(label),
      label,
      scale: points ?? { min: 0, max: 0 },
      max_points: points?.max ?? 0
    }
  })
}

// Section 11.5 "Suggested bands".
export const LEAD_BANDS = [
  { id: 'research_complete', min: 80, max: 100, action: 'research-complete, human outreach review' },
  { id: 'nurture', min: 60, max: 79, action: 'nurture or resolve missing evidence' },
  { id: 'monitor', min: 40, max: 59, action: 'monitor' },
  { id: 'archive', min: 0, max: 39, action: 'archive/disqualify' }
]

// Section 11.5: excluded from scoring entirely.
export const LEAD_EXCLUSIONS = [
  'personal wealth', 'family information', 'protected traits', 'vulnerability', 'private contact details'
]

/* ------------------------------------------------------------- rubrics -- */

export const RUBRICS = {
  finding: {
    id: 'finding',
    name: 'Finding quality score',
    section: '11-scoring-prioritization.md#2-finding-quality-score',
    output: '0-100',
    formula: 'FindingQuality = weighted mean of dimensions x 20',
    dimensions: findingDimensions()
  },
  opportunity: {
    id: 'opportunity',
    name: 'Opportunity priority score',
    section: '11-scoring-prioritization.md#3-opportunity-priority-score',
    output: '0-100',
    formula: 'BaseOpportunityScore = weighted sum x 20; RiskAdjustedPriority = Base x ConfidenceFactor x (1 - RiskPenalty)',
    dimensions: opportunityDimensions(),
    confidence_factors: CONFIDENCE_FACTORS,
    risk_penalty_max: RISK_PENALTY_MAX,
    risk_classes: RISK_CLASSES,
    hard_gates: OPPORTUNITY_GATES
  },
  authority: {
    id: 'authority',
    name: 'Authority score',
    section: '11-scoring-prioritization.md#4-authority-score',
    output: '-15 to 30',
    formula: 'AuthorityScore = sum(positive terms) - sum(penalty terms)',
    dimensions: AUTHORITY_TERMS.map((t) => ({ ...t, scale: { min: 0, max: 5 } })),
    hard_gates: AUTHORITY_GATES.map(({ id, requirement }) => ({ id, requirement }))
  },
  lead: {
    id: 'lead',
    name: 'Lead qualification score',
    section: '11-scoring-prioritization.md#5-lead-qualification-score',
    output: '0-100',
    formula: 'Sum of dimension points',
    dimensions: leadDimensions(),
    bands: LEAD_BANDS,
    never_score: LEAD_EXCLUSIONS
  }
}

/* -------------------------------------------------------------- helpers -- */

class InputError extends Error {
  constructor (message, details) {
    super(message)
    this.statusCode = 400
    this.details = details
  }
}

/**
 * Read the declared dimensions out of a request body.
 * Missing dimensions are collected and reported; they are never treated as zero, because a
 * zero is a claim about the finding and an absence is not.
 */
function readDimensions (dimensions, input, { required = true } = {}) {
  const values = {}
  const missing = []
  const invalid = []

  for (const d of dimensions) {
    const raw = input?.[d.key]
    if (raw === undefined || raw === null || raw === '') {
      if (required) missing.push({ key: d.key, label: d.label, scale: d.scale })
      continue
    }
    const n = Number(raw)
    if (!Number.isFinite(n)) {
      invalid.push({ key: d.key, reason: 'not a number', received: raw })
      continue
    }
    if (n < d.scale.min || n > d.scale.max) {
      invalid.push({ key: d.key, reason: `outside ${d.scale.min}-${d.scale.max}`, received: n })
      continue
    }
    values[d.key] = n
  }

  if (invalid.length) throw new InputError('One or more dimension values are invalid.', { invalid })
  return { values, missing }
}

const round = (n, places = 1) => Number(n.toFixed(places))

/* ------------------------------------------------------------- scorers -- */

export function scoreFinding (input = {}) {
  const rubric = RUBRICS.finding
  const { values, missing } = readDimensions(rubric.dimensions, input)
  if (missing.length) {
    return { rubric: rubric.id, complete: false, score: null, needs_input: missing, note: 'Supply every dimension; an absent dimension is not a zero.' }
  }

  const weighted = rubric.dimensions.map((d) => ({
    key: d.key,
    label: d.label,
    value: values[d.key],
    weight: d.weight,
    contribution: round(values[d.key] * (d.weight ?? 0) * 20, 2)
  }))

  const totalWeight = rubric.dimensions.reduce((n, d) => n + (d.weight ?? 0), 0)
  const mean = rubric.dimensions.reduce((n, d) => n + values[d.key] * (d.weight ?? 0), 0) / (totalWeight || 1)

  return {
    rubric: rubric.id,
    complete: true,
    score: round(mean * 20),
    scale: '0-100',
    weighted_mean: round(mean, 3),
    total_weight: round(totalWeight, 3),
    components: weighted,
    formula: rubric.formula,
    source: rubric.section
  }
}

export function scoreOpportunity (input = {}) {
  const rubric = RUBRICS.opportunity
  const { values, missing } = readDimensions(rubric.dimensions, input.dimensions ?? input)

  // Hard gates are evaluated first and independently: a failed gate blocks regardless of score.
  const gates = OPPORTUNITY_GATES.map((gate) => {
    const answer = input.gates?.[gate.id]
    return {
      id: gate.id,
      requirement: gate.question,
      status: answer === undefined ? 'unanswered' : answer === true ? 'pass' : 'fail',
      fails_when: gate.fails_when
    }
  })
  const failed = gates.filter((g) => g.status === 'fail')
  const unanswered = gates.filter((g) => g.status === 'unanswered')

  if (missing.length) {
    return { rubric: rubric.id, complete: false, score: null, needs_input: missing, gates, note: 'Supply every dimension; an absent dimension is not a zero.' }
  }

  const totalWeight = rubric.dimensions.reduce((n, d) => n + (d.weight ?? 0), 0)
  const base = rubric.dimensions.reduce((n, d) => n + values[d.key] * (d.weight ?? 0), 0) * 20

  const confidenceKey = String(input.confidence ?? '').toLowerCase().replace(/[\s-]/g, '_')
  const confidence = CONFIDENCE_FACTORS[confidenceKey]
  if (input.confidence !== undefined && confidence === undefined) {
    throw new InputError('Unknown confidence level.', { received: input.confidence, allowed: Object.keys(CONFIDENCE_FACTORS) })
  }

  const penalty = input.risk_penalty === undefined ? 0 : Number(input.risk_penalty)
  if (!Number.isFinite(penalty) || penalty < 0 || penalty > RISK_PENALTY_MAX) {
    throw new InputError(`risk_penalty must be between 0 and ${RISK_PENALTY_MAX}.`, { received: input.risk_penalty })
  }

  const adjusted = confidence === undefined ? null : base * confidence * (1 - penalty)

  return {
    rubric: rubric.id,
    complete: true,
    blocked: failed.length > 0,
    base_score: round(base),
    risk_adjusted_priority: adjusted === null ? null : round(adjusted),
    scale: '0-100',
    confidence_factor: confidence ?? null,
    risk_penalty: penalty,
    total_weight: round(totalWeight, 3),
    components: rubric.dimensions.map((d) => ({
      key: d.key,
      label: d.label,
      value: values[d.key],
      weight: d.weight,
      contribution: round(values[d.key] * (d.weight ?? 0) * 20, 2)
    })),
    gates,
    verdict: failed.length
      ? 'BLOCK - a hard gate failed; the numeric score does not apply'
      : unanswered.length
        ? 'INCOMPLETE - answer every hard gate before using this score'
        : 'gates pass',
    formula: rubric.formula,
    source: rubric.section
  }
}

export function scoreAuthority (input = {}) {
  const rubric = RUBRICS.authority
  const { values, missing } = readDimensions(rubric.dimensions, input)
  if (missing.length) {
    return { rubric: rubric.id, complete: false, score: null, needs_input: missing, note: 'Supply every term; an absent term is not a zero.' }
  }

  const total = AUTHORITY_TERMS.reduce((n, t) => n + t.sign * values[t.key], 0)
  const gates = AUTHORITY_GATES.map((g) => ({
    id: g.id,
    requirement: g.requirement,
    status: g.test(values, total) ? 'pass' : 'fail'
  }))
  const failed = gates.filter((g) => g.status === 'fail')

  return {
    rubric: rubric.id,
    complete: true,
    score: round(total),
    scale: '-15 to 30',
    eligible: failed.length === 0,
    components: AUTHORITY_TERMS.map((t) => ({
      key: t.key, label: t.label, value: values[t.key], sign: t.sign, contribution: t.sign * values[t.key]
    })),
    gates,
    failed_gates: failed.map((g) => g.requirement),
    verdict: failed.length
      ? 'INELIGIBLE - the draft cannot be sent until every gate passes'
      : 'eligible for jurisdiction, provenance, suppression and human-approval review',
    note: 'The score never overrides a legal, privacy, security, evidence or opt-out block.',
    formula: rubric.formula,
    source: rubric.section
  }
}

export function scoreLead (input = {}) {
  const rubric = RUBRICS.lead
  const { values, missing } = readDimensions(rubric.dimensions, input)
  if (missing.length) {
    return { rubric: rubric.id, complete: false, score: null, needs_input: missing, note: 'Supply every dimension; an absent dimension is not a zero.' }
  }

  const total = rubric.dimensions.reduce((n, d) => n + values[d.key], 0)
  const max = rubric.dimensions.reduce((n, d) => n + d.max_points, 0)
  const band = LEAD_BANDS.find((b) => total >= b.min && total <= b.max) ?? null

  return {
    rubric: rubric.id,
    complete: true,
    score: round(total),
    scale: `0-${max}`,
    band: band?.id ?? null,
    action: band?.action ?? null,
    components: rubric.dimensions.map((d) => ({
      key: d.key, label: d.label, value: values[d.key], max_points: d.max_points
    })),
    never_score: LEAD_EXCLUSIONS,
    note: 'Lead qualification is company and opportunity fit, not personal profiling.',
    source: rubric.section
  }
}

export const SCORERS = {
  finding: scoreFinding,
  opportunity: scoreOpportunity,
  authority: scoreAuthority,
  lead: scoreLead
}
