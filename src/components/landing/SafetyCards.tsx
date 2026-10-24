import { icons } from './icons';

const cards = [
  ['shieldCheck', '비수탁 연결', '주문 권한만 부여하고 출금 권한은 받지 않습니다. 자산은 고객님 KIS·Upbit 계좌에 그대로 있습니다.'],
  ['layers', '고객별 독립 실행', '한 고객의 지연·거래소 제한이 다른 고객 주문을 막지 않습니다. 같은 계좌의 주문만 순서대로 처리합니다.'],
  ['reconcile', '불명확 주문 자동 대사', '응답이 늦거나 끊기면 재주문하지 않습니다. 주문·체결·잔고를 먼저 확인하고 사람이 봐야 할 상태를 분리합니다.'],
];

export function SafetyCards() {
  return (
    <section className="sb-section">
      <div className="shell">
        <span className="sb-eyebrow">WHY SAFE</span>
        <h2 className="sb-h2">자산은 그대로,<br />실행만 자동으로.</h2>
        <div className="sb-safety-grid">
          {cards.map(([icon, title, body]) => (
            <article key={title} className="sb-safety-card">
              <span className="sb-safety-icon">{icons[icon]}</span>
              <h3 className="sb-safety-title">{title}</h3>
              <p className="sb-safety-body">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
