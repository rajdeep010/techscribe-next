"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadSource } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface LeadSourcesProps {
    sources: LeadSource[];
}

export function LeadSources({ sources }: LeadSourcesProps) {
    const total = sources.reduce((sum, source) => sum + source.value, 0);

    // Transform data for Recharts
    const chartData = sources.map(source => ({
        name: source.name,
        value: source.value,
        fill: source.color,
    }));

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Leads by Source</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-card p-2 shadow-lg">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium">
                                                        {payload[0].name}
                                                    </span>
                                                    <span className="text-lg font-bold">
                                                        {payload[0].value}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {((payload[0].value as number / total) * 100).toFixed(1)}% of total
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {/* Center Label */}
                            <text
                                x="50%"
                                y="45%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-foreground text-3xl font-bold"
                            >
                                {total}
                            </text>
                            <text
                                x="50%"
                                y="55%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-muted-foreground text-sm"
                            >
                                Leads
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-2 mt-4">
                    {sources.map((source) => (
                        <div key={source.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: source.color }}
                                />
                                <span className="text-sm">{source.name}</span>
                            </div>
                            <span className="text-sm font-medium">{source.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            {/* Action Buttons */}
            <CardFooter className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                    View Full Report
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                    Download CSV
                </Button>
            </CardFooter>
        </Card>
    );
}