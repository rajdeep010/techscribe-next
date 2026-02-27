"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStat } from "@/lib/types";
import {
    DollarSign,
    Users,
    Activity,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsCardsProps {
    stats: AdminStat[];
}

const iconMap = {
    "dollar-sign": DollarSign,
    "users": Users,
    "activity": Activity,
    "trending-up": TrendingUp,
};

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon];
                const isPositive = stat.trend === "up";

                return (
                    <Card key={index} className="px-4 py-8">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <span
                                    className={cn(
                                        "flex items-center gap-0.5 font-medium text-sm",
                                        isPositive ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {isPositive ? (
                                        <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4" />
                                    )}
                                    {stat.change}
                                </span>
                                <span className="t">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}