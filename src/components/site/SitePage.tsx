import Link from 'next/link';
import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { informationLinks } from '@/lib/information-links';

export type SitePageProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  updatedAt?: string;
  dateLabel?: string;
  width?: 'document' | 'wide';
  policyNavigation?: boolean;
};

export function SitePage({ title, eyebrow, description, children, updatedAt, dateLabel = '최종 작성일', width = 'document', policyNavigation = false }: SitePageProps) {
  return <div className="site-shell">
    <PublicHeader />
    <main className={`site-main ${width}`} id="content">
      <Link href="/" className="site-back">← 홈페이지로</Link>
      <header className="site-page-heading">
        <p className="site-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="site-description">{description}</p>
        {updatedAt ? <p className="site-date">{dateLabel} <time dateTime={updatedAt}>{updatedAt.replaceAll('-', '.')}</time></p> : null}
      </header>
      {policyNavigation ? <nav className="site-policy-nav" aria-label="공지 및 정책">
        {informationLinks.map(link => <Link key={link.href} href={link.href} aria-current={link.label === title ? 'page' : undefined}>{link.label}</Link>)}
      </nav> : null}
      <div className="site-prose">{children}</div>
    </main>
    <SiteFooter />
  </div>;
}
