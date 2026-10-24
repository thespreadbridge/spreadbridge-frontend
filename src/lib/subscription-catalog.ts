import { backend } from '@/lib/auth/backend';

export interface SubscriptionProduct {
  code: string;
  name: string;
  slots: number;
  monthly_krw: number;
  promotion_label: string;
  enabled: boolean;
  sort_order: number;
}
export interface SubscriptionCatalog {
  products: SubscriptionProduct[];
  checkoutUrl: string | null;
  billingPeriod: 'MONTHLY';
}

export function checkoutTarget(value: string | null): URL | null {
  try {
    const url = new URL(value ?? '');
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash ? url : null;
  } catch { return null; }
}

export async function subscriptionCatalog(): Promise<SubscriptionCatalog | null> {
  try {
    const response = await backend('/public/subscriptions/catalog');
    if (!response.ok) return null;
    const data = await response.json();
    if (data.billingPeriod !== 'MONTHLY' || !Array.isArray(data.products)) return null;
    if (!data.products.every((p: SubscriptionProduct) => p && typeof p.code === 'string' && typeof p.name === 'string'
      && Number.isSafeInteger(p.slots) && p.slots > 0 && Number.isSafeInteger(p.monthly_krw) && p.monthly_krw >= 0
      && typeof p.promotion_label === 'string' && typeof p.enabled === 'boolean' && Number.isFinite(p.sort_order))) return null;
    return {
      products: data.products.filter((p: SubscriptionProduct) => p.enabled).sort((a: SubscriptionProduct, b: SubscriptionProduct) => a.sort_order - b.sort_order),
      checkoutUrl: typeof data.checkoutUrl === 'string' ? checkoutTarget(data.checkoutUrl)?.toString() ?? null : null,
      billingPeriod: 'MONTHLY',
    };
  } catch { return null; }
}
