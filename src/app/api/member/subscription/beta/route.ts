import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { backend } from '@/lib/auth/backend';
import { sameOrigin } from '@/lib/auth/security';

const reply = (body: unknown, status = 200) => privateResponse(NextResponse.json(body, { status }));

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reply({ message: '허용되지 않은 요청입니다.' }, 403);
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return reply({ message: '로그인해 주세요.' }, 401);
  try {
    const response = await backend('/subscriptions/beta', {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: '{}',
    });
    if (response.status === 401) return reply({ message: '다시 로그인해 주세요.' }, 401);
    if (response.status === 403) return reply({ message: '인증된 계정 소유자만 베타에 가입할 수 있습니다.' }, 403);
    const result = await response.json();
    if (response.status === 409) {
      const message = result.message === '베타가 종료되었습니다.' ? result.message : '이미 이용 중인 구독이 있습니다.';
      return reply({ message }, 409);
    }
    if (response.ok && result.active === true && Number.isSafeInteger(result.maxActiveSlots)) {
      return reply({ active: true, maxActiveSlots: result.maxActiveSlots });
    }
  } catch { /* Return the same message for an unavailable API or an invalid response. */ }
  return reply({ message: '베타에 가입하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 503);
}
