"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CancellationSummary } from "./CancellationSummary";
import { BillingOperationStatus } from "./BillingOperationStatus";
import {
  quoteIsCurrent,
  won,
  type CancellationQuote,
} from "@/lib/subscription-billing";
import {
  billingRequest,
  parseOperation,
  type BillingOperation,
} from "@/lib/subscription-checkout";
export function SubscriptionCancellation({
  quote,
  enabled,
}: {
  quote: CancellationQuote;
  enabled: boolean;
}) {
  const router = useRouter(),
    key = useRef<string | null>(null),
    submitting = useRef(false);
  const [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [operation, setOperation] = useState<BillingOperation | null>(null);
  async function cancel() {
    if (submitting.current || !confirmed || !quote.quoteToken) return;
    if (!quoteIsCurrent(quote.quotedAt)) {
      setError(
        "환불 견적이 만료되었습니다. 새로고침 후 금액을 다시 확인해 주세요.",
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    key.current ??= crypto.randomUUID();
    try {
      const result = parseOperation(
        await billingRequest("cancellations/", {
          quotedAt: quote.quotedAt,
          quoteToken: quote.quoteToken,
          expectedRefundAmount: quote.refundAmount,
          idempotencyKey: key.current,
          confirm: true,
        }),
      );
      if (!result) throw new Error("구독 관리에서 접수 결과를 확인해 주세요.");
      setOperation(result);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  if (operation) return <BillingOperationStatus initial={operation} />;
  return (
    <>
      <CancellationSummary quote={quote} />
      {quote.quoteToken && (enabled || quote.refundAmount === 0) ? (
        <>
          <label className="site-billing-consent">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={busy}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>
              접수 즉시 이용이 종료되고 자동결제가 중단됩니다. 환불 예정액{" "}
              {won(quote.refundAmount)}을 확인했으며 즉시 해지를 신청합니다.
            </span>
          </label>
          <button
            type="button"
            className="btn ghost"
            disabled={busy || !confirmed}
            onClick={cancel}
            data-analytics-id="subscription_cancel_confirm"
          >
            {busy ? "해지를 접수하고 있습니다" : "즉시 해지·환불 신청"}
          </button>
          {error ? <p role="alert">{error}</p> : null}
        </>
      ) : null}
      <p>
        <a
          href="mailto:contact@thespreadbridge.com"
          data-analytics-id="subscription_cancel_email"
        >
          해지·환불 문의
        </a>
      </p>
    </>
  );
}
