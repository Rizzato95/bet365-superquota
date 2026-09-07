import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'

let db: PGlite
async function identity(role: string, metadata: Record<string, unknown>) {
  await db.exec('reset role')
  await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(metadata)])
  await db.exec(`set role ${role}`)
}
const row = "('2026-01-01','Calcio','A - B','Goal',2,3,'won')"
const insert = `insert into public.offers (date,sport,event,market,original_odds,boosted_odds,outcome) values ${row}`
describe('database RLS and soft deletion', () => {
  beforeAll(async () => {
    db = new PGlite()
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
      create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
      grant usage on schema public, auth to anon, authenticated, service_role;
      grant execute on function auth.jwt() to anon, authenticated, service_role;`)
    const migration = await readFile(
      new URL('../supabase/migrations/20260907105925_create_superquotes.sql', import.meta.url),
      'utf8',
    )
    await db.exec(migration)
    await db.exec(insert)
  })
  afterAll(async () => {
    await db?.close()
  })
  it('allows anonymous reads and refuses writes', async () => {
    await identity('anon', {})
    expect((await db.query('select * from public.offers')).rows).toHaveLength(1)
    await expect(db.exec(insert)).rejects.toThrow()
    await expect(db.exec("update public.offers set outcome='lost'")).rejects.toThrow()
  })
  it('refuses non-admin inserts and ignores updates, including spoofed user_metadata', async () => {
    await identity('authenticated', { user_metadata: { role: 'admin' }, app_metadata: {} })
    await expect(db.exec(insert)).rejects.toThrow()
    expect(
      (await db.query("update public.offers set outcome='lost' returning id")).rows,
    ).toHaveLength(0)
  })
  it('supports admin insert, update, recoverable deletion, restore and immutable import reruns', async () => {
    await identity('authenticated', { app_metadata: { role: 'admin' } })
    await db.exec(
      "insert into public.offers (date,sport,event,market,original_odds,boosted_odds,outcome,source_key) values ('2026-01-01','Calcio','A - B','Goal',2,3,'won','import-key')",
    )
    const updated = await db.query(
      "update public.offers set outcome='lost', deleted_at=now() where source_key='import-key' returning id, updated_at",
    )
    expect(updated.rows).toHaveLength(1)
    await identity('anon', {})
    expect((await db.query('select * from public.offers')).rows).toHaveLength(1)
    await identity('authenticated', { app_metadata: { role: 'admin' } })
    expect((await db.query('select * from public.offers')).rows).toHaveLength(2)
    await expect(db.exec('delete from public.offers')).rejects.toThrow()
    await identity('service_role', {})
    await db.exec(
      "insert into public.offers (date,sport,event,market,original_odds,boosted_odds,outcome,source_key) values ('2026-01-01','Calcio','A - B','Goal',2,3,'won','import-key') on conflict(source_key) do nothing",
    )
    const existing = await db.query<{ outcome: string; deleted_at: string }>(
      "select outcome,deleted_at from public.offers where source_key='import-key'",
    )
    expect(existing.rows[0]?.outcome).toBe('lost')
    expect(existing.rows[0]?.deleted_at).not.toBeNull()
    await identity('authenticated', { app_metadata: { role: 'admin' } })
    await db.exec("update public.offers set deleted_at=null where source_key='import-key'")
    await identity('anon', {})
    expect((await db.query('select * from public.offers')).rows).toHaveLength(2)
  })
  it('imports the initial import twice without duplicates and reconciles its return', async () => {
    await db.exec('reset role')
    const seed = await readFile(
      new URL('../supabase/migrations/20260907110959_import_superquotes_2026.sql', import.meta.url),
      'utf8',
    )
    await db.exec(seed)
    await db.exec(seed)
    const result = await db.query(`select count(*)::int as total,
      count(*) filter(where outcome='won')::int as won,
      count(*) filter(where outcome='lost')::int as lost,
      sum(case when outcome='won' then round(100*boosted_odds,2)-100
        when outcome='lost' then -100 else 0 end)::text as profit
      from public.offers where source_key is not null and source_key <> 'import-key'`)
    expect(result.rows[0]).toEqual({ total: 181, won: 94, lost: 87, profit: '9084.90' })
  })
})
