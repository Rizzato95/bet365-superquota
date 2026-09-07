<script setup lang="ts">
const config = useAppConfig()
const route = useRoute()
const { data: session } = useAdmin()
const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/+$/, '')
const navigation = [
  { to: '/', name: 'Panoramica', icon: 'overview' },
  { to: '/simulator', name: 'Simulatore', icon: 'simulator' },
  { to: '/archive', name: 'Archivio', icon: 'archive' },
]
useHead({
  titleTemplate: (title) =>
    title === config.brand.name ? title : `${title} · ${config.brand.name}`,
})
useHead({
  script: [
    {
      key: 'website-schema',
      type: 'application/ld+json' as any,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.brand.name,
        url: siteUrl,
        inLanguage: 'it-IT',
        description:
          'Archivio delle superquote bet365, statistiche e simulazione del rendimento storico a puntata fissa.',
        publisher: {
          '@type': 'Person',
          name: config.owner.name,
          url: config.owner.website,
        },
      }),
    },
  ],
})
</script>
<template>
  <div>
    <a class="p-3 fixed top-[-80px] left-5 bg-mint text-canvas z-100 focus:top-2.5" href="#main"
      >Vai al contenuto</a
    >
    <header
      class="px-4.5 py-0 fixed top-0 right-0 bottom-auto left-0 h-16 bg-header-gradient bg-transparent border-b border-b-[#315144] flex items-center z-30 gap-2.5 md:px-6 md:h-17 md:gap-7.5 lg:h-19 xl:px-8.5"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-base font-bold tracking-tight whitespace-nowrap xs:text-lg md:gap-2.5 md:text-lg xl:text-xl"
        ><span
          class="h-[29px] w-[29px] rounded-lg grid place-items-center bg-lime text-canvas md:h-[35px] md:w-[35px] md:rounded-lg"
          ><AppIcon name="boost" :size="24" /></span
        ><span
          >{{ config.brand.shortName
          }}<span
            class="font-normal text-mint tracking-tight ml-0.5 text-sm xs:text-sm md:ml-1 md:text-inherit"
            >&nbsp;{{ config.brand.suffix }}</span
          ></span
        ></NuxtLink
      >
      <NuxtLink
        to="/management"
        class="px-2.5 py-2 border border-[#446052] ml-auto flex items-center gap-2 rounded-lg text-foreground text-sm min-h-9 md:px-3 md:py-2 md:min-h-10 hover:border-[#6eaa88] hover:bg-[#294b3a]"
        aria-label="Gestione"
        ><AppIcon :name="session?.admin ? 'settings' : 'lock'" :size="16" /><span
          class="hidden md:inline"
          >Gestione</span
        ></NuxtLink
      >
    </header>
    <aside
      class="px-3 fixed left-0 top-19 bottom-0 w-[195px] bg-[#141c17] border-r border-r-[#28382d] pt-9.5 pb-5 hidden flex-col z-20 lg:flex xl:px-4.5 xl:w-56"
      aria-label="Navigazione principale"
    >
      <div class="mx-4 text-xs tracking-tight text-muted mt-0 mb-3.5 font-semibold">ESPLORA</div>
      <nav>
        <NuxtLink
          class="px-3.5 py-3.5 flex items-center gap-3 text-muted rounded-lg text-sm mb-1 transition-colors duration-150 aria-[current=page]:bg-[#21392c] aria-[current=page]:text-mint hover:bg-[#24372a] hover:text-foreground"
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          ><AppIcon :name="item.icon" /><span>{{ item.name }}</span
          ><span v-if="route.path === item.to" class="w-[5px] h-[5px] bg-mint rounded-full ml-auto"
        /></NuxtLink>
      </nav>
      <template v-if="session?.admin">
        <div class="mx-3.5 my-6 h-[1px] bg-[#2b382e]" />
        <div class="mx-4 text-xs tracking-tight text-muted mt-0 mb-3.5 font-semibold">
          IL PROGETTO
        </div>
        <NuxtLink
          class="px-3.5 py-3.5 flex items-center gap-3 text-muted rounded-lg text-sm mb-1 transition-colors duration-150 aria-[current=page]:bg-[#21392c] aria-[current=page]:text-mint hover:bg-[#24372a] hover:text-foreground"
          to="/management"
          :aria-current="route.path.startsWith('/management') ? 'page' : undefined"
          ><AppIcon name="settings" /><span>Gestione</span></NuxtLink
        >
      </template>
      <div class="px-4 mt-auto pt-10 pb-1.5">
        <span
          class="block border-t border-t-[#2a362d] mt-6.5 pt-5 text-xs leading-relaxed text-muted"
          >© 2026
          <a
            class="text-mint underline underline-offset-2 hover:text-foreground"
            :href="config.owner.website"
            target="_blank"
            rel="noreferrer"
            >{{ config.owner.name }}</a
          ><br />Progetto indipendente, non affiliato a bet365.</span
        >
      </div>
    </aside>
    <main
      id="main"
      class="px-3.5 mx-0 mt-16 mb-0 pt-5.5 pb-19.5 max-w-442.5 min-h-[calc(100vh_-_76px)] xs:px-4.5 md:px-6.5 md:mt-17 md:pt-7.5 md:pb-20 lg:px-6 lg:mt-19 lg:ml-48 lg:pt-8.5 lg:pb-0 xl:px-10 xl:ml-56 2xl:px-14"
    >
      <NuxtPage />
      <footer
        class="px-0 flex justify-between gap-2 mt-7.5 pt-5 pb-5.5 border-t border-t-[#29372d] text-xs text-muted flex-col leading-relaxed md:gap-3 md:pt-5.5 md:flex-row md:leading-normal lg:mt-9.5"
      >
        <span
          >© 2026
          <a
            class="text-mint underline underline-offset-2 hover:text-foreground"
            :href="config.owner.website"
            target="_blank"
            rel="noreferrer"
            >{{ config.owner.name }}</a
          >
          · Progetto indipendente, non affiliato a bet365.</span
        >
      </footer>
    </main>
    <nav
      class="px-3 flex fixed bottom-0 left-0 right-0 z-35 border-t border-t-[#40583e] bg-[#14251df2] backdrop-blur-[14px] pt-1.5 pb-[calc(7px_+_env(safe-area-inset-bottom))] justify-around lg:hidden lg:pl-0 lg:justify-normal"
      aria-label="Navigazione mobile"
    >
      <NuxtLink
        class="flex flex-col items-center gap-1 min-h-[49px] justify-center flex-1 text-xs text-mint relative lg:inline lg:flex-row lg:gap-0 lg:justify-normal lg:flex-initial lg:text-inherit aria-[current=page]:text-mint aria-[current=page]:before:content-[''] aria-[current=page]:before:absolute aria-[current=page]:before:w-5.5 aria-[current=page]:before:h-0.5 aria-[current=page]:before:bg-[#8de4b7] aria-[current=page]:before:top-[-7px] aria-[current=page]:before:rounded-lg lg:aria-[current=page]:before:content-[''] lg:aria-[current=page]:before:w-auto"
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :aria-current="route.path === item.to ? 'page' : undefined"
        ><AppIcon :name="item.icon" :size="21" /><span>{{ item.name }}</span></NuxtLink
      >
    </nav>
  </div>
</template>
