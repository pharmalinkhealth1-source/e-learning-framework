import Navbar from "@/components/stripe/Navbar";
import Hero from "@/components/stripe/Hero";
import ModularSolutions from "@/components/stripe/ModularSolutions";
import PurposeSection from "@/components/stripe/PurposeSection";
import DirectorQuoteSection from "@/components/stripe/DirectorQuoteSection";
import { PartnersSection } from "@/components/stripe/PartnersSection";
import CongressSection from "@/components/stripe/CongressSection";
import GlobalScale from "@/components/stripe/GlobalScale";
import FooterCTA from "@/components/stripe/FooterCTA";
import { NewsSection } from "@/components/stripe/NewsSection";
import Footer from "@/components/stripe/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ModularSolutions />
      <PurposeSection />
      <DirectorQuoteSection />
      <PartnersSection />
      <CongressSection />
      <GlobalScale />
      <NewsSection />
      <FooterCTA />
      <Footer />
    </main>
  );
}
