export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.googleAnalyticsId.trim()
  if (import.meta.dev || !/^G-[A-Z0-9]+$/.test(id)) return

  useHead({
    script: [
      {
        key: 'google-analytics-library',
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        async: true,
      },
      {
        key: 'google-analytics-config',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{'allow_google_signals':false,'allow_ad_personalization_signals':false});`,
      },
    ],
  })
})
