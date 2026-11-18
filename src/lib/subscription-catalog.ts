import { backend, apiBaseUrl } from '@/lib/auth/backend';

export interface SubscriptionProduct {
  code: string;
  name: string;
  slots: number;
  monthly_krw: number;
  promotion_label: string;
  enabled: boolean;
  sort_order: number;
}
/** One extra slot added to any base plan, sold up to `max_quantity` per subscription. */
export interface SubscriptionAddon {
  code: string;
  name: string;
  slots: number;
  monthly_krw: number;
  max_quantity: number;
}
export interface SubscriptionBeta {
  code: 'BETA';
  baseSlots: number;
  addonSlots: number;
  monthlyKrw: 0;
}
export interface SubscriptionCatalog {
  products: SubscriptionProduct[];
  beta?: SubscriptionBeta | null;
  addon: SubscriptionAddon | null;
  checkoutUrl: string | null;
  billingPeriod: 'MONTHLY';
}

export function checkoutTarget(value: string | null): URL | null {
  try {
    const url = new URL(value ?? '');
    const local = new URL(apiBaseUrl());
    const loopback = local.protocol === 'http:' && local.hostname === '127.0.0.1' && url.protocol === 'http:' && url.hostname === '127.0.0.1' && Number(url.port) >= 1024 && url.pathname === '/payments/checkout/';
    return (url.protocol === 'https:' || loopback) && !url.username && !url.password && !url.hash ? url : null;
  } catch { return null; }
}

function parseAddon(value: unknown): SubscriptionAddon | null {
  if (!value || typeof value !== 'object') return null;
  const a = value as Partial<SubscriptionAddon>;
  return typeof a.code === 'string' && typeof a.name === 'string' && a.slots === 1
    && Number.isSafeInteger(a.monthly_krw) && Number(a.monthly_krw) > 0
    && Number.isSafeInteger(a.max_quantity) && Number(a.max_quantity) >= 1 && Number(a.max_quantity) <= 3
    ? { code: a.code, name: a.name, slots: 1, monthly_krw: Number(a.monthly_krw), max_quantity: Number(a.max_quantity) } : null;
}

function parseBeta(value: unknown): SubscriptionBeta | null {
  if (!value || typeof value !== 'object') return null;
  const beta = value as Partial<SubscriptionBeta>;
  return beta.code === 'BETA' && beta.monthlyKrw === 0
    && typeof beta.baseSlots === 'number' && Number.isSafeInteger(beta.baseSlots) && beta.baseSlots > 0
    && typeof beta.addonSlots === 'number' && Number.isSafeInteger(beta.addonSlots) && beta.addonSlots >= 0 && beta.addonSlots <= 3
    ? { code: beta.code, baseSlots: beta.baseSlots, addonSlots: beta.addonSlots, monthlyKrw: beta.monthlyKrw } : null;
}

export async function subscriptionCatalog(accessToken: string | undefined): Promise<SubscriptionCatalog | null> {
  if (!accessToken) return null;
  try {
    const response = await backend('/subscriptions/catalog', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.billingPeriod !== 'MONTHLY' || !Array.isArray(data.products)) return null;
    if (!data.products.every((p: SubscriptionProduct) => p && typeof p.code === 'string' && typeof p.name === 'string'
      && Number.isSafeInteger(p.slots) && p.slots > 0 && Number.isSafeInteger(p.monthly_krw) && p.monthly_krw >= 0
      && typeof p.promotion_label === 'string' && typeof p.enabled === 'boolean' && Number.isFinite(p.sort_order))) return null;
    return {
      beta: parseBeta(data.beta),
      products: data.products.filter((p: SubscriptionProduct) => p.enabled).sort((a: SubscriptionProduct, b: SubscriptionProduct) => a.sort_order - b.sort_order),
      addon: parseAddon(data.addon),
      checkoutUrl: typeof data.checkoutUrl === 'string' ? checkoutTarget(data.checkoutUrl)?.toString() ?? null : null,
      billingPeriod: 'MONTHLY',
    };
  } catch { return null; }
}
