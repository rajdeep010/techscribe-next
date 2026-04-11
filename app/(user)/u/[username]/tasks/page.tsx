"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { UserAssignmentsProvider } from "@/context/UserAssignmentsProvider";
import { AssignmentsTable } from "@/components/dashboard/assignment-table";

export default function TasksPage() {
    return (
        <UserAssignmentsProvider>
            <SidebarProvider>
                <SidebarIconExample />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <h1 className="text-lg font-semibold">Tasks</h1>
                        </div>
                        <div className="px-4">
                            <ThemeToggle />
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col gap-6 p-6">
                        <AssignmentsTable />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </UserAssignmentsProvider>
    );
}