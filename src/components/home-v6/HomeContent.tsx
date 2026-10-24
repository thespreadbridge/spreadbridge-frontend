import { SpreadChart } from './SpreadChart';

// User-provided v6 HTML, retained for visual review in docs/design/.
export function HomeContent() {
  return <>



<nav>
  <div className={"wrap"}>
    <div className={"logo"}>Spread<b>bridge</b></div>
    <div className={"nav-links"}>
      <a href={"#how"}>작동 방식</a>
      <a href={"#security"}>보안</a>
      <a href={"#product"}>요금</a>
      <a href={"#faq"}>FAQ</a>
    </div>
    <div className={"nav-cta"}>
      <div className={"view-switch"} id={"viewSwitch"} title={"프로토타입 상태 전환"}>
        <button data-view={"guest"} className={"active"}>비로그인</button>
        <button data-view={"free"}>구독X 로그인</button>
        <button data-view={"paid"}>구독O 로그인</button>
      </div>
      <a className={"btn ghost"} href={"https://dollarflow.growbee.ai/login"} id={"loginBtn"}>로그인</a>
      <a className={"btn primary"} href={"#product"} id={"startBtn"}>시작하기</a>
      <div className={"user-chip"} id={"userChip"}>
        <span className={"uc-avatar"}>ha</span>
        <span className={"uc-name"}>ha**3 님</span>
        <a href={"#"} id={"logoutBtn"} className={"uc-out"}>로그아웃</a>
      </div>
    </div>
  </div>
</nav>


<header className={"hero view-guest"}>
  <div className={"hero-glow"}></div>
  <div className={"wrap hero-grid"}>
    <div>
      <div className={"eyebrow"}><span className={"dot"}></span> 24시간 멈추지 않는 나만의 매매 에이전트</div>
      <h1 className={"hero-title"}>미국 달러의 시장 격차,<br /><span className={"hl"}>공략해서 수익을 냅니다</span></h1>
      <p className={"hero-sub"}>
        국제 기준통화인 달러, 그리고 그와 똑같은 가치를 지닌 디지털 달러.
        제도와 국경 때문에 한국에서 이 둘의 값은 늘 어긋납니다.
        그 격차가 벌어질 때 사고 좁혀질 때 팔아 수익을 내는 일을,
        당신만의 에이전트들이 24시간 쉬지 않고 대신합니다.
      </p>
      <div className={"hero-actions"}>
        <a className={"btn primary lg"} href={"#product"}>Spreadbridge 시작하기</a>
        <a className={"btn ghost lg"} href={"#how"}>작동 방식 보기</a>
      </div>
      <div className={"hero-trust"}>
        <span className={"t"}><span className={"ic"}>◆</span> 내 PC에서 실행</span>
        <span className={"t"}><span className={"ic"}>◆</span> 회사는 계좌에 접근 불가</span>
        <span className={"t"}><span className={"ic"}>◆</span> 출금 권한 차단</span>
      </div>
    </div>

    
    <div className={"board"}>
      <div className={"board-head"}>
        <span className={"live"}><span className={"pip"}></span> LIVE</span>
        <span className={"title"}>이용자 수익 보드</span>
        <span className={"sub"}>🔒 구독 회원 전용</span>
      </div>
      <div className={"board-body blurred"}>
        <div className={"board-row top1"}>
          <div className={"board-rank"}>1</div>
          <div className={"board-user"}>
            <span className={"board-id"}>ki**7</span>
            <span className={"board-meta"}><span className={"in"}>진입 142</span> · <span className={"out"}>슬롯 3</span> · 운용 21일</span>
          </div>
          <div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "100%"}}></div></div>
          <div className={"board-pnl up"}>+₩4.82M</div>
        </div>
        <div className={"board-row top2"}>
          <div className={"board-rank"}>2</div>
          <div className={"board-user"}>
            <span className={"board-id"}>so**2</span>
            <span className={"board-meta"}><span className={"in"}>진입 98</span> · <span className={"out"}>슬롯 2</span> · 운용 34일</span>
          </div>
          <div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "78%"}}></div></div>
          <div className={"board-pnl up"}>+₩3.61M</div>
        </div>
        <div className={"board-row top3"}>
          <div className={"board-rank"}>3</div>
          <div className={"board-user"}>
            <span className={"board-id"}>ju**9</span>
            <span className={"board-meta"}><span className={"in"}>진입 216</span> · <span className={"out"}>슬롯 4</span> · 운용 12일</span>
          </div>
          <div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "59%"}}></div></div>
          <div className={"board-pnl up"}>+₩2.74M</div>
        </div>
        <div className={"board-row"}>
          <div className={"board-rank"}>4</div>
          <div className={"board-user"}>
            <span className={"board-id"}>mi**4</span>
            <span className={"board-meta"}><span className={"in"}>진입 61</span> · <span className={"out"}>슬롯 2</span> · 운용 8일</span>
          </div>
          <div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "41%"}}></div></div>
          <div className={"board-pnl up"}>+₩1.90M</div>
        </div>
        <div className={"board-row"}>
          <div className={"board-rank"}>5</div>
          <div className={"board-user"}>
            <span className={"board-id"}>yo**1</span>
            <span className={"board-meta"}><span className={"in"}>진입 34</span> · <span className={"out"}>슬롯 1</span> · 운용 3일</span>
          </div>
          <div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "24%"}}></div></div>
          <div className={"board-pnl up"}>+₩1.12M</div>
        </div>
      </div>
      
      <div className={"board-lock"}>
        <div className={"lock-ic"}>🔒</div>
        <div className={"lock-title"}>구독 회원에게만 공개됩니다</div>
        <div className={"lock-sub"}>다른 이용자들의 실제 누적 수익과 진입 기록을<br />구독 후 실시간으로 확인하세요</div>
        <a className={"btn primary"} href={"#product"}>구독하고 보드 열기</a>
      </div>
      <div className={"board-foot"}>계정 아이디는 익명 처리됩니다 · 누적 수익은 이용자별 설정과 운용 기간에 따라 다릅니다</div>
    </div>
  </div>
