import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { backend } from '@/lib/auth/backend';
import { isRaceSymbol, type RaceBucket, type RaceSummary } from '@/lib/race';

const integer = (value: unknown) => typeof value === 'number' && Number.isInteger(value) ? value : 0;
const rank = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
const text = (value: unknown) => typeof value === 'string' ? value : null;

// Only the anonymous aggregate fields reach the browser, whatever the backend adds later.
function pickSummary(raw: unknown, symbol: string): RaceSummary {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const buckets: RaceBucket[] = Array.isArray(data.buckets) ? data.buckets.flatMap(entry => {
    const bucket = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
    return Number.isInteger(bucket.lower) ? [{ lower: bucket.lower as number, people: integer(bucket.people), slots: integer(bucket.slots), previousPeopleRank: rank(bucket.previousPeopleRank), previousSlotsRank: rank(bucket.previousSlotsRank) }] : [];
  }) : [];
  return {
    symbol, shared: data.shared === true,
    months: Array.isArray(data.months) ? data.months.filter((month): month is string => typeof month === 'string' && isRaceSymbol(month)) : [],
    people: integer(data.people), slots: integer(data.slots), buckets,
    comparisonAt: text(data.comparisonAt), updatedAt: text(data.updatedAt) ?? new Date().toISOString(),
  };
}

// The backend validates the bearer token itself, so this route forwards it without
// resolving the whole member profile on every poll.
export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') ?? '';
  if (!isRaceSymbol(symbol)) return privateResponse(NextResponse.json({ error: 'Invalid symbol' }, { status: 400 }));
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return privateResponse(NextResponse.json({ error: 'Authentication required' }, { status: 401 }));
  try {
    const result = await backend(`/desktop/entry-race?symbol=${encodeURIComponent(symbol)}`, { headers: { Authorization: `Bearer ${token}` } });
    if (result.status === 401 || result.status === 403) return privateResponse(NextResponse.json({ error: 'Not permitted' }, { status: result.status }));
    if (!result.ok) return privateResponse(NextResponse.json({ error: 'Race unavailable' }, { status: 503 }));
    return privateResponse(NextResponse.json(pickSummary(await result.json(), symbol)));
  } catch { return privateResponse(NextResponse.json({ error: 'Race unavailable' }, { status: 503 })); }
}
