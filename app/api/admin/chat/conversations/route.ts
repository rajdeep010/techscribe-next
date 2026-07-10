import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import ConversationModel from "@/model/Conversation";
import MessageModel from "@/model/Message";
import { serializeConversation } from "@/lib/chat/serialize";

export async function GET(request: Request) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.trim();
        const status = searchParams.get("status");
        const unread = searchParams.get("unread") === "true";
        const assigned = searchParams.get("assigned");

        const filter: Record<string, unknown> = {};

        if (status === "open" || status === "closed") {
            filter.status = status;
        }

        if (assigned === "me") {
            filter.assignedAdminId = auth.session.user._id;
        } else if (assigned === "unassigned") {
            filter.assignedAdminId = null;
        }

        if (search) {
            filter.$or = [
                { participantId: { $regex: search, $options: "i" } },
                { guestId: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { lastMessage: { $regex: search, $options: "i" } },
            ];
        }

        const conversations = await ConversationModel.find(filter)
            .sort({ lastMessageAt: -1 })
            .limit(200);

        const ids = conversations.map((conversation) => conversation._id);

        const unreadCounts = await MessageModel.aggregate<{ _id: string; count: number }>([
            {
                $match: {
                    conversationId: { $in: ids },
                    senderType: "user",
                    read: false,
                },
            },
            {
                $group: {
                    _id: "$conversationId",
                    count: { $sum: 1 },
                },
            },
        ]);

        const unreadMap = new Map(
            unreadCounts.map((item) => [String(item._id), item.count])
        );

        const rows = conversations
            .map((conversation) => ({
                ...serializeConversation(conversation),
                unreadCount: unreadMap.get(String(conversation._id)) ?? 0,
            }))
            .filter((conversation) => (unread ? conversation.unreadCount > 0 : true));

        return NextResponse.json({
            success: true,
            conversations: rows,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to load conversations" },
            { status: 500 }
        );
    }
}
