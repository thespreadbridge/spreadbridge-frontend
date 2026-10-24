import Link from 'next/link';
import { Brand } from './brand';

export function PublicHeader() {
  return (
    <header className="public-header shell">
      <Brand />
      <nav aria-label="주요 메뉴" className="sb-nav">
        <Link href="/#principle">원리</Link>
        <Link href="/pricing">요금</Link>
        <Link href="/guide">가이드</Link>
        <Link href="/download">앱 다운로드</Link>
      </nav>
      <div className="header-actions">
        <Link href="https://dollarflow.growbee.ai/login" className="text-button">로그인</Link>
        <Link href="https://dollarflow.growbee.ai/login" className="button button-blue">시작하기</Link>
      </div>
    </header>
  );
}
