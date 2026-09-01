import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  RUBRICS, scoreFinding, scoreOpportunity, scoreAuthority, scoreLead, LEAD_BANDS
} from '../server/scoring.js'

/* --------------------------------------------------------------- weights -- */

test('the weighted rubrics have weights that sum to one', () => {
  for (const id of ['finding', 'opportunity']) {
    const total = RUBRICS[id].dimensions.reduce((n, d) => n + (d.weight ?? 0), 0)
    assert.ok(Math.abs(total - 1) < 1e-9, `${id} weights sum to ${total}`)
  }
})

test('lead points total one hundred', () => {
  const total = RUBRICS.lead.dimensions.reduce((n, d) => n + d.max_points, 0)
  assert.equal(total, 100)
})

test('every dimension has a distinct key and a scale', () => {
  for (const rubric of Object.values(RUBRICS)) {
    const keys = rubric.dimensions.map((d) => d.key)
    assert.equal(new Set(keys).size, keys.length, `${rubric.id} has duplicate keys`)
    assert.ok(rubric.dimensions.every((d) => d.scale && d.scale.max > 0))
  }
})

const fullFinding = {
  evidence: 5, entity_resolution: 5, recency: 5, directness: 5, independence: 5, contradiction_check: 5
}

/* ------------------------------------------------------- finding quality -- */

test('a perfect finding scores 100 and an empty one scores 0', () => {
  assert.equal(scoreFinding(fullFinding).score, 100)
  const zeroed = Object.fromEntries(Object.keys(fullFinding).map((k) => [k, 0]))
  assert.equal(scoreFinding(zeroed).score, 0)
})

test('an unscored dimension is reported, not treated as zero', () => {
  const { contradiction_check: _omitted, ...partial } = fullFinding
  const result = scoreFinding(partial)
  assert.equal(result.complete, false)
  assert.equal(result.score, null)
  assert.deepEqual(result.needs_input.map((n) => n.key), ['contradiction_check'])
})

test('a value outside its scale is rejected rather than clamped', () => {
  assert.throws(() => scoreFinding({ ...fullFinding, evidence: 9 }), (err) => {
    assert.equal(err.statusCode, 400)
    assert.equal(err.details.invalid[0].key, 'evidence')
    return true
  })
  assert.throws(() => scoreFinding({ ...fullFinding, evidence: 'high' }), (err) => err.statusCode === 400)
})

/* -------------------------------------------------- opportunity priority -- */

const fullOpportunity = Object.fromEntries(RUBRICS.opportunity.dimensions.map((d) => [d.key, 4]))
const allGatesPass = Object.fromEntries(RUBRICS.opportunity.hard_gates.map((g) => [g.id, true]))

test('the risk adjustment applies the confidence factor and the penalty', () => {
  const result = scoreOpportunity({
    dimensions: fullOpportunity, gates: allGatesPass, confidence: 'high', risk_penalty: 0.5
  })
  assert.equal(result.base_score, 80)
  assert.equal(result.risk_adjusted_priority, 32) // 80 x 0.8 x 0.5
  assert.equal(result.blocked, false)
})

test('a failed hard gate blocks a high score', () => {
  const result = scoreOpportunity({
    dimensions: Object.fromEntries(RUBRICS.opportunity.dimensions.map((d) => [d.key, 5])),
    gates: { ...allGatesPass, identity_resolved: false },
    confidence: 'very_high'
  })
  assert.equal(result.base_score, 100)
  assert.equal(result.blocked, true)
  assert.match(result.verdict, /^BLOCK/)
})

test('unanswered gates make the result incomplete rather than passing', () => {
  const result = scoreOpportunity({ dimensions: fullOpportunity, confidence: 'high' })
  assert.equal(result.blocked, false)
  assert.match(result.verdict, /^INCOMPLETE/)
  assert.ok(result.gates.every((g) => g.status === 'unanswered'))
})

test('an unknown confidence level and an out-of-range penalty are rejected', () => {
  assert.throws(() => scoreOpportunity({ dimensions: fullOpportunity, confidence: 'certain' }),
    (err) => err.statusCode === 400)
  assert.throws(() => scoreOpportunity({ dimensions: fullOpportunity, risk_penalty: 0.9 }),
    (err) => err.statusCode === 400)
})

test('dimensions may be sent flat or nested', () => {
  const nested = scoreOpportunity({ dimensions: fullOpportunity })
  const flat = scoreOpportunity(fullOpportunity)
  assert.equal(nested.base_score, flat.base_score)
})

/* ------------------------------------------------------- authority score -- */

const eligibleDraft = {
  evidence_specificity: 4,
  business_relevance: 4,
  economic_mechanism_clarity: 3,
  novelty: 3,
  usefulness_of_next_step: 4,
  respectful_boundary: 5,
  intrusiveness: 1,
  unsupported_certainty: 0,
  required_reading_friction: 1
}

test('penalty terms subtract from the authority score', () => {
  const result = scoreAuthority(eligibleDraft)
  assert.equal(result.score, 23 - 2)
  assert.equal(result.eligible, true)
})

test('every failing authority gate is named', () => {
  const result = scoreAuthority({ ...eligibleDraft, evidence_specificity: 2, intrusiveness: 3 })
  assert.equal(result.eligible, false)
  assert.ok(result.failed_gates.includes('EvidenceSpecificity >= 3'))
  assert.ok(result.failed_gates.includes('Intrusiveness <= 1'))
  assert.match(result.verdict, /^INELIGIBLE/)
})

test('a high total does not rescue a failed boundary gate', () => {
  const result = scoreAuthority({
    ...eligibleDraft, evidence_specificity: 5, novelty: 5, economic_mechanism_clarity: 5, respectful_boundary: 2
  })
  assert.ok(result.score >= 18)
  assert.equal(result.eligible, false)
  assert.ok(result.failed_gates.includes('RespectfulBoundary >= 4'))
})

/* ------------------------------------------------------------------ lead -- */

test('lead scores land in the documented bands', () => {
  const max = Object.fromEntries(RUBRICS.lead.dimensions.map((d) => [d.key, d.max_points]))
  const top = scoreLead(max)
  assert.equal(top.score, 100)
  assert.equal(top.band, 'research_complete')

  const none = Object.fromEntries(RUBRICS.lead.dimensions.map((d) => [d.key, 0]))
  assert.equal(scoreLead(none).band, 'archive')
})

test('the bands tile 0 to 100 without a gap or an overlap', () => {
  const sorted = [...LEAD_BANDS].sort((a, b) => a.min - b.min)
  assert.equal(sorted[0].min, 0)
  assert.equal(sorted[sorted.length - 1].max, 100)
  for (let i = 1; i < sorted.length; i++) {
    assert.equal(sorted[i].min, sorted[i - 1].max + 1)
  }
})

test('a lead result restates what is never scored', () => {
  const max = Object.fromEntries(RUBRICS.lead.dimensions.map((d) => [d.key, d.max_points]))
  const result = scoreLead(max)
  assert.ok(result.never_score.includes('protected traits'))
  assert.ok(result.never_score.includes('personal wealth'))
})
