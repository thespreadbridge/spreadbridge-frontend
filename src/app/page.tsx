import { HomeContent } from '@/components/home-v6/HomeContent';
import { HomeExperience } from '@/components/home-v6/HomeExperience';
import { redirect } from 'next/navigation';
import { publicPageMetadata } from '@/lib/seo';

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
  ...publicPageMetadata('/'),
  title: { absolute: '스프레드브리지 | 달러선물·USDT 스프레드 자동매매' },
  robots: { index: true, follow: true },
};
