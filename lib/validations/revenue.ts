import { z } from "zod";

export const revenueSchema = z.object({
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    category: z.enum(["assignment-payment", "other"]).default("assignment-payment"),
    description: z
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters long")
        .max(500, "Description is too long"),
    assignmentId: z.string().trim().optional().or(z.literal("")),
    studentName: z.string().trim().max(160).optional(),
    receivedAt: z.string().trim().min(1, "Received date is required"),
});

export type RevenueInput = z.infer<typeof revenueSchema>;
