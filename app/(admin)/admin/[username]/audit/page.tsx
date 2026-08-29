"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { AdminAuditTable, type AuditLogRow } from "@/components/admin/admin-audit-table";

export default function AuditPage() {
    const { user, isLoading } = useUser();
    const [logs, setLogs] = useState<AuditLogRow[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);

    useEffect(() => {
        async function loadAuditLog() {
            try {
                const response = await fetch("/api/admin/audit", { cache: "no-store" });
                const data = await response.json();

                if (response.ok && data.success) {
                    setLogs(data.logs);
                }
            } finally {
                setIsLoadingLogs(false);
            }
        }

        loadAuditLog();
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
                        <h1 className="text-lg font-semibold">Audit Logs</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
                        <div className="text-muted-foreground mt-2">
                            Every revenue entry and manually-logged assignment that&apos;s created, edited, or
                            deleted is recorded here. Each row&apos;s <span className="font-medium text-foreground">Ref</span> stays
                            the same across an entry&apos;s full history — including after it&apos;s deleted — so you can
                            sort or search by it to see everything that happened to one record.
                        </div>
                    </div>
                    <AdminAuditTable logs={logs} isLoading={isLoadingLogs} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
