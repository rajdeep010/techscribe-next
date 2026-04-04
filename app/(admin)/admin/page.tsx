import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function AdminRootPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect(session.user.username ? `/u/${session.user.username}` : "/");
    }

    redirect(`/admin/${session.user.username}`);
}