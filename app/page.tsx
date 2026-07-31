import { FeaturedAreas } from "@/components/FeaturedAreas";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchSection } from "@/components/SearchSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { publicPageClass } from "@/lib/public-ui";

export default function Home() {
  return (
    <div className={publicPageClass}>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SearchSection />
        <HowItWorks />
        <WhyChooseUs />
        <FeaturedAreas />
      </main>
      <Footer />
    </div>
  );
}
