"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminStatsCards } from "./admin-stats";
import { AdminAreaChart } from "./admin-area-chart";
import { AdminSidebar } from "./admin-sidebar";
import { User } from "@/lib/types";
import { mockChartData, mockDocuments, mockStats } from "@/lib/template-data";
import dynamic from "next/dynamic";

const AdminDataTable = dynamic(
    () => import("./admin-data-table").then((mod) => mod.AdminDataTable),
    { ssr: false }
);

interface AdminDashboardProps {
    user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
    return (
        <SidebarProvider>
            <AdminSidebar user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <AdminStatsCards stats={mockStats} />
                    <AdminAreaChart
                        data={mockChartData}
                        title="Total Visitors"
                        description="Total for the last 3 months"
                    />
                    <AdminDataTable documents={mockDocuments} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}