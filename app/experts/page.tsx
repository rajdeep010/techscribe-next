import Image from "next/image";
import {
    Award,
    BadgeCheck,
    BookOpen,
    ClipboardCheck,
    Clock3,
    FileText,
    MessageSquare,
    ShieldCheck,
    Star,
    Trophy,
    UserCheck,
    Users,
    type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { GradientCta } from "@/components/landing/gradient-cta";
import { SectionHeading } from "@/components/landing/section-heading";
import { StatRow } from "@/components/landing/stat-row";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { expertsPageData } from "@/lib/site-content/public-pages";

const trustIcons: LucideIcon[] = [BadgeCheck, ShieldCheck, Clock3];
const statIcons: LucideIcon[] = [Users, Award, BookOpen, Trophy];
const howItWorksIcons: LucideIcon[] = [FileText, UserCheck, MessageSquare, ClipboardCheck];

function ExpertCard({
    expert,
}: {
    expert: { name: string; rating: string; reviews: number; experience: string; subjects: string; specialties: string[]; available?: boolean };
}) {
    const initials = expert.name
        .replace("Dr. ", "")
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("");

    return (
        <Card className="border-primary/15 bg-card/90 dark:border-primary/25">
            <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                        {initials}
                    </div>
                    {expert.available && (
                        <Badge variant="outline" className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                            Available Now
                        </Badge>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-1.5 font-semibold">
                        {expert.name}
                        <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                        {expert.rating}
                        <span>({expert.reviews} reviews)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{expert.experience}</div>
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subjects</div>
                    <div className="mt-1 text-sm text-muted-foreground">{expert.subjects}</div>
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Specialties</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {expert.specialties.map((tag) => (
                            <Badge key={tag} variant="outline" className="rounded-full border-primary/25 bg-primary/10 px-2 py-0.5 text-primary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="h-9 flex-1 rounded-md text-xs font-semibold" asChild>
                        <a href={`/contact?expert=${encodeURIComponent(expert.name)}`}>View Profile</a>
                    </Button>
                    <Button className="h-9 flex-1 rounded-md text-xs font-semibold" asChild>
                        <a href={`/contact?expert=${encodeURIComponent(expert.name)}`}>Get Support</a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ExpertsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <HeroBanner
                align="split"
                className="pb-16 sm:pb-20"
                title={expertsPageData.title}
                description={expertsPageData.description}
                trustBadges={expertsPageData.trustBadges.map((label, index) => ({
                    icon: trustIcons[index % trustIcons.length],
                    label,
                }))}
                media={
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/group-office-1.jpg"
                            alt="Academic experts reviewing a student's work"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                }
            />

            <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 sm:-mt-10 sm:px-6">
                <Card className="border-primary/15 bg-card shadow-[0_20px_45px_-25px_hsl(var(--primary)/0.55)] dark:border-primary/25">
                    <CardContent className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Search by Subject</label>
                            <Input placeholder="e.g., Business Strategy" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Country</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uk">UK</SelectItem>
                                    <SelectItem value="us">USA</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Support Type</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Support Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                    <SelectItem value="dissertation">Dissertation</SelectItem>
                                    <SelectItem value="tutoring">Tutoring</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Availability</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Anytime" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="now">Available Now</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="h-9 rounded-md text-sm font-semibold">
                            <span className="inline-flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Search Experts
                            </span>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <main className="mx-auto max-w-6xl space-y-16 px-4 pb-16 pt-10 sm:px-6">
                <section>
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <h2 className="text-xl font-bold">
                            All Experts <span className="font-normal text-muted-foreground">({expertsPageData.directory.length} Experts Shown)</span>
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {expertsPageData.directory.map((expert) => (
                            <ExpertCard key={expert.name} expert={expert} />
                        ))}
                    </div>
                </section>

                <section>
                    <StatRow
                        items={expertsPageData.stats.map((stat, index) => ({
                            icon: statIcons[index % statIcons.length],
                            value: stat.value,
                            label: stat.label,
                        }))}
                    />
                </section>

                <section>
                    <SectionHeading
                        title="Featured Experts"
                        description="Handpicked professionals with exceptional ratings and client success."
                        align="left"
                        className="mb-6"
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {expertsPageData.featured.map((expert) => (
                            <ExpertCard key={expert.name} expert={expert} />
                        ))}
                    </div>
                </section>

                <section>
                    <SectionHeading title="How It Works With Our Experts" className="mb-10" />
                    <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-10">
                        {expertsPageData.howItWorks.map((step, index) => {
                            const Icon = howItWorksIcons[index % howItWorksIcons.length];
                            return (
                                <div key={step.title} className="flex w-40 flex-col items-center text-center">
                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="h-6 w-6" />
                                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {step.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <GradientCta
                    data={{
                        title: "Ready to Get Expert Support?",
                        description: "Connect with our academic experts today and achieve your goals with confidence.",
                        primaryCta: { label: "Get Free Brief Check", href: "/contact" },
                        icon: "sparkles",
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}
