import { z } from "zod";

export const MAX_INQUIRY_ATTACHMENT_BYTES = 20 * 1024 * 1024; // 20MB

export const inquirySchema = z.object({
    name: z.string().trim().max(120).optional(),
    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .optional()
        .or(z.literal("")),
    whatsappNumber: z
        .string()
        .trim()
        .min(6, "Enter a valid WhatsApp number")
        .max(20, "Enter a valid WhatsApp number"),
    assignmentType: z.string().trim().max(120).optional(),
    deadline: z.string().trim().optional().or(z.literal("")),
    message: z
        .string()
        .trim()
        .min(5, "Message must be at least 5 characters long")
        .max(2000, "Message is too long"),
    source: z.enum(["contact-form", "order-form"]),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
