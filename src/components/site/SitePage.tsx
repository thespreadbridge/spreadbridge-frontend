import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';

export function SitePage({ title, eyebrow, description, children }: { title: string; eyebrow: string; description: string; children: ReactNode; width?: 'document' | 'wide' }) {
  return <div className="marketing-page"><PublicHeader /><main className="sb-account shell">
    <header className="simple-hero"><span className="eyebrow"><span /> {eyebrow}</span><h1>{title}</h1><p>{description}</p></header>
    <div className="account-content">{children}</div>
  </main><SiteFooter /></div>;
}