</header>


<section className={"logged-main view-free"}>
  <div className={"wrap"}>
    <div className={"welcome-bar"}>
      <div>
        <div className={"wb-hi"}>환영합니다, <b>ha**3</b> 님</div>
        <div className={"wb-sub"}>아직 구독 전이에요. 리더보드와 자동매매는 구독 후 이용할 수 있습니다.</div>
      </div>
      <a className={"btn primary"} href={"#pricing-free"}>지금 구독하기</a>
    </div>

    
    <div className={"board"} style={{"maxWidth": "none"}}>
      <div className={"board-head"}>
        <span className={"live"}><span className={"pip"}></span> LIVE</span>
        <span className={"title"}>이용자 수익 보드</span>
        <span className={"sub"}>🔒 구독 회원 전용</span>
      </div>
      <div className={"board-body board-body-wide blurred"}>
        <div className={"board-row top1"}><div className={"board-rank"}>1</div><div className={"board-user"}><span className={"board-id"}>ki**7</span><span className={"board-meta"}><span className={"in"}>진입 142</span> · <span className={"out"}>슬롯 3</span> · 운용 21일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "100%"}}></div></div><div className={"board-pnl up"}>+₩4.82M</div></div>
        <div className={"board-row top2"}><div className={"board-rank"}>2</div><div className={"board-user"}><span className={"board-id"}>so**2</span><span className={"board-meta"}><span className={"in"}>진입 98</span> · <span className={"out"}>슬롯 2</span> · 운용 34일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "78%"}}></div></div><div className={"board-pnl up"}>+₩3.61M</div></div>
        <div className={"board-row top3"}><div className={"board-rank"}>3</div><div className={"board-user"}><span className={"board-id"}>ju**9</span><span className={"board-meta"}><span className={"in"}>진입 216</span> · <span className={"out"}>슬롯 4</span> · 운용 12일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "59%"}}></div></div><div className={"board-pnl up"}>+₩2.74M</div></div>
        <div className={"board-row"}><div className={"board-rank"}>4</div><div className={"board-user"}><span className={"board-id"}>mi**4</span><span className={"board-meta"}><span className={"in"}>진입 61</span> · <span className={"out"}>슬롯 2</span> · 운용 8일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "41%"}}></div></div><div className={"board-pnl up"}>+₩1.90M</div></div>
        <div className={"board-row"}><div className={"board-rank"}>5</div><div className={"board-user"}><span className={"board-id"}>yo**1</span><span className={"board-meta"}><span className={"in"}>진입 34</span> · <span className={"out"}>슬롯 1</span> · 운용 3일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "24%"}}></div></div><div className={"board-pnl up"}>+₩1.12M</div></div>
      </div>
      <div className={"board-lock"} style={{"inset": "52px 0 42px"}}>
        <div className={"lock-ic"}>🔒</div>
        <div className={"lock-title"}>구독하면 바로 열립니다</div>
        <div className={"lock-sub"}>다른 이용자들의 실제 누적 수익과 진입 기록을<br />실시간으로 확인하고, 나도 보드에 이름을 올리세요</div>
        <a className={"btn primary"} href={"#pricing-free"}>구독하고 보드 열기</a>
      </div>
      <div className={"board-foot"}>계정 아이디는 익명 처리됩니다 · 표시된 수치는 과거 실적이며 미래 수익을 보장하지 않습니다</div>
    </div>

    
    <div id={"pricing-free"} style={{"marginTop": "56px"}}>
      <div className={"sec-eyebrow"}>구독 시작</div>
      <h2 className={"sec-title"}>지금 시작하면 가장 저렴합니다</h2>
      <p className={"sec-lead"}>런칭 할인은 지금 참여하는 분들께만 적용됩니다. 가장 낮은 가격은 지금뿐입니다.</p>
      <div className={"prod-wrap"}>
        <div className={"prod-card live"}>
          <span className={"prod-badge now"}>● 지금 이용 가능</span>
          <h3>Spreadbridge</h3>
          <p className={"desc"}>달러 격차를 자동으로 공략하는 매매 에이전트. 슬롯 단위로 전략을 만들고 동시에 여러 개를 굴립니다.</p>
          <div className={"prod-price"}>
            <div className={"price-top"}><span className={"price-orig"}>₩990,000</span><span className={"price-off"}>런칭 90% OFF</span></div>
            <span className={"amt"}>₩99,000</span><span className={"per"}> / 월</span>
            <div className={"price-note"}>얼리버드 한정가 · 이후 정상가로 조정됩니다</div>
          </div>
          <ul className={"prod-feat"}>
            <li><span className={"ck"}>✓</span> 슬롯 1개 · 전략 등록 및 자동 운용</li>
            <li><span className={"ck"}>✓</span> 진입 · 청산 · 손절 직접 설정</li>
            <li><span className={"ck"}>✓</span> 수익 보드 열람 · 내 순위 등록</li>
            <li><span className={"ck"}>✓</span> 모의거래 모드 · 실시간 리포트</li>
          </ul>
          <a className={"btn primary"} href={"https://dollarflow.growbee.ai/payments"}>이 플랜으로 구독하기</a>
        </div>
        <div className={"prod-card"}>
          <span className={"prod-badge soon"}>준비 중</span>
          <h3>더 많은 전략</h3>
          <p className={"desc"}>Spreadbridge가 자리 잡으면 다른 격차와 시장을 다루는 상품이 순차 추가됩니다.</p>
          <div className={"prod-price"}><span className={"amt"} style={{"color": "var(--ink-3)"}}>Coming</span></div>
          <ul className={"prod-feat prod-soon-list"}>
            <li><span className={"ck"}>○</span> 새로운 페어 · 시장 확장</li>
            <li><span className={"ck"}>○</span> 고급 리스크 관리 도구</li>
            <li><span className={"ck"}>○</span> 전용 온보딩 · 우선 지원</li>
          </ul>
          <a className={"btn ghost"} href={"#"}>출시 알림 받기</a>
        </div>
      </div>
    </div>
  </div>
