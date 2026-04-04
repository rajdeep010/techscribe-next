import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { UserProvider } from "@/context/UserProvider";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect(session.user.username ? `/u/${session.user.username}` : "/");
    }

    return <UserProvider>{children}</UserProvider>;
}