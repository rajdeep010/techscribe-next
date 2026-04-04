import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {
    generateVerifyCode,
    getVerifyCodeExpiry,
    normalizeEmail,
    normalizeUsername,
} from "@/lib/auth";
import { signupSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email/send-email";
import { userOtpEmail } from "@/lib/email/templates";



export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            const firstError =
                parsed.error.issues[0]?.message || "Invalid signup data";
            return NextResponse.json(
                { success: false, message: firstError },
                { status: 400 }
            );
        }

        const { username, email, password } = parsed.data;

        const normalizedEmail = normalizeEmail(email);
        const normalizedUsername = normalizeUsername(username);

        const existingUserByEmail = await UserModel.findOne({
            email: normalizedEmail,
        });

        const existingUserByUsername = await UserModel.findOne({
            username: normalizedUsername,
        });

        if (existingUserByEmail?.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists",
                },
                { status: 409 }
            );
        }

        if (
            existingUserByUsername &&
            existingUserByUsername.email !== normalizedEmail
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = generateVerifyCode();
        const verifyCodeExpiry = getVerifyCodeExpiry();
        const formatted = userOtpEmail(normalizedUsername, verifyCode);

        if (existingUserByEmail && !existingUserByEmail.isVerified) {
            existingUserByEmail.username = normalizedUsername;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
            existingUserByEmail.isVerified = false;

            await existingUserByEmail.save();
        } else {
            const newUser = new UserModel({
                username: normalizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry,
            });

            await newUser.save();
        }

        await sendEmail({
            to: normalizedEmail,
            subject: formatted.subject,
            html: formatted.html,
            text: formatted.text,
        });


        return NextResponse.json(
            {
                success: true,
                message: "Signup successful. Please verify your email with the OTP sent.",
                email: normalizedEmail,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while creating the account",
            },
            { status: 500 }
        );
    }
}