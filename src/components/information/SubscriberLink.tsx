'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { homeView } from '@/lib/auth/types';

export function SubscriberLink({ href, children }: { href: string; children: ReactNode }) {
  const { session } = useSession();
  return homeView(session) === 'paid' ? <Link href={href}>{children}</Link> : <>{children}</>;
}
