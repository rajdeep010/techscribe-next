import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroTrustBadge = {
    icon: LucideIcon;
    label: string;
};

type HeroBannerProps = {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    trustBadges?: HeroTrustBadge[];
    actions?: React.ReactNode;
    media?: React.ReactNode;
    align?: "center" | "split";
    className?: string;
    children?: React.ReactNode;
};

export function HeroBanner({
    eyebrow,
    title,
    description,
    trustBadges,
    actions,
    media,
    align = "split",
    className,
    children,
}: HeroBannerProps) {
    const isSplit = align === "split" && !!media;

    return (
        <section
            className={cn(
                "bg-gradient-to-br from-violet-950 via-primary to-violet-800 px-4 py-14 sm:px-6 sm:py-16",
                className
            )}
        >
            <div
                className={cn(
                    "mx-auto max-w-6xl",
                    isSplit ? "grid items-center gap-10 md:grid-cols-2" : "text-center"
                )}
            >
                <div className={cn("space-y-5 text-white", !isSplit && "mx-auto max-w-2xl")}>
                    {eyebrow && (
                        <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                            {eyebrow}
                        </div>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
                    {description && (
                        <p className="text-base text-white/80 sm:text-lg">{description}</p>
                    )}
                    {actions && (
                        <div className={cn("flex flex-wrap gap-3", !isSplit && "justify-center")}>
                            {actions}
                        </div>
                    )}
                    {trustBadges && trustBadges.length > 0 && (
                        <ul
                            className={cn(
                                "flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80",
                                !isSplit && "justify-center"
                            )}
                        >
                            {trustBadges.map((badge) => (
                                <li key={badge.label} className="flex items-center gap-2">
                                    <badge.icon className="h-4 w-4 text-violet-300" />
                                    <span>{badge.label}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {isSplit && <div>{media}</div>}
            </div>
            {children}
        </section>
    );
}
