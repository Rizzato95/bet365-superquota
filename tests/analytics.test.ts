import { describe, expect, it } from 'vitest'
import { analyze, compareOdds, settle } from '../shared/utils/analytics'
import { offerSchema, stakeSchema } from '../shared/utils/validation'
import type { Offer } from '../shared/types/offer'

function offer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'sample',
    date: '2026-01-02',
    sport: 'Calcio',
    event: 'A - B',
    market: 'Primo goal',
    boosted_odds: 3,
    original_odds: 2,
    outcome: 'won',
    source_key: null,
    created_at: '',
    updated_at: '',
    deleted_at: null,
    ...overrides,
  }
}
describe('fixed-stake settlement', () => {
  it('separates gross returns, net profit, losses, refunds and pending offers', () => {
    const stats = analyze(
      [
        offer(),
        offer({ id: 'lost', outcome: 'lost' }),
        offer({ id: 'void', outcome: 'void' }),
        offer({ id: 'pending', outcome: 'pending' }),
      ],
      10,
    )
    expect(stats).toMatchObject({
      total: 4,
      settled: 2,
      wins: 1,
      losses: 1,
      pending: 1,
      voids: 1,
      staked: 20,
      returns: 30,
      refunded: 10,
      profit: 10,
      roi: 50,
      winRate: 50,
    })
  })
  it('rounds each return half-up to cents before accumulation', () => {
    expect(settle(offer({ boosted_odds: 2.199 }), 100).profit).toBe(11990)
    expect(
      analyze([offer({ boosted_odds: 2.5 }), offer({ id: 'second', boosted_odds: 2.5 })], 0.01),
    ).toMatchObject({ staked: 0.02, returns: 0.06, profit: 0.04 })
  })
  it('has no division by zero for empty, pending and refunded-only periods', () => {
    for (const offers of [[], [offer({ outcome: 'pending' })], [offer({ outcome: 'void' })]]) {
      expect(analyze(offers)).toMatchObject({
        roi: null,
        winRate: null,
        averageOdds: null,
        profit: 0,
      })
    }
  })
  it('sorts days, aggregates multiple offers per day and starts at zero', () => {
    const stats = analyze(
      [offer({ date: '2026-02-03', outcome: 'lost' }), offer(), offer({ id: 'other' })],
      10,
      'boosted',
      '2026-01-01',
    )
    expect(stats.points).toEqual([
      { date: '2025-12-31', profit: 0 },
      { date: '2026-01-02', profit: 40 },
      { date: '2026-02-03', profit: 30 },
    ])
    expect(stats.months.map((m) => m.profit)).toEqual([40, -10])
  })
  it('compares exactly the same sample, excluding missing original odds and deleted rows', () => {
    const offers = [
      offer(),
      offer({ id: 'missing', original_odds: null, outcome: 'lost' }),
      offer({ id: 'deleted', deleted_at: '2026-01-03' }),
    ]
    expect(analyze(offers, 10).profit).toBe(10)
    const comparison = compareOdds(offers, 10)
    expect(comparison).toMatchObject({ included: 1, excluded: 1, extraProfit: 10 })
    expect(comparison.boosted.profit).toBe(20)
    expect(comparison.original.profit).toBe(10)
  })
  it('rejects invalid inputs and preserves legitimate three-decimal odds', () => {
    for (const value of [0, -10, 0.001, Infinity, '', 'abc'])
      expect(stakeSchema.safeParse(value).success).toBe(false)
    const { id, source_key, created_at, updated_at, deleted_at, ...input } = offer()
    expect(offerSchema.safeParse({ ...input, date: '2026-02-30' }).success).toBe(false)
    expect(offerSchema.safeParse({ ...input, original_odds: null }).success).toBe(false)
    expect(offerSchema.safeParse({ ...input, boosted_odds: 1.2 }).success).toBe(false)
    expect(offerSchema.safeParse({ ...input, boosted_odds: 2.199 }).success).toBe(true)
  })
})
