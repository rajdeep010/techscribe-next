import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getWidgetActor } from "@/lib/chat/actor";
import { getConversationForWidgetActor } from "@/lib/chat/conversations";
import MessageModel from "@/model/Message";

export async function GET() {
    try {
        await dbConnect();

        const { actor } = await getWidgetActor();
        const conversation = await getConversationForWidgetActor(actor);

        if (!conversation) {
            return NextResponse.json({
                success: true,
                unreadCount: 0,
            });
        }

        const unreadCount = await MessageModel.countDocuments({
            conversationId: conversation._id,
            senderType: "admin",
            read: false,
        });

        return NextResponse.json({
            success: true,
            unreadCount,
            conversationId: String(conversation._id),
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to load unread count" },
            { status: 500 }
        );
    }
}
