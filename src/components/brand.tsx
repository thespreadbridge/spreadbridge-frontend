import Link from 'next/link';

export function Brand() {
  return <Link href="/" className="site-brand" aria-label="스프레드브리지 홈">스프레드<span className="site-brand-accent">브리지</span></Link>;
}
