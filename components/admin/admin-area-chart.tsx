"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartDataPoint, TimeFilter } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";

interface AdminAreaChartProps {
    data: ChartDataPoint[];
    title: string;
    description: string;
}

export function AdminAreaChart({ data, title, description }: AdminAreaChartProps) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("Last 3 months");
    const { theme } = useTheme();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const filters: TimeFilter[] = ["Last 3 months", "Last 30 days", "Last 7 days"];

    return (
        <Card className="py-8 px-4">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4">
                <div>
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{description}</CardDescription>
                </div>
                <div className="flex gap-1.5">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            variant={timeFilter === filter ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeFilter(filter)}
                            className="h-8 text-xs px-3"
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-0 pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValueLight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(0.606 0.25 292.717)" stopOpacity={0.5} />
                                    <stop offset="50%" stopColor="oklch(0.606 0.25 292.717)" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="oklch(0.606 0.25 292.717)" stopOpacity={0} />
                                </linearGradient>

                                <linearGradient id="colorValueDark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(0.606 0.25 292.717)" stopOpacity={0.6} />
                                    <stop offset="40%" stopColor="oklch(0.541 0.281 293.009)" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="oklch(0.432 0.232 292.759)" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="0"
                                stroke={theme === "dark" ? "white" : "hsl(var(--border))"}
                                vertical={false}
                                strokeOpacity={0.3}
                            />

                            <XAxis
                                dataKey="date"
                                tick={{ fill: theme === "dark" ? "white" : "black" }}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />

                            <YAxis
                                tick={{ fill: theme === "dark" ? "white" : "black" }}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                            />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-card p-3 shadow-lg">
                                                <div className="grid gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground font-medium">
                                                            Date
                                                        </span>
                                                        <span className="font-bold text-sm text-foreground">
                                                            {payload[0].payload.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground font-medium">
                                                            Visitors
                                                        </span>
                                                        <span className="font-bold text-sm text-primary">
                                                            {payload[0].value?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={theme === "dark" ? "oklch(0.606 0.25 292.717)" : "oklch(0.541 0.281 293.009)"}
                                strokeWidth={2.5}
                                fill={theme === "dark" ? "url(#colorValueDark)" : "url(#colorValueLight)"}
                                fillOpacity={1}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}