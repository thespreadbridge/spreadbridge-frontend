"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  billingRequest,
  parseOperation,
  settled,
  type BillingOperation,
} from "@/lib/subscription-checkout";
import { won } from "@/lib/subscription-billing";
const labels: Record<string, string> = {
  PENDING: "요청을 접수했습니다.",
  PROCESSING: "결제를 확인하고 있습니다.",
  PAID: "결제가 승인되었습니다. 이용 권한을 적용하고 있습니다.",
  APPLIED: "결제와 이용 권한 적용이 완료되었습니다.",
  REFUNDING: "해지를 접수했습니다. 결제 건별 환불을 진행하고 있습니다.",
  REFUNDED: "해지와 환불 처리가 완료되었습니다.",
  RETRY:
    "처리 결과를 다시 확인하고 있습니다. 같은 요청을 다시 접수하지 않아도 됩니다.",
  FAILED: "결제가 완료되지 않았습니다. 기존 이용 권한은 유지됩니다.",
  EXPIRED:
    "견적 유효기간이 지나 결제하지 않았습니다. 금액을 다시 확인해 주세요.",
  REVIEW_REQUIRED: "처리 결과 확인이 필요합니다. 고객센터에 문의해 주세요.",
};
export function BillingOperationStatus({
  initial,
}: {
  initial: BillingOperation;
}) {
  const router = useRouter();
  const [operation, setOperation] = useState(initial);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    setOperation(initial);
  }, [initial]);
  useEffect(() => {
    if (settled(operation.status)) return;
    let stopped = false,
      pending = false;
    const poll = async () => {
      if (pending) return;
      pending = true;
      try {
        const next = parseOperation(
          await billingRequest(`operations/${operation.id}/`),
        );
        if (!stopped && next) {
          setUnavailable(false);
          setOperation(next);
          if (settled(next.status)) router.refresh();
        }
      } catch {
        if (!stopped) setUnavailable(true);
      } finally {
        pending = false;
      }
    };
    const timer = setInterval(poll, 2500);
    void poll();
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [operation.id, operation.status, router]);
  return (
    <div className="site-notice" role="status">
      <p>
        <b>
          {operation.kind === "CANCEL" ? "해지·환불" : "구독 결제"} ·{" "}
          {won(operation.amount)}
        </b>
      </p>
      <p>{labels[operation.status]}</p>
      {unavailable ? (
        <p>
          상태를 불러오지 못했습니다. 잠시 후 구독 관리에서 다시 확인해 주세요.
        </p>
      ) : null}
      {operation.status === "REVIEW_REQUIRED" ? (
        <a href="mailto:contact@thespreadbridge.com">고객센터 문의</a>
      ) : null}
    </div>
  );
}
