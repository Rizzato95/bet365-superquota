<script setup lang="ts">
const search = defineModel<string>({ required: true })
</script>
<template>
  <label
    class="px-3.5 py-0 border border-[#38473b] flex items-center gap-2.5 bg-[#1c271f] rounded-lg max-w-none w-full text-mint md:max-w-112.5 focus-within:outline-2 focus-within:outline-solid focus-within:outline-mint focus-within:-outline-offset-2"
    ><AppIcon name="search" :size="18" /><input
      class="px-0 py-3 border-0 bg-transparent outline-none text-foreground w-full text-sm md:text-sm focus-visible:outline-none placeholder:text-mint"
      v-model="search"
      maxlength="120"
      type="search"
      placeholder="Cerca evento o mercato…"
      aria-label="Cerca evento o mercato"
  /></label>
</template>
