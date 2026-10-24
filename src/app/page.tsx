import { PublicHeader } from '@/components/public-header';
import { Hero } from '@/components/landing/Hero';
import { PrincipleCard } from '@/components/landing/PrincipleCard';
import { PrincipleFlow } from '@/components/landing/PrincipleFlow';
import { SafetyCards } from '@/components/landing/SafetyCards';
import { StartSteps } from '@/components/landing/StartSteps';
import { FairBilling } from '@/components/landing/FairBilling';
import { LiveSpread } from '@/components/landing/LiveSpread';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { SiteFooter } from '@/components/landing/SiteFooter';

export default function Home() {
  return (
    <div className="sb-page">
      <PublicHeader />
      <main className="sb-main">
        <Hero />
        <LiveSpread />
        <PrincipleCard />
        <PrincipleFlow />
        <SafetyCards />
        <StartSteps />
        <FairBilling />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

export const metadata = { alternates: { canonical: 'https://thespreadbridge.com/' } };
