import { SitePage, type SitePageProps } from '@/components/site/SitePage';

export function InformationPage(props: Omit<SitePageProps, 'policyNavigation'>) {
  return <SitePage {...props} policyNavigation />;
}
