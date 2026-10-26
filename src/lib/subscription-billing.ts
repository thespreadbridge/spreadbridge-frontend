/** Shapes of the member billing API (`/subscriptions/current|change-quote|cancellation-quote`). */
export interface PlanConfig { baseCode: string; addonSlots: number }
export interface CurrentBilling {
  baseCode: string; addonSlots: number; paidMonthlyKrw: number; cycleStart: string; periodEnd: string;
  renewal: (PlanConfig & { monthlyKrw: number | null }) | null;
  scheduledChange: (PlanConfig & { effectiveAt: string }) | null;
}
export type ChangeDirection = 'NEW' | 'UPGRADE' | 'DOWNGRADE' | 'NONE';
export interface ChangeQuote {
  quoteToken?: string;
  direction: ChangeDirection;
  target: { baseCode: string; baseName: string; addonSlots: number; totalSlots: number; monthlyKrw: number };
  current: { baseCode: string; baseName: string; addonSlots: number; totalSlots: number; paidMonthlyKrw: number } | null;
  removedAddonSlots: number; remainingDays: number | null; periodDays: number | null;
  chargeToday: number; nextMonthlyKrw: number; effectiveAt: string; nextBillingAt: string; quotedAt: string;
}
export const REFUND_POLICY_VERSION = 'PER_RECEIPT_KST_V1';
export interface RefundAllocation { receiptId: string; amount: number; periodStart: string; periodEnd: string; periodDays: number; remainingDays: number; refundableBalance: number; refundAmount: number }
export interface CancellationQuote {
  quoteToken?: string; processingStatus?: string; policyVersion: typeof REFUND_POLICY_VERSION; refundAmount: number; cancellationDate: string;
  unusedFrom: string; periodEnd: string; quotedAt: string; allocations: RefundAllocation[];
}

const MAX_ADDON = 3;
const obj = (v: unknown) => (v && typeof v === 'object' ? v as Record<string, unknown> : null);
const int = (v: unknown, min = 0) => (typeof v === 'number' && Number.isSafeInteger(v) && v >= min ? v : null);
const str = (v: unknown) => (typeof v === 'string' ? v : null);
const day = (v: unknown) => (typeof v === 'string' && Number.isFinite(Date.parse(v)) ? v : null);

export function validConfig(baseCode: unknown, addonSlots: unknown): PlanConfig | null {
  const addons = typeof addonSlots === 'string' && /^\d$/.test(addonSlots) ? Number(addonSlots) : addonSlots;
  return typeof baseCode === 'string' && /^[A-Z0-9_]{1,32}$/.test(baseCode) && typeof addons === 'number'
    && Number.isInteger(addons) && addons >= 0 && addons <= MAX_ADDON ? { baseCode, addonSlots: addons } : null;
}

function config(v: unknown): PlanConfig | null {
  const c = obj(v);
  return c ? validConfig(c.baseCode, c.addonSlots) : null;
}

export function parseBilling(raw: unknown): CurrentBilling | null {
  const b = obj(obj(raw)?.billing);
  const base = config(b);
  const paid = int(b?.paidMonthlyKrw, 1), cycleStart = day(b?.cycleStart), periodEnd = day(b?.periodEnd);
  if (!b || !base || paid === null || !cycleStart || !periodEnd) return null;
  const renewal = config(b.renewal);
  const renewalPrice = obj(b.renewal)?.monthlyKrw;
  const scheduled = config(b.scheduledChange), effectiveAt = day(obj(b.scheduledChange)?.effectiveAt);
  return { ...base, paidMonthlyKrw: paid, cycleStart, periodEnd,
    renewal: renewal ? { ...renewal, monthlyKrw: int(renewalPrice, 1) } : null,
    scheduledChange: scheduled && effectiveAt ? { ...scheduled, effectiveAt } : null };
}

