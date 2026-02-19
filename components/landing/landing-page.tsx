import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { WhyChooseUs } from "./why-choose-us";
import { ExpertsSection } from "./expert-section";
import { Footer } from "./footer";
import { FAQSection } from "./faq-section";
import { TopicsSection } from "./topics-section";
import { GradientCta } from "./gradient-cta";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="space-y-20 pb-20">
                <Hero />
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