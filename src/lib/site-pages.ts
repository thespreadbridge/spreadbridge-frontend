export const SITE_ORIGIN = 'https://thespreadbridge.com';
export const SITE_NAME = '스프레드브리지';
// Update when the public content/metadata is materially revised.
export const SITE_CONTENT_UPDATED_AT = '2026-10-26';
export const PUBLIC_PAGES: Record<string, { title: string; description: string }> = {
  '/': { title: '스프레드브리지 | 달러선물·USDT 스프레드 자동매매', description: '업비트 USDT와 한국투자증권 달러선물의 가격 차이를 비교하고 설정한 조건으로 실행하는 PC 자동매매 소프트웨어. 스프레드브리지의 작동 방식, 월 구독 요금, 설치와 사용 가이드를 확인하세요.' },
  '/guide/': { title: '시작 가이드 | 계좌 준비·API 연결·전략 설정', description: '스프레드브리지 시작에 필요한 업비트·한국투자증권 계좌, API 권한, PC 설치, 전략 설정과 실행 전 확인 사항을 안내합니다.' },
  '/pricing/': { title: '구독 요금 | 5·15·25슬롯 월 요금제·추가 슬롯', description: '스프레드브리지의 슬롯별 월 구독 요금과 이용 조건을 확인하세요. 거래소·증권사 수수료와 소프트웨어 구독료를 구분해 안내합니다.' },
  '/download/': { title: '앱 다운로드 | Windows·Mac 설치 안내', description: '스프레드브리지 PC 앱의 Windows·Mac 배포 현황과 설치·업데이트 방법을 확인하세요.' },
  '/blog/': { title: '블로그 | 달러선물·USDT 스프레드 거래 가이드', description: '달러선물과 USDT 가격 차이의 원리, 계좌 준비, API 연결, 앱 설정과 운용을 설명하는 스프레드브리지 블로그입니다.' },
  '/privacy/': { title: '개인정보처리방침', description: '스프레드브리지의 개인정보와 Google 로그인 정보 처리, 웹사이트 이용 분석, 보관·삭제 및 문의 방법을 안내합니다.' },
  '/notices/': { title: '공지사항 | 서비스 변경·업데이트 안내', description: '스프레드브리지의 서비스 변경, 점검과 앱 업데이트 소식을 확인하세요.' },
  '/terms/': { title: '이용약관', description: '스프레드브리지 서비스와 월 구독 이용, 계정 관리, 해지·환불 및 책임 범위를 안내합니다.' },
  '/risk/': { title: '위험고지 | 스프레드 거래 전 확인 사항', description: '달러선물·USDT 스프레드 거래의 가격, 증거금, 만기, 부분 체결과 연결 장애 위험을 확인하세요.' },
  '/api-consent/': { title: 'API 사용동의 | 거래소 연결과 권한 안내', description: '스프레드브리지의 거래소·증권사 API 연결 목적, 조회·주문 권한, 키 관리와 연결 해제 방법을 안내합니다.' },
};
export const ACCOUNT_PAGE_TITLES: Record<string, string> = {
  '/login/': '로그인 | 스프레드브리지', '/payments/': '구독 관리 | 스프레드브리지', '/race/': '진입갭 레이스 | 스프레드브리지',
};
