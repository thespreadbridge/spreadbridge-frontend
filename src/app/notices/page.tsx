import type { Metadata } from 'next';
import Link from 'next/link';
import { InformationPage } from '@/components/information/InformationPage';

export const metadata: Metadata = {
  title: '공지사항',
  description: 'Spreadbridge의 서비스 변경, 점검 및 업데이트 공지사항을 확인하세요.',
  alternates: { canonical: 'https://thespreadbridge.com/notices/' },
};

export default function NoticesPage() {
  return <InformationPage title="공지사항" eyebrow="SPREADBRIDGE · NOTICE" description="서비스 변경, 점검 및 업데이트 소식을 안내합니다.">
    <div className="site-empty">
      <svg className="site-empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="11" y="7" width="26" height="34" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 17h12M18 24h12M18 31h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h2>등록된 공지사항이 없습니다</h2>
      <p>새로운 공지가 등록되면 이곳에서 확인할 수 있습니다.</p>
    </div>
    <section><h2>서비스 이용 안내</h2>
      <p>설치와 시작 방법은 <Link href="/guide/">온보딩 안내</Link>에서, 앱 설치파일은 <Link href="/download/">다운로드</Link>에서 확인하세요.</p>
      <p>이용 중 문의는 <a href="mailto:contact@thespreadbridge.com">contact@thespreadbridge.com</a>으로 보내주세요. 비밀번호나 API 비밀키를 문의 내용에 포함하지 마세요.</p>
    </section>
  </InformationPage>;
}
