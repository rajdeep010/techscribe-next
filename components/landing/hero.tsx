import { Button } from "@/components/ui/button";
import { OrderForm } from "../common/order-form";
import { heroData } from "@/lib/template-data";
import { Award, Clock, MessageCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { HeroBanner } from "./hero-banner";

const badgeIconMap: Record<string, LucideIcon> = {
    award: Award,
    "shield-check": ShieldCheck,
    clock: Clock,
};

export function Hero() {
    const { title, description, primaryCta, secondaryCta, trustBadges, showForm } = heroData;
    const words = title.split(" ");
    const highlightCount = Math.min(2, words.length);
    const leading = words.slice(0, words.length - highlightCount).join(" ");
    const highlighted = words.slice(words.length - highlightCount).join(" ");

    return (
        <HeroBanner
            className="pb-24 sm:pb-28"
            title={
                <>
                    {leading} <span className="text-violet-300">{highlighted}</span>
                </>
            }
            description={description}
            media={showForm ? <OrderForm /> : undefined}
            trustBadges={trustBadges?.map((badge) => ({
                icon: badgeIconMap[badge.icon],
                label: badge.label,
            }))}
            actions={
                <>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="h-11 rounded-md bg-white px-5 text-sm font-semibold text-primary hover:bg-white/90 hover:text-primary"
                        asChild
                    >
                        <Link href={primaryCta.href} className="inline-flex items-center gap-2">
                            {primaryCta.label}
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-11 rounded-md border-white/40 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                        asChild
                    >
                        <Link href={secondaryCta.href} className="inline-flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {secondaryCta.label}
                        </Link>
                    </Button>
                </>
            }
        />
    );
}
