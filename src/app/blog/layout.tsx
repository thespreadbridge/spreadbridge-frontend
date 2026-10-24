import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="site-shell insights-page"><PublicHeader />{children}<SiteFooter /></div>;
}