export function parseQuote(raw: unknown): ChangeQuote | null {
  const q = obj(raw), t = obj(q?.target), c = obj(q?.current);
  const direction = str(q?.direction);
  if (!q || !t || !direction || !['NEW', 'UPGRADE', 'DOWNGRADE', 'NONE'].includes(direction)) return null;
  const target = { baseCode: str(t.baseCode), baseName: str(t.baseName), addonSlots: int(t.addonSlots), totalSlots: int(t.totalSlots, 1), monthlyKrw: int(t.monthlyKrw, 1) };
  const chargeToday = int(q.chargeToday), nextMonthlyKrw = int(q.nextMonthlyKrw, 1);
  const effectiveAt = day(q.effectiveAt), nextBillingAt = day(q.nextBillingAt), quotedAt = day(q.quotedAt);
  if (Object.values(target).some(v => v === null) || chargeToday === null || nextMonthlyKrw === null || !effectiveAt || !nextBillingAt || !quotedAt) return null;
  const current = c && str(c.baseCode) && str(c.baseName) && int(c.addonSlots) !== null && int(c.totalSlots, 1) && int(c.paidMonthlyKrw, 1)
    ? { baseCode: c.baseCode as string, baseName: c.baseName as string, addonSlots: c.addonSlots as number, totalSlots: c.totalSlots as number, paidMonthlyKrw: c.paidMonthlyKrw as number } : null;
  if (direction !== 'NEW' && !current) return null;
  return { ...(typeof q.quoteToken === 'string' && /^[A-Za-z0-9_-]{43}$/.test(q.quoteToken) ? {quoteToken:q.quoteToken} : {}), direction: direction as ChangeDirection, target: target as ChangeQuote['target'], current,
    removedAddonSlots: int(q.removedAddonSlots) ?? 0, remainingDays: int(q.remainingDays), periodDays: int(q.periodDays, 1),
    chargeToday, nextMonthlyKrw, effectiveAt, nextBillingAt, quotedAt };
}

/** Old cancellation quotes include the cancellation day and cannot represent this policy. */
export function parseCancellation(raw: unknown): CancellationQuote | null {
  const q = obj(raw);
  if (!q || q.policyVersion !== REFUND_POLICY_VERSION || !Array.isArray(q.allocations) || !q.allocations.length) return null;
  const refundAmount = int(q.refundAmount), cancellationDate = day(q.cancellationDate), unusedFrom = day(q.unusedFrom), periodEnd = day(q.periodEnd), quotedAt = day(q.quotedAt);
  if (refundAmount === null || !cancellationDate || !unusedFrom || !periodEnd || !quotedAt || calendarDays(cancellationDate, unusedFrom) !== 1 || (calendarDays(unusedFrom, periodEnd) < 0 && refundAmount !== 0)) return null;
  const allocations: RefundAllocation[] = [];
  const ids = new Set<string>();
  for (const value of q.allocations) {
    const a = obj(value);
    if (!a) return null;
    const receiptId = str(a.receiptId), amount = int(a.amount), start = day(a.periodStart), end = day(a.periodEnd);
    const periodDays = int(a.periodDays), remainingDays = int(a.remainingDays), balance = int(a.refundableBalance), refund = int(a.refundAmount);
    if (!receiptId || ids.has(receiptId) || amount === null || !start || !end || periodDays === null || remainingDays === null || balance === null || refund === null
      || (periodDays === 0 && amount !== 0) || calendarDays(start, end) !== periodDays || remainingDays > periodDays || balance > amount || refund > balance || calendarDays(end, periodEnd) !== 0
      || remainingDays !== Math.max(0, calendarDays(calendarDays(start, unusedFrom) < 0 ? start : unusedFrom, end))) return null;
    ids.add(receiptId);
    allocations.push({ receiptId, amount, periodStart: start, periodEnd: end, periodDays, remainingDays, refundableBalance: balance, refundAmount: refund });
  }
  const sum = allocations.reduce((total, a) => total + a.refundAmount, 0);
  return Number.isSafeInteger(sum) && sum === refundAmount ? { ...(typeof q.quoteToken === 'string' && /^[A-Za-z0-9_-]{43}$/.test(q.quoteToken) ? {quoteToken:q.quoteToken} : {}), ...(typeof q.processingStatus === 'string' ? {processingStatus:q.processingStatus} : {}), policyVersion: REFUND_POLICY_VERSION, refundAmount, cancellationDate, unusedFrom, periodEnd, quotedAt, allocations } : null;
}

/** Calendar dates in Asia/Seoul, independent of time-of-day. */
export function calendarDays(start: string, end: string): number {
  const koreanDay = (value: string) => new Date(value).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  const a = Date.parse(koreanDay(start) + 'T00:00:00Z'), b = Date.parse(koreanDay(end) + 'T00:00:00Z');
  return (b - a) / 86400000;
}

/** A quote cannot cross its KST calendar day, even inside the API's one-hour TTL. */
export function quoteIsCurrent(quotedAt: string, now = Date.now()) {
  const timestamp = Date.parse(quotedAt);
  return Number.isFinite(timestamp) && timestamp <= now + 5000 && now - timestamp < 3600000 && calendarDays(quotedAt, new Date(now).toISOString()) === 0;
}

/**
 * Link to the separate billing site. It charges/refunds through the PG and then reports the verified
 * payment back to the API, which re-checks the amount against its own quote.
 */
export function checkoutLink(checkoutUrl: string, params: Record<string, string | number>) {
  const url = new URL(checkoutUrl);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  return url.toString();
}

export const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;
export const kstDate = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
export function configLabel(baseName: string, addonSlots: number) {
  return addonSlots > 0 ? `${baseName} + 추가 ${addonSlots}슬롯` : baseName;
}
