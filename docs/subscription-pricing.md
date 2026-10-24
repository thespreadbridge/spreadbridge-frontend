# 슬롯 요금제·추가 슬롯·구성 변경 화면 (2026-10-25)

요금·차액 계산은 모두 API(`spreadbridge-backend`, `docs/subscription-pricing-2026-10-24.md`)가 한다. 홈페이지는 금액을 직접 계산해 청구하지 않는다. 선택 화면의 "선택 구성 · 월 금액"만 카탈로그 가격을 더해 보여주고, 결제·예약에 쓰는 금액은 항상 API 견적이다.

## 화면

- `/pricing/`: 5/15/25 기본 요금제, 추가 1슬롯(`catalog.addon`, 최대 3개), 업그레이드·다운그레이드·즉시 해지 규칙.
- 홈 요금 카드: 카탈로그에 추가 슬롯이 있으면 "슬롯 1개씩 추가" 항목을 표시.
- `/payments/`: 이번 달 결제 요금·다음 결제일·다음 달 요금(`billing`), 구성 선택(`PlanChangePanel`), 예약된 다운그레이드와 취소, 즉시 해지 환불 예정액, 이용 내역(추가 슬롯 수·업그레이드 차액 표시).
- 관리자 지정 이용권(`billing` 없음)은 화면에서 구성을 바꾸지 않고 고객센터 안내를 표시한다.

## 회원 프록시

- `GET /api/member/subscription/quote/?baseCode=&addonSlots=` → API `GET /subscriptions/change-quote`. 구성 값 검증 후 토큰만 전달하고 응답은 필요한 필드만 통과시킨다.
- `PUT|DELETE /api/member/subscription/scheduled-change/` → API 다운그레이드 예약·취소. 같은 출처 요청 + OWNER·이메일 인증·ACTIVE 계정만 허용. DELETE는 Fastify 빈 JSON 본문 거부를 피하려고 `{}`를 보낸다.

## 결제 사이트 링크 (결제 백엔드 연결 시 맞춰야 할 약속)

`checkoutUrl`이 설정되면 다음 쿼리로 이동한다. 결제 사이트는 PG 결제·환불 후 API 관리자 경로로 보고하며, API가 견적 시각(`quotedAt`, 1시간 이내)과 금액을 다시 검증한다.

| 상황 | 쿼리 |
|---|---|
| 신규 구독 | `action=subscribe&plan=BASE_15&addons=2&quotedAt=…` |
| 업그레이드 차액 | `action=upgrade&plan=…&addons=…&quotedAt=…` |
| 즉시 해지 | `action=cancel&quotedAt=…` |

`checkoutUrl`이 없으면 결제·해지 버튼은 "결제 준비 중"으로 비활성이다. 다운그레이드 예약은 결제가 없으므로 결제 사이트와 무관하게 동작한다.
