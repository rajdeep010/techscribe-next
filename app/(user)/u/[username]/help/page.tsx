"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { SupportForm } from "@/components/settings/support-form";

export default function HelpPage() {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div>No user found</div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            {user.role === "admin" ? <AdminSidebar /> : <SidebarIconExample />}

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Help & Support</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-6 p-6">
                    <SupportForm />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}