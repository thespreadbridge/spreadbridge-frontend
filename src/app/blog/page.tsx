import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { insightCategories, insightPath, insights, jsonLd, siteOrigin } from '@/lib/insights';

export const metadata: Metadata = {
  title: '인사이트 | 테더·달러선물 스프레드 가이드',
  description: 'USDT와 미국달러선물의 원리부터 계좌 준비, 슬롯 설정, 체결·증거금·만기 관리까지. Spreadbridge의 4개 시리즈, 14편을 읽어보세요.',
  alternates: { canonical: `${siteOrigin}/blog/`, types: { 'application/rss+xml': `${siteOrigin}/feed.xml` } },
  openGraph: { title: 'Spreadbridge 인사이트', description: '두 시장의 차이를 이해하고, 거래의 과정을 살펴봅니다.', url: `${siteOrigin}/blog/`, type: 'website', locale: 'ko_KR', images: [{ url: `${siteOrigin}/images/insights-cover.png`, width: 1200, height: 630, alt: 'Spreadbridge 인사이트' }] },
};

export default function BlogIndex() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Spreadbridge 인사이트', url: `${siteOrigin}/blog/`,
    mainEntity: { '@type': 'ItemList', itemListElement: insights.map((post, index) => ({ '@type': 'ListItem', position: index + 1, name: post.title, url: `${siteOrigin}${insightPath(post.slug)}` })) },
  };
  return (
    <div className="insights-page">
      <PublicHeader />
      <main className="shell insight-index">
        <header className="insight-index-heading">
          <span className="insight-kicker">SPREADBRIDGE INSIGHTS</span>
          <h1>두 시장의 차이를,<br /><em>이해하는 것부터.</em></h1>
          <p>원리부터 시작 준비, 설정과 운영까지.<br className="insight-desktop-break" /> 필요한 주제를 골라 읽고, 내 거래의 기준을 세워보세요.</p>
          <div className="insight-index-meta"><span>4개 시리즈</span><span>14편의 글</span><Link href="/feed.xml">RSS 구독 ↗</Link></div>
        </header>
        <nav className="insight-category-nav" aria-label="인사이트 시리즈">
          {insightCategories.map((category, index) => <a key={category.id} href={`#${category.id}`}><span>0{index + 1}</span>{category.name}</a>)}
        </nav>
        {insightCategories.map((category, index) => (
          <section key={category.id} id={category.id} className="insight-series" aria-labelledby={`${category.id}-title`}>
            <div className="insight-series-heading"><span className="insight-kicker">SERIES 0{index + 1}</span><h2 id={`${category.id}-title`}>{category.name}</h2><p>{category.description}</p></div>
            <div className="insight-card-grid">{insights.filter((post) => post.category === category.id).map((post) => <ArticleCard key={post.id} post={post} />)}</div>
          </section>
        ))}
        <section className="insight-next-step"><div><span className="insight-kicker">NEXT STEP</span><h2>이해했다면, 준비를 시작해 보세요.</h2><p>연결 준비를 확인하고 내 운영 환경에 맞는 앱을 설치하세요.</p></div><div><Link href="/guide/" className="button">시작 가이드</Link><Link href="/download/" className="button button-blue">앱 다운로드</Link></div></section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </div>
  );
}
