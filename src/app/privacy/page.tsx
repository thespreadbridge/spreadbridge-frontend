import { publicPageMetadata } from '@/lib/seo';
import { InformationPage } from '@/components/information/InformationPage';

export const metadata = publicPageMetadata('/privacy/');

export default function PrivacyPage() {
  return <InformationPage title="개인정보처리방침" eyebrow="SPREADBRIDGE · PRIVACY" updatedAt="2026-10-24" dateLabel="최종 변경일" description="Spreadbridge 웹사이트와 데스크톱 앱에서 개인정보를 어떻게 처리하는지 안내합니다.">
        <section>
          <h2>1. 운영자와 문의 창구</h2>
          <p>Spreadbridge 운영자는 회원 가입, 로그인 및 고객 계좌에서 실행하는 차익거래 자동매매 서비스 제공에 필요한 개인정보를 처리합니다.</p>
          <p>개인정보 관련 문의, 열람·정정·삭제·처리정지 및 회원 탈퇴 요청은 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>으로 보내주세요. 요청자 본인 여부와 처리 범위를 확인한 후 안내합니다.</p>
        </section>
        <section>
          <h2>2. 처리하는 정보와 이용 목적</h2>
          <div className="site-table-wrap">
            <table>
              <caption>이용 기능에 따른 개인정보 처리 항목</caption>
              <thead><tr><th scope="col">이용 기능</th><th scope="col">처리 정보</th><th scope="col">목적</th></tr></thead>
              <tbody>
                <tr><th scope="row">회원 가입·로그인</th><td>Google 계정 식별자, 이메일, 이름, 회사·담당자 정보, 이메일 확인 여부. 기존 계정 및 관리자 계정은 비밀번호의 단방향 해시가 보관될 수 있습니다</td><td>회원 식별, 계정 관리, 본인 확인</td></tr>
                <tr><th scope="row">Google 로그인</th><td>Google 계정 식별자, 이메일과 확인 여부, 이름, 인증 처리에 필요한 코드·토큰</td><td>Google 계정 확인, 회원 가입, 로그인 세션 발급</td></tr>
                <tr><th scope="row">서비스 이용·보안</th><td>로그인 시간, IP 주소, 브라우저·앱·기기 정보, 세션, 접속·감사·오류 기록</td><td>로그인 유지, 기기 인증, 부정 이용 방지, 장애 대응</td></tr>
                <tr><th scope="row">거래 연결·실행</th><td>선택한 거래소, 계좌·연결 식별정보, 전략 설정, 주문·체결·잔고·손익 및 실행 기록</td><td>사용자가 요청한 계좌 연결, 거래 실행, 상태 표시 및 대사</td></tr>
                <tr><th scope="row">결제·이용료 기능 사용 시</th><td>결제 주문번호, 금액, 결제·환불 상태, 크레딧 및 이용료 기록</td><td>이용료 정산, 결제 확인, 환불 및 문의 처리</td></tr>
                <tr><th scope="row">고객 문의</th><td>회신 연락처와 사용자가 제공한 문의 내용</td><td>문의 답변, 권리 행사 및 분쟁 처리</td></tr>
              </tbody>
            </table>
          </div>
          <p>정보는 사용자의 입력, Google 인증 응답, 사용자가 연결한 거래소 및 서비스 이용 과정에서 수집됩니다. 선택한 기능에 필요한 범위에서 처리하며, Google 로그인 대신 이메일 가입을 이용할 수 있습니다.</p>
        </section>
        <section>
          <h2>3. Google 사용자 정보의 처리</h2>
          <p>Google 로그인은 기본 계정 확인 권한(openid, email, profile)을 요청합니다. Gmail 메일, Google Drive 파일, 연락처 또는 캘린더 내용에 대한 접근 권한은 요청하지 않습니다. 기본 프로필 중 계정 식별자, 이메일 및 이름을 회원 정보로 저장하며 프로필 사진은 회원 정보로 저장하지 않습니다.</p>
          <p>Google 인증 코드는 서버에서 확인하고, 데스크톱 앱에는 짧은 유효기간의 일회용 코드를 전달합니다. Google 로그인 정보를 광고 타기팅, 개인정보 판매 또는 범용 AI 모델 학습에 사용하지 않습니다.</p>
          <p>Google에서 받은 정보의 이용과 다른 서비스로의 전송에는 <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API 서비스 사용자 데이터 정책</a>의 제한적 이용(Limited Use) 요건을 적용합니다.</p>
          <p><a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">Google 계정의 연결 관리</a>에서 접근 권한을 해제할 수 있습니다. Google 연결 해제와 Spreadbridge에 이미 저장된 회원 정보의 삭제는 별도 절차이므로, 저장 정보 삭제는 위 문의 창구로 요청해 주세요.</p>
        </section>
        <section>
          <h2>4. 정보의 저장과 보호</h2>
          <p>회원·인증·기기 및 서비스 운영 기록은 운영 서버와 데이터베이스에서 관리합니다. 일반 회원은 Google 계정으로 가입·로그인합니다. 기존 계정 및 관리자 계정의 비밀번호는 단방향 해시로 보관하며, 전송 구간에는 HTTPS를 사용합니다. 운영상 필요한 담당자로 접근을 제한합니다.</p>
          <p>데스크톱 앱에 등록한 거래소 API 비밀키와 자동 로그인 정보는 사용자 컴퓨터에서 운영체제의 보호 기능으로 암호화하여 보관합니다. 앱은 사용자가 연결한 거래소에 인증 및 주문 요청을 보내며, 거래 실행 결과와 운영에 필요한 기록을 서비스 서버에 전송합니다.</p>
          <p>로그아웃만으로 컴퓨터에 저장된 거래소 연결·전략·거래 기록이 모두 삭제되지는 않습니다. 공용 컴퓨터를 사용하거나 앱을 제거하려는 경우 연결 해제와 로컬 데이터 정리 여부를 함께 확인해 주세요.</p>
        </section>
        <section>
          <h2>5. 외부 서비스와 정보 제공</h2>
          <p>Google 계정 인증과 웹사이트 이용 분석에는 Google을, 웹사이트 호스팅에는 Vercel을, API와 회원 데이터 운영에는 Amazon Web Services를 이용합니다. 각 서비스는 제공하는 기능에 따라 인증 정보, 접속 IP, 요청 주소와 운영 데이터를 처리합니다. 글로벌 인프라 이용 과정에서 정보가 국외에서 처리될 수 있습니다.</p>
          <p>사용자가 거래소 연결과 거래 실행을 요청하면 해당 거래소에 인증·계좌 조회·주문에 필요한 정보가 전달됩니다. 결제 기능을 이용하는 경우에는 결제 화면에 안내된 결제 서비스가 결제 처리를 수행합니다.</p>
          <p>서비스 제공에 필요한 처리, 사용자 동의 또는 법령상 근거가 있는 경우를 제외하고 개인정보를 외부에 제공하지 않습니다. 개인정보를 판매하지 않으며, 외부 서비스의 정보 처리에 대해서는 각 서비스의 정책도 확인할 수 있습니다: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google 개인정보처리방침</a>, <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">Vercel 개인정보 안내</a>, <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noreferrer">AWS 개인정보 안내</a>.</p>
        </section>
        <section>
          <h2>6. 보관 기간과 파기</h2>
          <p>회원 정보는 계정 유지와 서비스 제공에 필요한 동안 보관합니다. 탈퇴 또는 삭제 요청을 받으면 진행 중인 거래·정산과 법령상 보존 의무를 확인하고, 보관할 필요가 없는 개인정보를 삭제하거나 개인을 식별할 수 없도록 처리합니다.</p>
          <p>법령에 따라 보존해야 하는 결제·분쟁 관련 기록은 해당 법령이 정한 기간과 목적의 범위에서 보관합니다. 삭제 요청 처리 시 계속 보관해야 하는 정보가 있으면 그 사유와 적용 기간을 안내합니다. 전자적 정보는 복구하기 어렵도록 삭제하며, 백업본의 잔여 정보도 백업 교체·폐기 절차에 따라 정리합니다.</p>
          <p>앱의 계정 폐쇄 요청은 거래 중지와 정리 절차를 시작하는 기능이며, 요청 즉시 모든 거래 기록이 자동 삭제되는 것은 아닙니다. 사용자 컴퓨터의 로컬 데이터는 서버 정보와 별도로 정리해야 합니다.</p>
        </section>
        <section>
          <h2>7. 쿠키와 로그인 유지</h2>
          <p>웹사이트는 로그인 세션과 갱신을 위한 필수 쿠키를 사용합니다. 로그인용 쿠키는 자바스크립트에서 직접 읽을 수 없도록 설정하며, 브라우저에서 쿠키를 삭제하거나 차단할 수 있습니다. 차단 시 로그인 유지 기능이 제한될 수 있습니다.</p>
          <p>데스크톱 앱의 자동 로그인 정보는 로컬 암호화 저장소에 보관됩니다. 자동 로그인 해제 또는 로그아웃으로 저장된 세션의 사용을 중단할 수 있습니다.</p>
        </section>
        <section>
          <h2>8. 웹사이트 이용 분석</h2>
          <p>웹사이트의 유입 경로와 이용 흐름을 개선하기 위해 Google Analytics 4를 사용합니다. 방문 페이지, 주요 버튼 클릭, 스크롤, 기기·브라우저 정보와 유입 사이트·캠페인 정보를 분석합니다. 로그인 회원의 이용 흐름은 이메일과 구분되는 서비스 내부 식별자(User-ID) 및 로그인·구독 상태와 함께 분석합니다.</p>
          <p>이메일, 이름, 계좌번호, 거래소 API 키, 개별 거래 기록과 손익은 분석 이벤트로 전송하지 않습니다. 로그인 인증 코드·토큰이 들어 있는 주소는 분석 대상에서 제외하고, 주소의 불필요한 매개변수를 제거합니다. Google 측의 이메일·인증 매개변수 삭제 설정도 적용합니다.</p>
          <p>Google Analytics 쿠키의 유지 기간은 1년으로 설정하며, 분석 데이터는 Google의 글로벌 인프라에서 처리될 수 있습니다. 광고 개인 최적화와 Google Signals는 사용하지 않습니다. 브라우저의 추적 금지(Do Not Track) 또는 Global Privacy Control 신호가 켜져 있으면 분석 태그를 로드하지 않습니다. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Google Analytics 차단 도구</a>와 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Google의 파트너 사이트 데이터 처리 안내</a>도 확인할 수 있습니다.</p>
        </section>
        <section>
          <h2>9. 이용자의 권리와 방침 변경</h2>
          <p>개인정보 열람·정정·삭제·처리정지와 동의 철회를 요청할 수 있습니다. 요청은 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>으로 접수하며, 확인 과정에서 비밀번호나 거래소 API 비밀키를 보내지 마세요. 법령상 의무 또는 진행 중인 거래·정산으로 처리가 제한되는 경우에는 이유를 안내합니다.</p>
          <p>정보 처리 방식이 바뀌면 이 페이지의 내용과 시행일을 갱신합니다. 수집 목적이나 제공 범위 등 중요한 변경은 웹사이트 또는 앱에서 안내하고, 추가 동의가 필요한 경우 별도로 요청합니다.</p>
        </section>

  </InformationPage>;
}
