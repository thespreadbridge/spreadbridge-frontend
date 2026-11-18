import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';
import { subscriberAccessStatus } from '@/lib/auth/access';
import { insightPath, insights, siteOrigin } from '@/lib/insights';

const xml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export async function GET(request: NextRequest) {
  const status = subscriberAccessStatus(await resolveSession(request.cookies.get(ACCESS_COOKIE)?.value));
  if (status !== 200) return privateResponse(new NextResponse(null, { status }));
  const latest = insights.reduce((date, post) => post.updatedAt > date ? post.updatedAt : date, insights[0].updatedAt);
  const items = insights.map(post => {
    const url = xml(siteOrigin + insightPath(post.slug));
    return `<item><title>${xml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>스프레드브리지 블로그</title><link>${siteOrigin}/blog/</link><description>테더·달러선물 스프레드의 원리와 운용 가이드</description><language>ko-KR</language>
  <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate><atom:link href="${siteOrigin}/feed.xml" rel="self" type="application/rss+xml"/>
  ${items.join('\n  ')}
</channel></rss>`;
  return privateResponse(new NextResponse(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }));
}
