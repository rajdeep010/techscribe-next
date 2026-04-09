import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BlogWriterShell } from "@/components/admin/blog-writer-shell"
import { ThemeToggle } from "@/components/common/theme-toggle-button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const page = () => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Write</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <BlogWriterShell />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default page