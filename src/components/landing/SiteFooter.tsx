import Link from 'next/link';
import { Brand } from '@/components/brand';
import { policyLinks } from '@/lib/information-links';

const footerGroups = [
  { title: '제품', links: [
    { href: '/#product', label: 'Spreadbridge' },
    { href: '/#how', label: '작동 방식' },
    { href: '/#security', label: '보안' },
    { href: '/download/', label: '다운로드' },
  ] },
  { title: '지원', links: [
    { href: '/#faq', label: 'FAQ' },
    { href: 'mailto:contact@thespreadbridge.com', label: '고객센터' },
    { href: '/guide/', label: '온보딩 안내' },
    { href: '/notices/', label: '공지사항' },
  ] },
  { title: '정책', links: policyLinks },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-grid">
          <div className="site-footer-brand"><Brand /><p>달러의 가격 격차를 자동으로 다루는 매매 소프트웨어. 판단은 당신의 PC에서, 자산은 당신의 손에서.</p></div>
          {footerGroups.map(group => <nav className="site-footer-column" key={group.title} aria-label={`${group.title} 하단 메뉴`}>
            <h2>{group.title}</h2>
            {group.links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>)}
        </div>
        <div className="site-footer-legal">
          Spreadbridge는 매매 자동화 소프트웨어를 제공하는 회사이며, 투자중개·투자자문·투자일임 서비스를 제공하지 않습니다.
          본 소프트웨어는 수익을 보장하지 않으며, 모든 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
          파생상품 거래에는 원금 손실 위험이 있습니다.<br />
          © 2026 Spreadbridge. 사업자등록번호 000-00-00000 · 문의 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>
        </div>
      </div>
    </footer>
  );
}
