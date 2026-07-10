import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SUPPORT_GUEST_COOKIE } from "@/lib/chat/constants";

export type WidgetActor = {
    kind: "guest" | "user";
    participantId: string;
    guestId?: string;
    userId?: string;
    username?: string;
};

export type GuestCookieResult = {
    guestId: string;
    needsSetCookie: boolean;
};

export async function getOrCreateGuestId(): Promise<GuestCookieResult> {
    const cookieStore = await cookies();
    const existing = cookieStore.get(SUPPORT_GUEST_COOKIE)?.value?.trim();

    if (existing) {
        return { guestId: existing, needsSetCookie: false };
    }

    return {
        guestId: crypto.randomUUID(),
        needsSetCookie: true,
    };
}

export async function getWidgetActor(): Promise<{
    actor: WidgetActor;
    guestCookie: GuestCookieResult;
}> {
    const session = await getServerSession(authOptions);
    const guestCookie = await getOrCreateGuestId();

    const userId = session?.user?._id;

    if (userId) {
        return {
            actor: {
                kind: "user",
                participantId: userId,
                userId,
                guestId: guestCookie.guestId,
                username: session.user.username,
            },
            guestCookie,
        };
    }

    return {
        actor: {
            kind: "guest",
            participantId: guestCookie.guestId,
            guestId: guestCookie.guestId,
        },
        guestCookie,
    };
}
