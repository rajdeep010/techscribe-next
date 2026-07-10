import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {
    SUPPORT_DASHBOARD_CHANNEL,
    getConversationChannelName,
} from "@/lib/chat/constants";
import { requireAdminConversationAccess } from "@/lib/chat/access";
import { serializeConversation } from "@/lib/chat/serialize";
import { publishAblyEvent } from "@/lib/realtime/ably-server";
import MessageModel from "@/model/Message";
import { adminConversationActionSchema } from "@/lib/validations/chat";

type PatchConversationBody = {
    action?: "claim" | "unassign" | "open" | "close" | "mark-read";
};

export async function PATCH(
    request: Request,
    context: { params: Promise<{ conversationId: string }> }
) {
    try {
        await dbConnect();

        const { conversationId } = await context.params;
        const access = await requireAdminConversationAccess(conversationId);

        if (!access.ok) {
            return NextResponse.json(
                { success: false, message: access.message },
                { status: access.status }
            );
        }

        const body = (await request.json()) as PatchConversationBody;
        const parsedBody = adminConversationActionSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid action",
                },
                { status: 400 }
            );
        }

        const { action } = parsedBody.data;

        if (action === "claim") {
            access.conversation.assignedAdminId = access.adminId;
            access.conversation.assignedAt = new Date();
        }

        if (action === "unassign") {
            access.conversation.assignedAdminId = null;
            access.conversation.assignedAt = null;
        }

        if (action === "open" || action === "close") {
            access.conversation.status = action === "close" ? "closed" : "open";
        }

        if (action === "mark-read") {
            await MessageModel.updateMany(
                {
                    conversationId: access.conversation._id,
                    senderType: "user",
                    read: false,
                },
                {
                    $set: {
                        read: true,
                        readAt: new Date(),
                    },
                }
            );
        }

        await access.conversation.save();

        const payloadConversation = serializeConversation(access.conversation);

        void publishAblyEvent(SUPPORT_DASHBOARD_CHANNEL, "conversation.updated", {
            conversation: payloadConversation,
            action,
        });

        void publishAblyEvent(
            getConversationChannelName(String(access.conversation._id)),
            "conversation.updated",
            {
                conversation: payloadConversation,
                action,
            }
        );

        return NextResponse.json({
            success: true,
            conversation: payloadConversation,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to update conversation" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ conversationId: string }> }
) {
    try {
        await dbConnect();

        const { conversationId } = await context.params;
        const access = await requireAdminConversationAccess(conversationId);

        if (!access.ok) {
            return NextResponse.json(
                { success: false, message: access.message },
                { status: access.status }
            );
        }

        const channelName = getConversationChannelName(String(access.conversation._id));

        await MessageModel.deleteMany({ conversationId: access.conversation._id });
        await access.conversation.deleteOne();

        void publishAblyEvent(SUPPORT_DASHBOARD_CHANNEL, "conversation.deleted", {
            conversationId,
        });

        void publishAblyEvent(channelName, "conversation.deleted", {
            conversationId,
        });

        return NextResponse.json({
            success: true,
            conversationId,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to delete conversation" },
            { status: 500 }
        );
    }
}
