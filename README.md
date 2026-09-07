# Superquota Tracker

Web app Nuxt 4 per consultare lo storico delle superquote, analizzare il rendimento e simulare una puntata fissa.

## Pagine

- **Panoramica** (`/`)
- **Simulatore** (`/simulator`)
- **Archivio** (`/archive`)
- **Gestione** (`/management`, riservata all’amministratore)

## Configurazione locale

Copia `.env.example` in `.env` e imposta:

```env
NUXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

L’app usa sempre Supabase. In assenza delle credenziali, le API restituiscono un errore di configurazione invece di mostrare dati locali.

```bash
npm install
npm run dev
```

## Verifiche

```bash
npm run typecheck
npm test
```

## Deploy

Netlify richiede le stesse variabili pubbliche e `NUXT_PUBLIC_SITE_URL` deve coincidere con il dominio HTTPS dell’app.
