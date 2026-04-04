import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function UserAreaLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ username: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { username } = await params;

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === "admin") {
        redirect(session.user.username ? `/admin/${session.user.username}` : "/");
    }

    if (session.user.username !== username) {
        redirect(`/u/${session.user.username}`);
    }

    return <>{children}</>;
}