</section>


<section className={"logged-main view-paid"}>
  <div className={"wrap"}>
    <div className={"welcome-bar paid"}>
      <div>
        <div className={"wb-hi"}>다시 오셨네요, <b>ha**3</b> 님</div>
        <div className={"wb-sub"}>Pro 구독 · 잔여 24일 · 에이전트 3개 실행 중</div>
      </div>
      <div style={{"display": "flex", "gap": "8px"}}>
        <span className={"run-badge"}><span className={"pip"}></span> 3 에이전트 가동 중</span>
      </div>
    </div>

    
    <div className={"paid-summary four"}>
      <div className={"ps-card"}><span className={"ps-lbl"}>누적 수익</span><b className={"ps-val up"}>+₩1.84M</b></div>
      <div className={"ps-card"}><span className={"ps-lbl"}>진입 횟수</span><b className={"ps-val"}>142</b></div>
      <div className={"ps-card"}><span className={"ps-lbl"}>운용 슬롯</span><b className={"ps-val"}>3 / 3</b></div>
      <div className={"ps-card"}><span className={"ps-lbl"}>구독 잔여</span><b className={"ps-val"}>24<span className={"ps-unit"}>일</span></b></div>
    </div>

    
    <div className={"spread-panel"}>
      <div className={"sp-head"}>
        <div>
          <div className={"sp-title"}>지금 시장의 진입 지형</div>
          <div className={"sp-sub"}>스프레드 구간마다 이용자 에이전트들이 어디에 이미 들어가 있고, 어느 지점을 진입 트리거로 걸어두고 대기 중인지 대략의 흐름을 보여줍니다</div>
        </div>
        <div className={"sp-legend"}>
          <span><span className={"sw entered"}></span> 진입 완료</span>
          <span><span className={"sw armed"}></span> 진입 대기(트리거)</span>
          <span className={"sp-now-lbl"}><span className={"sw now"}></span> 현재 스프레드</span>
        </div>
      </div>
      <div className={"sp-chart"} id={"spreadChart"}><SpreadChart /></div>
      <div className={"sp-foot"}>
        <span>가로 방향: 운용 에이전트가 몰린 정도 (상대적)</span>
        <span>세로 방향: 스프레드(%)</span>
        <span className={"sp-live"}><span className={"pip"}></span> 실시간 · 익명 집계</span>
      </div>
    </div>

    
    <div className={"board"} style={{"maxWidth": "none"}}>
      <div className={"board-head"}>
        <span className={"live"}><span className={"pip"}></span> LIVE</span>
        <span className={"title"}>이용자 수익 보드 · 실시간</span>
        <span className={"sub"}>계정 익명</span>
      </div>
      <div className={"board-body board-body-wide"} id={"paidBoard"}>
        <div className={"board-row top1"}><div className={"board-rank"}>1</div><div className={"board-user"}><span className={"board-id"}>ki**7</span><span className={"board-meta"}><span className={"in"}>진입 142</span> · <span className={"out"}>슬롯 3</span> · 운용 21일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "100%"}}></div></div><div className={"board-pnl up"}>+₩4.82M</div></div>
        <div className={"board-row top2"}><div className={"board-rank"}>2</div><div className={"board-user"}><span className={"board-id"}>so**2</span><span className={"board-meta"}><span className={"in"}>진입 98</span> · <span className={"out"}>슬롯 2</span> · 운용 34일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "78%"}}></div></div><div className={"board-pnl up"}>+₩3.61M</div></div>
        <div className={"board-row top3"}><div className={"board-rank"}>3</div><div className={"board-user"}><span className={"board-id"}>ju**9</span><span className={"board-meta"}><span className={"in"}>진입 216</span> · <span className={"out"}>슬롯 4</span> · 운용 12일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "59%"}}></div></div><div className={"board-pnl up"}>+₩2.74M</div></div>
        <div className={"board-row"}><div className={"board-rank"}>4</div><div className={"board-user"}><span className={"board-id"}>mi**4</span><span className={"board-meta"}><span className={"in"}>진입 61</span> · <span className={"out"}>슬롯 2</span> · 운용 8일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "41%"}}></div></div><div className={"board-pnl up"}>+₩1.90M</div></div>
        <div className={"board-row mine-row"}><div className={"board-rank"}>12</div><div className={"board-user"}><span className={"board-id"}>나 · ha**3</span><span className={"board-meta"}><span className={"in"}>진입 142</span> · <span className={"out"}>슬롯 3</span> · 운용 27일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "38%"}}></div></div><div className={"board-pnl up"}>+₩1.84M</div></div>
        <div className={"board-row"}><div className={"board-rank"}>5</div><div className={"board-user"}><span className={"board-id"}>yo**1</span><span className={"board-meta"}><span className={"in"}>진입 34</span> · <span className={"out"}>슬롯 1</span> · 운용 3일</span></div><div className={"board-bar-wrap"}><div className={"board-bar"} style={{"width": "24%"}}></div></div><div className={"board-pnl up"}>+₩1.12M</div></div>
      </div>
      <div className={"board-foot"}>계정 아이디는 익명 처리됩니다 · 표시된 수치는 과거 실적이며 미래 수익을 보장하지 않습니다</div>
    </div>

    
    <div style={{"marginTop": "56px"}}>
      <div className={"sec-eyebrow"}>더 키우기</div>
      <h2 className={"sec-title"}>슬롯을 늘리거나 구독을 연장하세요</h2>
      <p className={"sec-lead"}>동시에 굴리는 에이전트가 많을수록 더 많은 격차를 노릴 수 있습니다. 지금 연장하면 런칭 할인가가 유지됩니다.</p>
      <div className={"upsell-grid"}>
        <div className={"upsell-card"}>
          <div className={"us-ic"}>➕</div>
          <h3>슬롯 추가</h3>
          <p>현재 3 / 3 슬롯을 모두 사용 중입니다. 슬롯을 추가하면 전략을 더 많이 동시에 운용할 수 있습니다.</p>
          <div className={"us-price"}><span className={"amt"}>₩39,000</span><span className={"per"}> / 슬롯 · 월</span></div>
          <a className={"btn primary"} href={"https://dollarflow.growbee.ai/payments"}>슬롯 추가하기</a>
        </div>
        <div className={"upsell-card"}>
          <div className={"us-ic"}>📅</div>
          <h3>구독 연장</h3>
          <p>잔여 24일. 지금 연장하면 런칭 할인가(90% OFF)가 다음 결제에도 그대로 적용됩니다.</p>
          <div className={"us-price"}><span className={"price-orig"} style={{"fontSize": "13px"}}>₩990,000</span> <span className={"amt"}>₩99,000</span><span className={"per"}> / 월</span></div>
          <a className={"btn primary"} href={"https://dollarflow.growbee.ai/payments"}>지금 연장하기</a>
        </div>
        <div className={"upsell-card ghost-card"}>
          <div className={"us-ic"}>🎁</div>
          <h3>연간 구독</h3>
          <p>12개월을 한 번에. 월 결제 대비 추가 할인이 적용되고 할인가가 1년간 고정됩니다.</p>
          <div className={"us-price"}><span className={"amt"}>₩990,000</span><span className={"per"}> / 년</span></div>
          <a className={"btn ghost"} href={"https://dollarflow.growbee.ai/payments"}>연간으로 전환</a>
        </div>
      </div>
    </div>
  </div>
