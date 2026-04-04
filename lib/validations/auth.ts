import { z } from "zod";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
    return username.trim().toLowerCase();
}

export function generateVerifyCode(length = OTP_LENGTH) {
    let code = "";

    for (let index = 0; index < length; index += 1) {
        code += Math.floor(Math.random() * 10).toString();
    }

    return code;
}

export function getVerifyCodeExpiry() {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function isVerifyCodeExpired(expiry?: Date | null) {
    if (!expiry) {
        return true;
    }

    return expiry.getTime() < Date.now();
}

export const signupSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters long")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            ),
        email: z.email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must include at least one uppercase letter")
            .regex(/[a-z]/, "Password must include at least one lowercase letter")
            .regex(/[0-9]/, "Password must include at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    identifier: z.string().trim().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});

export const verifySchema = z.object({
    email: z.email("Please enter a valid email address"),
    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const resendOtpSchema = z.object({
    email: z.email("Please enter a valid email address"),
});