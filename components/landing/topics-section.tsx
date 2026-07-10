import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
    BookOpenText,
    Briefcase,
    Code2,
    FileBadge,
    FilePenLine,
    GraduationCap,
    Microscope,
    Presentation,
    SpellCheck2,
    Sigma,
} from "lucide-react";

const topics = [
    {
        title: "Essay Writing",
        description: "Compelling essays with strong arguments and proper structure."
    },
    {
        title: "Research Papers",
        description: "In-depth research with credible sources and citations."
    },
    {
        title: "Thesis Assistance",
        description: "Comprehensive thesis support from proposal to defense."
    },
    {
        title: "Dissertation Help",
        description: "End-to-end guidance for your doctoral dissertation."
    },
    {
        title: "Case Studies",
        description: "Detailed analysis with real-world applications and insights."
    },
    {
        title: "Coursework Help",
        description: "Complete coursework solutions across all subjects."
    },
    {
        title: "Editing & Proofreading",
        description: "Polishing your work to perfection with expert reviews."
    },
    {
        title: "Presentation Preparation",
        description: "Professional slides and speaker notes for impactful delivery."
    },
    {
        title: "Programming Assignments",
        description: "Clean, documented code in Python, Java, C++, and more."
    },
];

const topicIcons = [
    FilePenLine,
    Microscope,
    GraduationCap,
    BookOpenText,
    Briefcase,
    FileBadge,
    SpellCheck2,
    Presentation,
    Code2,
    Sigma,
];

const topicImages = [
    "/happy1-horz.jpg",
    "/help3-horz.jpg",
    "/help6-horz.jpg",
    "/help7-horz.jpg",
    "/help1-vert.jpg",
    "/help2-vert.jpg",
    "/help4-vert.jpg",
    "/help5-vert.jpg",
    "/happy2-horz.jpg",
    "/help6-horz.jpg",
];

export function TopicsSection() {
    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-background/95 px-4 py-8 shadow-[0_14px_34px_-22px_hsl(var(--primary)/0.7),0_6px_14px_-10px_hsl(var(--primary)/0.35)] sm:px-6 dark:border-primary/30 dark:bg-card/95 dark:shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.85),0_8px_18px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Topics We Cover</h2>
                <div className="mt-2 text-lg text-muted-foreground">
                    Expert assistance across 100+ subjects and academic levels.
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, index) => {
                    const Icon = topicIcons[index % topicIcons.length];
                    const accent =
                        index % 3 === 0
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : index % 3 === 1
                                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300";

                    return (
                        <Card key={topic.title} className="overflow-hidden border-primary/15 bg-card/85 transition-all hover:shadow-md hover:border-primary/40 dark:border-primary/25">
                            <CardContent className="py-4 px-6">
                                <div className="-mx-2 -mt-2 mb-4 overflow-hidden rounded-xl">
                                    <Image
                                        src={topicImages[index % topicImages.length]}
                                        alt={topic.title}
                                        width={680}
                                        height={420}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>

                                <div className="flex gap-2 items-center justify-start">
                                    <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border ${accent}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-base font-bold">{topic.title}</h3>
                                </div>

                                <div className="text-sm leading-relaxed text-muted-foreground">
                                    {topic.description}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
}