</section>


<section className={"blk view-guest"} id={"how"}>
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


<section className={"blk view-guest"} id={"security"} style={{"background": "var(--bg-2)", "borderTop": "1px solid var(--line)", "borderBottom": "1px solid var(--line)"}}>
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


<section className={"blk view-guest"} id={"product"}>
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
            <span className={"price-orig"}>₩990,000</span>
            <span className={"price-off"}>런칭 90% OFF</span>
          </div>
          <span className={"amt"}>₩99,000</span><span className={"per"}> / 월</span>
          <div className={"price-note"}>얼리버드 한정가 · 이후 정상가로 조정됩니다</div>
          <div className={"countdown"}>
            <span className={"cd-label"}>🔥 런칭 할인 종료까지</span>
            <div className={"cd-clock"}>
              <span className={"cd-box"}><b id={"cd-d"}>06</b><i>일</i></span>
              <span className={"cd-box"}><b id={"cd-h"}>14</b><i>시</i></span>
              <span className={"cd-box"}><b id={"cd-m"}>22</b><i>분</i></span>
              <span className={"cd-box"}><b id={"cd-s"}>08</b><i>초</i></span>
            </div>
          </div>
        </div>
        <ul className={"prod-feat"}>
          <li><span className={"ck"}>✓</span> 슬롯 단위 전략 등록 · 동시 운용</li>
          <li><span className={"ck"}>✓</span> 진입 · 청산 · 손절 직접 설정</li>
          <li><span className={"ck"}>✓</span> 24시간 자동 감시 · 실행</li>
          <li><span className={"ck"}>✓</span> IP 변경 자동 감지 · 재등록 안내</li>
          <li><span className={"ck"}>✓</span> 모의거래 모드 · 실시간 리포트</li>
        </ul>
        <a className={"btn primary"} href={"https://dollarflow.growbee.ai/payments"}>Spreadbridge 시작하기</a>
      </div>

      <div className={"prod-card"}>
        <span className={"prod-badge soon"}>준비 중</span>
        <h3>더 많은 전략</h3>
        <p className={"desc"}>Spreadbridge가 자리 잡으면, 다른 격차와 다른 시장을 다루는 상품이 순차적으로 추가됩니다.</p>
        <div className={"prod-price"}>
          <span className={"amt"} style={{"color": "var(--ink-3)"}}>Coming</span>
        </div>
        <ul className={"prod-feat prod-soon-list"}>
          <li><span className={"ck"}>○</span> 새로운 페어 · 시장 확장</li>
          <li><span className={"ck"}>○</span> 고급 리스크 관리 도구</li>
          <li><span className={"ck"}>○</span> 전용 온보딩 · 우선 지원</li>
        </ul>
        <a className={"btn ghost"} href={"#"}>출시 알림 받기</a>
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
        <p style={{"fontSize": "12.5px", "color": "var(--ink-3)", "marginTop": "14px"}}>
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


