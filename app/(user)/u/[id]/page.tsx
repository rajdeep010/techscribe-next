import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import AdminDashboard from "@/components/admin/admin-dashboard";

const IS_ADMIN = true;

async function getUser(id: string) {
    // Simulate async user fetch
    await new Promise(resolve => setTimeout(resolve, 0));

    return {
        id,
        name: IS_ADMIN ? "Admin User" : "Regular User",
        email: IS_ADMIN ? "admin@techscribe.com" : "user@techscribe.com",
        avatar: "https://github.com/shadcn.png",
        role: IS_ADMIN ? ("admin" as const) : ("user" as const),
    };
}

interface DashboardPageProps {
    params: {
        id: string;
    };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const user = await getUser(params.id);

    // Server-side role check - prevents hydration mismatch
    if (user.role === "admin") {
        return <AdminDashboard user={user} />;
    }

    return <SidebarIconExample />;
}