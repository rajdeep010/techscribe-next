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
            <Card className="overflow-hidden border-0">
                <div className={`bg-gradient-to-r ${gradientClassName}`}>
                    <CardContent className="flex flex-col items-start gap-4 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-white/20 p-2">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                {eyebrow && (
                                    <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                                        {eyebrow}
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold">{title}</h3>
                                <p className="text-sm text-white/80">{description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="lg" variant="secondary" className="text-slate-900">
                                <Link href={primaryCta.href}>{primaryCta.label}</Link>
                            </Button>
                            {secondaryCta && (
                                <Button asChild size="lg" variant="ghost" className="text-white">
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