<section className={"blk view-guest"} id={"faq"} style={{"background": "var(--bg-2)", "borderTop": "1px solid var(--line)"}}>
  <div className={"wrap"}>
    <div className={"sec-eyebrow"}>자주 묻는 질문</div>
    <h2 className={"sec-title"}>궁금한 것들</h2>
    <div className={"faq"}>
      <div className={"faq-item open"}>
        <div className={"faq-q"} role={"button"} tabIndex={0}>제 돈을 맡기는 건가요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>아닙니다. 프로그램은 당신의 PC에서 당신의 거래소 계정으로 직접 매매합니다. Spreadbridge는 당신의 자금을 받거나 보관하지 않고, 계좌에 접근할 수도 없습니다. 우리는 소프트웨어를 제공할 뿐입니다.</div>
      </div>
      <div className={"faq-item"}>
        <div className={"faq-q"} role={"button"} tabIndex={0}>수익이 보장되나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>보장하지 않습니다. 이 프로그램은 정해진 조건에 따라 매매를 자동화할 뿐이며, 시장 상황과 당신의 설정에 따라 손실이 발생할 수 있습니다. 수익을 약속하는 어떤 표현도 하지 않습니다.</div>
      </div>
      <div className={"faq-item"}>
        <div className={"faq-q"} role={"button"} tabIndex={0}>컴퓨터를 계속 켜둬야 하나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>네. 프로그램이 당신의 PC에서 실행되므로, 자동 운용 중에는 컴퓨터가 켜져 있어야 합니다. 전기 소모가 적은 미니PC를 두고 상시 운용하는 방식을 권장합니다.</div>
      </div>
      <div className={"faq-item"}>
        <div className={"faq-q"} role={"button"} tabIndex={0}>전략이 정확히 뭔가요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>달러와 관련된 두 시장 사이의 가격 격차를 이용합니다. 세부 산식과 실행 방식은 Spreadbridge의 핵심 자산이라 공개하지 않지만, 프로그램 안에서 당신이 조정할 수 있는 조건은 모두 투명하게 열려 있습니다.</div>
      </div>
      <div className={"faq-item"}>
        <div className={"faq-q"} role={"button"} tabIndex={0}>프로그래밍을 몰라도 되나요? <span className={"plus"}>+</span></div>
        <div className={"faq-a"}>됩니다. 설치부터 연결, 전략 등록까지 화면 안내를 따라가면 되고, 초기 설정은 1:1 온보딩으로 도와드립니다.</div>
      </div>
    </div>
  </div>
