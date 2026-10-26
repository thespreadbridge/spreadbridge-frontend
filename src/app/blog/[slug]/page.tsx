import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { BlogStart } from '@/components/blog/BlogStart';
import { formatArticleDate, getInsight, insightCategories, insightPath, insights, jsonLd, siteOrigin } from '@/lib/insights';

export const dynamicParams = false;
export function generateStaticParams() { return insights.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getInsight((await params).slug);
  if (!post) notFound();
  const url = `${siteOrigin}${insightPath(post.slug)}`;
  return {
    title: post.title, description: post.description, alternates: { canonical: url },
    authors: [{ name: '스프레드브리지', url: `${siteOrigin}/blog/` }],
    openGraph: { title: post.title, description: post.description, url, type: 'article', locale: 'ko_KR', publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: ['스프레드브리지'], images: [{ url: `${siteOrigin}/images/insights-cover.png`, width: 1200, height: 630, alt: '스프레드브리지 인사이트' }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [`${siteOrigin}/images/insights-cover.png`] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getInsight((await params).slug);
  if (!post) notFound();
  const category = insightCategories.find((item) => item.id === post.category)!;
  const related = post.relatedIds.map((id) => insights.find((item) => item.id === id)!).filter(Boolean);
  const url = `${siteOrigin}${insightPath(post.slug)}`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.title, description: post.description, url, mainEntityOfPage: url, datePublished: post.publishedAt, dateModified: post.updatedAt, inLanguage: 'ko-KR', articleSection: category.name, author: { '@type': 'Organization', name: '스프레드브리지', url: `${siteOrigin}/blog/` }, publisher: { '@type': 'Organization', name: '스프레드브리지', url: siteOrigin }, image: `${siteOrigin}/images/insights-cover.png`, citation: post.sources.map((source) => new URL(source.url, siteOrigin).href) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: `${siteOrigin}/` }, { '@type': 'ListItem', position: 2, name: '블로그', item: `${siteOrigin}/blog/` }, { '@type': 'ListItem', position: 3, name: post.title, item: url }] },
    ],
  };
  return (
    <>
      <main className="site-container insight-article-layout">
        <article className="insight-article">
          <nav className="insight-breadcrumb" aria-label="탐색 경로"><Link href="/">홈</Link><span aria-hidden="true">/</span><Link href="/blog/">블로그</Link><span aria-hidden="true">/</span><Link href={`/blog/#${category.id}`}>{category.name}</Link></nav>
          <header className="insight-article-heading">
            <Link className="insight-kicker" href={`/blog/#${category.id}`}>{category.name} · {String(post.id).padStart(2, '0')}</Link>
            <h1>{post.title}</h1><p className="insight-description">{post.description}</p>
            <div className="insight-byline"><Link href="/blog/">스프레드브리지</Link><time dateTime={post.publishedAt}>{formatArticleDate(post.publishedAt)}</time><span>{post.readingMinutes}분 읽기</span></div>
          </header>
          <details className="insight-toc" open><summary>목차</summary><ol>{post.toc.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></details>
          {/* Reviewed local content, restricted to article markup at import. No draft scripts or controls. */}
          <div className="insight-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          <section className="insight-sources" aria-labelledby="sources-title"><h2 id="sources-title">참고 자료</h2><p>상품·기관 안내는 2026년 10월 24일 기준으로 확인했습니다. 실제 거래에는 각 기관의 최신 조건이 적용됩니다.</p><ul>{post.sources.map((source) => <li key={source.url}><a href={source.url} target={source.url.startsWith('https://') ? '_blank' : undefined} rel={source.url.startsWith('https://') ? 'noopener noreferrer' : undefined}>{source.title}<span aria-hidden="true"> ↗</span></a></li>)}</ul></section>
          <p className="insight-editorial-note">이 글은 거래 구조와 운용을 이해하기 위한 자료입니다. 예시 수치는 실제 시세나 수익률이 아니며, 특정 조건의 거래를 권유하지 않습니다. 실제 기능과 표시 항목은 설치한 앱 버전에서 확인하세요.</p>
          <BlogStart />
        </article>
        <aside className="insight-related" aria-labelledby="related-title"><div className="insight-series-heading"><h2 id="related-title">관련 글</h2><Link href="/blog/">전체 글 보기 →</Link></div><div className="insight-card-grid">{related.map((item) => <ArticleCard key={item.id} post={item} />)}</div></aside>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </>
  );
}
