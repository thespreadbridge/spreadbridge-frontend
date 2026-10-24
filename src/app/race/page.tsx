import type { Metadata } from 'next';
import Link from 'next/link';
import { SitePage } from '@/components/site/SitePage';
import { RaceBoard } from '@/components/race/RaceBoard';
import { serverSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: '진입갭 레이스',
  description: '익명으로 공유된 Spreadbridge 회원들의 활성 진입대기 설정이 어느 진입갭 구간에 모여 있는지 월물별로 보여줍니다.',
  alternates: { canonical: 'https://thespreadbridge.com/race/' },
};

const rules = [
  ['참여 인원', '각 구간의 고유 사용자 수입니다. 한 사용자가 여러 구간에 설정하면 구간마다 1명으로 집계되므로 구간별 인원의 합은 전체 참여 인원보다 클 수 있습니다.'],
  ['슬롯 비중', '해당 구간의 공유된 활성 진입대기 슬롯 수를 선택 월물의 전체 공유 슬롯 수로 나눈 값입니다. 각 구간은 하한 이상·상한 미만이며 합계가 100.0%가 되도록 표시합니다.'],
  ['집계 대상', '익명 공유에 동의한 구독 회원의 활성 진입대기 슬롯만 포함합니다. 정지·보유 중·완료된 슬롯은 제외하고, 20초 안에 최신 설정이 반영됩니다.'],
  ['표시하지 않는 것', '다른 사용자의 이름·계좌·개별 슬롯명은 저장하거나 표시하지 않습니다. 실제 체결 구간이 아니라 사용자가 직접 등록한 진입 기준값의 분포입니다.'],
];

export default async function Race() {
  const session = await serverSession();
  const signedIn = session.status === 'authenticated';
  return <SitePage title="진입갭 레이스" eyebrow="SPREADBRIDGE · MEMBER RACE" width="wide" description="익명으로 공유된 회원들의 활성 진입대기 설정이 어느 진입갭 구간에 모여 있는지 월물별로 보여줍니다. 매매 신호가 아니라 회원들이 직접 정한 조건의 분포입니다.">
    {signedIn ? <RaceBoard /> : <div className="site-card race-gate">
      <h2>로그인 후 확인할 수 있습니다</h2>
      <p>진입갭 레이스는 Spreadbridge 회원에게만 공개됩니다. Google 계정으로 로그인하면 월물별 인원·슬롯 분포와 이전 분 대비 순위 변동을 볼 수 있습니다.</p>
      <p>내 설정을 집계에 포함할지는 데스크톱 앱의 전략 화면에 있는 레이스 창에서 언제든 켜고 끌 수 있습니다.</p>
      <div className="race-gate-actions">
        <Link href="/login/?next=%2Frace%2F" className="btn primary">로그인하고 레이스 보기</Link>
        <Link href="/download/" className="btn ghost">앱 다운로드</Link>
      </div>
    </div>}
    <section className="race-rules">
      <h2>집계 기준</h2>
      <dl>{rules.map(([term, body]) => <div key={term}><dt>{term}</dt><dd>{body}</dd></div>)}</dl>
    </section>
  </SitePage>;
}
