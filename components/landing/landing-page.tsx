import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { WhyChooseUs } from "./why-choose-us";
import { ExpertsSection } from "./expert-section";
import { Footer } from "./footer";
import { FAQSection } from "./faq-section";
import { TopicsSection } from "./topics-section";
import { GradientCta } from "./gradient-cta";
import { CountryFlagsSwiper } from "./country-flags-swiper";

export function LandingPage() {
    return (
        <div className="relative min-h-screen bg-background text-foreground">
            {/* <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(15,23,42,0.05))] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" /> */}

            <Navbar />
            <main className="space-y-20 pb-20">
                <Hero />
                <CountryFlagsSwiper />
                <ExpertsSection />
                <HowItWorks />
                <GradientCta />
                <WhyChooseUs />
                <TopicsSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}