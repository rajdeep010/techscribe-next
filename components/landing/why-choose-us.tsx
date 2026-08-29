import { CheckCircle2 } from "lucide-react";
import { whyChooseUsChecklist } from "@/lib/template-data";
import { reviewsPageData } from "@/lib/site-content/public-pages";
import { SectionHeading } from "./section-heading";
import { TestimonialsCarousel } from "./testimonials-carousel";

export function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                    <SectionHeading title="Why Students Choose Us" align="left" />
                    <ul className="space-y-3">
                        {whyChooseUsChecklist.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <span className="text-sm leading-relaxed text-foreground sm:text-base">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <SectionHeading title="What Our Students Say" align="left" />
                    <TestimonialsCarousel testimonials={reviewsPageData.testimonials} />
                </div>
            </div>
        </section>
    );
}
