import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getOrCreateGuestId } from "@/lib/chat/actor";
import ConversationModel, { ConversationDocument } from "@/model/Conversation";

export async function requireAdminConversationAccess(conversationId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
        return { ok: false as const, status: 401, message: "Unauthorized" };
    }

    if (session.user.role !== "admin") {
        return { ok: false as const, status: 403, message: "Forbidden" };
    }

    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
        return { ok: false as const, status: 404, message: "Conversation not found" };
    }

    return {
        ok: true as const,
        session,
        conversation,
        adminId: session.user._id,
    };
}

export async function requireWidgetConversationAccess(conversationId: string) {
    const [session, guestCookie] = await Promise.all([
        getServerSession(authOptions),
        getOrCreateGuestId(),
    ]);

    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
        return { ok: false as const, status: 404, message: "Conversation not found", guestCookie };
    }

    if (session?.user?._id) {
        if (conversation.userId !== session.user._id) {
            return { ok: false as const, status: 403, message: "Forbidden", guestCookie };
        }

        return {
            ok: true as const,
            conversation,
            actor: {
                kind: "user" as const,
                senderId: session.user._id,
                guestId: guestCookie.guestId,
            },
            guestCookie,
        };
    }

    if (conversation.guestId !== guestCookie.guestId) {
        return { ok: false as const, status: 403, message: "Forbidden", guestCookie };
    }

    return {
        ok: true as const,
        conversation,
        actor: {
            kind: "guest" as const,
            senderId: guestCookie.guestId,
            guestId: guestCookie.guestId,
        },
        guestCookie,
    };
}

export function canAdminReplyToConversation(params: {
    conversation: ConversationDocument;
    adminId: string;
}) {
    const { conversation, adminId } = params;

    return !conversation.assignedAdminId || conversation.assignedAdminId === adminId;
}
