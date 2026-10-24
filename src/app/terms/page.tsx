import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/information/InformationPage';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'Spreadbridge의 서비스 이용, 계정 관리, 구독 및 결제, 이용 제한과 문의 절차를 안내합니다.',
  alternates: { canonical: 'https://thespreadbridge.com/terms/' },
};

export default function TermsPage() {
  return <InformationPage title="이용약관" eyebrow="SPREADBRIDGE · TERMS" updatedAt="2026-10-24" description="Spreadbridge 웹사이트와 데스크톱 앱의 이용 조건을 안내합니다.">
    <section><h2>1. 목적 및 적용 범위</h2>
      <p>이 약관은 Spreadbridge 운영자와 이용자 사이의 웹사이트 및 데스크톱 매매 자동화 소프트웨어 이용에 관한 기본 사항을 정합니다. 별도로 동의한 거래소·증권사 및 결제 서비스의 약관도 해당 서비스에 적용됩니다.</p>
    </section>
    <section><h2>2. 제공하는 서비스</h2>
      <p>Spreadbridge는 이용자가 설정한 조건에 따른 시세 확인, 주문 실행, 거래 기록 및 상태 확인 기능을 제공합니다. 이용자의 자산은 이용자 명의의 거래소·증권사 계좌에 보관되며, 서비스 이용료와 투자 자금은 별개입니다.</p>
      <p>서비스는 투자 수익이나 원금을 보장하지 않습니다. 지원 시장·운영체제·연결 방식과 이용 가능한 기능은 홈페이지 및 앱에서 확인할 수 있습니다.</p>
    </section>
    <section><h2>3. 계정 및 이용 환경</h2>
      <p>이용자는 본인에게 사용 권한이 있는 계정과 거래 연결만 등록하고, 로그인 정보와 기기를 안전하게 관리해야 합니다. 거래소의 계좌 개설, 거래 자격, 증거금 및 API 이용 조건도 충족해야 합니다.</p>
      <p>자동 운용에는 앱이 실행 중인 컴퓨터, 인터넷 연결 및 유효한 API 연결이 필요합니다. 계정 도용이나 키 유출이 의심되면 거래소에서 키를 폐기하고 고객센터에 알려주세요.</p>
    </section>
    <section><h2>4. 거래 설정과 실행</h2>
      <p>거래 종목, 수량, 진입·청산 조건과 실행 여부는 이용자가 확인하고 설정합니다. 실제 주문 전에는 실행 모드와 계좌를 확인하고, 모의거래 결과가 실제 거래 결과와 같지 않을 수 있음을 이해해야 합니다.</p>
      <p>앱 중지, 로그아웃 또는 구독 해지가 기존 주문 취소나 보유 포지션의 청산을 의미하지 않습니다. 주문·잔고·포지션은 해당 거래소나 증권사에서도 확인해야 합니다. 상세 위험은 <Link href="/risk/">위험고지</Link>를 확인하세요.</p>
    </section>
    <section><h2>5. 구독 및 결제</h2>
      <p>이용 요금, 슬롯 수, 이용 기간, 할인 적용 기간 및 갱신 조건은 상품 및 결제 화면에서 안내한 내용을 기준으로 합니다. 거래소·증권사의 수수료와 증거금은 서비스 이용료에 포함되지 않습니다.</p>
      <p>자동 갱신을 제공하는 상품은 결제 전에 갱신 여부, 청구 금액과 해지 방법을 안내합니다. 결제 전 해당 조건을 확인해 주세요.</p>
    </section>
    <section><h2>6. 해지·청약철회 및 환불</h2>
      <p>구독 해지, 청약철회 및 환불은 관계 법령과 결제 시 고지한 조건에 따라 처리합니다. 본 안내는 관계 법령이 보장하는 이용자의 권리를 제한하지 않습니다.</p>
      <p>신청은 구독 관리 화면에서 제공하는 절차 또는 <a href="mailto:contact@thespreadbridge.com">고객센터 이메일</a>로 접수할 수 있습니다. 결제 식별정보와 요청 내용을 보내주시면 이용 내역과 결제 상태를 확인하여 처리 방법을 안내합니다. 카드번호 전체나 비밀번호는 보내지 마세요.</p>
    </section>
    <section><h2>7. 이용 제한 및 서비스 변경</h2>
      <p>타인 계정 도용, 불법 거래, 보안 침해, 서비스 운영 방해 등 부정 이용이 확인되면 필요한 범위에서 이용을 제한할 수 있습니다. 긴급한 보안·장애 대응을 제외하고 사유와 이의 제기 방법을 안내합니다.</p>
      <p>점검, 외부 서비스 장애 또는 기능 변경으로 일부 서비스가 일시 중단될 수 있습니다. 예정된 주요 변경은 <Link href="/notices/">공지사항</Link> 등을 통해 안내합니다.</p>
    </section>
    <section><h2>8. 개인정보와 책임</h2>
      <p>정보의 수집·이용 및 보관은 <Link href="/privacy/">개인정보처리방침</Link>에 따릅니다. 거래소 연결에 관한 내용은 <Link href="/api-consent/">API 사용동의</Link>에서 확인할 수 있습니다.</p>
      <p>거래 위험에 대한 안내는 운영자의 고의·과실 등 관계 법령에 따른 책임을 배제하지 않습니다. 손해와 분쟁에 대한 책임은 발생 원인과 관계 법령에 따라 판단합니다.</p>
    </section>
    <section><h2>9. 약관 변경 및 문의</h2>
      <p>약관이 변경되면 변경 내용, 적용 시점 및 필요한 동의 절차를 안내합니다. 문의와 이의 제기는 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>으로 접수할 수 있으며, 분쟁의 준거법과 관할은 관계 법령에 따릅니다.</p>
      <p>관련 기준: <a href="https://www.law.go.kr/법령/약관의규제에관한법률" target="_blank" rel="noreferrer">약관의 규제에 관한 법률</a>, <a href="https://www.law.go.kr/법령/전자상거래등에서의소비자보호에관한법률" target="_blank" rel="noreferrer">전자상거래 등에서의 소비자보호에 관한 법률</a>.</p>
    </section>
  </InformationPage>;
}
