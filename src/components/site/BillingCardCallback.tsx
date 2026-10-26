"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/auth/SessionProvider";
import { billingRequest } from "@/lib/subscription-checkout";
import { validConfig } from "@/lib/subscription-billing";
import { CHECKOUT_RETURN } from "@/lib/toss-sdk";
export function BillingCardCallback() {
  const { refresh } = useSession();
  const started = useRef(false),
    [message, setMessage] = useState("카드 등록 결과를 확인하고 있습니다."),
    [href, setHref] = useState("/payments/");
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(location.search);
    history.replaceState(null, "", location.pathname);
    let target = "/payments/";
    try {
      const saved = JSON.parse(
          sessionStorage.getItem(CHECKOUT_RETURN) ?? "null",
        ),
        config = validConfig(saved?.baseCode, saved?.addonSlots);
      sessionStorage.removeItem(CHECKOUT_RETURN);
      if (config)
        target = `/payments/checkout/?${new URLSearchParams({ plan: config.baseCode, addons: String(config.addonSlots) })}`;
    } catch {
      /* A cleared browser session can return to subscription management. */
    }
    setHref(target);
    const sessionId = params.get("session"),
      authKey = params.get("authKey"),
      customerKey = params.get("customerKey");
    if (params.has("failed") || !sessionId || !authKey || !customerKey) {
      setMessage(
        "카드 등록이 완료되지 않았습니다. 결제 화면에서 다시 시작해 주세요.",
      );
      return;
    }
    // Refresh the same session before consuming the one-time provider authKey.
    void refresh()
      .then(() =>
        billingRequest("authorizations/", { sessionId, authKey, customerKey }),
      )
      .then((result) =>
        setMessage(
          result.registered
            ? "카드가 등록되었습니다. 결제 화면으로 돌아가 금액을 확인하고 결제를 진행해 주세요."
            : "카드 등록 결과를 확인하지 못했습니다. 구독 관리에서 확인해 주세요.",
        ),
      )
      .catch(() =>
        setMessage(
          "카드 등록 결과를 확인하지 못했습니다. 구독 관리에서 카드 상태를 확인해 주세요.",
        ),
      );
  }, [refresh]);
  return (
    <>
      <p role="status">{message}</p>
      <a className="btn primary" href={href}>
        결제 화면으로 돌아가기
      </a>
    </>
  );
}
