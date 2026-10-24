import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { backend } from '@/lib/auth/backend';
import { sameOrigin } from '@/lib/auth/security';
import { resolveSession } from '@/lib/auth/session';
import { parseQuote, validConfig } from '@/lib/subscription-billing';

const reply = (body: unknown, status = 200) => privateResponse(NextResponse.json(body, { status }));

// Only the account owner with a verified, active account may change what the next renewal bills.
async function authorize(request: NextRequest) {
  if (!sameOrigin(request)) return { error: reply({ error: 'Invalid origin' }, 403) };
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const session = await resolveSession(token);
  if (session.status === 'guest' || session.status === 'refresh_required') return { error: reply({ error: 'Authentication required' }, 401) };
  if (session.status !== 'authenticated') return { error: reply({ error: 'Account unavailable' }, 503) };
  if (session.user.role !== 'OWNER' || !session.user.emailVerified || session.user.customerStatus !== 'ACTIVE') return { error: reply({ error: 'Not permitted' }, 403) };
  return { token: token as string };
}

/** Schedules a downgrade for the next billing date. The current cycle keeps its slots and nothing is refunded. */
export async function PUT(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return reply({ error: 'Invalid request' }, 400); }
  const config = validConfig(body?.baseCode, body?.addonSlots);
  if (!config) return reply({ error: 'Invalid plan' }, 400);
  try {
    const result = await backend('/subscriptions/scheduled-change', { method: 'PUT', headers: { Authorization: `Bearer ${auth.token}` }, body: JSON.stringify(config) });
    if (result.status === 400) return reply({ error: 'Only a lower configuration can be scheduled' }, 400);
    if (!result.ok) return reply({ error: 'Change unavailable' }, result.status === 401 ? 401 : 503);
    const quote = parseQuote(await result.json());
    return quote ? reply(quote) : reply({ error: 'Change unavailable' }, 503);
  } catch { return reply({ error: 'Change unavailable' }, 503); }
}

export async function DELETE(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;
  try {
    const result = await backend('/subscriptions/scheduled-change', { method: 'DELETE', headers: { Authorization: `Bearer ${auth.token}` }, body: '{}' });
    if (!result.ok) return reply({ error: 'Change unavailable' }, result.status === 401 ? 401 : 503);
    const data: unknown = await result.json();
    return reply({ cancelled: (data as { cancelled?: unknown })?.cancelled === true });
  } catch { return reply({ error: 'Change unavailable' }, 503); }
}
