const steps = [
  ['01', '두 가격을 잽니다', 'KIS 달러선물과 Upbit USDT의 가격 차이(스프레드)를 실시간으로 비교합니다.'],
  ['02', '설정 조건에서 진입', '진입 갭이 설정 기준에 도달하면 선물을 매도하고, 체결을 확인한 뒤 USDT를 매수합니다.'],
  ['03', '청산 조건에서 정리', '선물을 매수해 숏 포지션을 정리한 뒤 USDT를 매도합니다. 실제 손익은 양쪽 체결가·수량·비용으로 확인합니다.'],
];

export function PrincipleFlow() {
  return (
    <section className="sb-section sb-section-tint">
      <div className="shell">
        <span className="sb-eyebrow">HOW IT WORKS</span>
        <h2 className="sb-h2">두 가격의 차이를 보고,<br />정한 조건에 따라 실행합니다.</h2>
        <ol className="sb-flow-grid">
          {steps.map(([n, title, body]) => (
            <li key={n} className="sb-flow-step">
              <span className="sb-flow-num">{n}</span>
              <h3 className="sb-flow-title">{title}</h3>
              <p className="sb-flow-body">{body}</p>
            </li>
          ))}
        </ol>
        <p className="sb-note">갭은 USDT 가격에서 선물의 1달러당 가격을 뺀 값입니다. 이 조합은 진입 때보다 갭이 증가하면 비용 차감 전 손익에 유리하며, 반대로 움직이면 손실이 발생할 수 있습니다. 두 주문은 순서대로 진행됩니다.</p>
      </div>
    </section>
  );
}
