import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    demoMode:
      process.env.NUXT_DEMO_MODE === 'true' ||
      (!process.env.NUXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV !== 'production'),
    public: {
      supabaseUrl: '',
      supabasePublishableKey: '',
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://bet365-superquota.netlify.app'
          : 'http://localhost:3000'),
      googleAnalyticsId: '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      title: 'Superquota Tracker',
      meta: [
        {
          name: 'description',
          content:
            'Archivio delle superquote bet365, statistiche e simulazione del rendimento storico a puntata fissa.',
        },
        { name: 'theme-color', content: '#102d26' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  routeRules: {
    '/archivio': { redirect: { to: '/archive', statusCode: 301 } },
    '/simulatore': { redirect: { to: '/simulator', statusCode: 301 } },
    '/gestione': { redirect: { to: '/management', statusCode: 301 } },
    '/api/admin/**': { headers: { 'cache-control': 'no-store' } },
    '/api/auth/**': { headers: { 'cache-control': 'no-store' } },
  },
  typescript: { strict: true },
})
