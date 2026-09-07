export default defineEventHandler((event) => {
  const origin = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return `User-agent: *
Allow: /
Disallow: /management
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`
})
