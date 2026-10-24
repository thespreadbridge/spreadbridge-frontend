import Link from 'next/link';

export function Brand() {
  return <Link href="/" className="site-brand" aria-label="Spreadbridge 홈">Spread<span className="site-brand-accent">bridge</span></Link>;
}
