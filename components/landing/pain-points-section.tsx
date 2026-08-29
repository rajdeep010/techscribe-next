import { BarChart3, Clock, FileCheck, PenLine, UserCircle, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { painPointsData } from "@/lib/template-data";
import { SectionHeading } from "./section-heading";

const iconMap: Record<string, LucideIcon> = {
    clock: Clock,
    "bar-chart": BarChart3,
    "pen-line": PenLine,
    "file-check": FileCheck,
    "user-circle": UserCircle,
};

export function PainPointsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
                title="Struggling With Your Assignments?"
                description="You're not alone. Here's what students often face:"
                className="mb-8"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {painPointsData.map((point) => {
                    const Icon = iconMap[point.icon];
                    return (
                        <Card
                            key={point.label}
                            className="border-primary/15 bg-primary/5 text-center transition-colors hover:bg-primary/10 dark:border-primary/25 dark:bg-primary/10"
                        >
                            <CardContent className="flex flex-col items-center gap-3 px-4 py-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium leading-snug">{point.label}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
