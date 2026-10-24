import { HomeContent } from '@/components/home-v6/HomeContent';
import { HomePreview } from '@/components/home-v6/HomePreview';
import '@/components/home-v6/home-v6.css';

export default function Home() {
  return <HomePreview><HomeContent /></HomePreview>;
}

export const metadata = {
  title: { absolute: 'Spreadbridge — 달러 격차를 자동으로' },
  description: '달러의 가격 격차를 자동으로 다루는 매매 소프트웨어. Spreadbridge 홈페이지 v6 시안.',
  alternates: { canonical: 'https://thespreadbridge.com/' },
  robots: { index: false, follow: false },
};
