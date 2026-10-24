import Link from 'next/link';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Spreadbridge 홈">
      <span className="brand-word">Spread<span className="brand-word-accent">bridge</span></span>
    </Link>
  );
}
