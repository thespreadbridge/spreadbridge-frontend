import Link from 'next/link';
import { HeroSpreadCard } from './HeroSpreadCard';

export function Hero() {
  return (
    <section className="sb-hero shell">
      <div className="sb-hero-copy">
        <span className="sb-eyebrow"><i />달러선물 × 원화 USDT 스프레드 차익거래</span>
        <h1 className="sb-hero-h1">두 시장의 틈을,<br />자동으로.</h1>
        <p className="sb-lead">한국 달러선물과 원화 USDT의 가격 차이를 비교하고, 정한 진입·청산 조건에 따라 고객님 계좌에서 직접 실행합니다. 주문은 각 시장의 거래 가능 시간과 연결·체결 상태에 따라 진행됩니다.</p>
        <div className="sb-hero-actions">
          <Link href="https://dollarflow.growbee.ai/login" className="button button-blue">Google로 시작하기</Link>
          <Link href="/#principle" className="button button-ghost">원리 보기 ↗</Link>
        </div>
        <ul className="sb-trust">
          <li>출금 권한 없음</li><li>고객별 독립 실행</li><li>월 구독 요금제</li>
        </ul>
      </div>
      <HeroSpreadCard />
    </section>
  );
}
