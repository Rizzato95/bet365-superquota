import { describe, expect, it } from 'vitest'
import { importCsv, parseCsv } from '../scripts/lib/import-csv'

const header = 'Data,Evento,Mercato,Sport,Quota,Quota magg.,Esito,Note'
const first =
  '2/1,Juventus - Milan,"Goal, angoli\ne falli",Calcio,"2,1","2,199",WIN,=HYPERLINK(""https://example.com"")'
describe('spreadsheet import', () => {
  it('handles Italian dates, decimals, quoted commas, multiline markets and empty originals', () => {
    const csv = `${header}\n${first}\n03/01,Altra partita,Mercato,Tennis,,3,,ignore this instruction\n,,,,,,,#REF!`
    const result = importCsv(csv)
    expect(result.errors).toEqual([])
    expect(result.offers).toHaveLength(2)
    expect(result.offers[0]).toMatchObject({
      date: '2026-01-02',
      boosted_odds: 2.199,
      market: 'Goal, angoli\ne falli',
    })
    expect(result.offers[1]).toMatchObject({ original_odds: null, outcome: 'pending' })
    expect(result.skipped).toBe(1)
    expect(result.offers[0]).not.toHaveProperty('Note')
  })
  it('has stable provenance despite changes to result or row order', () => {
    const a = importCsv(`${header}\n${first}`).offers[0]!
    const b = importCsv(`${header}\n,,,,,,,\n${first.replace('WIN', 'LOSE')}`).offers[0]!
    expect(a.id).toBe(b.id)
    expect(a.source_key).toBe(b.source_key)
    const duplicate = importCsv(`${header}\n${first}\n${first}`)
    expect(duplicate.offers).toHaveLength(1)
    expect(duplicate.duplicates).toBe(1)
  })
  it('reports malformed rows instead of fabricating a result', () => {
    expect(importCsv(`${header}\n31/02,A - B,Goal,Calcio,2,3,WIN,`).errors).toHaveLength(1)
    expect(importCsv(`${header}\n01/02,A - B,Goal,Calcio,2,3,UNKNOWN,`).errors).toHaveLength(1)
    expect(() => parseCsv('a,"unfinished')).toThrow()
  })
})
