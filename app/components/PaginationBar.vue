<script setup lang="ts">
const page = defineModel<number>({ required: true })
const props = defineProps<{ total: number; pageSize: number; loading?: boolean }>()
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
async function changePage(nextPage: number) {
  page.value = nextPage
  await nextTick()
  document.querySelector('#archive-controls')?.scrollIntoView({ block: 'start' })
}
</script>
<template>
  <div
    class="flex items-center justify-between gap-[15px] mt-[23px] text-[11px] text-[#839b8b] flex-wrap md:text-xs md:flex-nowrap"
  >
    <span
      >Pagina <strong class="text-[#c1d2c6]">{{ page }}</strong> di {{ pages
      }}<span class="hidden md:inline"> · {{ total }} scommesse</span></span
    >
    <div class="flex gap-[7px] md:gap-[9px]">
      <button
        class="px-2.5 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[3px] min-h-9.5 rounded-[7px] text-[11px] font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] md:px-3 md:gap-[9px] md:text-xs hover:bg-[#304334]"
        :disabled="page <= 1 || loading"
        aria-label="Pagina precedente"
        @click="changePage(page - 1)"
      >
        <AppIcon name="left" :size="17" /><span>Precedente</span></button
      ><button
        class="px-2.5 py-2 border border-[#3a4c3e] inline-flex items-center justify-center gap-[3px] min-h-9.5 rounded-[7px] text-[11px] font-[550] transition-colors duration-150 bg-[#24332a] text-[#c4d3c9] md:px-3 md:gap-[9px] md:text-xs hover:bg-[#304334]"
        :disabled="page >= pages || loading"
        aria-label="Pagina successiva"
        @click="changePage(page + 1)"
      >
        <span>Successiva</span><AppIcon name="right" :size="17" />
      </button>
    </div>
  </div>
</template>
