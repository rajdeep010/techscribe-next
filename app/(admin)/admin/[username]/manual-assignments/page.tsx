import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminManualAssignments } from "@/components/admin/admin-manual-assignments";
import dbConnect from "@/lib/dbConnect";
import ManualAssignmentEntryModel from "@/model/ManualAssignmentEntry";

export default async function ManualAssignmentsPage() {
    await dbConnect();

    const entries = await ManualAssignmentEntryModel.find({}).sort({ createdAt: -1 }).limit(200).lean();

    const initialEntries = entries.map((entry) => ({
        id: String(entry._id),
        title: entry.title,
        subject: entry.subject || "",
        clientName: entry.clientName,
        clientContact: entry.clientContact,
        handledById: String(entry.handledBy),
        handledByName: entry.handledByName,
        status: entry.status,
        deliveryDate: entry.deliveryDate ? new Date(entry.deliveryDate).toISOString() : null,
        notes: entry.notes || "",
        recordedByName: entry.recordedByName,
        createdAt: new Date(entry.createdAt).toISOString(),
    }));

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Manual Assignments</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
                    <AdminManualAssignments initialEntries={initialEntries} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
