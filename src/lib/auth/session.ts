import { cache } from 'react';
import { cookies } from 'next/headers';
import { backend } from './backend';
import { ACCESS_COOKIE } from './cookies';
import { guestSession, type SiteSession } from './types';

export async function resolveSession(accessToken?: string): Promise<SiteSession> {
  if (!accessToken) return guestSession;
  const headers = { Authorization: `Bearer ${accessToken}` };
  try {
    const response = await backend('/auth/me', { headers });
    if (response.status === 401) return { status: 'refresh_required', user: null, subscription: null };
    if (!response.ok) throw new Error('Account unavailable');
    const member = await response.json();
    if (typeof member.userId !== 'string' || typeof member.email !== 'string') throw new Error('Invalid account');
    const [subscriptionResponse, profileResponse] = await Promise.all([
      backend('/subscriptions/current', { headers }), backend('/auth/profile', { headers }),
    ]);
    if (subscriptionResponse.status === 401 || profileResponse.status === 401) return { status: 'refresh_required', user: null, subscription: null };
    const profile = profileResponse.ok ? await profileResponse.json() : null;
    const raw = subscriptionResponse.ok ? await subscriptionResponse.json() : null;
    const subscription = raw && typeof raw.active === 'boolean' ? {
      active: raw.active && (!raw.expiresAt || Date.parse(raw.expiresAt) > Date.now()),
      planName: typeof raw.planName === 'string' ? raw.planName : null,
      maxActiveSlots: typeof raw.maxActiveSlots === 'number' && Number.isInteger(raw.maxActiveSlots) ? Math.max(0, raw.maxActiveSlots) : 0,
      expiresAt: typeof raw.expiresAt === 'string' ? raw.expiresAt : null,
      testData: raw.testData === true,
    } : null;
    return { status: 'authenticated', user: {
      userId: member.userId, email: member.email,
      displayName: typeof profile?.display_name === 'string' && profile.display_name.trim() ? profile.display_name : member.email.split('@')[0],
      role: member.role, emailVerified: member.emailVerified === true, customerStatus: member.customerStatus,
    }, subscription };
  } catch { return { status: 'unavailable', user: null, subscription: null }; }
}
export const serverSession = cache(async () => resolveSession((await cookies()).get(ACCESS_COOKIE)?.value));
