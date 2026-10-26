interface BillingSetup {
  clientKey: string;
  customerKey: string;
  sessionId: string;
  successUrl: string;
  failUrl: string;
}
interface TossPayment {
  requestBillingAuth(params: {
    method: "CARD";
    successUrl: string;
    failUrl: string;
    windowTarget: "self";
  }): Promise<void>;
}
declare global {
  interface Window {
    TossPayments?: (key: string) => {
      payment(params: { customerKey: string }): TossPayment;
    };
  }
}
let script: Promise<void> | null = null;
export const CHECKOUT_RETURN = "spreadbridge_checkout_return";
export async function registerBillingCard(setup: BillingSetup) {
  if (!window.TossPayments) {
    script ??= new Promise<void>((resolve, reject) => {
      const element = document.createElement("script");
      element.src = "https://js.tosspayments.com/v2/standard";
      element.onload = () => resolve();
      element.onerror = () => {
        element.remove();
        script = null;
        reject(
          new Error(
            "카드 등록 화면을 불러오지 못했습니다. 다시 시도해 주세요.",
          ),
        );
      };
      document.head.append(element);
    });
    await script;
  }
  if (!window.TossPayments)
    throw new Error("카드 등록 화면을 불러오지 못했습니다.");
  await window
    .TossPayments(setup.clientKey)
    .payment({ customerKey: setup.customerKey })
    .requestBillingAuth({
      method: "CARD",
      successUrl: setup.successUrl,
      failUrl: setup.failUrl,
      windowTarget: "self",
    });
}
