import Link from "next/link";
import { Sparkles } from "lucide-react";
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
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
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
                                <p className="mt-2 text-sm text-white/90">{description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" variant="secondary" className="font-semibold shadow-md">
                                <Link href={primaryCta.href}>{primaryCta.label}</Link>
                            </Button>
                            {secondaryCta && (
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                                >
                                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>
        </section>
    );
}