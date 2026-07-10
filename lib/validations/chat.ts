import { z } from "zod";

export const paginationQuerySchema = z.object({
    conversationId: z.string().min(1, "conversationId is required"),
    limit: z
        .string()
        .optional()
        .transform((value) => {
            if (!value) return 30;
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) return 30;
            return Math.max(1, Math.min(100, Math.floor(parsed)));
        }),
    cursor: z
        .string()
        .optional()
        .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), {
            message: "Invalid cursor",
        }),
});

export const userMessageCreateSchema = z.object({
    conversationId: z.string().min(1, "conversationId is required").optional(),
    message: z.string().trim().min(1, "Message cannot be empty").max(5000),
    clientMessageId: z.string().trim().max(120).optional(),
});

export const adminMessageCreateSchema = z.object({
    message: z.string().trim().min(1, "Message cannot be empty").max(5000),
    clientMessageId: z.string().trim().max(120).optional(),
});

export const adminConversationActionSchema = z.object({
    action: z.enum(["claim", "unassign", "open", "close", "mark-read"]),
});