</section>


<div className={"member-board"} id={"memberBoard"} role={"dialog"} aria-modal={"true"} aria-label={"이용자 수익 보드 미리보기"} tabIndex={-1}>
  <div className={"mb-inner"}>
    <div className={"mb-head"}>
      <div>
        <div className={"sec-eyebrow"} style={{"marginBottom": "6px"}}>구독 회원 전용</div>
        <h2 style={{"fontSize": "26px", "fontWeight": "740", "letterSpacing": "-.6px"}}>이용자 수익 보드</h2>
      </div>
      <button className={"btn ghost"} id={"mbClose"}>✕ 닫기</button>
    </div>

    <div className={"mb-mine"}>
      <div className={"mb-mine-rank"}>내 순위 <b>12</b></div>
      <div className={"mb-mine-stat"}><span className={"lbl"}>누적 수익</span><b className={"up"}>+₩1.84M</b></div>
      <div className={"mb-mine-stat"}><span className={"lbl"}>진입 횟수</span><b>142</b></div>
      <div className={"mb-mine-stat"}><span className={"lbl"}>운용 슬롯</span><b>3</b></div>
      <div className={"mb-mine-stat"}><span className={"lbl"}>운용 기간</span><b>27일</b></div>
    </div>

    <div className={"mb-tabs"}>
      <button className={"mb-tab active"}>누적 수익순</button>
      <button className={"mb-tab"}>진입 횟수순</button>
      <button className={"mb-tab"}>이번 달</button>
    </div>

    <div className={"mb-table"}>
      <div className={"mb-row mb-hd"}><span>순위</span><span>계정</span><span>진입</span><span>슬롯</span><span>기간</span><span style={{"textAlign": "right"}}>누적 수익</span></div>
      <div className={"mb-row r1"}><span className={"mb-rk"}>🥇 1</span><span className={"mb-id"}>ki**7</span><span>142</span><span>3</span><span>21일</span><span className={"up mb-pnl"}>+₩4.82M</span></div>
      <div className={"mb-row r2"}><span className={"mb-rk"}>🥈 2</span><span className={"mb-id"}>so**2</span><span>98</span><span>2</span><span>34일</span><span className={"up mb-pnl"}>+₩3.61M</span></div>
      <div className={"mb-row r3"}><span className={"mb-rk"}>🥉 3</span><span className={"mb-id"}>ju**9</span><span>216</span><span>4</span><span>12일</span><span className={"up mb-pnl"}>+₩2.74M</span></div>
      <div className={"mb-row"}><span className={"mb-rk"}>4</span><span className={"mb-id"}>mi**4</span><span>61</span><span>2</span><span>8일</span><span className={"up mb-pnl"}>+₩1.90M</span></div>
      <div className={"mb-row mine"}><span className={"mb-rk"}>12</span><span className={"mb-id"}>나 (ha**3)</span><span>142</span><span>3</span><span>27일</span><span className={"up mb-pnl"}>+₩1.84M</span></div>
      <div className={"mb-row"}><span className={"mb-rk"}>5</span><span className={"mb-id"}>yo**1</span><span>34</span><span>1</span><span>3일</span><span className={"up mb-pnl"}>+₩1.12M</span></div>
      <div className={"mb-row"}><span className={"mb-rk"}>6</span><span className={"mb-id"}>ha**8</span><span>77</span><span>2</span><span>19일</span><span className={"up mb-pnl"}>+₩0.98M</span></div>
      <div className={"mb-row"}><span className={"mb-rk"}>7</span><span className={"mb-id"}>se**5</span><span>51</span><span>2</span><span>15일</span><span className={"up mb-pnl"}>+₩0.86M</span></div>
      <div className={"mb-row"}><span className={"mb-rk"}>8</span><span className={"mb-id"}>do**0</span><span>29</span><span>1</span><span>6일</span><span className={"up mb-pnl"}>+₩0.54M</span></div>
    </div>
    <div className={"mb-foot"}>계정 아이디는 익명 처리됩니다 · 표시된 수치는 과거 실적이며 미래 수익을 보장하지 않습니다 · 개별 결과는 설정·운용 기간에 따라 다릅니다</div>
  </div>
