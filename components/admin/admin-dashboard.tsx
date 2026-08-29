"use client";

import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminStatsCards } from "./admin-stats";
import { AdminAreaChart } from "./admin-area-chart";
import { AdminSidebar } from "./admin-sidebar";
import { AdminAssignmentsProvider } from "@/context/AdminAssignmentsProvider";
import { AdminAssignmentsTable } from "./admin-assignments-table";
import type { AdminStat, ChartDataPoint } from "@/lib/types";
import type { DashboardStats } from "@/lib/admin/analytics";
import { formatCurrency } from "@/lib/utils";

function toStatCards(stats: DashboardStats): AdminStat[] {
    return [
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue.value),
            change: stats.totalRevenue.change,
            trend: stats.totalRevenue.trend,
            description: "vs previous 30 days",
            icon: "dollar-sign",
        },
        {
            title: "New Customers",
            value: stats.newCustomers.value.toLocaleString(),
            change: stats.newCustomers.change,
            trend: stats.newCustomers.trend,
            description: "New signups vs previous 30 days",
            icon: "users",
        },
        {
            title: "Active Accounts",
            value: stats.activeAccounts.value.toLocaleString(),
            change: stats.activeAccounts.change,
            trend: stats.activeAccounts.trend,
            description: "Verified accounts, all time",
            icon: "activity",
        },
        {
            title: "Growth Rate",
            value: stats.assignmentVolume.change,
            change: stats.assignmentVolume.change,
            trend: stats.assignmentVolume.trend,
            description: "Assignment submissions vs previous 30 days",
            icon: "trending-up",
        },
    ];
}

export default function AdminDashboard() {
    const [adminOptions, setAdminOptions] = useState<Array<{ id: string; label: string }>>([]);
    const [stats, setStats] = useState<AdminStat[] | null>(null);
    const [assignmentVolume, setAssignmentVolume] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        async function loadAdmins() {
            const response = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await response.json();

            if (!response.ok) return;

            const admins = (data.users || [])
                .filter((user: { role: string }) => user.role === "admin")
                .map((user: { id: string; name?: string; username: string }) => ({
                    id: user.id,
                    label: user.name?.trim() || `@${user.username}`,
                }));

            setAdminOptions(admins);
        }

        async function loadDashboardStats() {
            const response = await fetch("/api/admin/dashboard-stats", { cache: "no-store" });
            const data = await response.json();

            if (!response.ok || !data.success) return;

            setStats(toStatCards(data.stats));
            setAssignmentVolume(data.assignmentVolume);
        }

        loadAdmins();
        loadDashboardStats();
    }, []);

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="min-w-0">
                <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-w-0 flex-1 flex-col gap-6 p-6">
                    {stats && <AdminStatsCards stats={stats} />}
                    {assignmentVolume.length > 0 && (
                        <AdminAreaChart
                            data={assignmentVolume}
                            title="Assignment Volume"
                            description="New assignments submitted over time"
                            valueLabel="Assignments"
                        />
                    )}
                    <AdminAssignmentsProvider>
                        <AdminAssignmentsTable adminOptions={adminOptions} />
                    </AdminAssignmentsProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
