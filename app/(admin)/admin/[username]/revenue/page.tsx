import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminRevenue } from "@/components/admin/admin-revenue";
import dbConnect from "@/lib/dbConnect";
import RevenueModel from "@/model/Revenue";

export default async function RevenuePage() {
    await dbConnect();

    const entries = await RevenueModel.find({}).sort({ receivedAt: -1 }).limit(200).lean();

    const initialEntries = entries.map((entry) => ({
        id: String(entry._id),
        amount: entry.amount,
        category: entry.category,
        description: entry.description,
        assignmentId: entry.assignment ? String(entry.assignment) : null,
        studentName: entry.studentName || "",
        recordedByName: entry.recordedByName,
        receivedAt: new Date(entry.receivedAt).toISOString(),
        createdAt: new Date(entry.createdAt).toISOString(),
    }));

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Revenue</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
                    <AdminRevenue initialEntries={initialEntries} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
