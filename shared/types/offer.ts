export const sports = ['Calcio', 'Tennis', 'Basket', 'Motori', 'Altro'] as const
export const outcomes = ['pending', 'won', 'lost', 'void'] as const
export type Sport = (typeof sports)[number]
export type Outcome = (typeof outcomes)[number]
export type Offer = {
  id: string
  date: string
  sport: Sport
  event: string
  market: string
  original_odds: number | null
  boosted_odds: number
  outcome: Outcome
  source_key: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
export type OfferInput = Pick<
  Offer,
  'date' | 'sport' | 'event' | 'market' | 'original_odds' | 'boosted_odds' | 'outcome'
>
export type DataMode = 'snapshot' | 'live'
export type OfferPage = {
  offers: Offer[]
  total: number
  page: number
  pageSize: number
  mode: DataMode
}
export type StatisticsSource = { offers: Offer[]; mode: DataMode }
export type PeriodFilter = { from: string; to: string; sport: string }
