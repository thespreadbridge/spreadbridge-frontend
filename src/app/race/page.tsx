import type { Metadata } from 'next';
import Link from 'next/link';
import { SitePage } from '@/components/site/SitePage';
import { RaceBoard } from '@/components/race/RaceBoard';
import { serverSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: '진입갭 레이스',
  description: '회원들이 정해둔 진입 조건이 어느 격차 구간에 모여 있는지 월물별로 보여줍니다.',
  alternates: { canonical: 'https://thespreadbridge.com/race/' },
};

const rules = [
  ['참여 인원', '구간마다 고유 사용자 수를 셉니다. 한 사람이 여러 구간에 걸치면 각각 1명으로 잡혀, 합이 전체보다 클 수 있습니다.'],
  ['슬롯 비중', '그 구간의 공유 슬롯 수를 월물 전체 공유 슬롯 수로 나눈 값입니다. 합계가 100.0%가 되도록 맞춥니다.'],
  ['집계 대상', '익명 공유에 동의한 구독 회원의 활성 진입대기 슬롯만 셉니다. 정지·보유·완료는 빼고, 20초 안에 반영됩니다.'],
  ['드러나지 않는 것', '이름, 계좌, 슬롯명은 저장하지도 보여주지도 않습니다. 체결이 아니라 등록한 조건의 분포입니다.'],
];

export default async function Race() {
  const session = await serverSession();
  const signedIn = session.status === 'authenticated';
  return <SitePage title="다른 회원들은 어디서 기다리고 있을까요?" eyebrow="SPREADBRIDGE · MEMBER RACE" width="wide" description="회원들이 정해둔 진입 조건이 어느 격차 구간에 모여 있는지 월물별로 보여줍니다. 매매 신호가 아니라, 각자가 직접 정한 조건의 분포입니다.">
    {signedIn ? <RaceBoard /> : <div className="site-card race-gate">
      <h2>🔒 로그인하고 확인하세요</h2>
      <p>회원들의 진입 조건이 어느 구간에 몰려 있는지, 분 단위 순위 변동까지 볼 수 있습니다.</p>
      <p>내 조건을 집계에 넣을지는 앱에서 켜고 끕니다. 이름도 계좌도 드러나지 않습니다.</p>
      <div className="race-gate-actions">
        <Link href="/login/?next=%2Frace%2F" className="btn primary">로그인하고 확인하기</Link>
        <Link href="/download/" className="btn ghost">앱 다운로드</Link>
      </div>
    </div>}
    <section className="race-rules">
      <h2>집계 기준</h2>
      <dl>{rules.map(([term, body]) => <div key={term}><dt>{term}</dt><dd>{body}</dd></div>)}</dl>
    </section>
  </SitePage>;
}
