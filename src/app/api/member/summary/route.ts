import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';
import { homeView } from '@/lib/auth/types';
import { backend } from '@/lib/auth/backend';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const session = await resolveSession(token);
  if (session.status === 'guest' || session.status === 'refresh_required') return privateResponse(NextResponse.json({ error: 'Authentication required' }, { status: 401 }));
  if (session.status === 'unavailable' || !session.subscription) return privateResponse(NextResponse.json({ error: 'Account unavailable' }, { status: 503 }));
  if (homeView(session) !== 'paid') return privateResponse(NextResponse.json({ error: 'Active membership required' }, { status: 403 }));
  try {
    const result = await backend('/history/trades?month=all&limit=5&source=SPREADBRIDGE', { headers: { Authorization: `Bearer ${token}` } });
    if (!result.ok) return privateResponse(NextResponse.json({ error: 'History unavailable' }, { status: result.status === 401 ? 401 : 503 }));
    const data = await result.json();
    return privateResponse(NextResponse.json({ summary: data.summary, items: data.items }));
  } catch { return privateResponse(NextResponse.json({ error: 'History unavailable' }, { status: 503 })); }
}
