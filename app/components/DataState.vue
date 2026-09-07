<script setup lang="ts">
defineProps<{ loading?: boolean; error?: boolean; empty?: boolean }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div
    v-if="loading || error || empty"
    class="p-7.5 flex items-center justify-center text-center flex-col gap-3.5 min-h-70 text-[#8fa295]"
    :role="error ? 'alert' : 'status'"
  >
    <template v-if="error"
      ><AppIcon name="help" :size="28" />
      <h2 class="text-[17px] text-[#d2ded6] font-medium">Non riusciamo a caricare i dati</h2>
      <p class="text-[13px] leading-[1.6]">Controlla la connessione e riprova.</p>
      <button
        class="px-4 py-[11px] border border-[#3a4c3e] inline-flex items-center justify-center gap-[9px] min-h-11 rounded-[7px] text-[13px] font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] hover:bg-[#304334]"
        @click="$emit('retry')"
      >
        <AppIcon name="restore" :size="16" />Riprova
      </button></template
    ><template v-else-if="loading"
      ><AppIcon name="loading" :size="25" class="animate-spin" />
      <p class="text-[13px] leading-[1.6]">Caricamento superquote…</p></template
    ><template v-else
      ><AppIcon name="archive" :size="30" />
      <h2 class="text-[17px] text-[#d2ded6] font-medium">Nessuna superquota trovata</h2>
      <p class="text-[13px] leading-[1.6]">Prova a cambiare il periodo o i filtri.</p></template
    >
  </div>
</template>
