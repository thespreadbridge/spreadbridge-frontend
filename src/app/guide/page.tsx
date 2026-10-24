import { SitePage } from '@/components/site/SitePage';
import { icons } from '@/components/landing/icons';

const sections = [
  ['01', '계좌 준비', '한국투자증권 달러선물 계좌와 Upbit 계정을 준비합니다.', 'card'],
  ['02', 'API 발급', '거래 권한만 허용하고 출금 권한은 반드시 해제합니다. 서버의 고정 IP를 허용 목록에 등록합니다.', 'key'],
  ['03', '연결 검증', 'API키는 암호화되어 저장되며 읽기 전용 검증을 통과해야 전략에 사용할 수 있습니다.', 'shieldCheck'],
  ['04', '전략 설정', '달러선물 코드, 진입·청산 기준, 1회 수량과 최대 포지션을 설정합니다.', 'sliders'],
  ['05', 'Shadow 확인', '초기에는 실주문 없이 동일한 신호와 주문 흐름을 확인합니다.', 'eye'],
  ['06', '운영 시작', '운영자 승인 후에만 실주문 모드와 신규 진입을 별도로 해제합니다.', 'play'],
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
