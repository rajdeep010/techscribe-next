"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { UserProfileSection } from "./user-stats";
import { AssignmentsTable } from "./assignment-table";
import { UserAssignmentsProvider } from "@/context/UserAssignmentsProvider";

export default function UserDashboard() {
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
        <UserAssignmentsProvider>
            <SidebarProvider>
                <SidebarIconExample />
                <SidebarInset className="min-w-0">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                        <div className="px-4">
                            <ThemeToggle />
                        </div>
                    </header>
                    <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
                        <UserProfileSection />
                        <AssignmentsTable />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </UserAssignmentsProvider>
    );
}