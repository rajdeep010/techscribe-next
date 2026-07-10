import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import ConversationModel from "@/model/Conversation";
import MessageModel from "@/model/Message";

export async function POST() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        await dbConnect();

        const usage = await MessageModel.aggregate<{
            _id: string;
            messageCount: number;
        }>([
            {
                $group: {
                    _id: "$conversationId",
                    messageCount: { $sum: 1 },
                },
            },
        ]);

        const usedConversationIds = new Set(usage.map((item) => String(item._id)));

        const allConversations = await ConversationModel.find({}, { _id: 1 });
        const unusedConversationIds = allConversations
            .map((conversation) => String(conversation._id))
            .filter((id) => !usedConversationIds.has(id));

        if (unusedConversationIds.length === 0) {
            return NextResponse.json({
                success: true,
                deletedCount: 0,
            });
        }

        const deleteResult = await ConversationModel.deleteMany({
            _id: { $in: unusedConversationIds },
        });

        return NextResponse.json({
            success: true,
            deletedCount: deleteResult.deletedCount ?? 0,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to cleanup unused conversations" },
            { status: 500 }
        );
    }
}
