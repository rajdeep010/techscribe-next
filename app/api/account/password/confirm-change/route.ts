import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { confirmPasswordChangeSchema } from "@/lib/validations/security";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const parsed = confirmPasswordChangeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        parsed.error.issues[0]?.message || "Invalid confirmation code",
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findById(session.user._id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.pendingPassword || !user.passwordChangeCode) {
            return NextResponse.json(
                { success: false, message: "No pending password change request found" },
                { status: 400 }
            );
        }

        if (
            !user.passwordChangeCodeExpiry ||
            new Date(user.passwordChangeCodeExpiry).getTime() < Date.now()
        ) {
            user.pendingPassword = "";
            user.passwordChangeCode = "";
            user.passwordChangeCodeExpiry = null;
            await user.save();

            return NextResponse.json(
                { success: false, message: "OTP has expired. Please request a new one" },
                { status: 400 }
            );
        }

        if (user.passwordChangeCode !== parsed.data.code) {
            return NextResponse.json(
                { success: false, message: "Incorrect OTP" },
                { status: 400 }
            );
        }

        user.password = user.pendingPassword;
        user.pendingPassword = "";
        user.passwordChangeCode = "";
        user.passwordChangeCodeExpiry = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully. Please sign in again.",
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to confirm password change" },
            { status: 500 }
        );
    }
}