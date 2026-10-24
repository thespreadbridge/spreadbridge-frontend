import type { Metadata } from 'next';
import { PUBLIC_PAGES, ACCOUNT_PAGE_TITLES, SITE_NAME, SITE_ORIGIN } from './site-pages';
import { insights, insightPath } from './insights';

export const pageTitles: Record<string, string> = {
  ...Object.fromEntries(Object.entries(PUBLIC_PAGES).map(([path, page]) => [path, page.title])),
  ...ACCOUNT_PAGE_TITLES,
  ...Object.fromEntries(insights.map(post => [insightPath(post.slug), post.title])),
};
export function publicPageMetadata(path: string): Metadata {
  const page = PUBLIC_PAGES[path];
  if (!page) throw new Error('Unknown public page');
  const url = SITE_ORIGIN + path;
  return {
    title: page.title, description: page.description, alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: page.title,
      description: page.description, url, images: [{ url: SITE_ORIGIN + '/images/spreadbridge-cover.png', width: 1200, height: 630, alt: 'Spreadbridge · 달러선물과 USDT 스프레드 자동매매' }] },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [SITE_ORIGIN + '/images/spreadbridge-cover.png'] },
  };
}
export const organizationSchema = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': SITE_ORIGIN + '/#organization', name: SITE_NAME, alternateName: '스프레드브릿지',
      url: SITE_ORIGIN + '/', logo: SITE_ORIGIN + '/images/spreadbridge-logo.png', email: 'contact@thespreadbridge.com' },
    { '@type': 'WebSite', '@id': SITE_ORIGIN + '/#website', name: SITE_NAME, alternateName: '스프레드브릿지',
      url: SITE_ORIGIN + '/', inLanguage: 'ko-KR', publisher: { '@id': SITE_ORIGIN + '/#organization' } },
  ],
};
export const softwareSchema = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: SITE_NAME, alternateName: '스프레드브릿지',
  url: SITE_ORIGIN + '/', description: PUBLIC_PAGES['/'].description, applicationCategory: 'FinanceApplication',
  operatingSystem: 'Windows, macOS', softwareHelp: SITE_ORIGIN + '/guide/',
  publisher: { '@id': SITE_ORIGIN + '/#organization' },
};
