export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return `# Superquota Tracker

> Archivio indipendente delle superquote bet365, con statistiche storiche e simulatore a puntata fissa.

## Pagine

- [Panoramica](${siteUrl}/): risultati, andamento e statistiche delle superquote.
- [Simulatore](${siteUrl}/simulator): rendimento storico con un importo fisso personalizzabile.
- [Archivio](${siteUrl}/archive): elenco e filtri di tutte le superquote registrate.

## Informazioni

- I dati rappresentano le superquote registrate dal progetto.
- Il progetto è indipendente e non è affiliato a bet365.
- [Sito di Marco Rizzato](https://www.marcorizzato.it)`
})
