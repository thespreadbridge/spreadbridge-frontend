import { publicPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { BlogStart } from '@/components/blog/BlogStart';
import { insightCategories, insightPath, insights, jsonLd, siteOrigin } from '@/lib/insights';

export const metadata: Metadata = {
  ...publicPageMetadata('/blog/'),
  alternates: { canonical: siteOrigin + '/blog/', types: { 'application/rss+xml': siteOrigin + '/feed.xml' } },
};

export default function BlogIndex() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: '스프레드브리지 블로그', url: `${siteOrigin}/blog/`,
    mainEntity: { '@type': 'ItemList', itemListElement: insights.map((post, index) => ({ '@type': 'ListItem', position: index + 1, name: post.title, url: `${siteOrigin}${insightPath(post.slug)}` })) },
  };
  return (
    <>
      <main className="site-container insight-index">
        <header className="insight-index-heading">
          <span className="insight-kicker">SPREADBRIDGE BLOG</span>
          <h1>원리부터 운용까지,<br /><em>스프레드브리지 블로그</em></h1>
          <p>스프레드 거래의 기본 원리와 계좌 준비,<br className="insight-desktop-break" /> 앱 설정 및 운용 정보를 안내합니다.</p>
          <div className="insight-index-meta"><span>{insightCategories.length}개 주제</span><span>{insights.length}편의 글</span><Link href="/feed.xml">RSS 구독 ↗</Link></div>
        </header>
        <nav className="insight-category-nav" aria-label="블로그 주제">
          {insightCategories.map((category, index) => <a key={category.id} href={`#${category.id}`}><span>0{index + 1}</span>{category.name}</a>)}
        </nav>
        {insightCategories.map((category, index) => (
          <section key={category.id} id={category.id} className="insight-series" aria-labelledby={`${category.id}-title`}>
            <div className="insight-series-heading"><span className="insight-kicker">주제 0{index + 1}</span><h2 id={`${category.id}-title`}>{category.name}</h2><p>{category.description}</p></div>
            <div className="insight-card-grid">{insights.filter((post) => post.category === category.id).map((post) => <ArticleCard key={post.id} post={post} />)}</div>
          </section>
        ))}
        <BlogStart />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </>
  );
}
