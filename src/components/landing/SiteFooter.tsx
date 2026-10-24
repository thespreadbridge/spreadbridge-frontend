import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="sb-footer shell">
      <div className="sb-footer-brand">
        <b>Spreadbridge</b>
        <p>비수탁 스프레드 차익거래 자동매매 플랫폼</p>
      </div>
      <div className="sb-footer-links">
        <Link href="/#principle">원리</Link>
        <Link href="/pricing">요금</Link>
        <Link href="/guide">가이드</Link>
        <Link href="/privacy">개인정보처리방침</Link>
        <span className="sb-disclaimer">투자에는 원금 손실 위험이 있습니다. 과거·예시 수치는 미래 수익을 보장하지 않습니다.</span>
      </div>
    </footer>
  );
}
