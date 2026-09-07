import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const unconfigured = process.argv.includes('--unconfigured')
process.env.NUXT_DEMO_MODE = unconfigured ? 'false' : 'true'
process.env.NUXT_PUBLIC_SUPABASE_URL = ''
process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = ''
const { default: handler } = await import('../.netlify/functions-internal/server/main.mjs')
const request = (path, options = {}) =>
  handler(new Request(`http://localhost:3000${path}`, options))

if (unconfigured) {
  const response = await request('/api/statistics')
  assert.equal(response.status, 503, 'Production must not silently fall back to snapshot data')
  console.log('Production without Supabase: explicit 503 verified.')
} else {
  const page1 = await (await request('/api/offers?page=1')).json()
  const page2 = await (await request('/api/offers?page=2')).json()
  const statistics = await (await request('/api/statistics')).json()
  assert.equal(page1.offers.length, 25)
  assert.equal(page2.offers.length, 25)
  assert.equal(page1.total, 181)
  assert.equal(statistics.offers.length, 181)
  assert.equal(new Set([...page1.offers, ...page2.offers].map((o) => o.id)).size, 50)
  assert.ok(page1.offers.every((o, i) => i === 0 || page1.offers[i - 1].date >= o.date))
  const filtered = await (
    await request('/api/offers?sport=Tennis&search=Sinner&outcome=won')
  ).json()
  assert.equal(filtered.total, 3)
  assert.ok(filtered.offers.every((o) => o.sport === 'Tennis' && o.outcome === 'won'))
  assert.equal((await request('/api/offers?from=2026-02-30')).status, 400)
  assert.equal((await request('/api/offers?page=0')).status, 400)
  const empty = await (await request('/api/offers?from=2027-01-01&to=2027-01-31')).json()
  assert.equal(empty.total, 0)
  const session = await request('/api/auth/session')
  assert.ok(session.headers.get('cache-control').includes('no-store'))
  assert.equal((await session.json()).mode, 'snapshot')
  assert.equal((await request('/api/admin/offers')).status, 503)
  assert.equal((await request('/api/admin/offers', { method: 'POST' })).status, 403)
  assert.equal(
    (
      await request('/api/admin/offers', {
        method: 'POST',
        headers: { origin: 'https://evil.example' },
      })
    ).status,
    403,
  )
  assert.equal(
    (
      await request('/api/admin/offers', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
      })
    ).status,
    503,
  )
  for (const [path, heading] of [
    ['/', 'Overview'],
    ['/archive', 'Archive'],
    ['/simulator', 'Simulator'],
    ['/management', 'Management'],
  ]) {
    const response = await request(path)
    assert.equal(response.status, 200, `SSR route ${path}`)
    const html = await response.text()
    assert.ok(html.includes(heading), `SSR content ${path}`)
    assert.ok(!html.includes('Kappati a'), 'Private spreadsheet notes must not leak into SSR')
  }
  const isolated = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--unconfigured'], {
    encoding: 'utf8',
    env: { ...process.env },
  })
  assert.equal(isolated.status, 0, isolated.stdout + isolated.stderr)
  console.log(isolated.stdout.trim())
  console.log(
    'Netlify production handler: pagination, filters, statistics, validation, blocked writes and all four SSR routes passed.',
  )
}
