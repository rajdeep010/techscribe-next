import { z } from "zod"

export const assignmentStatusSchema = z.enum([
    "submitted",
    "under-review",
    "assigned",
    "in-progress",
    "awaiting-user",
    "delivered",
    "completed",
    "cancelled",
    "archived",
])

export const createAssignmentSchema = z.object({
    title: z.string().trim().min(5).max(160),
    description: z.string().trim().min(20).max(5000),
    subject: z.string().trim().max(100).optional().or(z.literal("")),
    deliveryDeadline: z.string().datetime()
})

export const updateAssignmentDetailsSchema = z.object({
    description: z.string().trim().min(20).max(5000),
})

export const assignReviewerSchema = z.object({
    reviewerId: z.string().trim().min(1),
})

export const updateAssignmentStatusSchema = z.object({
    status: assignmentStatusSchema,
})