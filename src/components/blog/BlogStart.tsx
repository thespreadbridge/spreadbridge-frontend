import Link from 'next/link';

export function BlogStart() {
  return <section id="blog-start" className="insight-next-step" aria-label="스프레드브리지 이용 안내">
    <div>
      <h2>스프레드브리지 시작하기</h2>
      <p>앱 설치와 계정 연결에 필요한 준비 사항을 확인하세요.</p>
    </div>
    <div>
      <Link href="/guide/" className="btn ghost">시작 가이드</Link>
      <Link href="/download/" className="btn primary">앱 다운로드</Link>
    </div>
  </section>;
}
