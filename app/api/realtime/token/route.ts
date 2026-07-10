import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
    SUPPORT_GUEST_COOKIE,
    SUPPORT_GUEST_COOKIE_MAX_AGE,
} from "@/lib/chat/constants";
import { getOrCreateGuestId } from "@/lib/chat/actor";
import { createAblyTokenRequest } from "@/lib/realtime/ably-server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const guestCookie = await getOrCreateGuestId();

        const userId = session?.user?._id;
        const userRole = session?.user?.role;

        const clientId = userId
            ? `${userRole === "admin" ? "admin" : "user"}:${userId}`
            : `guest:${guestCookie.guestId}`;

        const tokenRequest = await createAblyTokenRequest(clientId);

        const response = NextResponse.json(tokenRequest);

        if (guestCookie.needsSetCookie) {
            response.cookies.set(SUPPORT_GUEST_COOKIE, guestCookie.guestId, {
                path: "/",
                maxAge: SUPPORT_GUEST_COOKIE_MAX_AGE,
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });
        }

        return response;
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to create realtime token" },
            { status: 500 }
        );
    }
}
