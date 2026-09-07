const publicPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/simulator', priority: '0.8', changefreq: 'weekly' },
  { path: '/archive', priority: '0.9', changefreq: 'daily' },
]

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    }
    return entities[character]!
  })
}

export default defineEventHandler((event) => {
  const origin = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')
  const urls = publicPages
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${escapeXml(`${origin}${path}`)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
