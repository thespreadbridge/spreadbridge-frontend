export interface BillingOperation {
  id: string;
  kind: "SUBSCRIBE" | "UPGRADE" | "RENEWAL" | "CANCEL";
  status: string;
  amount: number;
}
export interface BillingStatus {
  enabled: boolean;
  cardRegistered: boolean;
  cardLabel: string | null;
  renewalEnabled: boolean;
  nextBillingAt: string | null;
  latestOperation: BillingOperation | null;
}
const states = new Set([
  "PENDING",
  "PROCESSING",
  "PAID",
  "APPLIED",
  "REFUNDING",
  "REFUNDED",
  "RETRY",
  "FAILED",
  "EXPIRED",
  "REVIEW_REQUIRED",
]);
export const settled = (status: string) =>
  ["APPLIED", "REFUNDED", "FAILED", "EXPIRED", "REVIEW_REQUIRED"].includes(
    status,
  );
export function parseOperation(raw: unknown): BillingOperation | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return typeof o.id === "string" &&
    /^[0-9a-f-]{36}$/i.test(o.id) &&
    typeof o.kind === "string" &&
    ["SUBSCRIBE", "UPGRADE", "RENEWAL", "CANCEL"].includes(o.kind) &&
    typeof o.status === "string" &&
    states.has(o.status) &&
    typeof o.amount === "number" &&
    Number.isSafeInteger(o.amount) &&
    o.amount >= 0
    ? {
        id: o.id,
        kind: o.kind as BillingOperation["kind"],
        status: o.status,
        amount: o.amount,
      }
    : null;
}
export function parseBillingStatus(raw: unknown): BillingStatus | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (
    typeof b.enabled !== "boolean" ||
    typeof b.cardRegistered !== "boolean" ||
    typeof b.renewalEnabled !== "boolean"
  )
    return null;
  return {
    enabled: b.enabled,
    cardRegistered: b.cardRegistered,
    cardLabel: typeof b.cardLabel === "string" ? b.cardLabel : null,
    renewalEnabled: b.renewalEnabled,
    nextBillingAt:
      typeof b.nextBillingAt === "string" &&
      Number.isFinite(Date.parse(b.nextBillingAt))
        ? b.nextBillingAt
        : null,
    latestOperation: parseOperation(b.latestOperation),
  };
}
export async function billingRequest(path: string, body?: unknown) {
  const response = await fetch(`/api/member/subscription/billing/${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const value = await response.json();
  if (!response.ok)
    throw new Error(
      typeof value.message === "string"
        ? value.message
        : "요청을 처리하지 못했습니다. 잠시 후 다시 확인해 주세요.",
    );
  return value;
}
