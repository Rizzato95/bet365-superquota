# Superquota Tracker

Nuxt 4, Tailwind CSS 4, Supabase e Chart.js. Interfaccia italiana responsive con panoramica, archivio, simulatore e gestione amministrativa.

Le pagine e la navigazione usano nomi inglesi: **Overview** (`/`, `index.vue`), **Archive** (`/archive`, `archive.vue`), **Simulator** (`/simulator`, `simulator.vue`) e **Management** (`/management`, `management.vue`). I precedenti URL italiani reindirizzano alle nuove pagine.

## Avvio locale

Richiede Node 22+ (Node 24 su Netlify).

```sh
npm ci
npm run dev
```

Apri http://127.0.0.1:3000. Senza URL Supabase, **soltanto in sviluppo** viene attivato lo snapshot in sola lettura. Login e scritture rimangono disabilitati. In produzione l’assenza della configurazione genera un errore 503, senza ripiegare sullo snapshot. `NUXT_DEMO_MODE=true` permette una preview esplicita dello snapshot anche con una build di produzione.

Il nome del prodotto si trova in `app/app.config.ts`.

## Dati e calcoli

`server/data/offers-2026.json` contiene esclusivamente i campi pubblici del foglio **Stats**, scaricato il 7 settembre 2026. Nessuna nota personale o dato della cassa è incluso.

Il foglio è stato aggiornato durante la realizzazione:

| Versione              | Concluse | Vinte | Perse | In attesa | Quote originali mancanti | Utile con 100€ |
| --------------------- | -------: | ----: | ----: | --------: | -----------------------: | -------------: |
| Piano iniziale        |      180 |    94 |    86 |         1 |                        3 |      9.184,90€ |
| Snapshot implementato |      181 |    94 |    87 |         0 |                        0 |      9.084,90€ |

Il campione iniziale, privato dei campi personali, è conservato in `tests/fixtures/planning-2026.csv` per la riconciliazione. La quota storica **2,199** viene preservata: il database ammette quattro decimali, mentre gli incassi vengono arrotondati ai centesimi, per singola offerta, con arrotondamento half-up.

Il motore unico `shared/utils/analytics.ts` calcola utile, incassi, capitale puntato, rimborsi separati, ROI, vittorie, serie giornaliera e risultati mensili. Il confronto elimina da entrambe le curve le offerte senza quota originale. Attese e rimborsi non entrano nel denominatore del ROI o nella percentuale di vittorie. Nessun reinvestimento o limite personale di puntata.

## Configurazione Supabase

Il progetto di produzione è **Superquota** (`dgaskmmkivpfijghuiod`), nell’organizzazione **Superquota**, regione `eu-west-1`. Le migrazioni versionate comprendono lo schema, l’importazione iniziale delle 181 scommesse e la restrizione della funzione interna della piattaforma. I tipi generati dal database hosted sono in `supabase/database.types.ts`.

1. Per un nuovo ambiente, creare un progetto Supabase dedicato.
2. Applicare le migrazioni in `supabase/migrations/` al progetto dedicato. La migrazione è stata verificata su PostgreSQL locale tramite PGlite, incluse le RLS. Per il deploy tramite CLI: collegare il progetto con `supabase link --project-ref <ref>` e verificare `supabase db push --dry-run` prima di `supabase db push`.
3. In **Authentication**, disabilitare la registrazione di nuovi utenti. Il `supabase/config.toml` locale contiene già questa impostazione; il file non modifica automaticamente la configurazione hosted.
4. Creare manualmente l’account amministratore email/password. Assegnare `app_metadata.role = "admin"` tramite un’operazione amministrativa affidabile (Dashboard o Admin API). Non usare `user_metadata`, modificabili dall’utente. Nessuna pagina pubblica di registrazione o promozione a admin è presente.
5. Copiare `.env.example` in `.env` e impostare `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NUXT_PUBLIC_SITE_URL` e `NUXT_DEMO_MODE=false`.
6. Impostare la Site URL e gli URL di redirect in Supabase. Riavviare il server di sviluppo dopo le modifiche a `.env`.
7. Importare lo storico come descritto sotto, quindi verificare login, inserimento, modifica, rimozione e ripristino sul progetto reale. Controllare anche gli advisor Supabase e rigenerare i tipi dopo future migrazioni.

La chiave pubblicabile può essere distribuita al client perché le RLS proteggono le scritture. L’app usa sessioni SSR con cookie HttpOnly/SameSite, verifica fresca dell’utente sui server endpoint e controllo dell’Origin sulle mutazioni. Nessuna chiave privilegiata è necessaria al runtime del sito. Revocando un amministratore, revocare anche le sessioni: le chiamate dirette alla Data API possono mantenere i vecchi claim JWT fino alla loro scadenza.

### Importazione iniziale

In produzione lo snapshot è già importato dalla migrazione `20260907110959_import_superquotes_2026.sql`. Non occorre rilanciare lo script: `ON CONFLICT (source_key) DO NOTHING` evita duplicati e preserva le modifiche successive. Lo script resta disponibile per l’anteprima o un’importazione esplicita da CSV.

```sh
npm run import:preview
# Oppure con il CSV esportato dal foglio Stats:
npm run import:preview -- --file /percorso/Stats.csv
# SOLO dopo aver configurato URL del progetto dedicato e SUPABASE_SECRET_KEY in .env:
npm run import:apply -- --file /percorso/Stats.csv
```

