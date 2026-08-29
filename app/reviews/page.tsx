import Image from "next/image";
import {
    Award,
    Globe2,
    Lightbulb,
    ShieldCheck,
    Star,
    TrendingUp,
    Trophy,
    Users,
} from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { GradientCta } from "@/components/landing/gradient-cta";
import { SectionHeading } from "@/components/landing/section-heading";
import { StatRow } from "@/components/landing/stat-row";
import { TestimonialsGrid } from "@/components/landing/testimonials-carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { reviewsPageData } from "@/lib/site-content/public-pages";

const highlightIcons = [ShieldCheck, Users, Award];
const statIcons = [Users, ShieldCheck, Star, Globe2];
const resultIcons = [TrendingUp, Lightbulb, Trophy];

export default function ReviewsPage() {
    const faqMidpoint = Math.ceil(reviewsPageData.faqs.length / 2);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <HeroBanner
                align="split"
                className="pb-16 sm:pb-20"
                title={reviewsPageData.title}
                description={reviewsPageData.description}
                trustBadges={reviewsPageData.highlights.map((label, index) => ({
                    icon: highlightIcons[index % highlightIcons.length],
                    label,
                }))}
                media={
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/happy2-horz.jpg"
                            alt="A student celebrating academic success"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                }
            />

            <main>
                {/* <section className="mx-auto -mt-4 max-w-6xl px-4 sm:-mt-10 sm:px-6">
                    <Card className="relative bg-gradient-to-br from-violet-200 via-primary via-violet-500 to-violet-200  z-10 border-0 shadow-[0_20px_45px_-25px_hsl(var(--primary)/0.55)]">
                        <CardContent className="flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:justify-center sm:gap-8 sm:text-left">
                            <div className="flex flex-col items-center gap-2 sm:items-start">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30">
                                    <Star className="h-5 w-5" />
                                </div>
                                <div className="text-sm">Overall Rating</div>
                                <div className="text-5xl font-bold">{reviewsPageData.overallRating.value}</div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                </div>
                                <div className="text-sm">{reviewsPageData.overallRating.basedOn}</div>
                            </div>
                            <p className="max-w-md border-t border-violet/15 pt-4 text-sm italic sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
                                &ldquo;{reviewsPageData.overallRating.quote}&rdquo;
                            </p>
                        </CardContent>
                    </Card>
                </section> */}

                <section className="mx-auto max-w-6xl space-y-16 px-4 pb-16 pt-10 sm:px-6">
                    <div>
                        <SectionHeading title="What Students Are Saying" align="left" className="mb-6" />
                        <TestimonialsGrid testimonials={reviewsPageData.testimonials.slice(0, 4)} />
                    </div>

                    <StatRow
                        items={reviewsPageData.stats.map((stat, index) => ({
                            icon: statIcons[index % statIcons.length],
                            value: stat.value,
                            label: stat.label,
                        }))}
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-lg font-bold">What Students Love Most</h2>
                                <div className="space-y-3">
                                    {reviewsPageData.loveMost.map((item) => (
                                        <div key={item.label}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="font-medium">{item.label}</span>
                                                <span className="text-muted-foreground">{item.percent}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                                                <div
                                                    className="h-full rounded-full bg-primary"
                                                    style={{ width: `${item.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Based on student feedback from verified reviews.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-lg font-bold">Results Shared with Permission</h2>
                                <div className="space-y-3">
                                    {reviewsPageData.results.map((result, index) => {
                                        const Icon = resultIcons[index % resultIcons.length];
                                        return (
                                            <div key={result.title} className="flex items-start gap-3 rounded-lg bg-primary/5 p-3 dark:bg-primary/10">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold">{result.title}</div>
                                                    <div className="text-xs text-muted-foreground">{result.description}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Results shared with permission from our students.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <SectionHeading title="Frequently Asked Questions" className="mb-8" />
                        <div className="grid gap-4 md:grid-cols-2">
                            {[reviewsPageData.faqs.slice(0, faqMidpoint), reviewsPageData.faqs.slice(faqMidpoint)].map(
                                (column, columnIndex) => (
                                    <Accordion key={columnIndex} type="single" collapsible className="space-y-3">
                                        {column.map((faq, index) => (
                                            <AccordionItem
                                                key={faq.question}
                                                value={`${columnIndex}-${index}`}
                                                className="rounded-lg border border-primary/15 bg-card/85 px-4 dark:border-primary/25"
                                            >
                                                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-sm text-muted-foreground">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )
                            )}
                        </div>
                    </div>

                    <GradientCta
                        data={{
                            title: "Ready to Achieve Your Academic Goals?",
                            description: "Join thousands of successful students who trust Assignment Consultants.",
                            primaryCta: { label: "Get Free Brief Check", href: "/contact" },
                            icon: "sparkles",
                        }}
                    />
                </section>
            </main>
            <Footer />
        </div>
    );
}
