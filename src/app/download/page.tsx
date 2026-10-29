import Link from 'next/link';
import { publicPageMetadata } from '@/lib/seo';
import { SitePage } from '@/components/site/SitePage';
import { downloadTargets, publishedRelease } from '@/lib/published-releases';
import { serverSession } from '@/lib/auth/session';

const installationLabels: Record<string, string> = { MANUAL: '수동 설치', AUTO_UNSIGNED: '자동 업데이트 지원 · 인증서 없음', AUTO: '자동 업데이트 지원' };
const installationLabel = (mode?: string) => installationLabels[mode ?? 'AUTO'] ?? '수동 설치';
export default async function Download() {
  const session = await serverSession();
  const signedIn = session.status === 'authenticated';
  const releases = signedIn ? await Promise.all(downloadTargets.map(publishedRelease)) : [];
  return <SitePage title="스프레드브리지 다운로드" eyebrow="스프레드브리지 · DOWNLOAD" width="wide" description="회원 전용 다운로드입니다. Google 계정으로 가입하거나 로그인한 뒤 사용하는 컴퓨터에 맞는 설치파일을 선택하세요. 유료 구독 없이도 다운로드할 수 있습니다.">
    <p>각 배포본의 설치·업데이트 방식을 확인한 뒤 설치하세요. 자동 업데이트를 지원하지 않는 배포본은 새 설치파일을 직접 설치해야 합니다.</p>
    <div className="site-card-grid">
      {downloadTargets.map((target, index) => {
        const result = releases[index];
        const release = result?.release;
        return <section className="site-card" key={target.platform + target.architecture}>
          <h2>{target.name}</h2><p>{target.detail}</p>
          {!signedIn ? <>
            <p role="status">{session.status === 'unavailable' ? '로그인 정보를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.' : '가입·로그인 후 설치파일을 다운로드할 수 있습니다.'}</p>
            <Link data-analytics-id={"download_login_" + target.platform + "_" + target.architecture} className="btn primary" href="/login/?next=%2Fdownload%2F">로그인 후 다운로드</Link>
          </> : release ? <>
            <p>v{release.version} · {installationLabel(release.installationMode)}</p>
            <a data-analytics-id={"download_" + target.platform + "_" + target.architecture} data-analytics-event="file_download" data-analytics-platform={target.platform} className="btn primary" href={`/api/member/download/?platform=${target.platform}&architecture=${target.architecture}`}>설치파일 다운로드</a>
          </> : <p role="status">{result?.status === 'unavailable' ? '배포 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.' : '현재 등록된 설치파일이 없습니다. 새 배포본을 준비 중입니다.'}</p>}
        </section>;
      })}
    </div>
    <section><h2>설치 안내</h2>
      <p>Windows는 EXE 설치파일을 실행합니다. Mac은 ZIP을 압축 해제한 뒤 스프레드브리지 앱을 응용 프로그램 폴더에 옮깁니다. </p>
      <h3>업데이트 전 확인</h3><p>업데이트 전 신규 진입을 중단하고 미체결 주문과 보유 포지션을 확인하세요. 앱을 종료한 동안에는 앱의 자동 감시와 주문 실행이 중단됩니다. 확인을 마친 뒤 앱을 종료하고 새 설치파일을 설치하세요. 기존 앱의 데이터 폴더는 삭제하지 마세요.</p>
    </section>
  </SitePage>;
}

export const metadata = publicPageMetadata('/download/');
