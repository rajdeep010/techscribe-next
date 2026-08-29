"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
    value: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function RevenueGrowth({
    data,
    title = "Revenue Growth",
    description = "Recorded revenue per month",
    footerNote = "Showing recorded revenue for the last 6 months",
}: {
    data: { date: string; value: number }[]
    title?: string
    description?: string
    footerNote?: string
}) {
    const hasData = data.some((point) => point.value > 0)

    return (
        <Card className="px-8 py-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No revenue recorded yet for this period.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                top: 20,
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line
                                dataKey="value"
                                type="natural"
                                stroke="var(--color-value)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-value)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                            </Line>
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
            <div className="flex-col items-start gap-2 text-sm my-4">
                <div className="text-muted-foreground leading-none">
                    {footerNote}
                </div>
            </div>
        </Card>
    )
}
