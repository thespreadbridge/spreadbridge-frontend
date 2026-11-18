import { redirect } from 'next/navigation';
import { serverSession } from './session';
import { homeView, type SiteSession } from './types';

export async function requireSubscriberAccess() {
  const session = await serverSession();
  if (homeView(session) !== 'paid') {
    redirect(session.status === 'authenticated' ? '/download/' : '/');
  }
}

export function subscriberAccessStatus(session: SiteSession) {
  if (session.status === 'guest' || session.status === 'refresh_required') return 401;
  if (session.status === 'unavailable' || !session.subscription) return 503;
  return homeView(session) === 'paid' ? 200 : 403;
}
