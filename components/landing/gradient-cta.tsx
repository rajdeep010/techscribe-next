import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradientCtaData } from "@/lib/template-data";

const icons = {
    sparkles: Sparkles,
};

export function GradientCta() {
    const {
        eyebrow,
        title,
        description,
        primaryCta,
        secondaryCta,
        icon,
        gradientClassName = "from-indigo-600 via-purple-600 to-pink-600",
    } = gradientCtaData;

    const Icon = icons[icon];

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
            <Card className="overflow-hidden rounded-2xl border border-primary/20 shadow-[0_14px_32px_-18px_hsl(var(--primary)/0.75),0_6px_14px_-10px_hsl(var(--primary)/0.35)] dark:border-primary/30 dark:shadow-[0_18px_40px_-20px_hsl(var(--primary)/0.9),0_8px_18px_-10px_hsl(var(--primary)/0.55)]">
                <div className={`bg-gradient-to-r ${gradientClassName}`}>
                    <CardContent className="flex flex-col items-start gap-6 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                {eyebrow && (
                                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-white/90">
                                        {eyebrow}
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white">{title}</h3>
                                <div className="mt-2 text-sm text-white/90">{description}</div>
                            </div>
                        </div>
                        <div className="flex md:flex-wrap gap-3">
                            <Button asChild size="lg" variant="secondary" className="h-11 rounded-md px-5 text-sm font-semibold shadow-md">
                                <Link href={primaryCta.href} className="inline-flex items-center gap-2">
                                    {primaryCta.label}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            {secondaryCta && (
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-11 rounded-md border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                                >
                                    <Link href={secondaryCta.href} className="inline-flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        {secondaryCta.label}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>
        </section>
    );
}