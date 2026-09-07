import { createHash } from 'node:crypto'
import { offerSchema } from '../../shared/utils/validation'
import type { Offer } from '../../shared/types/offer'

export const sourceId = '18gEnIXYbGGQFvXukD_w3mJolWs-4_gSnrMDbjCY4eQM'
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [],
    cell = '',
    quoted = false
  text = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"'
        i++
      } else quoted = !quoted
    } else if (!quoted && (char === ',' || char === '\n')) {
      row.push(cell.replace(/\r$/, ''))
      cell = ''
      if (char === '\n') {
        rows.push(row)
        row = []
      }
    } else cell += char
  }
  if (quoted) throw new Error('CSV non valido: virgolette non chiuse')
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ''))
    rows.push(row)
  }
  return rows
}
export function italianNumber(value: string) {
  const normalized = value
    .trim()
    .replace(/[€%\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  if (!normalized || !/^-?\d+(\.\d+)?$/.test(normalized))
    throw new Error(`Numero non valido: ${value}`)
  return Number(normalized)
}
export function importCsv(text: string, year = 2026) {
  const importedAt = new Date().toISOString()
  const rows = parseCsv(text)
  const headerIndex = rows.findIndex(
    (row) => row[0]?.trim() === 'Data' && row.includes('Quota magg.'),
  )
  if (headerIndex < 0) throw new Error('Intestazioni del foglio Stats non trovate')
  const header = rows[headerIndex]!
  for (const name of ['Data', 'Evento', 'Mercato', 'Sport', 'Quota', 'Quota magg.', 'Esito']) {
    if (!header.includes(name)) throw new Error(`Colonna mancante: ${name}`)
  }
  const offers: Offer[] = [],
    errors: string[] = [],
    keys = new Set<string>()
  let skipped = 0,
    duplicates = 0
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i]!,
      get = (name: string) => (row[header.indexOf(name)] ?? '').trim()
    if (!get('Data') && !get('Evento')) {
      skipped++
      continue
    }
    try {
      const parts = get('Data').split('/')
      if (parts.length !== 2 && parts.length !== 3) throw new Error('Data non valida')
      const date = `${parts[2] || year}-${parts[1]!.padStart(2, '0')}-${parts[0]!.padStart(2, '0')}`
      const outcomes: Record<string, string> = {
        WIN: 'won',
        LOSE: 'lost',
        '': 'pending',
        VOID: 'void',
      }
      const data = offerSchema.parse({
        date,
        event: get('Evento'),
        market: get('Mercato'),
        sport: get('Sport'),
        original_odds: get('Quota') ? italianNumber(get('Quota')) : null,
        boosted_odds: italianNumber(get('Quota magg.')),
        outcome: outcomes[get('Esito').toUpperCase()],
      })
      const fingerprint = createHash('sha256')
        .update(
          JSON.stringify([
            date,
            data.event.toLowerCase(),
            data.market.toLowerCase(),
            data.boosted_odds,
          ]),
        )
        .digest('hex')
      const source_key = `${sourceId}:Stats:${fingerprint}`
      if (keys.has(source_key)) {
        duplicates++
        continue
      }
      keys.add(source_key)
      const id = `${fingerprint.slice(0, 8)}-${fingerprint.slice(8, 12)}-4${fingerprint.slice(13, 16)}-a${fingerprint.slice(17, 20)}-${fingerprint.slice(20, 32)}`
      offers.push({
        ...data,
        id,
        source_key,
        created_at: importedAt,
        updated_at: importedAt,
        deleted_at: null,
      })
    } catch (error) {
      errors.push(`Riga ${i + 1}: ${error instanceof Error ? error.message : 'Dati non validi'}`)
    }
  }
  return { offers, errors, skipped, duplicates }
}
