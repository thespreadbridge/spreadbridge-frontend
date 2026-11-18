import { SitePage } from '@/components/site/SitePage';
import { ManualLibrary } from '@/components/manuals/ManualLibrary';
import { publicPageMetadata } from '@/lib/seo';
import { PAGE_CONTENT_UPDATED_AT } from '@/lib/site-pages';
import { requireSubscriberAccess } from '@/lib/auth/access';
import manuals from '@/content/manuals.json';
import './manuals.css';

export const metadata = publicPageMetadata('/manuals/');

export default async function Manuals() {
  await requireSubscriberAccess();
  return <SitePage title="설치 매뉴얼" eyebrow="스프레드브리지 · MANUALS" width="wide"
    description="프로그램 설치부터 API 연결까지, 화면을 보며 차례로 따라 해보세요. 가이드를 바로 읽거나 PDF로 내려받을 수 있습니다." updatedAt={PAGE_CONTENT_UPDATED_AT['/manuals/']} dateLabel="문서 수정일">
    <ManualLibrary manuals={manuals} />
  </SitePage>;
}
