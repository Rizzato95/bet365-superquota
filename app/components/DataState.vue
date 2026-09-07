<script setup lang="ts">
defineProps<{ loading?: boolean; error?: boolean; empty?: boolean }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div
    v-if="loading || error || empty"
    class="p-7.5 flex items-center justify-center text-center flex-col gap-3.5 min-h-70 text-mint"
    :role="error ? 'alert' : 'status'"
  >
    <template v-if="error"
      ><AppIcon name="help" :size="28" />
      <h2 class="text-base text-heading font-medium">Non riusciamo a caricare i dati</h2>
      <p class="text-sm leading-relaxed">Controlla la connessione e riprova.</p>
      <button
        class="px-4 py-2.5 border border-action-border inline-flex items-center justify-center gap-2 min-h-11 rounded-lg text-sm font-medium transition-colors duration-150 bg-action text-action-text hover:bg-action-hover"
        @click="$emit('retry')"
      >
        <AppIcon name="restore" :size="16" />Riprova
      </button></template
    ><template v-else-if="loading"
      ><AppIcon name="loading" :size="25" class="animate-spin" />
      <p class="text-sm leading-relaxed">Caricamento superquote…</p></template
    ><template v-else
      ><AppIcon name="archive" :size="30" />
      <h2 class="text-base text-heading font-medium">Nessuna superquota trovata</h2>
      <p class="text-sm leading-relaxed">Prova a cambiare il periodo o i filtri.</p></template
    >
  </div>
</template>