L’anteprima stampa quantità e riepilogo, senza scrivere su Supabase. Il download automatico usa il primo foglio del documento condiviso (attualmente l’unico, Stats); se la struttura del workbook cambia, esportare esplicitamente Stats e usare `--file`.

L’importatore rifiuta righe evento non valide, ignora righe vuote/formule/note, supporta celle multilinea e decimali italiani. Le chiavi di provenienza dipendono da data, evento, mercato e quota maggiorata. La riesecuzione ignora i conflitti senza sovrascrivere correzioni o ripristinare offerte rimosse; non è una sincronizzazione periodica. Rimuovere la chiave privilegiata dall’ambiente quando l’importazione è terminata e non configurarla su Netlify.

## API

- `GET /api/offers`: `from`, `to`, `sport`, `outcome`, `search`, `page`; 25 risultati per pagina e conteggio totale. Ordinamento per data decrescente con ID come spareggio stabile.
- `GET /api/statistics`: `from`, `to`, `sport`; tutte le offerte del periodo per il motore condiviso, senza il limite della pagina dell’archivio.
- `GET /api/auth/session`, `POST /api/auth/login`, `POST /api/auth/logout`: sessione amministrativa.
- `GET/POST /api/admin/offers`, `PATCH/DELETE /api/admin/offers/:id`, `POST /api/admin/offers/:id/restore`: gestione protetta. `deleted=true` nell’elenco amministrativo mostra il cestino.

Le offerte rimosse sono escluse dalle letture pubbliche e dai calcoli. Le RLS consentono SELECT agli anonimi sulle sole righe attive, INSERT/UPDATE ai soli amministratori; nessun DELETE fisico è concesso all’app.

## Verifica

```sh
npm run typecheck
npm test
npm run build
NITRO_PRESET=netlify npm run build
npm run test:netlify
```

I test verificano il calcolo esatto, i due snapshot, casi vuoti/rimborsi/attese, il confronto su campioni identici, importazione e deduplicazione. I test RLS eseguono la migrazione in PostgreSQL (PGlite), con ruoli anon/authenticated/service_role e claim Auth simulati: verificano accesso anonimo, tentativi con metadati falsificati, scritture amministrative, rimozione, ripristino e importazione idempotente. Non sostituiscono la verifica di Supabase Auth sul progetto hosted.

`test:netlify` esegue localmente la funzione server della build Netlify effettiva: verifica le quattro pagine SSR, paginazione, filtri combinati, statistiche complete, validazione delle richieste, controllo Origin e blocco delle scritture nello snapshot. Verifica inoltre che una produzione senza configurazione risponda 503 e non mostri silenziosamente dati dimostrativi. Questa verifica non implica un deploy sul servizio Netlify.

Controlli browser effettuati a 360, 390, 768 e 1440 px: navigazione, ricerca/esito/sport, paginazione, simulazioni a 10€/100€/200€, validazione degli importi, confronto delle curve e assenza di scorrimento orizzontale alle dimensioni provate.

## Netlify e GitHub

### Google Analytics 4

Impostare `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX` con l’ID del flusso web GA4 nelle variabili di produzione Netlify. Senza ID valido, e sempre durante `npm run dev`, il tag non viene caricato e non vengono inviate visite. Lasciare la variabile vuota nei deploy di anteprima.

Il tag invia la prima visualizzazione e usa la misurazione avanzata GA4 per le navigazioni Nuxt. Nel flusso web, abilitare **Misurazione avanzata → Visualizzazioni di pagina → Modifiche della pagina basate su eventi della cronologia del browser**, come nella [guida ufficiale Google per le applicazioni SPA](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications). Non aggiungere un secondo tag o eventi `page_view` manuali. I segnali Google e quelli di personalizzazione pubblicitaria sono disabilitati; questa integrazione non aggiunge una piattaforma di gestione del consenso.

Dopo il deploy, verificare in Tempo reale/DebugView una visita iniziale e una per ogni passaggio fra le pagine. La ricezione sulla proprietà reale richiede l’ID e non è verificabile nell’anteprima locale.

Il repository GitHub è `Rizzato95/bet365-superquota`. `netlify.toml` configura Node 24, build Nuxt con preset Nitro `netlify` e directory `dist`.

1. Il progetto Netlify `bet365-superquota` nel team “Marco Rizzato’s team” è collegato al branch `main` del repository. URL di produzione: https://bet365-superquota.netlify.app.
2. Impostare le tre variabili pubbliche Supabase/Site URL sopra indicate nei contesti build e runtime, con `NUXT_DEMO_MODE=false`. Site URL deve coincidere con l’origine HTTPS reale: il controllo Origin protegge login e scritture.
3. Per le Deploy Preview, impostare la relativa origine se si vogliono provare le scritture; mantenere le preview collegate al database di sviluppo, non a dati di produzione.
4. Pubblicare e verificare accesso diretto a tutte le pagine, login, persistenza e aggiornamento dei grafici. Le API amministrative e Auth non vengono memorizzate in cache.

Google Analytics rimane disattivato in produzione su richiesta dell’utente. La configurazione hosted di Auth va mantenuta separatamente dal file locale `supabase/config.toml`.
