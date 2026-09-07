import Decimal from 'decimal.js'
import type { Offer } from '../types/offer'
import { stakeSchema } from './validation'

export type Point = { date: string; profit: number }
export type MonthResult = { month: string; profit: number; count: number; wins: number }
export type Analysis = {
  total: number
  settled: number
  wins: number
  losses: number
  pending: number
  voids: number
  staked: number
  returns: number
  refunded: number
  profit: number
  roi: number | null
  winRate: number | null
  averageOdds: number | null
  points: Point[]
  months: MonthResult[]
}
export function settle(
  offer: Pick<Offer, 'outcome' | 'boosted_odds' | 'original_odds'>,
  stake: number,
  kind: 'boosted' | 'original' = 'boosted',
) {
  const cents = new Decimal(stakeSchema.parse(stake)).times(100).toNumber()
  if (offer.outcome === 'pending') return { stake: 0, returns: 0, profit: 0, refunded: 0 }
  if (offer.outcome === 'void') return { stake: 0, returns: 0, profit: 0, refunded: cents }
  const odds = kind === 'boosted' ? offer.boosted_odds : offer.original_odds
  if (odds === null) throw new Error('Quota originale non disponibile')
  const returns =
    offer.outcome === 'won'
      ? new Decimal(cents).times(odds).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()
      : 0
  return { stake: cents, returns, profit: returns - cents, refunded: 0 }
}

export function analyze(
  offers: Offer[],
  stake = 100,
  kind: 'boosted' | 'original' = 'boosted',
  startDate?: string,
): Analysis {
  stakeSchema.parse(stake)
  const active = offers
    .filter((o) => !o.deleted_at)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
  let staked = 0,
    returns = 0,
    refunded = 0,
    wins = 0,
    losses = 0,
    pending = 0,
    voids = 0
  const days = new Map<string, number>(),
    months = new Map<string, { profit: number; count: number; wins: number }>()
  for (const offer of active) {
    const result = settle(offer, stake, kind)
    staked += result.stake
    returns += result.returns
    refunded += result.refunded
    if (offer.outcome === 'pending') {
      pending++
      continue
    }
    if (offer.outcome === 'void') voids++
    if (offer.outcome === 'won') wins++
    if (offer.outcome === 'lost') losses++
    days.set(offer.date, (days.get(offer.date) ?? 0) + result.profit)
    const key = offer.date.slice(0, 7),
      month = months.get(key) ?? { profit: 0, count: 0, wins: 0 }
    month.profit += result.profit
    if (offer.outcome === 'won' || offer.outcome === 'lost') month.count++
    if (offer.outcome === 'won') month.wins++
    months.set(key, month)
  }
  const first = startDate || active[0]?.date
  const points: Point[] = []
  if (first) {
    const previous = new Date(`${first}T12:00:00Z`)
    previous.setUTCDate(previous.getUTCDate() - 1)
    points.push({ date: previous.toISOString().slice(0, 10), profit: 0 })
  }
  let accumulated = 0
  for (const [date, profit] of days) {
    accumulated += profit
    points.push({ date, profit: accumulated / 100 })
  }
  const settled = wins + losses
  return {
    total: active.length,
    settled,
    wins,
    losses,
    pending,
    voids,
    staked: staked / 100,
    returns: returns / 100,
    refunded: refunded / 100,
    profit: (returns - staked) / 100,
    roi: staked ? ((returns - staked) / staked) * 100 : null,
    winRate: settled ? (wins / settled) * 100 : null,
    averageOdds: settled
      ? active
          .filter((o) => o.outcome === 'won' || o.outcome === 'lost')
          .reduce((sum, o) => sum + (kind === 'boosted' ? o.boosted_odds : o.original_odds!), 0) /
        settled
      : null,
    points,
    months: [...months].map(([month, value]) => ({ month, ...value, profit: value.profit / 100 })),
  }
}
export function compareOdds(offers: Offer[], stake: number, startDate?: string) {
  const active = offers.filter((o) => !o.deleted_at)
  const boosted = analyze(active, stake, 'boosted', startDate)
  const original = analyze(active, stake, 'original', startDate)
  return {
    boosted,
    original,
    extraProfit: new Decimal(boosted.profit).minus(original.profit).toNumber(),
  }
}
