import { SitePage } from "@/components/site/SitePage";
import { BillingCardCallback } from "@/components/site/BillingCardCallback";
export const metadata = {
  title: "카드 등록 확인",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function Callback() {
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
