import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {
    SUPPORT_GUEST_COOKIE,
    SUPPORT_GUEST_COOKIE_MAX_AGE,
} from "@/lib/chat/constants";
import { getWidgetActor } from "@/lib/chat/actor";
import { getConversationForWidgetActor } from "@/lib/chat/conversations";
import { serializeConversation } from "@/lib/chat/serialize";

export async function GET() {
    try {
        await dbConnect();

        const { actor, guestCookie } = await getWidgetActor();
        const conversation = await getConversationForWidgetActor(actor);
        const serializedConversation = conversation ? serializeConversation(conversation) : null;

        const response = NextResponse.json({
            success: true,
            conversation: serializedConversation,
            actor,
        });

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
            { success: false, message: "Failed to load conversation" },
            { status: 500 }
        );
    }
}
