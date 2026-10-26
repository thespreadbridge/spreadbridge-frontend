import { homeFaqs } from '@/lib/public-faq';
import { LaunchCountdown } from './LaunchCountdown';
import { subscriptionCatalog } from '@/lib/subscription-catalog';
import { softwareSchema } from '@/lib/seo';
import { jsonLd } from '@/lib/insights';

// User-provided v6 HTML, retained for visual review in docs/design/.
export async function HomeContent() {
  const catalog = await subscriptionCatalog();
  const startingPlan = catalog?.products[0];
  return <>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(softwareSchema) }} />
<header className={"hero view-guest"}>
  <div className={"hero-glow"}></div>
  <div className={"wrap hero-grid"}>
    <div>
      <div className={"eyebrow"}><span className={"dot"}></span> 스프레드브리지 · 달러 스프레드 자동매매</div>
      <h1 className={"hero-title"}>달러선물·USDT 가격 차이를,<br /><span className={"hl"}>내 PC에서 자동으로</span></h1>
      <p className={"hero-sub"}>
        스프레드브리지는 업비트의 테더(USDT)와 한국투자증권의 미국달러선물 간 가격 차이(스프레드)를 확인하고, 사용자가 설정한 조건에 따라 매매를 실행하는 소프트웨어입니다.
      </p>
      <div className={"hero-actions"}>
        <a data-analytics-id="hero_start" className={"btn primary lg"} href={"#product"}>요금제 보기</a>
        <a data-analytics-id="hero_how" className={"btn ghost lg"} href={"#how"}>작동 방식 보기</a>
      </div>
      <div className={"hero-trust"}>
        <span className={"t"}><span className={"ic"}>◆</span> 내 PC에서 실행</span>
        <span className={"t"}><span className={"ic"}>◆</span> 투자금은 본인 계좌에 보관</span>
        <span className={"t"}><span className={"ic"}>◆</span> 출금 권한 차단</span>
      </div>
    </div>

    
    <div className={"board"}>
      <div className={"board-head"}>
        <span className={"live"}>MEMBERS</span>
        <span className={"title"}>내 거래 리포트</span>
        <span className={"sub"}>🔒 구독 회원 전용</span>
      </div>
      <div className="board-body blurred" aria-hidden="true">
        {[1, 2, 3, 4, 5].map(row => <div className="board-row" key={row}>
          <div className="board-rank">—</div>
          <div className="board-user"><span className="board-skeleton" /><span className="board-skeleton short" /></div>
          <div className="board-bar-wrap"><div className="board-bar board-fill-78" /></div>
          <div className="board-pnl"><span className="board-skeleton" /></div>
        </div>)}
      </div>

      <div className={"board-lock"}>
        <div className={"lock-ic"}>🔒</div>
        <div className={"lock-title"}>내 거래 기록을 확인하세요</div>
        <div className={"lock-sub"}>로그인과 구독 확인 후 내 계정의<br />거래 기록과 실현손익을 확인할 수 있습니다</div>
        <a data-analytics-id="report_login" className={"btn primary"} href={"/login/"}>로그인하고 확인하기</a>
      </div>
      <div className={"board-foot"}>내 계정에서 서버에 수신된 거래 기록을 표시합니다</div>
    </div>
  </div>
</header>


