import { readFile, writeFile } from 'node:fs/promises';
import { PUBLIC_PAGES, SITE_CONTENT_UPDATED_AT, SITE_ORIGIN } from '../src/lib/site-pages.ts';
const origin = SITE_ORIGIN;
const { posts } = JSON.parse(await readFile(new URL('../src/content/insights.json', import.meta.url), 'utf8'));
const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const paths = Object.keys(PUBLIC_PAGES);
const latest = posts.reduce((date, post) => post.updatedAt > date ? post.updatedAt : date, posts[0].updatedAt);
const sitemapEntries = paths.map((path) => ({ url: origin + path, modified: path === '/blog/' && latest > SITE_CONTENT_UPDATED_AT ? latest : SITE_CONTENT_UPDATED_AT })).concat(posts.map((post) => ({ url: `${origin}/blog/${post.slug}/`, modified: post.updatedAt })));
await writeFile(new URL('../public/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map(({ url, modified }) => `  <url><loc>${xml(url)}</loc>${modified ? `<lastmod>${xml(modified)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
const items = posts.map((post) => {
  const url = `${origin}/blog/${post.slug}/`;
  return `    <item><title>${xml(post.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`;
});
await writeFile(new URL('../public/feed.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>\n  <title>Spreadbridge 블로그</title><link>${origin}/blog/</link><description>테더·달러선물 스프레드의 원리와 운영 가이드</description><language>ko-KR</language><lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate><atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml"/>\n${items.join('\n')}\n</channel></rss>\n`);
console.log(`Generated sitemap (${sitemapEntries.length} URLs) and RSS (${posts.length} articles).`);
