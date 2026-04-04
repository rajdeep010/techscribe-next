"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { LeadSources } from "@/components/analytics/lead-sources";
import { ProjectProgress } from "@/components/analytics/project-progress";
import { RevenueGrowth } from "@/components/analytics/revenue-growth"; // Add this import
import { analyticsData } from "@/lib/template-data";
import { AnalyticsMetricCard } from "@/components/analytics/metric-cards";

export default function AnalyticsPage() {
    const { user, isLoading } = useUser();

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
                        <div className="text-muted-foreground mt-2">
                            Track your performance metrics and business insights
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {analyticsData.metrics.map((metric, index) => (
                            <AnalyticsMetricCard key={index} metric={metric} />
                        ))}
                    </div>

                    {/* Uncomment this */}
                    <RevenueGrowth />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <LeadSources sources={analyticsData.leadSources} />
                        <ProjectProgress />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}