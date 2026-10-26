/** Public copy shared by the current homepage and the legacy landing components. */
export const custodyFaq = {
  id: 'custody', question: '제 돈을 맡기는 건가요?',
  answer: '투자금은 본인 계좌에 보관됩니다. 주문은 이용자의 PC에서 실행되며 거래 리포트 제공에 필요한 기록은 서버로 전송됩니다.',
} as const;
export const returnsFaq = {
  id: 'returns', question: '수익이 보장되나요?',
  answer: '수익은 보장되지 않으며 시장 상황과 거래 조건, 체결 결과에 따라 손실이 발생할 수 있습니다.',
} as const;
export const pcUptimeFaq = {
  id: 'pc_uptime', question: '컴퓨터를 계속 켜 두어야 하나요?',
  answer: '자동 운용 중에는 PC와 앱을 켜 두고 인터넷 연결을 유지해야 합니다. 절전모드에서는 작동이 중단될 수 있습니다.',
} as const;
export const setupFaq = {
  id: 'setup', question: '프로그래밍을 몰라도 되나요?',
  answer: '네. 코딩 없이 화면에서 거래 조건을 설정할 수 있습니다. 설치부터 계좌 연결까지 화면 안내를 따라 진행하면 됩니다.',
} as const;
export const subscriptionExpiryFaq = {
  id: 'subscription_expiry', question: '구독 해지·종료·만료 이후에는 어떻게 해야 하나요?',
  answer: '구독 해지·종료·만료 이후에는 이용자가 업비트와 한국투자증권에 직접 접속해 미체결 주문과 보유 포지션을 확인하고 정리해야 합니다. 구독 종료만으로 기존 주문이 취소되거나 보유 포지션이 자동으로 청산되지는 않습니다.',
} as const;
export const planChangeFaq = {
  id: 'plan_change', question: '이용 중에 요금제를 바꾸거나 슬롯을 추가할 수 있나요?',
  answer: '기본 요금제는 같은 결제 주기 안에서도 여러 번 상향할 수 있습니다. 각 기본 요금제에는 낱개 슬롯을 최대 3개까지 추가할 수 있어 5슬롯 요금제는 최대 8개, 15슬롯 요금제는 최대 18개, 25슬롯 요금제는 최대 28개를 이용할 수 있습니다. 상위 기본 요금제로 변경하면 기존 추가 슬롯은 새 요금제에 포함되며, 새 요금제에서도 최대 3개를 추가할 수 있습니다. 변경은 결제 완료 후 즉시 적용됩니다. 추가요금은 변경 전후 월 요금의 차액을 변경 당일부터 남은 기간에 맞춰 일할 계산하며, 다음 결제일은 유지됩니다. 다운그레이드는 다음 결제일부터 적용됩니다.',
} as const;
export const cancellationRefundFaq = {
  id: 'cancellation_refund', question: '구독을 해지하면 환불되나요?',
  answer: '네. 현재 결제 주기의 각 결제분에서 미사용 기간에 해당하는 금액을 계산해 환불합니다. 월중 추가 결제분은 해당 결제분의 이용기간을 기준으로 계산합니다. 해지 당일은 미사용일수에 포함하지 않으며, 해지 다음 날부터 다음 결제일 전날까지 계산합니다. 각 결제분의 환불액을 합산한 뒤 원 미만은 버립니다. 환불 예정액은 구독 관리 화면에서 확인할 수 있습니다. 해지 후에는 업비트와 한국투자증권에 직접 접속해 미체결 주문과 보유 포지션을 확인하고 정리해야 합니다.',
} as const;
export const homeFaqs = [custodyFaq, returnsFaq, pcUptimeFaq, {
  id: 'strategy', question: '전략이 정확히 뭔가요?',
  answer: '달러와 관련된 두 시장 사이의 가격 차이(스프레드)를 이용합니다. 세부 산식과 실행 방식은 스프레드브리지의 핵심 자산이라 공개하지 않지만, 프로그램 안에서 당신이 조정할 수 있는 조건은 모두 투명하게 열려 있습니다.',
}, setupFaq, subscriptionExpiryFaq, planChangeFaq, cancellationRefundFaq];
export const subscriptionEndNotice = '구독 종료 후에는 업비트와 한국투자증권에 직접 접속해 미체결 주문과 보유 포지션을 확인하고 정리해야 합니다. 구독 종료만으로 기존 주문이 취소되거나 보유 포지션이 자동으로 청산되지는 않습니다.';
export const monthlyBillingNotice = '첫 결제일을 기준으로 매월 같은 날짜에 결제됩니다. 해당 날짜가 없는 달에는 말일에 결제되며, 이후에는 원래 결제일을 기준으로 계산합니다. 월 구독은 달력상 한 달을 기준으로 하므로 결제 주기의 총일수는 주기마다 달라질 수 있습니다.';
export const downgradeNotice = '다운그레이드는 다음 결제일부터 적용되므로 이번 결제분은 변경되지 않습니다. 즉시 이용을 종료하려면 구독 해지를 선택하세요.';
