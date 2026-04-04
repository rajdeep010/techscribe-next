import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSupportCenter } from "@/components/admin/admin-support-center";
import { AdminSupportProvider } from "@/context/AdminProvider";
import dbConnect from "@/lib/dbConnect";
import SupportTicketModel from "@/model/SupportTicket";

export default async function NotificationsPage() {
  await dbConnect();

  const tickets = await SupportTicketModel.find({})
    .sort({ createdAt: -1 })
    .lean();

  const initialTickets = tickets.map((ticket: any) => ({
    id: String(ticket._id),
    userId: ticket.userId,
    username: ticket.username,
    email: ticket.email,
    role: ticket.role,
    subject: ticket.subject,
    category: ticket.category,
    message: ticket.message,
    status: ticket.status,
    createdAt: new Date(ticket.createdAt).toISOString(),
    updatedAt: new Date(ticket.updatedAt).toISOString(),
  }));

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          <div className="px-4">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
          <AdminSupportProvider initialTickets={initialTickets}>
            <AdminSupportCenter />
          </AdminSupportProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}