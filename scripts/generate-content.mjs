import { writeFile } from 'node:fs/promises';
import { PUBLIC_SITE_PATHS, PAGE_CONTENT_UPDATED_AT, SITE_CONTENT_UPDATED_AT, SITE_ORIGIN } from '../src/lib/site-pages.ts';

const entries = PUBLIC_SITE_PATHS.map(path => {
  const modified = PAGE_CONTENT_UPDATED_AT[path] ?? SITE_CONTENT_UPDATED_AT;
  return `  <url><loc>${SITE_ORIGIN}${path}</loc><lastmod>${modified}</lastmod></url>`;
});
await writeFile(new URL('../public/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`Generated sitemap (${entries.length} public URLs).`);
