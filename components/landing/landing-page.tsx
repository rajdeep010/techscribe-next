import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { StatsBar } from "./stats-bar";
import { HowItWorks } from "./how-it-works";
import { WhyChooseUs } from "./why-choose-us";
import { Footer } from "./footer";
import { FAQSection } from "./faq-section";
import { GradientCta } from "./gradient-cta";
import { CountryFlagsSwiper } from "./country-flags-swiper";
import { PainPointsSection } from "./pain-points-section";
import { ServicesGrid } from "./services-grid";

export function LandingPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="space-y-20 pb-20">
                <div>
                    <Hero />
                    <StatsBar />
                </div>
                <CountryFlagsSwiper />
                <PainPointsSection />
                <ServicesGrid />
                <HowItWorks />
                <WhyChooseUs />
                <FAQSection />
                <GradientCta />
            </main>
            <Footer />
        </div>
    );
}