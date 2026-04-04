import { z } from "zod";

export const supportTicketSchema = z.object({
    subject: z
        .string()
        .trim()
        .min(5, "Subject must be at least 5 characters long")
        .max(120, "Subject is too long"),
    category: z.enum(["general", "billing", "technical", "account"]),
    message: z
        .string()
        .trim()
        .min(20, "Message must be at least 20 characters long")
        .max(2000, "Message is too long"),
});