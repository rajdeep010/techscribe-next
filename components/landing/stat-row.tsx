import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatRowItem = {
    icon: LucideIcon;
    value: string;
    label: string;
};

export function StatRow({
    items,
    tone = "light",
    className,
}: {
    items: StatRowItem[];
    tone?: "light" | "dark";
    className?: string;
}) {
    const isDark = tone === "dark";

    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-center gap-x-10 gap-y-6 rounded-2xl px-6 py-6 sm:px-8",
                isDark
                    ? "bg-gradient-to-r from-violet-950 via-primary to-violet-800 text-white"
                    : "border border-primary/15 bg-card",
                className
            )}
        >
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                            isDark ? "bg-white/15 text-white" : "bg-primary/10 text-primary dark:bg-primary/15"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold leading-tight">{item.value}</div>
                        <div
                            className={cn(
                                "text-xs leading-tight",
                                isDark ? "text-white/75" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
