import type { Database } from '../../supabase/database.types'

export type Sport = Database['public']['Enums']['offer_sport']
export type Outcome = Database['public']['Enums']['offer_outcome']
export const sports = ['Calcio', 'Tennis', 'Basket', 'Motori', 'Altro'] as const satisfies readonly Sport[]
export const outcomes = ['pending', 'won', 'lost', 'void'] as const satisfies readonly Outcome[]
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
export type OfferPage = {
  offers: Offer[]
  total: number
  page: number
  pageSize: number
}
export type StatisticsSource = { offers: Offer[] }
export type PeriodFilter = { from: string; to: string; sport: string }
