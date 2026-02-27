"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnalyticsMetric } from "@/lib/types";
import { BarChart, LineChart, DollarSign, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsMetricCardProps {
    metric: AnalyticsMetric;
}

const iconMap = {
    bar: BarChart,
    line: LineChart,
    dollar: DollarSign,
    trophy: Trophy,
};

export function AnalyticsMetricCard({ metric }: AnalyticsMetricCardProps) {
    const Icon = metric.icon ? iconMap[metric.icon] : BarChart;
    const isPositive = metric.trend === "up";

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {metric.subtitle}
                        </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Chart Mini Preview */}
                {metric.chartData && (
                    <div className="flex items-end gap-1 h-16">
                        {metric.chartData.map((point, index) => (
                            <div
                                key={index}
                                className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/30"
                                style={{
                                    height: `${(point.value / Math.max(...metric.chartData!.map(p => p.value))) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Value and Change */}
                <div className="space-y-1">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    {metric.change && (
                        <p
                            className={cn(
                                "text-sm font-medium",
                                isPositive ? "text-green-600" : "text-red-600"
                            )}
                        >
                            {metric.change}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}