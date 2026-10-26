import Link from 'next/link';
import { Brand } from '@/components/brand';
import { policyLinks } from '@/lib/information-links';

const footerGroups = [
  { title: '제품', links: [
    { href: '/#product', label: '스프레드브리지' },
    { href: '/#how', label: '작동 방식' },
    { href: '/#security', label: '보안' },
    { href: '/download/', label: '다운로드' },
  ] },
  { title: '지원', links: [
    { href: '/#faq', label: '자주 묻는 질문' },
    { href: '/blog/', label: '블로그' },
    { href: 'mailto:contact@thespreadbridge.com', label: '고객센터' },
    { href: '/guide/', label: '시작 가이드' },
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
          스프레드브리지는 매매 자동화 소프트웨어를 제공하며 투자중개·투자자문·투자일임 서비스를 제공하지 않습니다. 본 소프트웨어는 원금과 수익을 보장하지 않습니다. 투자 판단과 거래 설정은 이용자가 결정합니다. 회사와 이용자의 책임 범위는 이용약관 및 관계 법령에 따릅니다. 파생상품 거래에서는 예탁금을 초과하는 손실이 발생할 수 있으며 추가 증거금 납부나 반대매매가 발생할 수 있습니다.<br />
          © 2026 스프레드브리지. 문의 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>
        </div>
      </div>
    </footer>
  );
}
