import "server-only"
import { SupabaseStorageProvider } from "./supabase-provider"

export const ASSIGNMENT_FILES_BUCKET = process.env.SUPABASE_ASSIGNMENTS_BUCKET || "assignment-files"
export const storageProvider = new SupabaseStorageProvider()