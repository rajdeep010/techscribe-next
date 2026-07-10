"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { useUser } from "@/context/UserProvider";
import { UserSupportChat } from "@/components/chat/user-support-chat";

export default function UserSupportChatPage() {
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
            <SidebarIconExample />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Support Chat</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 p-4 sm:p-6">
                    <div className="mx-auto flex h-[74dvh] min-h-[420px] w-full max-w-6xl sm:h-[80dvh] sm:min-h-[550px] lg:h-[84dvh]">
                        <UserSupportChat />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
