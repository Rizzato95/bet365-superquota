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
