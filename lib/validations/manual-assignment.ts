import { z } from "zod";

export const manualAssignmentSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long").max(160),
    subject: z.string().trim().max(100).optional(),
    clientName: z.string().trim().min(2, "Client name is required").max(160),
    clientContact: z.string().trim().min(4, "Client contact is required").max(60),
    handledBy: z.string().trim().min(1, "Select who handled the work"),
    status: z.enum(["in-progress", "delivered", "completed"]).default("completed"),
    deliveryDate: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().max(2000).optional(),
});

export type ManualAssignmentInput = z.infer<typeof manualAssignmentSchema>;
