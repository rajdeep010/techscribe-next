import Image from "next/image";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

export const BRAND_NAME = CONTACT_INFO.brandName;

// Matches the aspect ratio of /public/logo-full.png (900x605)
const LOGO_FULL_ASPECT_RATIO = 605 / 900;

/**
 * Compact lettermark badge used anywhere the full logo lockup would be too
 * small to read (navbar, footer inline mark, etc). Pure CSS/text so it stays
 * crisp at any size — update the gradient/letter here and it updates everywhere.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-700 font-bold text-primary-foreground",
                className
            )}
            aria-hidden="true"
        >
            <span className="leading-none">A</span>
        </span>
    );
}

export function Logo({
    className,
    markClassName,
    textClassName,
    showText = true,
}: {
    className?: string;
    markClassName?: string;
    textClassName?: string;
    showText?: boolean;
}) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <LogoMark className={cn("h-8 w-8 text-lg", markClassName)} />
            {showText && (
                <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
                    {BRAND_NAME}
                </span>
            )}
        </span>
    );
}

/** Full icon + wordmark lockup, for spots with room to show it clearly (auth panels, large brand moments). */
export function LogoFull({
    className,
    width = 220,
}: {
    className?: string;
    width?: number;
}) {
    return (
        <Image
            src="/logo-full.png"
            alt={BRAND_NAME}
            width={width}
            height={Math.round(width * LOGO_FULL_ASPECT_RATIO)}
            className={cn("rounded-2xl", className)}
        />
    );
}
