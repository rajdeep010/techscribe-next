import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { sendEmail } from "@/lib/email/send-email";
import { passwordChangeOtpEmail } from "@/lib/email/templates";
import UserModel from "@/model/User";
import { requestPasswordChangeSchema } from "@/lib/validations/security";

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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
        const parsed = requestPasswordChangeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        parsed.error.issues[0]?.message || "Invalid password change request",
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

        const isCurrentPasswordValid = await bcrypt.compare(
            parsed.data.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Current password is incorrect" },
                { status: 400 }
            );
        }

        const isSamePassword = await bcrypt.compare(
            parsed.data.newPassword,
            user.password
        );

        if (isSamePassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "New password must be different from the current password",
                },
                { status: 400 }
            );
        }

        const hashedNewPassword = await bcrypt.hash(parsed.data.newPassword, 10);
        const otp = generateOtp();

        user.pendingPassword = hashedNewPassword;
        user.passwordChangeCode = otp;
        user.passwordChangeCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const template = passwordChangeOtpEmail(user.username, otp);

        await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent to your email address",
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to start password change" },
            { status: 500 }
        );
    }
}