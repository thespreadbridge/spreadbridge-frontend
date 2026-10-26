"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QuoteSummary } from "./PlanChangePanel";
import { BillingOperationStatus } from "./BillingOperationStatus";
import {
  parseQuote,
  quoteIsCurrent,
  won,
  type ChangeQuote,
} from "@/lib/subscription-billing";
import {
  billingRequest,
  parseBillingStatus,
  parseOperation,
  settled,
  type BillingOperation,
  type BillingStatus,
} from "@/lib/subscription-checkout";
import { CHECKOUT_RETURN, registerBillingCard } from "@/lib/toss-sdk";
export function SubscriptionCheckout({
  baseCode,
  addonSlots,
}: {
  baseCode: string;
  addonSlots: number;
}) {
  const router = useRouter();
  const [quote, setQuote] = useState<ChangeQuote | null>(null),
    [status, setStatus] = useState<BillingStatus | null>(null),
    [operation, setOperation] = useState<BillingOperation | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [consent, setConsent] = useState(false),
    [loading, setLoading] = useState(true);
  const key = useRef<string | null>(null),
    submitting = useRef(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    setConsent(false);
    key.current = null;
    try {
      const [response, billing] = await Promise.all([
        fetch(
          `/api/member/subscription/quote/?${new URLSearchParams({ baseCode, addonSlots: String(addonSlots) })}`,
          { cache: "no-store", credentials: "same-origin" },
        ),
        billingRequest(""),
      ]);
      const q = response.ok ? parseQuote(await response.json()) : null,
        b = parseBillingStatus(billing);
      if (!q?.quoteToken || !b)
        throw new Error(
          "결제 정보를 불러오지 못했습니다. 구독 관리에서 다시 확인해 주세요.",
        );
      setQuote(q);
      setStatus(b);
      if (
        b.latestOperation &&
        (!settled(b.latestOperation.status) ||
          b.latestOperation.status === "REVIEW_REQUIRED")
      )
        setOperation(b.latestOperation);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [baseCode, addonSlots]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function card() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const setup = await billingRequest("setup/", {});
      sessionStorage.setItem(
        CHECKOUT_RETURN,
        JSON.stringify({ baseCode, addonSlots }),
      );
      await registerBillingCard(setup);
    } catch {
      setError("카드 등록을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setBusy(false);
      submitting.current = false;
    }
  }
  async function pay() {
    if (submitting.current || !quote?.quoteToken || !consent) return;
    if (!quoteIsCurrent(quote.quotedAt)) {
      setError("견적 유효기간이 지났습니다. 금액을 다시 확인해 주세요.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    key.current ??= crypto.randomUUID();
    try {
      const result = parseOperation(
        await billingRequest("orders/", {
          baseCode,
          addonSlots,
          quotedAt: quote.quotedAt,
          quoteToken: quote.quoteToken,
          idempotencyKey: key.current,
          renewalConsent: true,
        }),
      );
      if (!result) throw new Error("구독 관리에서 처리 결과를 확인해 주세요.");
      setOperation(result);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  if (operation)
    return (
      <>
        <BillingOperationStatus initial={operation} />
        <a className="btn primary" href="/payments/">
          구독 관리에서 확인
        </a>
      </>
    );
  return (
    <section className="site-plan-change" aria-label="구독 결제 확인">
      {loading ? <p role="status">결제 정보를 확인하고 있습니다.</p> : null}
      {quote ? <QuoteSummary quote={quote} /> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!loading &&
      quote &&
      status &&
      ["NEW", "UPGRADE"].includes(quote.direction) ? (
        <>
          <p>
            결제 카드:{" "}
            {status.cardRegistered ? status.cardLabel : "등록된 카드 없음"}
          </p>
          {status.enabled ? (
            <button
              className="btn ghost"
              type="button"
              disabled={busy}
              onClick={card}
              data-analytics-id="billing_card_register"
            >
              {status.cardRegistered ? "결제 카드 변경" : "결제 카드 등록"}
            </button>
          ) : (
            <p>결제 연결을 준비하고 있습니다.</p>
          )}
          <label className="site-billing-consent">
            <input
              type="checkbox"
              checked={consent}
              disabled={busy}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              이번 {won(quote.chargeToday)} 결제와 매월 다음 결제일의 자동결제에
              동의합니다. 즉시 해지는 구독 관리에서 신청할 수 있습니다.
            </span>
          </label>
          <p>
            <a href="/terms/" target="_blank" rel="noopener noreferrer">
              이용약관
            </a>
            과 위 구성·금액을 확인한 뒤 결제해 주세요.
          </p>
          <button
            className="btn primary"
            type="button"
            disabled={
              busy ||
              !consent ||
              !status.enabled ||
              (!status.cardRegistered && quote.chargeToday > 0)
            }
            onClick={pay}
            data-analytics-id="billing_order_confirm"
          >
            {busy
              ? "요청을 처리하고 있습니다"
              : quote.chargeToday === 0
                ? "추가 결제 없이 바로 변경"
                : `${won(quote.chargeToday)} 결제하고 ${quote.direction === "NEW" ? "구독 시작" : "바로 변경"}`}
          </button>
        </>
      ) : null}
      {!busy && !loading ? (
        <button
          type="button"
          className="btn ghost"
          onClick={() => void refresh()}
        >
          금액 다시 확인
        </button>
      ) : null}
      <p>
        <a href="/payments/">구독 관리로 돌아가기</a>
      </p>
    </section>
  );
}
