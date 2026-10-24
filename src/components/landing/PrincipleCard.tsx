import { PrincipleAnimation } from './PrincipleAnimation';

export function PrincipleCard() {
  return (
    <section id="principle" className="sb-section sb-principle-card-wrap">
      <div className="shell">
        <div className="sb-principle-card">
          <div className="sb-principle-copy">
            <span className="sb-principle-label">스프레드 차익거래란?</span>
            <p className="sb-principle-text">
              한국 달러선물과 원화 USDT의 가격 차이(스프레드)는 계속 좁아졌다 벌어졌다 합니다.
              Spreadbridge는 스프레드가 <strong>좁을 때</strong> 양쪽에 포지션을 잡고,
              <strong> 벌어지면</strong> 정리해 그 변화폭만 수익으로 담습니다.
            </p>
          </div>
          <PrincipleAnimation />
        </div>
      </div>
    </section>
  );
}
