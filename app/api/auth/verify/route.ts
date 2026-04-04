import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { normalizeEmail, isVerifyCodeExpired } from "@/lib/auth";
import { verifySchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email/send-email";
import { accountVerifiedEmail } from "@/lib/email/templates";


export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const parsed = verifySchema.safeParse(body);

        if (!parsed.success) {
            const firstError =
                parsed.error.issues[0]?.message || "Invalid verification data";

            return NextResponse.json(
                { success: false, message: firstError },
                { status: 400 }
            );
        }

        const { email, code } = parsed.data;
        const normalizedEmail = normalizeEmail(email);

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
                    success: true,
                    message: "Account is already verified. Please sign in.",
                },
                { status: 200 }
            );
        }

        if (!user.verifyCode || user.verifyCode !== code.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                { status: 400 }
            );
        }

        if (isVerifyCodeExpired(user.verifyCodeExpiry)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification code has expired. Please request a new one.",
                },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyCode = "";
        user.verifyCodeExpiry = null;

        await user.save();

        const formatted = accountVerifiedEmail(user.username);

        await sendEmail({
            to: normalizedEmail,
            subject: formatted.subject,
            html: formatted.html,
            text: formatted.text,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account verified successfully. You can now sign in.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verify error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while verifying the account",
            },
            { status: 500 }
        );
    }
}