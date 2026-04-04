import { z } from "zod";

export const profileUpdateSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    about: z.string().trim().max(500, "About is too long").optional().default(""),
    location: z.string().trim().max(120, "Location is too long").optional().default(""),
    linkedin: z.string().trim().max(200, "LinkedIn URL is too long").optional().default(""),
    profile: z.string().trim().max(200, "Profile URL is too long").optional().default(""),
});