import "server-only"

import { createClient } from "@supabase/supabase-js"

import type {
    StorageFileRef,
    StorageProvider,
    StorageSignedUrlInput,
    StorageSignedUrlResult,
    StorageUploadInput,
} from "./types"

export class SupabaseStorageProvider implements StorageProvider {
    private client

    constructor() {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!url || !serviceRoleKey) {
            throw new Error("Missing Supabase storage environment variables")
        }

        this.client = createClient(url, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }

    async upload(input: StorageUploadInput): Promise<StorageFileRef> {
        const { error } = await this.client.storage.from(input.bucket).upload(input.path, input.body, {
            contentType: input.contentType,
            cacheControl: input.cacheControl ?? "3600",
            upsert: false,
        })

        if (error) {
            throw new Error(`Storage upload failed: ${error.message}`)
        }

        return {
            provider: "supabase",
            bucket: input.bucket,
            path: input.path,
        }
    }

    async deleteFile(input: StorageFileRef): Promise<void> {
        const { error } = await this.client.storage.from(input.bucket).remove([input.path])

        if (error) {
            throw new Error(`Storage delete failed: ${error.message}`)
        }
    }

    async createSignedDownloadUrl(
        input: StorageSignedUrlInput
    ): Promise<StorageSignedUrlResult> {
        const { data, error } = await this.client.storage
            .from(input.bucket)
            .createSignedUrl(input.path, input.expiresInSeconds, {
                download: input.downloadFileName ?? true,
            })

        if (error || !data?.signedUrl) {
            throw new Error(`Failed to create signed download URL: ${error?.message ?? "Unknown error"}`)
        }

        return {
            url: data.signedUrl,
            expiresInSeconds: input.expiresInSeconds,
        }
    }
}