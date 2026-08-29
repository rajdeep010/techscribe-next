"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Testimonial = {
    name: string;
    role: string;
    quote: string;
};

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => {
                const initials = testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("");

                return (
                    <Card key={testimonial.name} className="border-primary/15 bg-card/90 dark:border-primary/25">
                        <CardContent className="space-y-4 p-5">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 border-t pt-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                    {initials}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
    const [index, setIndex] = React.useState(0);

    if (testimonials.length === 0) return null;

    const active = testimonials[index % testimonials.length];
    const initials = active.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("");

    const goTo = (next: number) => {
        setIndex(((next % testimonials.length) + testimonials.length) % testimonials.length);
    };

    return (
        <Card className="border-primary/15 bg-card/90 dark:border-primary/25">
            <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                </div>
                <p className="min-h-[5.5rem] text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{active.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                            {initials}
                        </div>
                        <div>
                            <div className="font-medium">{active.name}</div>
                            <div className="text-sm text-muted-foreground">{active.role}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => goTo(index - 1)}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => goTo(index + 1)}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                    {testimonials.map((testimonial, i) => (
                        <button
                            key={testimonial.name}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Show testimonial from ${testimonial.name}`}
                            className={cn(
                                "h-1.5 rounded-full transition-all",
                                i === index % testimonials.length ? "w-5 bg-primary" : "w-1.5 bg-primary/25"
                            )}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
