import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import UserModel from "@/model/User";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        const { userId } = await params;
        const body = await request.json();

        if (body.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Only promotion to admin is supported" },
                { status: 400 }
            );
        }

        await dbConnect();

        const targetUser = await UserModel.findById(userId);

        if (!targetUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (String(targetUser._id) === auth.session.user._id) {
            return NextResponse.json(
                { success: false, message: "You cannot change your own role here" },
                { status: 400 }
            );
        }

        if (targetUser.role === "admin") {
            return NextResponse.json(
                { success: false, message: "User is already an admin" },
                { status: 400 }
            );
        }

        targetUser.role = "admin";
        await targetUser.save();

        return NextResponse.json({
            success: true,
            message: `${targetUser.username} has been promoted to admin`,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to update user role" },
            { status: 500 }
        );
    }
}