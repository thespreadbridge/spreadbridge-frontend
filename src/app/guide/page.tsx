import { SitePage } from '@/components/site/SitePage';
import { icons } from '@/components/landing/icons';

const sections = [
  ['01', '계좌 준비', '한국투자증권 달러선물 계좌와 Upbit 계정을 준비합니다.', 'card'],
  ['02', 'API 발급', '필요한 조회·주문 권한을 확인하고 출금 권한은 부여하지 않습니다. 허용 IP가 필요한 경우 실제 앱 실행 환경의 네트워크 주소를 확인합니다.', 'key'],
  ['03', '연결 검증', 'API키는 암호화되어 저장되며 읽기 전용 검증을 통과해야 전략에 사용할 수 있습니다.', 'shieldCheck'],
  ['04', '전략 설정', '달러선물 코드, 진입·청산 기준, 1회 수량과 최대 포지션을 설정합니다.', 'sliders'],
  ['05', '실행 환경 확인', '연결한 계좌가 실전인지 모의인지 확인하고, 현재 버전의 실행 모드와 주문·중단 방법을 먼저 살펴봅니다.', 'eye'],
  ['06', '실행 전 검토', '전체 거래 수량과 자금 여유를 확인합니다. 실행 후에는 양쪽의 실제 체결과 포지션 상태를 함께 확인합니다.', 'play'],
];

export default function Guide() {
  return <SitePage title="안전한 연결부터 차근차근." eyebrow="SPREADBRIDGE · GETTING STARTED" description="고객 자산을 맡기지 않습니다. 출금 권한 없는 API로 고객 계좌에서 직접 실행합니다.">
    <ol className="site-steps">
      {sections.map(([number, title, body, icon]) => <li className="site-step" key={number}>
        <span className="site-step-icon">{icons[icon]}</span>
        <div><span className="site-step-number">STEP {number}</span><h2>{title}</h2><p>{body}</p></div>
      </li>)}
    </ol>
  </SitePage>;
}

export const metadata = { title: '온보딩 안내', alternates: { canonical: 'https://thespreadbridge.com/guide/' } };
