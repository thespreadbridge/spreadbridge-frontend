import Link from 'next/link';
import { informationLinks } from '@/lib/information-links';

export function SiteFooter() {
  return (
    <footer className="sb-footer shell">
      <div className="sb-footer-brand">
        <b>Spreadbridge</b>
        <p>비수탁 스프레드 차익거래 자동매매 플랫폼</p>
      </div>
      <div className="sb-footer-links">
        <Link href="/#how">작동 방식</Link>
        <Link href="/pricing">요금</Link>
        <Link href="/guide">가이드</Link>
        {informationLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        <span className="sb-disclaimer">투자에는 원금 손실 위험이 있습니다. 과거·예시 수치는 미래 수익을 보장하지 않습니다.</span>
      </div>
    </footer>
  );
}
