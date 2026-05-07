import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminUsersProvider } from "@/context/AdminUsersProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { getUserAvatarUrl } from "@/lib/user-avatar";
import UserModel from "@/model/User";
import { AdminUsersManagement } from "@/components/admin/admin-users-management";

export default async function AdminUsersPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || !session.user.username) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect(`/u/${session.user.username}`);
    }

    if (session.user.username !== username) {
        redirect(`/admin/${session.user.username}/users`);
    }

    await dbConnect();

    const users = await UserModel.find({})
        .sort({ createdAt: -1 })
        .select("name username email role isVerified location avatar createdAt updatedAt")
        .lean();

    const initialUsers = users.map((user: any) => ({
        id: String(user._id),
        name: user.name || "",
        username: user.username,
        email: user.email,
        role: user.role ?? "user",
        isVerified: Boolean(user.isVerified),
        location: user.location || "",
        avatar: getUserAvatarUrl({ userId: String(user._id), avatar: user.avatar }),
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
    }));

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Users</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                    <AdminUsersProvider initialUsers={initialUsers}>
                        <AdminUsersManagement />
                    </AdminUsersProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}