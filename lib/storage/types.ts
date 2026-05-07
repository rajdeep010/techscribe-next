export type StorageProviderName = "supabase" | "r2"

export type StorageFileRef = {
    provider: StorageProviderName
    bucket: string
    path: string
}

export type StorageUploadInput = {
    bucket: string
    path: string
    body: Buffer
    contentType: string
    cacheControl?: string
}

export type StorageSignedUrlInput = StorageFileRef & {
    expiresInSeconds: number
    downloadFileName?: string
    download?: boolean
}

export type StorageSignedUrlResult = {
    url: string
    expiresInSeconds: number
}

export interface StorageProvider {
    upload(input: StorageUploadInput): Promise<StorageFileRef>
    deleteFile(input: StorageFileRef): Promise<void>
    createSignedDownloadUrl(input: StorageSignedUrlInput): Promise<StorageSignedUrlResult>
}