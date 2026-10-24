import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Payments from '@/app/payments/page';
import { backend } from '@/lib/auth/backend';

vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => ({ value: 'isolated-fixture-access' }) }) }));
vi.mock('@/components/site/SitePage', () => ({ SitePage: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock('@/lib/auth/backend', () => ({ backend: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ serverSession: async () => ({
  status: 'authenticated', user: { displayName: '회원', role: 'OWNER', emailVerified: true, customerStatus: 'ACTIVE' },
  subscription: { active: true, planName: '5슬롯', maxActiveSlots: 5, expiresAt: null },
}) }));
vi.mock('@/lib/subscription-catalog', () => ({
  subscriptionCatalog: async () => ({ products: [], checkoutUrl: null }), checkoutTarget: () => null,
}));

beforeEach(() => {
  const receipts = Array.from({ length: 23 }, (_, index) => ({
    id: `receipt-${index}`, total_slots: 5, amount: 10000 + index,
    period_start: '2026-10-01T00:00:00Z', period_end: '2026-11-01T00:00:00Z', revoked_at: null,
  }));
  vi.mocked(backend).mockResolvedValue(Response.json(receipts));
});

describe('subscription page query integration', () => {
  it('uses the requested URL page and keeps the backend credential out of the page', async () => {
    const html = renderToStaticMarkup(await Payments({ searchParams: Promise.resolve({ historyPage: '2' }) }));
    expect(html).toContain('10,010원'); expect(html).not.toContain('10,009원');
    expect(html).toContain('id="subscription-history"'); expect(html).toContain('11–20');
    expect(backend).toHaveBeenCalledWith('/subscriptions/history', { headers: { Authorization: 'Bearer isolated-fixture-access' } });
    expect(html).not.toContain('isolated-fixture-access');
  });
  it('handles repeated page query parameters deterministically', async () => {
    const html = renderToStaticMarkup(await Payments({ searchParams: Promise.resolve({ historyPage: ['3', '2'] }) }));
    expect(html).toContain('10,020원'); expect(html).not.toContain('10,019원'); expect(html).toContain('21–23');
  });
});
