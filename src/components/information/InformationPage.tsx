import Link from 'next/link';
import type { ReactNode } from 'react';
import { informationLinks } from '@/lib/information-links';
import styles from './information.module.css';

type Props = { title: string; eyebrow: string; description: string; children: ReactNode; updatedAt?: string };

export function InformationPage({ title, eyebrow, description, children, updatedAt }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Spreadbridge 홈">Spread<span>bridge</span></Link>
          <nav className={styles.primaryNav} aria-label="주요 메뉴">
            <Link href="/#how">작동 방식</Link>
            <Link href="/#product">요금</Link>
            <Link href="/download/">다운로드</Link>
          </nav>
          <Link href="https://dollarflow.growbee.ai/login" className={styles.login}>로그인</Link>
        </div>
      </header>
      <main className={styles.document} id="content">
        <Link href="/" className={styles.back}>← 홈페이지로</Link>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
          {updatedAt ? <p className={styles.date}>최종 작성일 <time dateTime={updatedAt}>{updatedAt.replaceAll('-', '.')}</time></p> : null}
        </header>
        <nav className={styles.relatedNav} aria-label="공지 및 정책">
          {informationLinks.map(link => <Link key={link.href} href={link.href} aria-current={link.label === title ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <div className={styles.content}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <Link href="/" className={styles.brand} aria-label="Spreadbridge 홈">Spread<span>bridge</span></Link>
        <nav aria-label="하단 정책 메뉴">{informationLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <p>문의 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a></p>
        <p>© 2026 Spreadbridge. 투자에는 원금 손실 위험이 있으며 수익을 보장하지 않습니다.</p>
      </footer>
    </div>
  );
}