</div>


<section className={"final view-guest"}>
  <div className={"final-glow"}></div>
  <div className={"wrap"}>
    <h2>격차는 지금도 벌어지고 있습니다</h2>
    <p>사람이 밤새 지켜볼 수 없는 순간을, 기계에게 맡기세요.</p>
    <a className={"btn primary lg"} href={"#product"}>Spreadbridge 시작하기</a>
  </div>
</section>


<footer>
  <div className={"wrap"}>
    <div className={"foot-grid"}>
      <div className={"foot-brand"}>
        <div className={"logo"}>Spread<b>bridge</b></div>
        <p>달러의 가격 격차를 자동으로 다루는 매매 소프트웨어. 판단은 당신의 PC에서, 자산은 당신의 손에서.</p>
      </div>
      <div className={"foot-col"}>
        <h4>제품</h4>
        <a href={"#product"}>Spreadbridge</a>
        <a href={"#how"}>작동 방식</a>
        <a href={"#security"}>보안</a>
        <a href={"/download/"}>다운로드</a>
      </div>
      <div className={"foot-col"}>
        <h4>지원</h4>
        <a href={"#faq"}>FAQ</a>
        <a href={"mailto:contact@thespreadbridge.com"}>고객센터</a>
        <a href={"/guide/"}>온보딩 안내</a>
        <a href={"#"}>공지사항</a>
      </div>
      <div className={"foot-col"}>
        <h4>정책</h4>
        <a href={"#"}>이용약관</a>
        <a href={"#"}>위험고지</a>
        <a href={"/privacy/"}>개인정보처리방침</a>
        <a href={"#"}>API 사용동의</a>
      </div>
    </div>
    <div className={"foot-legal"}>
      Spreadbridge는 매매 자동화 소프트웨어를 제공하는 회사이며, 투자중개·투자자문·투자일임 서비스를 제공하지 않습니다.
      본 소프트웨어는 수익을 보장하지 않으며, 모든 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
      파생상품 거래에는 원금 손실 위험이 있습니다.<br />
      © 2026 Spreadbridge. 사업자등록번호 000-00-00000 · 문의 contact@thespreadbridge.com
    </div>
  </div>
</footer>


  </>;
}
