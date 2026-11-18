import { SitePage } from "@/components/site/SitePage";
import { BillingCardCallback } from "@/components/site/BillingCardCallback";
import { redirect } from "next/navigation";
import { serverSession } from "@/lib/auth/session";
export const metadata = {
  title: "카드 등록 확인",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function Callback({ searchParams }: {
  searchParams: Promise<{ session?: string | string[]; authKey?: string | string[]; customerKey?: string | string[] }>;
}) {
  const [account, params] = await Promise.all([serverSession(), searchParams]);
  // The access cookie can expire during card registration. The callback refreshes it before sending the one-time key.
  const providerReturn = typeof params.session === "string" && /^[\da-f-]{36}$/i.test(params.session)
    && typeof params.authKey === "string" && typeof params.customerKey === "string";
  if (account.status !== "authenticated" && !providerReturn) redirect("/");
  return (
    <SitePage
      title="카드 등록 확인"
      eyebrow="스프레드브리지 · MEMBERSHIP"
      description="등록 결과를 확인한 뒤 결제를 진행해 주세요."
    >
      <BillingCardCallback />
    </SitePage>
  );
}
