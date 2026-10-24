import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '../styles/tokens.css';
import './globals.css';
import '../styles/site.css';
import '../components/home-v6/home-v6.css';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});
const mono = localFont({ src: '../fonts/GeistMono.woff2', variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://thespreadbridge.com'),
  title: { default: 'Spreadbridge | 비수탁 스프레드 차익거래 자동매매', template: '%s | Spreadbridge' },
  description: '두 시장의 가격 차이를, 고객님 계좌에서 직접 자동으로. 비수탁 스프레드 차익거래 자동매매 플랫폼 Spreadbridge.',
  verification: {
    other: { 'naver-site-verification': '193462cdf03f0035bac4c42074fb8c3591444cae' },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
