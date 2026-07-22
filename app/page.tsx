import { ContactSection } from "@/components/ContactSection";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchSection } from "@/components/SearchSection";
import { ViewingPolicy } from "@/components/ViewingPolicy";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-zinc-800">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SearchSection />
        <HowItWorks />
        <FeaturedProperties />
        <ViewingPolicy />
        <WhyChooseUs />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
