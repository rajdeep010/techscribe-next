import { z } from "zod"

export const blogStatusSchema = z.enum(["draft", "published"])

export const blogUpsertSchema = z.object({
    contentJson: z.record(z.string(), z.any()).or(z.any()),
    contentHtml: z.string().default(""),
    autosaveEnabled: z.boolean().default(true),
    status: blogStatusSchema.default("draft"),
})

export type BlogUpsertInput = z.infer<typeof blogUpsertSchema>