import { redirect } from "next/navigation";
import { SitePage } from "@/components/site/SitePage";
import { SubscriptionCheckout } from "@/components/site/SubscriptionCheckout";
import { serverSession } from "@/lib/auth/session";
import { validConfig } from "@/lib/subscription-billing";
export const metadata = {
  title: "구독 결제",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; addons?: string }>;
}) {
  const session = await serverSession();
  if (session.status === "guest" || session.status === "refresh_required")
    redirect("/login/?next=%2Fpayments%2F");
  const params = await searchParams,
    config = validConfig(params.plan, params.addons ?? "0");
  return (
    <SitePage
      title="구독 결제"
      eyebrow="스프레드브리지 · MEMBERSHIP"
      description="선택한 구성과 결제 금액을 확인하세요."
    >
      {session.status === "authenticated" &&
      session.user.role === "OWNER" &&
      session.user.emailVerified &&
      session.user.customerStatus === "ACTIVE" &&
      config ? (
        <SubscriptionCheckout
          baseCode={config.baseCode}
          addonSlots={config.addonSlots}
        />
      ) : (
        <p>
          계정 상태와 구독 구성을 확인해 주세요.{" "}
          <a href="/payments/">구독 관리로 이동</a>
        </p>
      )}
    </SitePage>
  );
}
