"use client";

import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { TaskDetail } from "@/components/dashboard/task-detail";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function TaskDetailPage() {
    return (
        <SidebarProvider>
            <SidebarIconExample />
            <SidebarInset className="min-w-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_26%)]">
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex min-w-0 items-center gap-3 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-semibold tracking-tight">
                                Task Details
                            </h1>
                            <p className="hidden text-xs text-muted-foreground sm:block">
                                Review assignment status, update instructions, and manage attachments.
                            </p>
                        </div>
                    </div>

                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <div className="mx-auto w-full max-w-7xl">
                        <TaskDetail />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}