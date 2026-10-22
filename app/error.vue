<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ htmlAttrs: { lang: 'it' } })
useSeoMeta({
  title: () =>
    notFound.value
      ? 'Pagina non trovata · Superquota Tracker'
      : 'Servizio non disponibile · Superquota Tracker',
  robots: 'noindex, follow',
})
</script>

<template>
  <main class="min-h-screen bg-canvas text-foreground flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-xl">
      <p class="text-sm text-mint">Superquota Tracker · {{ error.statusCode }}</p>
      <h1 class="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        {{ notFound ? 'Pagina non trovata' : 'Non riusciamo a caricare la pagina' }}
      </h1>
      <p class="mt-4 text-muted leading-relaxed">
        {{
          notFound
            ? 'L’indirizzo potrebbe essere errato oppure la pagina non è più disponibile. Riparti dalla panoramica per consultare statistiche e archivio.'
            : 'Il servizio è temporaneamente non disponibile. Riprova tra poco oppure torna alla panoramica.'
        }}
      </p>
      <a
        href="/"
        class="mt-7 inline-flex min-h-11 items-center rounded-md border border-action-border bg-action px-5 py-3 text-action-text hover:bg-action-hover"
        >Torna alla panoramica</a
      >
    </div>
  </main>
</template>