<section className={"blk"} id={"how"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>작동 방식</div>
    <h2 className={"sec-title"}>전략은 당신이 실행은 에이전트가</h2>
    <p className={"sec-lead"}>세 단계면 충분합니다. 전략의 세부는 감춰져 있지만, 당신이 다루는 화면은 이만큼 단순합니다.</p>
    <div className={"how-grid"}>
      <div className={"how-card"}>
        <div className={"how-num"}>01</div>
        <h3>조건을 정합니다</h3>
        <p>어느 격차에서 들어가고 어디서 나올지, 얼마씩 운용할지, 손절은 어디서 걸지. 슬롯 하나에 전략 하나를 담습니다.</p>
      </div>
      <div className={"how-card"}>
        <div className={"how-num"}>02</div>
        <h3>에이전트가 지켜봅니다</h3>
        <p>격차는 하루에도 수없이 벌어졌다 좁혀집니다. 그 순간을 놓치지 않도록, 당신의 에이전트가 당신의 PC에서 24시간 감시합니다.</p>
      </div>
      <div className={"how-card"}>
        <div className={"how-num"}>03</div>
        <h3>조건이 맞으면 실행합니다</h3>
        <p>설정한 스프레드에 도달하면 양쪽 시장에서 동시에 포지션을 잡아 환율 방향의 영향을 줄입니다. 이후 설정한 청산·손절 조건에 따라 포지션을 정리합니다. 전 과정이 기록으로 남습니다.</p>
      </div>
    </div>
  </div>
</section>


<section className={"blk section-tint-bordered"} id={"security"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>권한과 통제</div>
    <h2 className={"sec-title"}>모든 권한은 당신 손안에 있습니다</h2>
    <p className={"sec-lead"}>에이전트는 당신이 허용한 범위 안에서만 움직입니다. 설정도, 실행도, 정지도 전부 당신이 직접 결정합니다.</p>
    <div className={"trust-grid"}>
      <div className={"trust-card"}>
        <div className={"trust-ic"}>🖥️</div>
        <h3>내 PC에서 내가 실행합니다</h3>
        <p>에이전트는 이용자의 PC에서 설정 조건을 확인하고 거래소·증권사로 주문을 전송합니다. 시작과 정지는 이용자가 직접 결정합니다.</p>
      </div>
      <div className={"trust-card"}>
        <div className={"trust-ic"}>🎚️</div>
        <h3>내가 정한 조건대로만 움직입니다</h3>
        <p>진입·청산·손절·운용 규모까지 모든 조건을 당신이 직접 설정합니다. 에이전트는 그 설정을 벗어나지 않고 충실히 실행합니다.</p>
      </div>
      <div className={"trust-card"}>
        <div className={"trust-ic"}>🔐</div>
        <h3>딱 필요한 권한만 부여합니다</h3>
        <p>API 키 발급 시 출금 권한을 제외하세요.</p>
      </div>
    </div>
  </div>
</section>


<section className={"blk"} id={"product"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>요금</div>
    <h2 className={"sec-title"}>지금 시작하면 가장 저렴합니다</h2>
    <p className={"sec-lead"}>출시 할인은 지금 참여하는 분들께만 적용됩니다. 이용자가 늘수록 할인폭은 줄어들고, 가장 낮은 가격은 지금뿐입니다.</p>
    <div className={"prod-wrap"}>
      <div className={"prod-card live"}>
        <span className={"prod-badge now"}>● 지금 이용 가능</span>
        <h3>스프레드브리지</h3>
        <p className={"desc"}>USDT·달러선물 스프레드 거래를 자동화합니다. 슬롯별로 조건을 설정하고 여러 전략을 함께 운용할 수 있습니다.</p>
        <div className={"prod-price"}>
          <div className={"price-top"}>
            {startingPlan?.promotion_label ? <span className={"price-off"}>{startingPlan.promotion_label}</span> : null}
          </div>
          {startingPlan ? <><span className={"amt"}>{startingPlan.monthly_krw.toLocaleString('ko-KR')}원</span><span className={"per"}> / 월부터 · 부가세 포함</span>
            <div className={"price-note"}>{startingPlan.name} 기준 · <a href="/pricing/">전체 요금 보기</a></div></> : <p role="status">{catalog ? '현재 판매 중인 구독 상품이 없습니다.' : '요금 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'}</p>}
          <LaunchCountdown />
        </div>
        <ul className={"prod-feat"}>
          <li><span className={"ck"}>✓</span> 슬롯 단위 전략 등록 · 동시 운용</li>
          {catalog?.addon ? <li><span className={"ck"}>✓</span> 슬롯 1개씩 추가 · 월 {catalog.addon.monthly_krw.toLocaleString('ko-KR')}원 (최대 {catalog.addon.max_quantity}개)</li> : null}
          <li><span className={"ck"}>✓</span> 진입 · 청산 · 손절 직접 설정</li>
          <li><span className={"ck"}>✓</span> 24시간 자동 감시 · 실행</li>
          <li><span className={"ck"}>✓</span> IP 변경 자동 감지 · 재등록 안내</li>
          <li><span className={"ck"}>✓</span> 모의거래 모드 · 실시간 리포트</li>
        </ul>
        <a data-analytics-id="product_start" className={"btn primary"} href={"/payments/"}>구독 시작하기</a>
      </div>

      <div className={"prod-card"}>
        <span className={"prod-badge soon"}>준비 중</span>
        <h3>더 많은 전략</h3>
        <p className={"desc"}>지원 시장과 전략 설정 기능을 확대할 예정입니다. 구체적인 내용과 일정은 확정 후 안내합니다.</p>
        <div className={"prod-price"}>
          <span className={"amt text-dim"}>출시 예정</span>
        </div>
        <ul className={"prod-feat prod-soon-list"}>
          <li><span className={"ck"}>○</span> 새로운 페어 · 시장 확장</li>
          <li><span className={"ck"}>○</span> 고급 리스크 관리 도구</li>
          <li><span className={"ck"}>○</span> 전용 초기 설정 안내 · 우선 지원</li>
        </ul>
        <a className={"btn ghost"} href={"/notices/"}>출시 소식 보기</a>
      </div>
    </div>

    
    <div className={"elig"}>
      <div className={"elig-ic"}>📋</div>
      <div>
        <h3>시작 전에 필요한 것</h3>
        <div className={"elig-items"}>
          <div className={"elig-item"}>거래 계좌<b>업비트 계정·한국투자증권 국내선물옵션 계좌</b></div>
          <div className={"elig-item"}>파생상품 거래 준비<b>본인에게 적용되는 교육·모의거래 요건 확인</b></div>
          <div className={"elig-item"}>상시 켜둘 PC<b>또는 미니PC 권장</b></div>
        </div>
        <p className="elig-note">
          본인에게 적용되는 사전교육·모의거래·기본예탁금 요건을 증권사에서 확인하세요.
        </p>
      </div>
    </div>

    
    <div className={"risk-band"}>
      <h3>⚠ 시작 전 반드시 확인하세요</h3>
      <p>스프레드브리지는 매매 자동화 도구이며 투자자문 서비스를 제공하지 않습니다. 원금과 수익을 보장하지 않습니다. USDT 매수·달러선물 매도 조합에서는 진입 시점보다 스프레드 값이 커지면 비용 차감 전 손익에 유리하고 작아지면 불리합니다. 실제 순손익은 체결 결과와 거래 비용에 따라 달라집니다.</p>
      <p>투자 판단과 거래 설정은 이용자가 결정합니다. 회사와 이용자의 책임 범위는 이용약관 및 관계 법령에 따릅니다. 파생상품 거래에서는 예탁금을 초과하는 손실이 발생할 수 있으며 추가 증거금 납부나 반대매매가 발생할 수 있습니다.</p>
    </div>
  </div>
</section>


<section className={"blk section-tint"} id={"faq"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>자주 묻는 질문</div>
    <h2 className={"sec-title"}>궁금한 것들</h2>
    <div className={"faq"}>
      {homeFaqs.map((faq, index) => <div className={index === 0 ? 'faq-item open' : 'faq-item'} key={faq.id}>
        <div data-analytics-id={'faq_' + faq.id} className="faq-q" role="button" aria-expanded={index === 0} tabIndex={0}>{faq.question} <span className="plus">+</span></div>
        <div className="faq-a">{faq.answer}</div>
      </div>)}
    </div>
  </div>
</section>


<section className={"final view-guest"}>
  <div className={"final-glow"}></div>
  <div className={"wrap"}>
    <h2>가격 격차는 수시로 계속 벌어집니다</h2>
    <p>매 순간 지켜보지 않아도 당신의 전략대로 움직이는 트레이딩 에이전트</p>
    <a data-analytics-id="final_start" className={"btn primary lg"} href={"/login/"}>가입·로그인</a>
  </div>
</section>





  </>;
}
