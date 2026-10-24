import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/information/InformationPage';

export const metadata: Metadata = {
  title: 'API 사용동의',
  description: '거래소 API 연결의 이용 목적, 권한 범위, 정보 보관과 연결 해제 방법을 안내합니다.',
  alternates: { canonical: 'https://thespreadbridge.com/api-consent/' },
};

export default function ApiConsentPage() {
  return <InformationPage title="API 사용동의" eyebrow="SPREADBRIDGE · API CONNECTION" updatedAt="2026-10-24" description="거래소·증권사 API를 연결하기 전에 이용 목적, 허용 권한과 해제 방법을 확인해 주세요.">
    <section><h2>1. 연결 목적과 범위</h2>
      <p>API 연결은 이용자 명의의 계좌에서 잔고·주문·체결 상태를 확인하고, 이용자가 설정하고 실행한 전략에 따라 주문을 제출·조회·취소하기 위해 사용합니다. 자산은 해당 거래소·증권사 계좌에 보관됩니다.</p>
      <p>이 페이지를 읽는 것만으로 API가 연결되거나 매매가 시작되지 않습니다. 실제 연결과 실행은 앱의 해당 화면에서 별도로 진행합니다.</p>
    </section>
    <section><h2>2. 허용할 권한</h2>
      <ul><li>계좌·잔고 및 주문·체결 조회 등 연결 검증과 상태 확인에 필요한 권한</li><li>이용자가 요청한 거래를 위한 주문 제출·조회·취소 권한</li></ul>
      <p><strong>출금 및 자산 이전 권한은 부여하지 마세요.</strong> 거래소별로 권한 이름이 다르므로 발급 화면에서 실제 허용 범위를 확인하고, 앱에서 요청하는 기능에 필요한 최소 권한만 부여해야 합니다.</p>
      <p>앱이 출금 권한을 조회할 수 있는 경우 해당 권한이 확인된 키의 등록을 거부합니다. 조회가 지원되지 않거나 권한 확인이 불가능한 연결도 있으므로, 자동 검사만으로 출금 권한이 없다고 판단하지 마세요.</p>
    </section>
    <section><h2>3. 정보의 저장과 처리</h2>
      <p>데스크톱 앱에 등록한 거래소 API 비밀키는 이용자 컴퓨터에서 운영체제의 보호 기능으로 암호화하여 보관합니다. 앱은 연결한 거래소·증권사에 인증·조회·주문 요청을 보냅니다.</p>
      <p>서비스 운영을 위해 계좌·연결 식별정보, 전략 설정, 실행 결과와 필요한 운영 기록을 처리하며, 일부 기록은 서비스 서버로 전송됩니다. 자세한 처리 항목과 보관·삭제 내용은 <Link href="/privacy/">개인정보처리방침</Link>을 확인해 주세요.</p>
    </section>
    <section><h2>4. 키와 허용 IP 관리</h2>
      <p>본인에게 사용 권한이 있는 API 키만 등록하고, 키를 타인과 공유하거나 이메일·메신저로 보내지 마세요. 거래소가 허용 IP 설정을 요구하는 경우 실제 주문을 실행할 기기의 공인 IP를 등록해야 합니다.</p>
      <p>IP 변경, 키 만료·폐기 또는 거래소 권한 변경으로 조회와 주문이 중단될 수 있습니다. 변경 후에는 연결 상태를 다시 확인해야 합니다. <a href="https://docs.upbit.com/kr/reference/auth" target="_blank" rel="noreferrer">업비트 API 인증 및 권한 안내</a></p>
    </section>
    <section><h2>5. 주문 실행과 위험 확인</h2>
      <p>전략을 실행하면 설정 조건과 계좌 상태에 따라 실제 주문이 전송될 수 있습니다. 실거래·모의거래 모드, 종목, 수량 및 진입·청산 조건을 확인한 뒤 실행하세요.</p>
      <p>주문 지연·거절·부분 체결 및 한쪽 포지션의 위험이 있습니다. API 연결은 원하는 가격의 체결이나 수익을 보장하지 않으며, 상세 내용은 <Link href="/risk/">위험고지</Link>를 확인해 주세요.</p>
    </section>
    <section><h2>6. 연결 해제와 동의 철회</h2>
      <p>신규 거래를 중지하고 미체결 주문과 보유 포지션을 확인한 뒤 앱에서 연결 해제 절차를 진행하세요. 즉시 접근을 차단하려면 해당 거래소·증권사의 API 관리 화면에서 키를 폐기하거나 권한을 변경할 수 있습니다.</p>
      <p><strong>키 폐기나 연결 해제는 기존 포지션 청산·주문 취소를 대신하지 않습니다.</strong> 이후 앱의 조회·청산도 불가능해질 수 있으므로 해당 거래소에서 직접 상태를 확인해야 합니다. 연결 해제와 거래·운영 기록의 삭제도 별도 절차입니다.</p>
    </section>
    <section><h2>7. 문의</h2>
      <p>API 연결 및 정보 처리에 관한 문의는 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>으로 보내주세요. 문의에는 거래소 이름과 오류 상황만 기재하고 API 비밀키·계좌 비밀번호를 포함하지 마세요.</p>
    </section>
  </InformationPage>;
}
