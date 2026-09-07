import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { importCsv, sourceId } from './lib/import-csv'
import { analyze } from '../shared/utils/analytics'
import type { Database } from '../shared/types/database'

const args = process.argv.slice(2)
const getArg = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const filename = getArg('--file')
const response = filename
  ? null
  : await fetch(`https://docs.google.com/spreadsheets/d/${sourceId}/export?format=csv`)
if (response && !response.ok) throw new Error(`Download fallito: ${response.status}`)
const csv = filename ? await readFile(filename, 'utf8') : await response!.text()
const result = importCsv(csv)
if (result.errors.length) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
if (!result.offers.length) throw new Error('Nessun evento da importare')
const stats = analyze(result.offers, 100)
console.log(
  JSON.stringify(
    {
      source: 'Stats 2026',
      events: stats.total,
      won: stats.wins,
      lost: stats.losses,
      pending: stats.pending,
      missingOriginalOdds: result.offers.filter((o) => o.original_odds === null).length,
      profit100: stats.profit,
      skipped: result.skipped,
      duplicates: result.duplicates,
    },
    null,
    2,
  ),
)
if (args.includes('--snapshot')) {
  await mkdir('server/data', { recursive: true })
  await writeFile('server/data/offers-2026.json', JSON.stringify(result.offers, null, 2) + '\n')
  console.log('Snapshot pubblico salvato, senza note o dati personali.')
}
if (args.includes('--apply')) {
  const url = process.env.NUXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key)
    throw new Error('Configura URL del progetto dedicato e SUPABASE_SECRET_KEY in .env')
  const supabase = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  // Conflicts are ignored: reruns must never overwrite manual corrections or restore deleted rows.
  const { data, error } = await supabase
    .from('offers')
    .upsert(result.offers, { onConflict: 'source_key', ignoreDuplicates: true })
    .select('id')
  if (error) throw new Error(error.message)
  console.log(
    `Importazione completata. Nuovi eventi: ${data.length}. Già presenti: ${result.offers.length - data.length}.`,
  )
} else console.log('Anteprima soltanto: nessuna modifica a Supabase. Usa --apply per importare.')
