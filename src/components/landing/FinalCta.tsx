import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="sb-section">
      <div className="shell sb-cta">
        <div>
          <span className="sb-eyebrow">INVITATION BETA</span>
          <h2 className="sb-h2">최대 20명,<br />먼저 시작합니다.</h2>
        </div>
        <div className="sb-cta-side">
          <p>내부 검증을 마친 초대 고객부터 함께합니다.</p>
          <Link href="https://dollarflow.growbee.ai/login" className="button button-blue">Google로 시작하기</Link>
        </div>
      </div>
    </section>
  );
}
