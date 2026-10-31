import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ArticlePage, { generateMetadata } from '@/app/blog/[slug]/page';
import { insights } from '@/lib/insights';
import { tradeManagementNotice } from '@/lib/blog-notices';

describe('final blog publication', () => {
  it('shows the external-order warning once before the table of contents on articles 2–14', async () => {
    for (const post of insights) {
      const html = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ slug: post.slug }) }));
      expect(html.split(tradeManagementNotice.title).length - 1).toBe(post.id === 1 ? 0 : 1);
      if (post.id !== 1) {
        const warning = html.indexOf('class="insight-notice insight-trade-warning"');
        expect(warning).toBeGreaterThan(html.indexOf('</header>'));
        expect(warning).toBeLessThan(html.indexOf('class="insight-toc"'));
      }
      expect(html).not.toMatch(/이 위치에|제작 지시:|도표 처리:|글로 연결합니다|새로 단정하지|고정 증거금률이나 권장 자금 비율은 제시하지/);
    }
  });

  it('keeps live headings, source links and credential notices in the intended articles', () => {
    for (const post of insights) {
      const headings = [...post.bodyHtml.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
      expect(headings.map(([, id, title]) => ({ id, title }))).toEqual(post.toc);
      expect(post.sources.every(source => source.url.startsWith('https://'))).toBe(true);
      expect(post.bodyHtml.match(/class="insight-notice insight-credentials"/g)?.length ?? 0).toBe([5, 14].includes(post.id) ? 1 : 0);
      expect(post.bodyHtml).not.toMatch(/<svg|class="(?:more|recap|analogy)"/);
    }
    const setup = insights.find(post => post.id === 5)!.bodyHtml;
    expect(setup.indexOf('insight-credentials')).toBeGreaterThan(setup.indexOf('필요한 API 권한만 설정하세요'));
    expect(setup.indexOf('insight-credentials')).toBeLessThan(setup.indexOf('연결 후에는 조회 결과를 확인하세요'));
    const troubleshooting = insights.find(post => post.id === 14)!.bodyHtml;
    expect(troubleshooting.indexOf('insight-credentials')).toBeGreaterThan(troubleshooting.indexOf('인증정보 원문을 전달하지 마세요'));
    expect(insights.find(post => post.id === 10)!.bodyHtml).toContain('창을 닫는 것만으로는 앱이 완전히 종료되지 않습니다.');
  });

  it('uses each final title, introduction and preserved publication date in social metadata', async () => {
    for (const post of insights) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(meta).toMatchObject({ title: post.title, description: post.description });
      expect(meta.openGraph).toMatchObject({ title: post.title, description: post.description, publishedTime: post.publishedAt, modifiedTime: post.updatedAt });
      expect(meta.twitter).toMatchObject({ title: post.title, description: post.description });
    }
  });
});
