import { z } from "zod";

export const requestPasswordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters long")
            .max(100, "New password is too long"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export const confirmPasswordChangeSchema = z.object({
    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Enter the 6-digit OTP"),
});