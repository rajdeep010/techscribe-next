import {
    ArrowRight,
    ClipboardCheck,
    FileEdit,
    MessageSquare,
    Send,
    ThumbsUp,
    UserCheck,
    type LucideIcon,
} from "lucide-react";
import { howItWorksData } from "@/lib/template-data";
import { SectionHeading } from "./section-heading";

const iconMap: Record<string, LucideIcon> = {
    "file-edit": FileEdit,
    "user-check": UserCheck,
    "message-square": MessageSquare,
    "clipboard-check": ClipboardCheck,
    send: Send,
    "thumbs-up": ThumbsUp,
};

export function HowItWorks() {
    const { eyebrow, title, description, steps } = howItWorksData;

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} className="mb-10" />

            <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-10">
                {steps.map((step, index) => {
                    const Icon = iconMap[step.icon];
                    const isLast = index === steps.length - 1;
                    return (
                        <div key={step.title} className="flex items-start">
                            <div className="flex w-32 flex-col items-center text-center sm:w-36">
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/25 bg-card text-primary shadow-sm">
                                    <Icon className="h-6 w-6" />
                                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {index + 1}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {step.description}
                                </div>
                            </div>
                            {!isLast && (
                                <ArrowRight className="mt-6 hidden h-5 w-5 shrink-0 text-primary/40 lg:block" />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
