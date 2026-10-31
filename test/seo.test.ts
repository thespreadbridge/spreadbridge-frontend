import { describe, expect, it } from 'vitest';
import { PUBLIC_PAGES, ACCOUNT_PAGE_TITLES, SITE_ORIGIN } from '@/lib/site-pages';
import { organizationSchema, pageTitles, publicPageMetadata, softwareSchema, softwareSchemaForPlan } from '@/lib/seo';
import type { SubscriptionProduct } from '@/lib/subscription-catalog';
import { insights, insightPath, jsonLd } from '@/lib/insights';

describe('public search metadata', () => {
  it('gives each public page its own canonical, description and social preview', () => {
    for (const path of Object.keys(PUBLIC_PAGES)) {
      const meta = publicPageMetadata(path);
      expect(meta.alternates?.canonical).toBe(SITE_ORIGIN + path);
      expect(path.endsWith('/')).toBe(true);
      expect(meta.description?.length).toBeGreaterThan(20);
      expect(meta.robots).toMatchObject({ index: true, follow: true, 'max-image-preview': 'large' });
      expect(meta.openGraph).toMatchObject({ url: SITE_ORIGIN + path, locale: 'ko_KR', siteName: '스프레드브리지' });
    }
    for (const path of Object.keys(ACCOUNT_PAGE_TITLES)) expect(PUBLIC_PAGES).not.toHaveProperty(path);
  });
  it('includes the brand on article social previews', async () => {
    const { generateMetadata } = await import('@/app/blog/[slug]/page');
    const meta = await generateMetadata({ params: Promise.resolve({ slug: insights[0].slug }) });
    expect(meta.openGraph).toMatchObject({ siteName: '스프레드브리지' });
  });
  it('uses only public route titles for analytics and includes all published articles', () => {
    for (const post of insights) expect(pageTitles[insightPath(post.slug)]).toBe(post.title);
    expect(Object.values(pageTitles).every(title => !title.includes('@'))).toBe(true);
  });
  it('publishes truthful organization and software identity without invented ratings or sales', () => {
    expect(organizationSchema['@graph'][0]).toMatchObject({ '@type': 'Organization', name: '스프레드브리지', alternateName: 'Spreadbridge' });
    expect(softwareSchema).toMatchObject({ '@type': 'SoftwareApplication', operatingSystem: 'Windows, macOS' });
    expect(softwareSchema).not.toHaveProperty('aggregateRating');
    expect(softwareSchema).not.toHaveProperty('offers');
    expect(jsonLd({ value: '</script>' })).not.toContain('</script>');
  });
  it('only publishes an offer when the visible plan has a valid enabled monthly price', () => {
    const plan: SubscriptionProduct = { code: 'BASIC', name: '기본 요금제', slots: 5, monthly_krw: 12345, enabled: true, promotion_label: '', sort_order: 1 };
    expect(softwareSchemaForPlan(plan)).toMatchObject({ offers: {
      price: 12345, priceCurrency: 'KRW', url: SITE_ORIGIN + '/pricing/',
      priceSpecification: { price: 12345, billingDuration: 'P1M', valueAddedTaxIncluded: true },
    } });
    for (const invalid of [undefined, { ...plan, enabled: false }, { ...plan, monthly_krw: -1 }, { ...plan, monthly_krw: NaN }]) {
      expect(softwareSchemaForPlan(invalid)).not.toHaveProperty('offers');
    }
  });
});
