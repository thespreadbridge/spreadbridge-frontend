import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/landing/SiteFooter';

import releases from '@/generated/releases.json';
type Release = { version: string; artifactUrl: string; installationMode?: string };
const installationLabels: Record<string, string> = { MANUAL: '수동 설치', AUTO_UNSIGNED: '자동 업데이트 지원 · 인증서 없음', AUTO: '자동 업데이트 지원' };
const installationLabel = (mode?: string) => installationLabels[mode ?? 'AUTO'] ?? '수동 설치';
const targets = [
  {platform:'win32',architecture:'x64',name:'Windows',detail:'Windows 10 이상 · 64비트 · EXE 설치파일'},
  {platform:'darwin',architecture:'arm64',name:'Mac · Apple Silicon',detail:'M1·M2·M3·M4 이후 Apple Silicon · ZIP'},
  {platform:'darwin',architecture:'x64',name:'Mac · Intel',detail:'Intel 프로세서 · ZIP'},
];
async function latest(platform: string, architecture: string): Promise<Release|null> {
  return releases.find(r => r.platform === platform && r.architecture === architecture) ?? null;
}
export default async function Download() {
  const releases=await Promise.all(targets.map(t=>latest(t.platform,t.architecture)));
  return <div className="sb-page"><PublicHeader/><main className="shell" style={{paddingTop:64,paddingBottom:80}}>
    <span className="sb-eyebrow">고객용 데스크톱 앱</span><h1>Spreadbridge 다운로드</h1>
    <p className="sb-lead">사용하는 컴퓨터에 맞는 설치파일을 선택하세요. Google 계정으로 로그인하면 구독과 슬롯 한도가 적용됩니다.</p>
    <p className="sb-lead">현재 배포본은 코드서명 인증서와 Apple 공증 없이 제공됩니다. 첫 설치 시 운영체제의 확인 안내가 표시될 수 있습니다. 0.3.48 이전 앱은 한 번 수동 설치한 뒤부터 자동 업데이트를 이용할 수 있습니다.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,marginTop:40}}>
      {targets.map((target,index)=>{const release=releases[index];return <section className="card" key={target.architecture+target.platform} style={{padding:28,border:'1px solid var(--line, #dce2ec)',borderRadius:18}}>
        <h2>{target.name}</h2><p>{target.detail}</p>
        {release?<><p>v{release.version} · {installationLabel(release.installationMode)}</p>
          <a className="button button-blue" href={release.artifactUrl}>설치파일 다운로드</a></>:<p role="status">이 플랫폼의 설치파일은 준비 중입니다.</p>}
      </section>;})}
    </div>
    <section style={{marginTop:40,lineHeight:1.8}}><h2>설치 안내</h2>
      <p>Windows는 EXE 설치파일을 실행합니다. Mac은 ZIP을 압축 해제한 뒤 Spreadbridge 앱을 응용 프로그램 폴더에 옮깁니다. 거래 중인 앱을 업데이트할 때는 거래를 중지하고 앱을 종료한 뒤 설치하세요. 기존 앱의 데이터 폴더를 삭제하지 마세요.</p>
    </section>
  </main><SiteFooter/></div>;
}

export const metadata = { alternates: { canonical: 'https://thespreadbridge.com/download/' } };
