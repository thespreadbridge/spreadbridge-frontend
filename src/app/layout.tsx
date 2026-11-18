import type { Metadata } from 'next';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { serverSession } from '@/lib/auth/session';
import { homeView } from '@/lib/auth/types';
import { PUBLIC_SITE_PATHS } from '@/lib/site-pages';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { Analytics } from '@/components/analytics/Analytics';
import { GA_MEASUREMENT_ID } from '@/lib/analytics-config';
import { organizationSchema, pageTitles, publicPageMetadata, publicRobots } from '@/lib/seo';
import { jsonLd } from '@/lib/insights';

import '../styles/tokens.css';
import './globals.css';
import '../styles/site.css';
import '../styles/insights.css';
import '../components/home-v6/home-v6.css';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});
const mono = localFont({ src: '../fonts/GeistMono.woff2', variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  ...publicPageMetadata('/'),
  metadataBase: new URL('https://thespreadbridge.com'),
  title: { default: '스프레드브리지 | 달러선물·USDT 스프레드 자동매매', template: '%s | 스프레드브리지' },
  applicationName: '스프레드브리지',
  robots: publicRobots,
  icons: { icon: '/icon.svg', apple: '/images/spreadbridge-logo.png' },
  verification: {
    other: { 'naver-site-verification': '193462cdf03f0035bac4c42074fb8c3591444cae' },
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await serverSession();
  const visibleTitles = homeView(session) === 'paid' ? pageTitles : Object.fromEntries(
    Object.entries(pageTitles).filter(([path]) => PUBLIC_SITE_PATHS.includes(path) || path === '/login/'
      || (session.status === 'authenticated' && ['/download/', '/payments/', '/payments/checkout/'].includes(path))),
  );
  return (
    <html lang="ko" data-scroll-behavior="smooth" className={`${pretendard.variable} ${mono.variable}`}>
      <body>
        <SessionProvider initialSession={session}>
          {children}
          <Suspense fallback={null}><Analytics measurementId={GA_MEASUREMENT_ID} pageTitles={visibleTitles} /></Suspense>
        </SessionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }} />
      </body>
    </html>
  );
}
