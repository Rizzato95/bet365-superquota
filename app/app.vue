<script setup lang="ts">
const config = useAppConfig()
const route = useRoute()
const { data: session } = await useAdmin()
const navigation = [
  { to: '/', name: 'Overview', icon: 'overview' },
  { to: '/archive', name: 'Archive', icon: 'archive' },
  { to: '/simulator', name: 'Simulator', icon: 'simulator' },
]
useHead({
  titleTemplate: (title) =>
    title === config.brand.name ? title : `${title} · ${config.brand.name}`,
})
</script>
<template>
  <div>
    <a class="p-3 fixed top-[-80px] left-5 bg-mint text-[#102019] z-100 focus:top-2.5" href="#main"
      >Vai al contenuto</a
    >
    <header
      class="px-4.5 py-0 fixed top-0 right-0 bottom-auto left-0 h-16 bg-[linear-gradient(110deg,_#174b3a_0%,_#133529_44%,_#102a22_100%)] bg-transparent border-b border-b-[#315144] flex items-center z-30 gap-2.5 md:px-6 md:h-17 md:gap-7.5 lg:h-19 xl:px-8.5"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-[17px] font-[760] tracking-[-0.8px] whitespace-nowrap xs:text-lg md:gap-[11px] md:text-[19px] xl:text-[21px]"
        :aria-label="config.brand.name"
        ><span
          class="h-[29px] w-[29px] rounded-lg grid place-items-center bg-lime text-[#193c2b] md:h-[35px] md:w-[35px] md:rounded-[10px]"
          ><AppIcon name="boost" :size="24" /></span
        ><span
          >{{ config.brand.shortName
          }}<span
            class="font-normal text-[#a3c3b1] tracking-[-0.4px] ml-[3px] text-sm xs:text-[15px] md:ml-1 md:text-[length:inherit]"
            >{{ config.brand.suffix }}</span
          ></span
        ></NuxtLink
      >
      <div
        class="absolute left-1/2 -translate-x-1/2 hidden items-center gap-[9px] text-[#a2c0af] text-[13px] lg:flex"
      >
        <span
          class="w-1.5 h-1.5 bg-mint rounded-full inline-block shadow-[0_0_8px_#45dbac38] shrink-0"
        />
        Archivio e statistiche
      </div>
      <NuxtLink
        to="/management"
        class="px-2.5 py-2 border border-[#446052] ml-auto flex items-center gap-2 rounded-[7px] text-[#c8d8cf] text-[13px] min-h-9 md:px-[13px] md:py-[9px] md:min-h-10 hover:border-[#6eaa88] hover:bg-[#294b3a]"
        aria-label="Management"
        ><AppIcon :name="session?.admin ? 'settings' : 'lock'" :size="16" /><span
          class="hidden md:inline"
          >Management</span
        ></NuxtLink
      >
    </header>
    <aside
      class="px-3 fixed left-0 top-19 bottom-0 w-[195px] bg-[#141c17] border-r border-r-[#28382d] pt-9.5 pb-5 hidden flex-col z-20 lg:flex xl:px-4.5 xl:w-56"
      aria-label="Navigazione principale"
    >
      <div class="mx-4 text-[10px] tracking-[1.6px] text-[#667b6c] mt-0 mb-3.5 font-[650]">
        ESPLORA
      </div>
      <nav>
        <NuxtLink
          class="px-[15px] py-3.5 flex items-center gap-3 text-[#99a99d] rounded-[7px] text-sm mb-[5px] transition-colors duration-150 aria-[current=page]:bg-[#21392c] aria-[current=page]:text-[#69dfae] hover:bg-[#24372a] hover:text-[#d1e7d7]"
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          ><AppIcon :name="item.icon" /><span>{{ item.name }}</span
          ><span v-if="route.path === item.to" class="w-[5px] h-[5px] bg-mint rounded-full ml-auto"
        /></NuxtLink>
      </nav>
      <div class="mx-3.5 my-[25px] h-[1px] bg-[#2b382e]" />
      <div class="mx-4 text-[10px] tracking-[1.6px] text-[#667b6c] mt-0 mb-3.5 font-[650]">
        IL PROGETTO
      </div>
      <NuxtLink
        class="px-[15px] py-3.5 flex items-center gap-3 text-[#99a99d] rounded-[7px] text-sm mb-[5px] transition-colors duration-150 aria-[current=page]:bg-[#21392c] aria-[current=page]:text-[#69dfae] hover:bg-[#24372a] hover:text-[#d1e7d7]"
        to="/management"
        :aria-current="route.path.startsWith('/management') ? 'page' : undefined"
        ><AppIcon name="settings" /><span>Management</span></NuxtLink
      >
      <div class="px-4 mt-auto pt-10 pb-1.5">
        <div class="text-[#557961] mb-4"><AppIcon name="boost" :size="28" /></div>
        <strong class="text-[13px] text-[#b4c2b8] font-medium">Ogni quota, nel tempo.</strong>
        <p class="text-xs leading-[1.7] text-[#74877a] mt-2">
          Lo storico delle superquote<br />in un unico posto.
        </p>
        <span
          class="block border-t border-t-[#2a362d] mt-6.5 pt-[19px] text-[10px] leading-[1.6] text-[#65756a]"
          >Progetto indipendente da bet365</span
        >
      </div>
    </aside>
    <main
      id="main"
      class="px-3.5 mx-0 mt-16 mb-0 pt-5.5 pb-19.5 max-w-442.5 min-h-[calc(100vh_-_76px)] xs:px-4.5 md:px-6.5 md:mt-17 md:pt-7.5 md:pb-[75px] lg:px-[25px] lg:mt-19 lg:ml-[195px] lg:pt-8.5 lg:pb-0 xl:px-10 xl:ml-56 2xl:px-[55px]"
    >
      <NuxtPage />
      <footer
        class="px-0 flex justify-between gap-2 mt-7.5 pt-5 pb-5.5 border-t border-t-[#29372d] text-[10px] text-[#627e6c] flex-col leading-[1.6] md:gap-3 md:pt-5.5 md:flex-row md:leading-[inherit] lg:mt-9.5"
      >
        <span class="first:text-[#8d9f93]">{{ config.brand.name }}</span
        ><span class="first:text-[#8d9f93]"
          >Risultati storici · Simulazioni teoriche a puntata fissa</span
        >
      </footer>
    </main>
    <nav
      class="px-3 flex fixed bottom-0 left-0 right-0 z-35 border-t border-t-[#40583e] bg-[#14251df2] backdrop-blur-[14px] pt-[7px] pb-[calc(7px_+_env(safe-area-inset-bottom))] justify-around lg:hidden lg:pl-0 lg:justify-normal"
      aria-label="Navigazione mobile"
    >
      <NuxtLink
        class="flex flex-col items-center gap-[5px] min-h-[49px] justify-center flex-1 text-[10px] text-[#8da696] relative lg:inline lg:flex-row lg:gap-[normal] lg:justify-normal lg:flex-initial lg:text-[length:inherit] aria-[current=page]:text-[#8de4b7] aria-[current=page]:before:content-[''] aria-[current=page]:before:absolute aria-[current=page]:before:w-5.5 aria-[current=page]:before:h-0.5 aria-[current=page]:before:bg-[#8de4b7] aria-[current=page]:before:top-[-7px] aria-[current=page]:before:rounded-[0_0_3px_3px] lg:aria-[current=page]:before:content-[''] lg:aria-[current=page]:before:w-auto"
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :aria-current="route.path === item.to ? 'page' : undefined"
        ><AppIcon :name="item.icon" :size="21" /><span>{{ item.name }}</span></NuxtLink
      >
    </nav>
  </div>
</template>
