import { ArrowRight, BookOpen, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { howItWorksData } from "@/lib/template-data";
import Link from "next/link";

const iconMap = {
    "book-open": BookOpen,
    "credit-card": CreditCard,
    "check-circle": CheckCircle2,
};

export function HowItWorks() {
    const { eyebrow, title, description, steps, cta } = howItWorksData;
    const accentThemes = [
        {
            iconWrap: "bg-primary/15 text-primary border-primary/25 dark:bg-primary/20 dark:border-primary/35",
            cardBorder: "border-primary/20 hover:border-primary/45",
        },
        {
            iconWrap: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/35",
            cardBorder: "border-emerald-500/20 hover:border-emerald-500/45 dark:border-emerald-400/25 dark:hover:border-emerald-400/45",
        },
        {
            iconWrap: "bg-cyan-500/15 text-cyan-700 border-cyan-500/25 dark:bg-cyan-400/15 dark:text-cyan-300 dark:border-cyan-400/35",
            cardBorder: "border-cyan-500/20 hover:border-cyan-500/45 dark:border-cyan-400/25 dark:hover:border-cyan-400/45",
        },
    ];

    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-background/95 px-4 py-8 shadow-[0_14px_34px_-22px_hsl(var(--primary)/0.7),0_6px_14px_-10px_hsl(var(--primary)/0.35)] sm:px-6 dark:border-primary/30 dark:bg-card/95 dark:shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.85),0_8px_18px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mb-10 text-center">
                <div className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {eyebrow}
                </div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                <div className="mt-3 text-lg text-muted-foreground">{description}</div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.icon as keyof typeof iconMap];
                    const accent = accentThemes[index % accentThemes.length];
                    return (
                        <Card key={step.title} className={`relative overflow-hidden border-2 bg-card/85 transition-all hover:shadow-lg ${accent.cardBorder}`}>
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl border ${accent.iconWrap}`}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <span className="text-5xl font-bold text-muted-foreground/20">
                                        {index + 1}
                                    </span>
                                </div>
                                <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                </div>
                                <div className="text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </div>
                            </CardContent>
                            {index < steps.length - 1 && (
                                <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center md:flex">
                                    <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-500 via-primary to-cyan-500 dark:from-emerald-300 dark:via-primary dark:to-cyan-300" />
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Button size="lg" className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                    <Link href={cta.href} className="inline-flex items-center gap-2">
                        {cta.label}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}