import Image from "next/image";
import {
    BookOpen,
    CheckCircle2,
    Compass,
    Diamond,
    Eye,
    Flag,
    Globe,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    Users,
    type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { GradientCta } from "@/components/landing/gradient-cta";
import { SectionHeading } from "@/components/landing/section-heading";
import { StatRow } from "@/components/landing/stat-row";
import { Card, CardContent } from "@/components/ui/card";
import { aboutPageData } from "@/lib/site-content/public-pages";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const highlightIcons = [Users, ShieldCheck, Sparkles];

const journeyIcons: LucideIcon[] = [Flag, Users, Globe, Trophy, Sparkles];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <HeroBanner
                align="split"
                eyebrow={aboutPageData.eyebrow}
                title={aboutPageData.title}
                description={aboutPageData.description}
                trustBadges={aboutPageData.highlights.map((item, index) => ({
                    icon: highlightIcons[index % highlightIcons.length],
                    label: item.title,
                }))}
                media={
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/group-office-2.jpg"
                            alt="The Assignment Consultants team collaborating"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                }
            />

            <main>

                <section className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h2 className="font-semibold">{aboutPageData.story.title}</h2>
                                <div className="space-y-2">
                                    {aboutPageData.story.paragraphs.map((p) => (
                                        <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Target className="h-5 w-5" />
                                </div>
                                <h2 className="font-semibold">{aboutPageData.mission.title}</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {aboutPageData.mission.description}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <h2 className="font-semibold">{aboutPageData.vision.title}</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {aboutPageData.vision.description}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/15 bg-card/85 dark:border-primary/25">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Diamond className="h-5 w-5" />
                                </div>
                                <h2 className="font-semibold">Core Values</h2>
                                <ul className="space-y-2">
                                    {aboutPageData.values.map((value) => (
                                        <li key={value} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                            {value}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
                    <StatRow
                        tone="dark"
                        items={aboutPageData.stats.map((stat, index) => ({
                            icon: [Users, Trophy, BookOpen, Compass, ShieldCheck][index] ?? Sparkles,
                            value: stat.value,
                            label: stat.label,
                        }))}
                    />
                </section>

                <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
                    <SectionHeading
                        title="Our Journey"
                        description="Milestones that reflect our commitment to student success."
                        className="mb-10"
                    />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
                        {aboutPageData.journey.map((item, index) => {
                            const Icon = journeyIcons[index % journeyIcons.length];
                            return (
                                <div key={item.year} className="flex flex-col items-center text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="mt-3 text-lg font-bold text-primary">{item.year}</div>
                                    <div className="mt-1 text-sm font-semibold">{item.title}</div>
                                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
                    <SectionHeading
                        title="Meet the Team"
                        description="Experienced. Passionate. Committed to your success."
                        className="mb-10"
                    />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {aboutPageData.team.map((member) => {
                            const initials = member.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("");
                            return (
                                <Card key={member.name} className="border-primary/15 bg-card/85 text-center dark:border-primary/25">
                                    <CardContent className="flex flex-col items-center gap-2 p-5">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                            {initials}
                                        </div>
                                        <div className="text-sm font-semibold">{member.name}</div>
                                        <div className="text-xs text-primary">{member.role}</div>
                                        <div className="text-xs leading-relaxed text-muted-foreground">
                                            {member.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-950 via-primary to-violet-800 text-white">
                        <CardContent className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{aboutPageData.promise.title}</h2>
                                <p className="mt-1 text-sm text-white/80">{aboutPageData.promise.description}</p>
                            </div>
                            <ul className="grid gap-2 text-sm sm:grid-cols-2">
                                {aboutPageData.promise.points.map((point) => (
                                    <li key={point} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-300" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section className="mx-auto my-16 max-w-6xl px-4 sm:px-6">
                    <GradientCta
                        data={{
                            title: "Ready to experience the Assignment Consultants difference?",
                            description: "Let our experts help you achieve your academic goals with confidence.",
                            primaryCta: { label: "Get Free Brief Check", href: "/contact" },
                            secondaryCta: { label: "WhatsApp Us", href: CONTACT_INFO.whatsappLink },
                            icon: "sparkles",
                        }}
                    />
                </section>
            </main>
            <Footer />
        </div>
    );
}
