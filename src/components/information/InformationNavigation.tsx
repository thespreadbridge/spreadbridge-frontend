'use client';

import Link from 'next/link';
import { useSession } from '@/components/auth/SessionProvider';
import { homeView } from '@/lib/auth/types';
import { informationLinks, publicPolicyLinks } from '@/lib/information-links';

export function InformationNavigation({ title }: { title: string }) {
  const { session } = useSession();
  const links = homeView(session) === 'paid' ? informationLinks : publicPolicyLinks;
  return <nav className="site-policy-nav" aria-label="공지 및 정책">
    {links.map(link => <Link key={link.href} href={link.href} aria-current={link.label === title ? 'page' : undefined}>{link.label}</Link>)}
  </nav>;
}
