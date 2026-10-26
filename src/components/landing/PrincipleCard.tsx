import { PrincipleAnimation } from './PrincipleAnimation';

export function PrincipleCard() {
  return (
    <section id="principle" className="sb-section sb-principle-card-wrap">
      <div className="shell">
        <div className="sb-principle-card">
          <div className="sb-principle-copy">
            <span className="sb-principle-label">스프레드 차익거래란?</span>
            <p className="sb-principle-text">
              스프레드브리지는 원화 USDT와 한국 달러선물의 가격 차이(갭)를 비교합니다.
              설정한 조건에서 <strong>선물 매도·USDT 매수</strong>로 진입하고,
              청산 조건에 도달하면 반대 거래로 정리합니다. 최종 손익에는 실제 체결가와 거래 비용이 반영됩니다.
            </p>
          </div>
          <PrincipleAnimation />
        </div>
      </div>
    </section>
  );
}
