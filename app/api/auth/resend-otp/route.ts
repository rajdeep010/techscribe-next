import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {
    generateVerifyCode,
    getVerifyCodeExpiry,
    normalizeEmail,
} from "@/lib/auth";
import { resendOtpSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email/send-email";
import { userOtpEmail } from "@/lib/email/templates";


export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const parsed = resendOtpSchema.safeParse(body);

        if (!parsed.success) {
            const firstError =
                parsed.error.issues[0]?.message || "Invalid resend OTP data";

            return NextResponse.json(
                { success: false, message: firstError },
                { status: 400 }
            );
        }

        const normalizedEmail = normalizeEmail(parsed.data.email);

        const user = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Account is already verified. Please sign in.",
                },
                { status: 400 }
            );
        }

        const verifyCode = generateVerifyCode();
        const verifyCodeExpiry = getVerifyCodeExpiry();

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;

        await user.save();

        const formatted = userOtpEmail(user.username, verifyCode);

        await sendEmail({
            to: normalizedEmail,
            subject: formatted.subject,
            html: formatted.html,
            text: formatted.text,
        });

        return NextResponse.json(
            {
                success: true,
                message: "A new verification code has been sent to your email.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend OTP error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while resending the verification code",
            },
            { status: 500 }
        );
    }
}