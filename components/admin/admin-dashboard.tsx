"use client";

import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminStatsCards } from "./admin-stats";
import { AdminAreaChart } from "./admin-area-chart";
import { AdminSidebar } from "./admin-sidebar";
import { mockChartData, mockStats } from "@/lib/template-data";
import { AdminAssignmentsProvider } from "@/context/AdminAssignmentsProvider";
import { AdminAssignmentsTable } from "./admin-assignments-table";

export default function AdminDashboard() {
    const [adminOptions, setAdminOptions] = useState<Array<{ id: string; label: string }>>([]);

    useEffect(() => {
        async function loadAdmins() {
            const response = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await response.json();

            if (!response.ok) return;

            const admins = (data.users || [])
                .filter((user: any) => user.role === "admin")
                .map((user: any) => ({
                    id: user.id,
                    label: user.name?.trim() || `@${user.username}`,
                }));

            setAdminOptions(admins);
        }

        loadAdmins();
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
                    <AdminStatsCards stats={mockStats} />
                    <AdminAreaChart
                        data={mockChartData}
                        title="Total Visitors"
                        description="Total for the last 3 months"
                    />
                    <AdminAssignmentsProvider>
                        <AdminAssignmentsTable adminOptions={adminOptions} />
                    </AdminAssignmentsProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}