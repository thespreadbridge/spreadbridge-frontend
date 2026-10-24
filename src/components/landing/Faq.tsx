const faqs = [
  ['스프레드 차익거래가 정확히 뭔가요?', '두 시장(KIS 달러선물·Upbit USDT)의 가격 차이(스프레드)가 좁을 때 양쪽에 포지션을 잡고, 벌어지면 정리해 그 변화폭을 수익으로 담는 방식입니다.'],
  ['제 돈을 맡기는 건가요?', '아니요. 비수탁이라 자산은 고객님 계좌에 있고, Spreadbridge는 출금 권한을 받지 않습니다.'],
  ['얼마나 벌 수 있나요?', '수익을 보장하지 않습니다. 스프레드·시장 상황·체결에 따라 다르며 손실이 발생할 수 있습니다.'],
  ['최소 얼마가 필요한가요?', '필요한 금액은 거래 수량과 거래소·증권사의 조건에 따라 달라집니다. 시작 전에 테더 매수대금과 선물 증거금, 거래 비용을 확인해 주세요.'],
  ['어떤 거래소를 지원하나요?', '현재 KIS 달러선물과 Upbit USDT를 지원합니다.'],
  ['구독이 만료되면 보유 포지션은 어떻게 되나요?', '구독 만료, 거래 중지, 앱 종료, 로그아웃은 보유 자산의 자동 처분이나 기존 주문 취소를 의미하지 않습니다. 만료 후 신규 진입은 중단되지만 보유 포지션은 그대로 남으므로, 청산·정리는 고객님이 직접 확인하고 처리해야 합니다.'],
];

export function Faq() {
  return (
    <section className="sb-section">
      <div className="shell">
        <span className="sb-eyebrow">FAQ</span>
        <h2 className="sb-h2">자주 묻는 질문</h2>
        <div className="sb-faq-list">
          {faqs.map(([q, a]) => (
            <details key={q} className="sb-faq-item">
              <summary className="sb-faq-q">{q}</summary>
              <p className="sb-faq-a">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
