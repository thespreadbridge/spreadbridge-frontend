import { backend } from '@/lib/auth/backend';

export const downloadTargets = [
  { platform: 'win32', architecture: 'x64', name: 'Windows', detail: 'Windows 10 이상 · 64비트 · EXE 설치파일' },
  { platform: 'darwin', architecture: 'arm64', name: 'Mac · Apple Silicon', detail: 'Apple Silicon 탑재 Mac(M1 이후) · arm64 · ZIP' },
  { platform: 'darwin', architecture: 'x64', name: 'Mac · Intel', detail: 'Intel 프로세서 탑재 Mac · x64 · ZIP' },
] as const;
type Target = typeof downloadTargets[number];
export interface PublishedRelease { version: string; artifactUrl: string; installationMode: 'AUTO' | 'MANUAL' | 'AUTO_UNSIGNED' }
export type ReleaseResult = { status: 'ready'; release: PublishedRelease | null } | { status: 'unavailable'; release: null };

export async function publishedRelease(target: Pick<Target, 'platform' | 'architecture'>): Promise<ReleaseResult> {
  try {
    const query = new URLSearchParams({ platform: target.platform, architecture: target.architecture, updaterVersion: '2' });
    const response = await backend(`/desktop/updates/latest?${query}`);
    if (!response.ok) throw new Error('Release unavailable');
    const data = await response.json();
    if (data.release === null) return { status: 'ready', release: null };
    const release = data.release;
    if (!release || release.platform !== target.platform || release.architecture !== target.architecture || release.status !== 'PUBLISHED'
      || !/^\d+\.\d+\.\d+$/.test(release.version) || !['AUTO', 'MANUAL', 'AUTO_UNSIGNED'].includes(release.installationMode)
      || !/^[A-Za-z0-9+/]{86}==$/.test(release.sha512) || !Number.isSafeInteger(release.artifactSize) || release.artifactSize <= 0) throw new Error('Invalid release');
    const url = new URL(release.artifactUrl);
    const extension = target.platform === 'darwin' ? '.zip' : '.exe';
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || !url.pathname.toLowerCase().endsWith(extension)) throw new Error('Invalid installer');
    return { status: 'ready', release: { version: release.version, artifactUrl: url.toString(), installationMode: release.installationMode } };
  } catch { return { status: 'unavailable', release: null }; }
}
