import "server-only"
import { SupabaseStorageProvider } from "./supabase-provider"

export { AVATAR_IMAGES_BUCKET } from "@/lib/user-avatar"

export const ASSIGNMENT_FILES_BUCKET = process.env.SUPABASE_ASSIGNMENTS_BUCKET || "assignment-files"
export const storageProvider = new SupabaseStorageProvider()