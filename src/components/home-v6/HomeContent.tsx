import { subscriptionExpiryFaq } from '@/lib/public-faq';
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
      <div className={"eyebrow"}><span className={"dot"}></span> Spreadbridge · 달러 스프레드 자동매매</div>
      <h1 className={"hero-title"}>달러선물·USDT 가격 차이를,<br /><span className={"hl"}>내 PC에서 자동으로</span></h1>
      <p className={"hero-sub"}>
        스프레드브릿지는 업비트 USDT와 한국투자증권 달러선물의 가격 차이를 확인하고,
        내가 정한 조건에 따라 내 PC에서 실행하는 자동매매 소프트웨어입니다.
      </p>
      <div className={"hero-actions"}>
        <a data-analytics-id="hero_start" className={"btn primary lg"} href={"#product"}>Spreadbridge 시작하기</a>
        <a data-analytics-id="hero_how" className={"btn ghost lg"} href={"#how"}>작동 방식 보기</a>
      </div>
      <div className={"hero-trust"}>
        <span className={"t"}><span className={"ic"}>◆</span> 내 PC에서 실행</span>
        <span className={"t"}><span className={"ic"}>◆</span> 회사는 계좌에 접근 불가</span>
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
    <h2 className={"sec-title"}>복잡한 건 에이전트들이, 결정은 당신이</h2>
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
        <p>정해둔 격차에 닿으면 양쪽을 동시에 잡아 균형을 맞추고, 격차가 좁혀지면 빠져나옵니다. 전 과정이 기록으로 남습니다.</p>
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
        <p>에이전트는 당신의 컴퓨터에서 돕니다. 시작과 정지를 당신이 직접 누르고, 매매 판단과 주문 모두 당신의 기기 안에서 이뤄집니다.</p>
      </div>
      <div className={"trust-card"}>
        <div className={"trust-ic"}>🎚️</div>
        <h3>내가 정한 조건대로만 움직입니다</h3>
        <p>진입·청산·손절·운용 규모까지 모든 조건을 당신이 직접 설정합니다. 에이전트는 그 설정을 벗어나지 않고 충실히 실행합니다.</p>
      </div>
      <div className={"trust-card"}>
        <div className={"trust-ic"}>🔐</div>
        <h3>딱 필요한 권한만 부여합니다</h3>
        <p>거래소 연결 키는 당신의 PC에만 저장되고, 매매에 필요한 권한만 허용됩니다. 자산을 옮기는 권한은 처음부터 부여되지 않습니다.</p>
      </div>
    </div>
  </div>
</section>


