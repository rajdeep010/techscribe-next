"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { LeadSources } from "@/components/analytics/lead-sources";
import { ProjectProgress } from "@/components/analytics/project-progress";
import { RevenueGrowth } from "@/components/analytics/revenue-growth";
import { AnalyticsMetricCard } from "@/components/analytics/metric-cards";
import type { AnalyticsMetric } from "@/lib/types";
import type { AnalyticsSummary } from "@/lib/admin/analytics";
import { formatCurrency } from "@/lib/utils";

function toMetrics(summary: AnalyticsSummary): AnalyticsMetric[] {
    return [
        {
            title: "New Leads",
            subtitle: "Last 30 Days",
            value: summary.newLeads.value,
            change: summary.newLeads.change,
            trend: summary.newLeads.trend,
            icon: "bar",
            chartData: summary.newLeads.sparkline.map((value) => ({ value })),
        },
        {
            title: "Reviewers Assigned",
            subtitle: "Last 30 Days",
            value: summary.reviewersAssigned.value,
            change: summary.reviewersAssigned.change,
            trend: summary.reviewersAssigned.trend,
            icon: "line",
        },
        {
            title: "Revenue",
            subtitle: "Last 6 Months",
            value: formatCurrency(summary.revenue.value),
            change: summary.revenue.change,
            trend: summary.revenue.trend,
            icon: "dollar",
        },
        {
            title: "Projects Won",
            subtitle: "Last 6 Months",
            value: summary.projectsWon.value,
            change: summary.projectsWon.change,
            trend: summary.projectsWon.trend,
            icon: "trophy",
        },
    ];
}

export default function AnalyticsPage() {
    const { user, isLoading } = useUser();
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        async function loadAnalytics() {
            const response = await fetch("/api/admin/analytics", { cache: "no-store" });
            const data = await response.json();

            if (response.ok && data.success) {
                setSummary(data.summary);
            }
        }

        loadAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div>No user found</div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            {user.role === "admin" ? <AdminSidebar /> : <SidebarIconExample />}

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Analytics</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <div className="text-muted-foreground mt-2 text-sm">
                            Track your performance metrics and business insights
                        </div>
                    </div>

                    {summary && (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {toMetrics(summary).map((metric, index) => (
                                    <AnalyticsMetricCard key={index} metric={metric} />
                                ))}
                            </div>

                            <RevenueGrowth data={summary.revenueByMonth} />

                            <div className="grid gap-6 lg:grid-cols-2">
                                <LeadSources sources={summary.leadsBySource} />
                                <ProjectProgress data={summary.assignmentsByMonth} />
                            </div>
                        </>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
