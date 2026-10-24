const steps = [
  ['01', '두 가격을 잽니다', 'KIS 달러선물과 Upbit USDT의 가격 차이(스프레드)를 실시간으로 비교합니다.'],
  ['02', '좁혀지면 진입', '스프레드가 설정 기준보다 좁아지면 선물 매수·USDT 매도로 양쪽에 동시에 진입합니다.'],
  ['03', '벌어지면 청산', '스프레드가 다시 벌어지면 양쪽을 정리해 그 차이를 수익으로 확정합니다.'],
];

export function PrincipleFlow() {
  return (
    <section className="sb-section sb-section-tint">
      <div className="shell">
        <span className="sb-eyebrow">HOW IT WORKS</span>
        <h2 className="sb-h2">좁혀졌을 때 담고,<br />벌어지면 정리합니다.</h2>
        <ol className="sb-flow-grid">
          {steps.map(([n, title, body]) => (
            <li key={n} className="sb-flow-step">
              <span className="sb-flow-num">{n}</span>
              <h3 className="sb-flow-title">{title}</h3>
              <p className="sb-flow-body">{body}</p>
            </li>
          ))}
        </ol>
        <p className="sb-note">* 스프레드는 시장 상황에 따라 확대·축소되며, 손실이 발생할 수 있습니다.</p>
      </div>
    </section>
  );
}