<section className={"blk"} id={"product"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>요금</div>
    <h2 className={"sec-title"}>지금 시작하면 가장 저렴합니다</h2>
    <p className={"sec-lead"}>런칭 할인은 지금 참여하는 분들께만 적용됩니다. 이용자가 늘수록 할인폭은 줄어들고, 가장 낮은 가격은 지금뿐입니다.</p>
    <div className={"prod-wrap"}>
      <div className={"prod-card live"}>
        <span className={"prod-badge now"}>● 지금 이용 가능</span>
        <h3>Spreadbridge</h3>
        <p className={"desc"}>달러 격차를 자동으로 잡는 매매 프로그램. 슬롯 단위로 전략을 만들고, 동시에 여러 개를 굴립니다.</p>
        <div className={"prod-price"}>
          <div className={"price-top"}>
            {startingPlan?.promotion_label ? <span className={"price-off"}>{startingPlan.promotion_label}</span> : null}
          </div>
          {startingPlan ? <><span className={"amt"}>{startingPlan.monthly_krw.toLocaleString('ko-KR')}원</span><span className={"per"}> / 월부터</span>
            <div className={"price-note"}>{startingPlan.name} 기준 · <a href="/pricing/">전체 요금 보기</a></div></> : <p role="status">{catalog ? '현재 판매 중인 구독 상품이 없습니다.' : '요금 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'}</p>}
          <LaunchCountdown />
        </div>
        <ul className={"prod-feat"}>
          <li><span className={"ck"}>✓</span> 슬롯 단위 전략 등록 · 동시 운용</li>
          <li><span className={"ck"}>✓</span> 진입 · 청산 · 손절 직접 설정</li>
          <li><span className={"ck"}>✓</span> 24시간 자동 감시 · 실행</li>
          <li><span className={"ck"}>✓</span> IP 변경 자동 감지 · 재등록 안내</li>
          <li><span className={"ck"}>✓</span> 모의거래 모드 · 실시간 리포트</li>
        </ul>
        <a data-analytics-id="product_start" className={"btn primary"} href={"/payments/"}>Spreadbridge 시작하기</a>
      </div>

      <div className={"prod-card"}>
        <span className={"prod-badge soon"}>준비 중</span>
        <h3>더 많은 전략</h3>
        <p className={"desc"}>Spreadbridge가 자리 잡으면, 다른 격차와 다른 시장을 다루는 상품이 순차적으로 추가됩니다.</p>
        <div className={"prod-price"}>
          <span className={"amt text-dim"}>Coming</span>
        </div>
        <ul className={"prod-feat prod-soon-list"}>
          <li><span className={"ck"}>○</span> 새로운 페어 · 시장 확장</li>
          <li><span className={"ck"}>○</span> 고급 리스크 관리 도구</li>
          <li><span className={"ck"}>○</span> 전용 온보딩 · 우선 지원</li>
        </ul>
        <a className={"btn ghost"} href={"/notices/"}>출시 소식 보기</a>
      </div>
    </div>

    
    <div className={"elig"}>
      <div className={"elig-ic"}>📋</div>
      <div>
        <h3>시작 전에 필요한 것</h3>
        <div className={"elig-items"}>
          <div className={"elig-item"}>거래소 계정<b>업비트 · 한국투자</b></div>
          <div className={"elig-item"}>파생상품 거래 자격<b>사전교육 · 모의거래 이수</b></div>
          <div className={"elig-item"}>상시 켜둘 PC<b>또는 미니PC 권장</b></div>
        </div>
        <p className="elig-note">
          파생상품 거래에는 기본예탁금과 사전 교육 이수가 필요합니다. 자격이 준비되지 않았다면 안내를 도와드립니다.
        </p>
      </div>
    </div>

    
    <div className={"risk-band"}>
      <h3>⚠ 시작 전 반드시 확인하세요</h3>
      <p>
        Spreadbridge는 매매를 자동화하는 도구이며, 투자 자문이나 수익을 보장하지 않습니다.
        시장의 격차는 좁혀질 것으로 기대되지만, 반대로 벌어지는 국면에서는 손실이 발생할 수 있고
        선물 포지션에서 증거금 부족이 생길 수 있습니다. 모든 설정과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
      </p>
    </div>
  </div>
</section>


<section className={"blk section-tint"} id={"faq"}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>자주 묻는 질문</div>
    <h2 className={"sec-title"}>궁금한 것들</h2>
    <div className={"faq"}>
      <div className={"faq-item open"}>
        <div data-analytics-id="faq_custody" className={"faq-q"} role={"button"} tabIndex={0}>제 돈을 맡기는 건가요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>아닙니다. 프로그램은 당신의 PC에서 당신의 거래소 계정으로 직접 매매합니다. Spreadbridge는 당신의 자금을 받거나 보관하지 않고, 계좌에 접근할 수도 없습니다. 우리는 소프트웨어를 제공할 뿐입니다.</div>
      </div>
      <div className={"faq-item"}>
        <div data-analytics-id="faq_returns" className={"faq-q"} role={"button"} tabIndex={0}>수익이 보장되나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>보장하지 않습니다. 이 프로그램은 정해진 조건에 따라 매매를 자동화할 뿐이며, 시장 상황과 당신의 설정에 따라 손실이 발생할 수 있습니다. 수익을 약속하는 어떤 표현도 하지 않습니다.</div>
      </div>
      <div className={"faq-item"}>
        <div data-analytics-id="faq_pc_uptime" className={"faq-q"} role={"button"} tabIndex={0}>컴퓨터를 계속 켜둬야 하나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>네. 프로그램이 당신의 PC에서 실행되므로, 자동 운용 중에는 컴퓨터가 켜져 있어야 합니다. 전기 소모가 적은 미니PC를 두고 상시 운용하는 방식을 권장합니다.</div>
      </div>
      <div className={"faq-item"}>
        <div data-analytics-id="faq_strategy" className={"faq-q"} role={"button"} tabIndex={0}>전략이 정확히 뭔가요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>달러와 관련된 두 시장 사이의 가격 격차를 이용합니다. 세부 산식과 실행 방식은 Spreadbridge의 핵심 자산이라 공개하지 않지만, 프로그램 안에서 당신이 조정할 수 있는 조건은 모두 투명하게 열려 있습니다.</div>
      </div>
      <div className={"faq-item"}>
        <div data-analytics-id="faq_setup" className={"faq-q"} role={"button"} tabIndex={0}>프로그래밍을 몰라도 되나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>됩니다. 설치부터 연결, 전략 등록까지 화면 안내를 따라가면 되고, 초기 설정은 1:1 온보딩으로 도와드립니다.</div>
      </div>
      <div className={"faq-item"}>
        <div data-analytics-id={"faq_" + subscriptionExpiryFaq.id} className={"faq-q"} role={"button"} tabIndex={0}>{subscriptionExpiryFaq.question} <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>{subscriptionExpiryFaq.answer}</div>
      </div>
    </div>
  </div>
</section>


<section className={"final view-guest"}>
  <div className={"final-glow"}></div>
  <div className={"wrap"}>
    <h2>격차는 지금도 벌어지고 있습니다</h2>
    <p>사람이 밤새 지켜볼 수 없는 순간을, 기계에게 맡기세요.</p>
    <a data-analytics-id="final_start" className={"btn primary lg"} href={"/login/"}>Spreadbridge 시작하기</a>
  </div>
</section>





  </>;
}
