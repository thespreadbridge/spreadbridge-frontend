import { publicPageMetadata } from '@/lib/seo';
import { SitePage } from '@/components/site/SitePage';
import { downloadTargets, publishedRelease } from '@/lib/published-releases';

const installationLabels: Record<string, string> = { MANUAL: '수동 설치', AUTO_UNSIGNED: '자동 업데이트 지원 · 인증서 없음', AUTO: '자동 업데이트 지원' };
const installationLabel = (mode?: string) => installationLabels[mode ?? 'AUTO'] ?? '수동 설치';
export default async function Download() {
  const releases = await Promise.all(downloadTargets.map(publishedRelease));
  return <SitePage title="Spreadbridge 다운로드" eyebrow="SPREADBRIDGE · DOWNLOAD" width="wide" description="사용하는 컴퓨터에 맞는 설치파일을 선택하세요. Google 계정으로 로그인하면 구독과 슬롯 한도가 적용됩니다.">
    <p>각 배포본의 설치·업데이트 방식을 확인한 뒤 설치하세요. 자동 업데이트를 지원하지 않는 배포본은 새 설치파일을 직접 설치해야 합니다.</p>
    <div className="site-card-grid">
      {downloadTargets.map((target, index) => {
        const { status, release } = releases[index];
        return <section className="site-card" key={target.platform + target.architecture}>
          <h2>{target.name}</h2><p>{target.detail}</p>
          {release ? <>
            <p>v{release.version} · {installationLabel(release.installationMode)}</p>
            <a data-analytics-id={"download_" + target.platform + "_" + target.architecture} data-analytics-event="file_download" data-analytics-platform={target.platform} className="btn primary" href={release.artifactUrl}>설치파일 다운로드</a>
          </> : <p role="status">{status === 'unavailable' ? '배포 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.' : '현재 등록된 설치파일이 없습니다. 새 배포본을 준비 중입니다.'}</p>}
        </section>;
      })}
    </div>
    <section><h2>설치 안내</h2>
      <p>Windows는 EXE 설치파일을 실행합니다. Mac은 ZIP을 압축 해제한 뒤 Spreadbridge 앱을 응용 프로그램 폴더에 옮깁니다. 거래 중인 앱을 업데이트할 때는 거래를 중지하고 앱을 종료한 뒤 설치하세요. 기존 앱의 데이터 폴더를 삭제하지 마세요.</p>
    </section>
  </SitePage>;
}

export const metadata = publicPageMetadata('/download/');
