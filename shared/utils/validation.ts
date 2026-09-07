import { z } from 'zod'
import { outcomes, sports } from '../types/offer'

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida')
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  }, 'Data non valida')

const odds = z
  .number()
  .finite()
  .gt(1, 'La quota deve essere maggiore di 1')
  .max(10000)
  .multipleOf(0.0001, 'Usa al massimo quattro decimali')
export const offerSchema = z
  .object({
    date: isoDate,
    sport: z.enum(sports),
    event: z.string().trim().min(2, 'Inserisci un evento').max(240),
    market: z.string().trim().min(2, 'Inserisci il mercato').max(2000),
    original_odds: odds.nullable(),
    boosted_odds: odds,
    outcome: z.enum(outcomes),
  })
  .strict()
  .refine((v) => v.original_odds === null || v.boosted_odds >= v.original_odds, {
    message: 'La quota maggiorata non può essere inferiore alla quota originale',
    path: ['boosted_odds'],
  })

export const stakeSchema = z.coerce
  .number()
  .finite()
  .positive('Inserisci un importo positivo')
  .max(1000000, 'Importo massimo: 1.000.000€')
  .multipleOf(0.01, 'Usa al massimo due decimali')
export const filterSchema = z
  .object({
    from: isoDate.optional(),
    to: isoDate.optional(),
    sport: z.enum(sports).or(z.literal('')).optional(),
  })
  .refine(
    (v) => !v.from || !v.to || v.from <= v.to,
    'La data iniziale deve precedere quella finale',
  )
export const archiveSchema = filterSchema.and(
  z.object({
    page: z.coerce.number().int().positive().max(100000).default(1),
    search: z.string().trim().max(120).default(''),
    outcome: z.enum(outcomes).or(z.literal('')).default(''),
    deleted: z.enum(['true', 'false']).default('false'),
  }),
)
