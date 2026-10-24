import { HomeContent } from '@/components/home-v6/HomeContent';
import { HomeExperience } from '@/components/home-v6/HomeExperience';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  // Existing API loopback OAuth returns to '/', then immediately finishes in our protected callback route.
  if (typeof params.state === 'string' && (typeof params.code === 'string' || typeof params.error === 'string')) {
    const query = new URLSearchParams({ state: params.state });
    if (typeof params.code === 'string') query.set('code', params.code);
    if (typeof params.error === 'string') query.set('error', params.error);
    redirect(`/api/session/google/callback/?${query}`);
  }
  return <HomeExperience><HomeContent /></HomeExperience>;
}

export const metadata = {
  title: { absolute: 'Spreadbridge — 달러 격차를 자동으로' },
  description: '달러의 가격 격차를 자동으로 다루는 매매 소프트웨어. Spreadbridge 홈페이지 v6 시안.',
  alternates: { canonical: 'https://thespreadbridge.com/' },
  robots: { index: false, follow: false },
};
