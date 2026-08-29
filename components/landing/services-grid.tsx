import Link from "next/link";
import {
    BookOpen,
    GraduationCap,
    Microscope,
    Presentation,
    Quote,
    SpellCheck2,
    type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { academicServicesData } from "@/lib/template-data";
import { SectionHeading } from "./section-heading";

const iconMap: Record<string, LucideIcon> = {
    "book-open": BookOpen,
    microscope: Microscope,
    "graduation-cap": GraduationCap,
    presentation: Presentation,
    quote: Quote,
    "spell-check": SpellCheck2,
};

export function ServicesGrid() {
    return (
        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
            <SectionHeading title="Our Academic Support Services" className="mb-8" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {academicServicesData.map((service) => {
                    const Icon = iconMap[service.icon];
                    return (
                        <Card
                            key={service.title}
                            className="border-primary/15 bg-card/85 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-primary/25"
                        >
                            <CardContent className="p-6">
                                <Link
                                    href={service.href ?? "/contact"}
                                    className="flex flex-col items-start gap-3"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{service.title}</h3>
                                    <div className="text-sm leading-relaxed text-muted-foreground">
                                        {service.description}
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
