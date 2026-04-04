"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { ProfileSettings } from "@/components/settings/profile-settings";

export default function SettingsPageContent() {
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
                        <h1 className="text-lg font-semibold">Settings</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                        <div className="text-sm text-muted-foreground mt-2">
                            Manage your account settings and set e-mail preferences.
                        </div>
                    </div>
                    <ProfileSettings />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}