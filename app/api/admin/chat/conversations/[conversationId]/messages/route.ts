import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import {
    SUPPORT_DASHBOARD_CHANNEL,
    getConversationChannelName,
} from "@/lib/chat/constants";
import {
    canAdminReplyToConversation,
    requireAdminConversationAccess,
} from "@/lib/chat/access";
import { serializeConversation, serializeMessage } from "@/lib/chat/serialize";
import { publishAblyEvent } from "@/lib/realtime/ably-server";
import {
    adminMessageCreateSchema,
    paginationQuerySchema,
} from "@/lib/validations/chat";

export async function GET(
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

        const { searchParams } = new URL(request.url);
        const parsedQuery = paginationQuerySchema.safeParse({
            conversationId,
            cursor: searchParams.get("cursor") || undefined,
            limit: searchParams.get("limit") || undefined,
        });

        if (!parsedQuery.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedQuery.error.issues[0]?.message || "Invalid query",
                },
                { status: 400 }
            );
        }

        const { cursor, limit } = parsedQuery.data;

        const query: Record<string, unknown> = {
            conversationId: access.conversation._id,
        };

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const rows = await MessageModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit + 1);

        const hasMore = rows.length > limit;
        const pageRows = hasMore ? rows.slice(0, limit) : rows;
        const orderedRows = [...pageRows].reverse();

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

        return NextResponse.json({
            success: true,
            messages: orderedRows.map(serializeMessage),
            hasMore,
            nextCursor: hasMore ? new Date(pageRows[pageRows.length - 1].createdAt).toISOString() : null,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to load conversation messages" },
            { status: 500 }
        );
    }
}

type AdminReplyBody = {
    message?: string;
    clientMessageId?: string;
};

export async function POST(
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

        if (!canAdminReplyToConversation({
            conversation: access.conversation,
            adminId: access.adminId,
        })) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Conversation is assigned to another admin",
                },
                { status: 409 }
            );
        }

        const body = (await request.json()) as AdminReplyBody;
        const parsedBody = adminMessageCreateSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid message",
                },
                { status: 400 }
            );
        }

        const text = parsedBody.data.message;
        const clientMessageId = parsedBody.data.clientMessageId?.trim() || null;

        if (clientMessageId) {
            const existing = await MessageModel.findOne({
                conversationId: access.conversation._id,
                senderType: "admin",
                senderId: access.adminId,
                clientMessageId,
            });

            if (existing) {
                return NextResponse.json({
                    success: true,
                    message: serializeMessage(existing),
                    duplicate: true,
                });
            }
        }

        if (!access.conversation.assignedAdminId) {
            access.conversation.assignedAdminId = access.adminId;
            access.conversation.assignedAt = new Date();
        }

        const savedMessage = await MessageModel.create({
            conversationId: access.conversation._id,
            senderType: "admin",
            senderId: access.adminId,
            message: text,
            clientMessageId,
            read: false,
            readAt: null,
        });

        access.conversation.lastMessage = text;
        access.conversation.lastMessageAt = savedMessage.createdAt;
        access.conversation.status = "open";
        await access.conversation.save();

        const payloadMessage = serializeMessage(savedMessage);
        const payloadConversation = serializeConversation(access.conversation);

        void publishAblyEvent(
            getConversationChannelName(String(access.conversation._id)),
            "message.created",
            {
                conversation: payloadConversation,
                message: payloadMessage,
            }
        );

        void publishAblyEvent(SUPPORT_DASHBOARD_CHANNEL, "message.created", {
            conversation: payloadConversation,
            message: payloadMessage,
        });

        return NextResponse.json({
            success: true,
            message: payloadMessage,
            conversation: payloadConversation,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to send admin reply" },
            { status: 500 }
        );
    }
}
