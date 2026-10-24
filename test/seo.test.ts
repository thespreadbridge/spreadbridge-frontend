import { describe, expect, it } from 'vitest';
import { PUBLIC_PAGES, ACCOUNT_PAGE_TITLES, SITE_ORIGIN } from '@/lib/site-pages';
import { organizationSchema, pageTitles, publicPageMetadata, softwareSchema } from '@/lib/seo';
import { insights, insightPath, jsonLd } from '@/lib/insights';

describe('public search metadata', () => {
  it('gives each public page its own canonical, description and social preview', () => {
    for (const path of Object.keys(PUBLIC_PAGES)) {
      const meta = publicPageMetadata(path);
      expect(meta.alternates?.canonical).toBe(SITE_ORIGIN + path);
      expect(path.endsWith('/')).toBe(true);
      expect(meta.description?.length).toBeGreaterThan(20);
      expect(meta.openGraph).toMatchObject({ url: SITE_ORIGIN + path, locale: 'ko_KR', siteName: 'Spreadbridge' });
    }
    for (const path of Object.keys(ACCOUNT_PAGE_TITLES)) expect(PUBLIC_PAGES).not.toHaveProperty(path);
  });
  it('uses only public route titles for analytics and includes all published articles', () => {
    for (const post of insights) expect(pageTitles[insightPath(post.slug)]).toBe(post.title);
    expect(Object.values(pageTitles).every(title => !title.includes('@'))).toBe(true);
  });
  it('publishes truthful organization and software identity without invented ratings or sales', () => {
    expect(organizationSchema['@graph'][0]).toMatchObject({ '@type': 'Organization', name: 'Spreadbridge', alternateName: '스프레드브릿지' });
    expect(softwareSchema).toMatchObject({ '@type': 'SoftwareApplication', operatingSystem: 'Windows, macOS' });
    expect(softwareSchema).not.toHaveProperty('aggregateRating');
    expect(softwareSchema).not.toHaveProperty('offers');
    expect(jsonLd({ value: '</script>' })).not.toContain('</script>');
  });
});
