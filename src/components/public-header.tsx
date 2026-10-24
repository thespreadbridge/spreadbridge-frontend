import Link from 'next/link';
import { Brand } from './brand';

export function PublicHeader({ preview = false }: { preview?: boolean }) {
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Brand />
        <nav aria-label="주요 메뉴" className="site-nav">
          <Link href="/#how">작동 방식</Link>
          <Link href="/#security">보안</Link>
          <Link href="/#product">요금</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="site-actions">
          {preview ? <div className="view-switch" id="viewSwitch" title="프로토타입 상태 전환">
            <button type="button" data-view="guest">비로그인</button>
            <button type="button" data-view="free">구독X 로그인</button>
            <button type="button" data-view="paid">구독O 로그인</button>
          </div> : null}
          <Link href="https://dollarflow.growbee.ai/login" className="btn ghost" id={preview ? 'loginBtn' : undefined}>로그인</Link>
          <Link href={preview ? '/#product' : 'https://dollarflow.growbee.ai/login'} className="btn primary" id={preview ? 'startBtn' : undefined}>시작하기</Link>
          {preview ? <div className="user-chip" id="userChip">
            <span className="uc-avatar">ha</span><span className="uc-name">ha**3 님</span>
            <a href="#" id="logoutBtn" className="uc-out">로그아웃</a>
          </div> : null}
        </div>
      </div>
    </header>
  );
}
