import { Headphones, ShieldCheck, Star, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { statsBarData } from "@/lib/template-data";
import { StatRow } from "./stat-row";

const iconMap: Record<string, LucideIcon> = {
    users: Users,
    star: Star,
    headphones: Headphones,
    "trending-up": TrendingUp,
    "shield-check": ShieldCheck,
};

export function StatsBar() {
    const items = statsBarData.map((stat) => ({
        icon: iconMap[stat.icon],
        value: stat.value,
        label: stat.label,
    }));

    return (
        <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4 sm:-mt-16 sm:px-6">
            <StatRow
                items={items}
                className="shadow-[0_20px_45px_-25px_hsl(var(--primary)/0.55)]"
            />
        </div>
    );
}
