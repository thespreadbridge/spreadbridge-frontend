const steps = [
  ['01', '계좌 연결', 'KIS·Upbit에 출금 권한 없는 API 키로 연결합니다.'],
  ['02', '조건 설정', '진입·청산 스프레드, 주문 수량, 최대 포지션을 직접 정합니다.'],
  ['03', '자동 실행', '조건이 맞을 때 자동으로 주문하고 체결을 실시간 추적합니다.'],
];

export function StartSteps() {
  return (
    <section className="sb-section sb-section-tint">
      <div className="shell sb-start">
        <div className="sb-start-head">
          <span className="sb-eyebrow">GET STARTED</span>
          <h2 className="sb-h2">한 번 연결하고,<br />투명하게 확인하세요.</h2>
        </div>
        <ol className="sb-start-list">
          {steps.map(([n, title, body]) => (
            <li key={n} className="sb-start-item">
              <span className="sb-start-num">{n}</span>
              <div><h3 className="sb-start-title">{title}</h3><p className="sb-start-body">{body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
