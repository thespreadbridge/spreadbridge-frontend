import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="sb-section">
      <div className="shell sb-cta">
        <div>
          <span className="sb-eyebrow">GET STARTED</span>
          <h2 className="sb-h2">내 계좌에서,<br />지금 시작하세요.</h2>
        </div>
        <div className="sb-cta-side">
          <p>Google 계정으로 가입한 뒤 앱을 설치하고 거래 조건을 설정하세요.</p>
          <Link href="/login/" className="button button-blue">Google로 시작하기</Link>
        </div>
      </div>
    </section>
  );
}
