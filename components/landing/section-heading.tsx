import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
    eyebrow?: string;
    eyebrowIcon?: LucideIcon;
    title: string;
    description?: string;
    align?: "center" | "left";
    className?: string;
};

export function SectionHeading({
    eyebrow,
    eyebrowIcon: EyebrowIcon,
    title,
    description,
    align = "center",
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "space-y-3",
                align === "center" ? "mx-auto max-w-2xl text-center" : "text-left",
                className
            )}
        >
            {eyebrow && (
                <div
                    className={cn(
                        "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary dark:border-primary/35 dark:bg-primary/15"
                    )}
                >
                    {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5" />}
                    {eyebrow}
                </div>
            )}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {description && (
                <div className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {description}
                </div>
            )}
        </div>
    );
}
