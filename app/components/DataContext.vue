<script setup lang="ts">
const { dialog, open, close, closeOnBackdrop } = useDialog()
const route = useRoute()
watch(() => route.fullPath, close)
</script>

<template>
  <button
    type="button"
    class="self-start py-2 text-mint underline underline-offset-4 hover:text-foreground md:self-center"
    aria-haspopup="dialog"
    @click="open"
  >
    Informazioni sui dati
  </button>
  <dialog
    ref="dialog"
    aria-labelledby="data-context-title"
    class="m-auto w-full max-h-[calc(100dvh_-_32px)] max-w-[min(42rem,calc(100%_-_32px))] overflow-auto rounded-lg border border-panel-border bg-surface p-5 text-foreground shadow-2xl backdrop:bg-[#06140cba] backdrop:backdrop-blur-[4px] md:p-7"
    @click="closeOnBackdrop"
  >
    <div class="flex items-start justify-between gap-4">
      <h2 id="data-context-title" class="text-xl font-semibold leading-tight">
        Informazioni sui dati
      </h2>
      <button
        type="button"
        autofocus
        class="shrink-0 rounded-md border border-action-border bg-action px-3 py-2 text-sm text-action-text hover:bg-action-hover"
        @click="close"
      >
        Chiudi
      </button>
    </div>
    <div class="mt-4 text-base leading-relaxed text-muted">
      <p class="mt-3 max-w-3xl">
        Questo progetto indipendente raccoglie le superquote bet365 registrate nell’archivio, con
        data, evento, mercato, quota originale, quota maggiorata ed esito. Lo storico rappresenta le
        offerte inserite nel progetto e non garantisce di includere tutte le promozioni pubblicate
        da bet365. I risultati cambiano quando vengono aggiunte o corrette le registrazioni e
        aggiornati gli esiti.
      </p>
      <p class="mt-3 max-w-3xl">
        I filtri selezionano il periodo e lo sport analizzati. La panoramica usa una puntata fissa
        di 100 € per offerta; il simulatore permette di cambiarla. I risultati descrivono il passato
        e non prevedono rendimenti futuri. Il sito non è affiliato a bet365 e non consente di
        piazzare scommesse.
      </p>

      <h3 class="mt-5 font-semibold text-heading">Come vengono calcolati i risultati</h3>
      <p class="mt-3 max-w-3xl">
        Per ogni vincita, l’incasso lordo è la puntata moltiplicata per la quota maggiorata; l’utile
        netto è l’incasso meno la puntata. Una perdita sottrae la puntata, mentre un rimborso ha
        utile zero. Ogni incasso viene arrotondato ai centesimi prima della somma.
      </p>
      <p class="mt-3 max-w-3xl">
        ROI = utile netto / totale puntato sulle scommesse vinte o perse. Percentuale di vittorie =
        vinte / (vinte + perse). Eventi in attesa e rimborsati sono esclusi da questi indicatori. Il
        confronto con le quote originali usa solo gli eventi con entrambe le quote disponibili.
      </p>

      <nav
        @click="close"
        aria-label="Approfondisci i dati"
        class="mt-4 flex flex-wrap gap-x-5 gap-y-3"
      >
        <NuxtLink to="/archive" class="text-mint underline underline-offset-4"
          >Consulta l’archivio storico</NuxtLink
        >
        <NuxtLink to="/simulator" class="text-mint underline underline-offset-4"
          >Calcoli e simulazione del rendimento</NuxtLink
        >
      </nav>
    </div>
  </dialog>
</template>
