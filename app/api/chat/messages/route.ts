import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";
import {
    SUPPORT_DASHBOARD_CHANNEL,
    SUPPORT_GUEST_COOKIE,
    SUPPORT_GUEST_COOKIE_MAX_AGE,
    getConversationChannelName,
} from "@/lib/chat/constants";
import { requireWidgetConversationAccess } from "@/lib/chat/access";
import { getWidgetActor } from "@/lib/chat/actor";
import { getOrCreateConversationForWidgetActor } from "@/lib/chat/conversations";
import { serializeConversation, serializeMessage } from "@/lib/chat/serialize";
import { publishAblyEvent } from "@/lib/realtime/ably-server";
import {
    paginationQuerySchema,
    userMessageCreateSchema,
} from "@/lib/validations/chat";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const parsedQuery = paginationQuerySchema.safeParse({
            conversationId: searchParams.get("conversationId") || "",
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

        const { conversationId, cursor, limit } = parsedQuery.data;

        const access = await requireWidgetConversationAccess(conversationId);

        if (!access.ok) {
            return NextResponse.json(
                { success: false, message: access.message },
                { status: access.status }
            );
        }

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
                senderType: "admin",
                read: false,
            },
            {
                $set: {
                    read: true,
                    readAt: new Date(),
                },
            }
        );

        const response = NextResponse.json({
            success: true,
            messages: orderedRows.map(serializeMessage),
            hasMore,
            nextCursor: hasMore ? new Date(pageRows[pageRows.length - 1].createdAt).toISOString() : null,
        });

        if (access.guestCookie.needsSetCookie) {
            response.cookies.set(SUPPORT_GUEST_COOKIE, access.guestCookie.guestId, {
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
            { success: false, message: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

type CreateMessageBody = {
    conversationId?: string;
    message?: string;
    clientMessageId?: string;
};

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = (await request.json()) as CreateMessageBody;
        const parsedBody = userMessageCreateSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid request",
                },
                { status: 400 }
            );
        }

        const conversationId = parsedBody.data.conversationId;
        const messageText = parsedBody.data.message;
        const clientMessageId = parsedBody.data.clientMessageId?.trim() || null;

        const { actor, guestCookie } = await getWidgetActor();

        const access = conversationId
            ? await requireWidgetConversationAccess(conversationId)
            : null;

        if (access && !access.ok) {
            return NextResponse.json(
                { success: false, message: access.message },
                { status: access.status }
            );
        }

        const resolvedConversation = access?.ok
            ? access.conversation
            : (await getOrCreateConversationForWidgetActor(actor)).conversation;

        const senderId = access?.ok ? access.actor.senderId : actor.participantId;

        if (clientMessageId) {
            const existing = await MessageModel.findOne({
                conversationId: resolvedConversation._id,
                senderId,
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

        const savedMessage = await MessageModel.create({
            conversationId: resolvedConversation._id,
            senderType: "user",
            senderId,
            message: messageText,
            clientMessageId,
            read: false,
            readAt: null,
        });

        resolvedConversation.lastMessage = messageText;
        resolvedConversation.lastMessageAt = savedMessage.createdAt;
        resolvedConversation.status = "open";
        await resolvedConversation.save();

        const payloadMessage = serializeMessage(savedMessage);
        const payloadConversation = serializeConversation(resolvedConversation);

        void publishAblyEvent(
            getConversationChannelName(String(resolvedConversation._id)),
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

        const response = NextResponse.json({
            success: true,
            message: payloadMessage,
            conversation: payloadConversation,
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
            { success: false, message: "Failed to send message" },
            { status: 500 }
        );
    }
}
