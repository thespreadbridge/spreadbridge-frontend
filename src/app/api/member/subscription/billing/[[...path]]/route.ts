import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, privateResponse } from "@/lib/auth/cookies";
import { backend } from "@/lib/auth/backend";
import { resolveSession } from "@/lib/auth/session";
import { sameOrigin } from "@/lib/auth/security";
import {
  parseBillingStatus,
  parseOperation,
} from "@/lib/subscription-checkout";
export const maxDuration = 90;
const reply = (body: unknown, status = 200) =>
  privateResponse(NextResponse.json(body, { status }));
type Context = { params: Promise<{ path?: string[] }> };
async function handle(request: NextRequest, context: Context) {
  const path = (await context.params).path?.join("/") ?? "";
  const read = request.method === "GET";
  if (
    read
      ? request.headers.get("sec-fetch-site") === "cross-site"
      : !sameOrigin(request)
  )
    return reply({ message: "요청 출처를 확인할 수 없습니다." }, 403);
  if (
    !(read
      ? path === "" || /^operations\/[0-9a-f-]{36}$/i.test(path)
      : ["setup", "authorizations", "orders", "cancellations"].includes(path))
  )
    return reply({ message: "요청 경로를 확인해 주세요." }, 404);
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const session = await resolveSession(token);
  if (session.status === "guest" || session.status === "refresh_required")
    return reply({ message: "다시 로그인해 주세요." }, 401);
  if (session.status !== "authenticated")
    return reply({ message: "계정 정보를 불러오지 못했습니다." }, 503);
  if (
    session.user.role !== "OWNER" ||
    !session.user.emailVerified ||
    session.user.customerStatus !== "ACTIVE"
  )
    return reply({ message: "인증된 계정 소유자만 이용할 수 있습니다." }, 403);
  let body: unknown;
  if (!read) {
    try {
      const text = await request.text();
      if (text.length > 4096)
        return reply({ message: "요청이 너무 큽니다." }, 400);
      body = JSON.parse(text);
    } catch {
      return reply({ message: "요청 내용을 확인해 주세요." }, 400);
    }
  }
  try {
    const response = await backend(
      `/subscriptions/billing${path ? "/" + path : ""}`,
      {
        method: request.method,
        headers: { Authorization: `Bearer ${token}` },
        ...(read ? {} : { body: JSON.stringify(body) }),
      },
      path === "authorizations" ? 70000 : 10000,
    );
    if (!response.ok) {
      const status = [400, 401, 403, 409].includes(response.status)
        ? response.status
        : 503;
      const message =
        status === 409
          ? "견적이 변경되었거나 처리 중인 요청이 있습니다. 새로고침 후 확인해 주세요. 기존 결제의 환불은 고객센터에 문의해 주세요."
          : status === 400
            ? "결제 구성과 카드 등록 상태를 확인해 주세요."
            : status === 401
              ? "다시 로그인해 주세요."
              : "요청을 처리하지 못했습니다. 잠시 후 다시 확인해 주세요.";
      return reply({ message }, status);
    }
    const raw: unknown = await response.json();
    if (read) {
      const value = path ? parseOperation(raw) : parseBillingStatus(raw);
      return value
        ? reply(value)
        : reply({ message: "처리 상태를 확인하지 못했습니다." }, 503);
    }
    if (path === "orders" || path === "cancellations") {
      const value = parseOperation(raw);
      return value
        ? reply(value, 202)
        : reply(
            {
              message:
                "처리 상태를 확인하지 못했습니다. 구독 관리에서 결과를 확인해 주세요.",
            },
            503,
          );
    }
    if (path === "authorizations")
      return reply({
        registered: (raw as { registered?: unknown })?.registered === true,
      });
    // Only public SDK setup data. Provider secrets never reach the browser.
    const value = raw as Record<string, unknown>;
    if (
      typeof value.clientKey !== "string" ||
      !/^(test|live)_ck_/.test(value.clientKey) ||
      typeof value.customerKey !== "string" ||
      typeof value.sessionId !== "string" ||
      typeof value.successUrl !== "string" ||
      typeof value.failUrl !== "string"
    )
      return reply({ message: "카드 등록을 시작하지 못했습니다." }, 503);
    return reply({
      clientKey: value.clientKey,
      customerKey: value.customerKey,
      sessionId: value.sessionId,
      successUrl: value.successUrl,
      failUrl: value.failUrl,
    });
  } catch {
    return reply(
      {
        message:
          "응답을 확인하지 못했습니다. 구독 관리에서 처리 상태를 확인해 주세요.",
      },
      503,
    );
  }
}
export const GET = handle;
export const POST = handle;
