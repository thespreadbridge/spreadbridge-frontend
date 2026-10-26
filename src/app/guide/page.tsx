import { publicPageMetadata } from '@/lib/seo';
import { SitePage } from '@/components/site/SitePage';
import { icons } from '@/components/landing/icons';

const sections = [
  ['01', '거래 계좌와 거래 요건 확인', '업비트 계정과 한국투자증권 국내선물옵션 계좌를 준비합니다. 본인에게 적용되는 사전교육·모의거래·기본예탁금 요건을 증권사에서 확인하세요.', 'card'],
  ['02', '앱 설치와 Google 로그인', '사용하는 PC에 맞는 설치파일로 앱을 설치하고 Google 계정으로 로그인합니다. 로그인한 계정의 구독과 이용 가능한 슬롯 수를 확인하세요.', 'play'],
  ['03', 'API 키 발급과 권한 설정', '업비트·한국투자증권에서 연결에 필요한 API 키를 발급합니다. 조회·주문에 필요한 권한을 확인하고 출금 권한은 제외하세요. 허용 IP가 필요한 경우 실제 앱을 실행하는 PC의 공인 IP를 등록합니다.', 'key'],
  ['04', '계좌 연결과 잔고 확인', '앱에서 계좌를 연결하고 연결 상태와 양쪽 잔고를 확인합니다. 실전·모의 계좌 구분과 조회 결과를 확인한 뒤 전략을 설정하세요.', 'shieldCheck'],
  ['05', '전략 조건과 수량 설정', '거래할 미국달러선물 월물과 진입·청산·손절 조건, 수량과 한도를 설정합니다. 앱의 ‘계약 수’는 달러선물 계약 단위로 정수를 입력합니다. 전체 슬롯에는 ‘최대 진입 계약 수’ 한도가 적용됩니다.', 'sliders'],
  ['06', '실행 방식과 중단 방법 확인', '모니터링 화면에서 전체 실행 상태를 확인하고 전략별 ‘시작’·‘정지’ 버튼으로 슬롯을 제어합니다. ‘전체 정지’는 모든 슬롯을 중지합니다. 자동 운용 중에는 앱과 PC를 켜 두고 인터넷 연결을 유지하세요.', 'eye'],
  ['07', '실행 전후 주문과 포지션 확인', '실행 전 전체 슬롯의 총수량, 자금 여유, 미체결 주문과 보유 포지션을 확인합니다. 실행 후에는 업비트와 한국투자증권의 실제 주문·체결 결과를 함께 확인하세요.', 'play'],
];

export default function Guide() {
  return <SitePage title="설치부터 첫 실행까지" eyebrow="스프레드브리지 · GETTING STARTED" description="투자금은 본인 계좌에 보관됩니다. 이용자의 PC에서 설정한 조건에 따라 매매를 실행합니다.">
    <ol className="site-steps">
      {sections.map(([number, title, body, icon]) => <li className="site-step" key={number}>
        <span className="site-step-icon">{icons[icon]}</span>
        <div><span className="site-step-number">STEP {number}</span><h2>{title}</h2><p>{body}</p></div>
      </li>)}
    </ol>
  </SitePage>;
}

export const metadata = publicPageMetadata('/guide/');
