import { BookOpen, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { howItWorksData } from "@/lib/template-data";

const iconMap = {
    "book-open": BookOpen,
    "credit-card": CreditCard,
    "check-circle": CheckCircle2,
};

export function HowItWorks() {
    const { eyebrow, title, description, steps, cta } = howItWorksData;

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                <p className="mt-3 text-lg text-muted-foreground">{description}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.icon as keyof typeof iconMap];
                    return (
                        <Card key={step.title} className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                        <Icon className="h-7 w-7 text-primary" />
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
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                            {index < steps.length - 1 && (
                                <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center md:flex">
                                    <div className="h-0.5 w-8 bg-gradient-to-r from-primary to-transparent" />
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Button size="lg" className="px-8">
                    {cta.label}
                </Button>
            </div>
        </section>
    );
}