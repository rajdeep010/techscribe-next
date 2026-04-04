import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { UserSupportProvider } from "@/context/UserSupportProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import SupportTicketModel from "@/model/SupportTicket";
import UserQueriesBoard from "@/components/settings/user-queries-board";

export default async function QueriesPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || !session.user.username) {
        redirect("/login");
    }

    if (session.user.username !== username) {
        redirect(`/u/${session.user.username}/queries`);
    }

    await dbConnect();

    const tickets = await SupportTicketModel.find({
        userId: session.user._id,
    })
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
            <SidebarIconExample />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Queries</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                    <UserSupportProvider initialTickets={initialTickets}>
                        <UserQueriesBoard />
                    </UserSupportProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}