"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
    value: {
        label: "Assignments",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig

export function ProjectProgress({
    data,
    title = "Assignments Submitted",
    description = "New assignments received per month",
    footerNote = "Showing new assignment submissions for the last 6 months",
}: {
    data: { name: string; value: number }[]
    title?: string
    description?: string
    footerNote?: string
}) {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {total === 0 ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No assignment data yet for this period.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={data}
                            layout="vertical"
                            margin={{
                                right: 16,
                            }}
                        >
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                hide
                            />
                            <XAxis dataKey="value" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Bar
                                dataKey="value"
                                layout="vertical"
                                fill="var(--color-value)"
                                radius={4}
                            >
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-(--color-label)"
                                    fontSize={12}
                                />
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    offset={8}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
                <div className="text-muted-foreground leading-none">
                    {footerNote}
                </div>
            </CardFooter>
        </Card>
    )
}
