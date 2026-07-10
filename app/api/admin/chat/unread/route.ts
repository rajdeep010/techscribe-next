import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import MessageModel from "@/model/Message";

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        await dbConnect();

        const rows = await MessageModel.aggregate<{
            _id: string;
            count: number;
        }>([
            {
                $match: {
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

        const unreadCount = rows.reduce((sum, row) => sum + row.count, 0);

        return NextResponse.json({
            success: true,
            unreadCount,
            unreadConversations: rows.length,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to load unread count" },
            { status: 500 }
        );
    }
}
