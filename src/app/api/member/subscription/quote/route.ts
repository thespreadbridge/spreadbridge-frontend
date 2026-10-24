import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { backend } from '@/lib/auth/backend';
import { parseQuote, validConfig } from '@/lib/subscription-billing';

const reply = (body: unknown, status = 200) => privateResponse(NextResponse.json(body, { status }));

// Price of changing to a configuration. The API computes it from the amount actually paid this cycle.
export async function GET(request: NextRequest) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Invalid origin' }, 403);
  const config = validConfig(request.nextUrl.searchParams.get('baseCode'), request.nextUrl.searchParams.get('addonSlots'));
  if (!config) return reply({ error: 'Invalid plan' }, 400);
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return reply({ error: 'Authentication required' }, 401);
  try {
    const query = new URLSearchParams({ baseCode: config.baseCode, addonSlots: String(config.addonSlots) });
    const result = await backend(`/subscriptions/change-quote?${query}`, { headers: { Authorization: `Bearer ${token}` } });
    if (result.status === 401) return reply({ error: 'Authentication required' }, 401);
    if (result.status === 400) return reply({ error: 'Plan unavailable' }, 400);
    if (!result.ok) return reply({ error: 'Quote unavailable' }, 503);
    const quote = parseQuote(await result.json());
    return quote ? reply(quote) : reply({ error: 'Quote unavailable' }, 503);
  } catch { return reply({ error: 'Quote unavailable' }, 503); }
}
