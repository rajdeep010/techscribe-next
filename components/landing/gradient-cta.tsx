import Link from "next/link";
import { ArrowRight, MessageCircle, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradientCtaData } from "@/lib/template-data";
import type { GradientCtaData } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    rocket: Rocket,
};

export function GradientCta({ data = gradientCtaData }: { data?: GradientCtaData }) {
    const {
        eyebrow,
        title,
        description,
        primaryCta,
        secondaryCta,
        icon,
        gradientClassName = "from-primary via-primary to-violet-700",
    } = data;

    const Icon = icons[icon];

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <Card className="overflow-hidden rounded-2xl border-0">
                <div className={`bg-gradient-to-r ${gradientClassName}`}>
                    <CardContent className="flex flex-col items-start gap-6 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
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
                        <div className="flex flex-wrap gap-3">
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
