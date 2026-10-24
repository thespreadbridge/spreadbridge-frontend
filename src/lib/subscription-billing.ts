/** Shapes of the member billing API (`/subscriptions/current|change-quote|cancellation-quote`). */
export interface PlanConfig { baseCode: string; addonSlots: number }
export interface CurrentBilling {
  baseCode: string; addonSlots: number; paidMonthlyKrw: number; cycleStart: string; periodEnd: string;
  renewal: (PlanConfig & { monthlyKrw: number | null }) | null;
  scheduledChange: (PlanConfig & { effectiveAt: string }) | null;
}
export type ChangeDirection = 'NEW' | 'UPGRADE' | 'DOWNGRADE' | 'NONE';
export interface ChangeQuote {
  direction: ChangeDirection;
  target: { baseCode: string; baseName: string; addonSlots: number; totalSlots: number; monthlyKrw: number };
  current: { baseCode: string; baseName: string; addonSlots: number; totalSlots: number; paidMonthlyKrw: number } | null;
  removedAddonSlots: number; remainingDays: number | null; periodDays: number | null;
  chargeToday: number; nextMonthlyKrw: number; effectiveAt: string; nextBillingAt: string; quotedAt: string;
}
export interface CancellationQuote { refundAmount: number; paidMonthlyKrw: number; remainingDays: number; periodDays: number; periodEnd: string; quotedAt: string }

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
  return { direction: direction as ChangeDirection, target: target as ChangeQuote['target'], current,
    removedAddonSlots: int(q.removedAddonSlots) ?? 0, remainingDays: int(q.remainingDays, 1), periodDays: int(q.periodDays, 1),
    chargeToday, nextMonthlyKrw, effectiveAt, nextBillingAt, quotedAt };
}

export function parseCancellation(raw: unknown): CancellationQuote | null {
  const q = obj(raw);
  const refundAmount = int(q?.refundAmount), paidMonthlyKrw = int(q?.paidMonthlyKrw, 1), remainingDays = int(q?.remainingDays), periodDays = int(q?.periodDays, 1);
  const periodEnd = day(q?.periodEnd), quotedAt = day(q?.quotedAt);
  return refundAmount !== null && paidMonthlyKrw !== null && remainingDays !== null && periodDays !== null && periodEnd && quotedAt
    ? { refundAmount, paidMonthlyKrw, remainingDays, periodDays, periodEnd, quotedAt } : null;
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
