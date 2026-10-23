# Superquota Tracker

[Superquota Tracker](https://bet365-superquota.netlify.app) è una web app che raccoglie e analizza lo storico delle superquote. Permette di consultare i risultati delle scommesse, osservarne l’andamento nel tempo e simulare il rendimento con una puntata fissa.

Il progetto è indipendente e non è affiliato a bet365.

## Cosa puoi fare

- **Panoramica** — visualizza utile netto, ROI, percentuale di vittorie, andamento cumulativo e risultati mensili.
- **Simulatore** — applica un importo fisso a tutte le scommesse di un periodo per stimare puntato, incassi e utile storico.
- **Archivio** — cerca e filtra le superquote per data, sport ed esito.
- **Gestione** — area riservata all’amministratore per inserire, modificare, rimuovere e ripristinare le scommesse.

## Come vengono calcolati i risultati

La simulazione non reinveste gli incassi: applica lo stesso importo a ogni scommessa selezionata.

| Esito      | Incasso                    | Utile netto       |
| ---------- | -------------------------- | ----------------- |
| Vinta      | Puntata × quota maggiorata | Incasso − puntata |
| Persa      | 0 €                        | − puntata         |
| Rimborsata | Puntata                    | 0 €               |
| In attesa  | Non conteggiata            | Non conteggiata   |

Ogni incasso viene arrotondato ai centesimi prima del totale. ROI e percentuale di vittorie considerano soltanto le scommesse vinte o perse.

## Dati e accesso

Le informazioni pubblicate descrivono lo storico delle superquote registrate nel progetto. La gestione dei dati richiede un account amministratore; il sito non consente di piazzare scommesse e non gestisce denaro.

## Contatti

Progetto di [Marco Rizzato](https://www.marcorizzato.it)

## Verifiche di sviluppo

`pnpm typecheck`,
`pnpm format:check` e `pnpm build` verificano rispettivamente tipi, formattazione e build.

## Rendering e indicizzazione

Le pagine pubbliche caricano i dati con SSR usando esclusivamente il client Supabase pubblico, senza sessioni amministrative. Non è necessario modificare RLS o aggiungere chiavi privilegiate. Un errore di lettura restituisce HTTP 503 invece di presentare una pagina vuota come disponibile.

L’archivio mostra per impostazione predefinita tutto lo storico, anche di anni precedenti. La paginazione espone link HTML (`/archive?page=2`, ecc.) e canonical specifici per ogni pagina. Periodo, sport, ricerca ed esito sono conservati nei parametri URL; queste viste filtrate usano `noindex, follow`. Le pagine inesistenti e i numeri di pagina fuori intervallo restituiscono HTTP 404.

Dopo il deploy, usare il test URL pubblicato di Search Console per controllare HTML e screenshot, poi richiedere l’indicizzazione di homepage, archivio e simulatore. La sitemap resta `/sitemap.xml`; l’indicizzazione è una decisione di Google e non è garantita dal deploy.

### Verifica SEO HTTP

Eseguire `pnpm typecheck` e `pnpm build`. Avviare la build con le variabili Supabase pubbliche configurate, per esempio `node --env-file=.env .output/server/index.mjs`.

Con il server attivo, eseguire `SEO_BASE_URL=http://127.0.0.1:3000 node scripts/check-seo.mjs`. Il controllo segue tutti i link di paginazione senza JavaScript e verifica contenuti SSR, canonical, direttive robots, sitemap e 404. Il dataset deve contenere almeno due pagine di offerte. `SEO_CANONICAL_ORIGIN` permette di specificare il dominio canonico atteso (predefinito: `https://bet365-superquota.netlify.app`).
