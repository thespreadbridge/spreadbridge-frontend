import type { Metadata } from 'next';
import Link from 'next/link';
import { SitePage } from '@/components/site/SitePage';
import { RaceBoard } from '@/components/race/RaceBoard';
import { serverSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: '진입갭 레이스',
  robots: { index: false, follow: false },
  description: '익명으로 공유된 활성 진입대기 설정의 인기 구간을 월물별로 보여줍니다.',
  alternates: { canonical: 'https://thespreadbridge.com/race/' },
};

const rules = [
  '인원은 각 구간의 고유 사용자 수입니다. 같은 사용자가 여러 구간에 설정하면 구간마다 1명으로 집계되므로 구간별 인원의 합은 전체 참여 인원보다 클 수 있습니다.',
  '슬롯 비중 = 해당 구간의 공유된 활성 진입대기 슬롯 수 ÷ 선택 월물의 전체 공유 활성 진입대기 슬롯 수. 각 구간은 하한 이상·상한 미만이며, 실제 체결 구간이 아닌 등록한 진입 기준값의 분포입니다. 비중은 소수점 한 자리로 합계 100.0%에 맞춰 표시합니다. 동률은 공동 순위입니다.',
  '다른 사용자의 이름·계좌·개별 슬롯명은 표시하지 않습니다.',
];

export default async function Race() {
  const session = await serverSession();
  const signedIn = session.status === 'authenticated';
  return <SitePage title="진입갭 레이스" eyebrow="SPREADBRIDGE · 회원 집계" width="wide" description="익명으로 공유된 활성 진입대기 설정의 인기 구간">
    {signedIn ? <RaceBoard /> : <div className="site-card race-gate">
      <h2>로그인 후 확인할 수 있습니다</h2>
      <p>회원 집계 · 내 설정은 동의 후 포함</p>
      <div className="race-gate-actions">
        <Link href="/login/?next=%2Frace%2F" className="btn primary">로그인</Link>
        <Link href="/download/" className="btn ghost">앱 다운로드</Link>
      </div>
    </div>}
    <section className="race-rules">
      <h2>집계 기준과 비중 계산</h2>
      {rules.map(line => <p key={line}>{line}</p>)}
      <p className="race-foot"><span>표시 구간: 1원 단위 · 사용자가 직접 설정한 조건의 분포</span><span>회원 집계 · 내 설정은 동의 후 포함</span></p>
    </section>
  </SitePage>;
}
