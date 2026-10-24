export interface Member {
  userId: string;
  email: string;
  displayName: string;
  role: string;
  emailVerified: boolean;
  customerStatus: string;
}
export interface Membership {
  active: boolean;
  planName: string | null;
  maxActiveSlots: number;
  expiresAt: string | null;
  testData?: boolean;
}
export type SiteSession =
  | { status: 'guest' | 'refresh_required' | 'unavailable'; user: null; subscription: null }
  | { status: 'authenticated'; user: Member; subscription: Membership | null };
export const guestSession: SiteSession = { status: 'guest', user: null, subscription: null };
export function homeView(session: SiteSession): 'guest' | 'free' | 'paid' | 'pending' {
  if (session.status === 'refresh_required' || session.status === 'unavailable') return 'pending';
  if (session.status !== 'authenticated') return 'guest';
  if (!session.subscription) return 'pending';
  return session.subscription.active && session.user.emailVerified && session.user.customerStatus === 'ACTIVE' ? 'paid' : 'free';
}
