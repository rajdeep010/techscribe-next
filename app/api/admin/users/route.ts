import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import { getUserAvatarUrl } from "@/lib/user-avatar";
import UserModel from "@/model/User";

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

        const users = await UserModel.find({})
            .sort({ createdAt: -1 })
            .select("name username email role isVerified location avatar createdAt updatedAt")
            .lean();

        const serializedUsers = users.map((user: any) => ({
            id: String(user._id),
            name: user.name || "",
            username: user.username,
            email: user.email,
            role: user.role ?? "user",
            isVerified: Boolean(user.isVerified),
            location: user.location || "",
            avatar: getUserAvatarUrl({ userId: String(user._id), avatar: user.avatar }),
            createdAt: new Date(user.createdAt).toISOString(),
            updatedAt: new Date(user.updatedAt).toISOString(),
        }));

        return NextResponse.json({
            success: true,
            users: serializedUsers,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}