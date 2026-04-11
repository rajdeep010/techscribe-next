import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function requireUserSession() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return {
            ok: false as const,
            status: 401,
            message: "Unauthorized",
        }
    }

    if (session.user.role !== "user") {
        return {
            ok: false as const,
            status: 403,
            message: "Forbidden",
        }
    }

    if (!session.user._id) {
        return {
            ok: false as const,
            status: 401,
            message: "Unauthorized",
        }
    }

    return {
        ok: true as const,
        session,
    }
}