export const DEFAULT_AVATAR_URL = "https://github.com/shadcn.png"
export const AVATAR_IMAGES_BUCKET = process.env.SUPABASE_AVATARS_BUCKET || "avatars"
export const MAX_AVATAR_FILE_SIZE_BYTES = 5 * 1024 * 1024

const AVATAR_MIME_TYPE_TO_EXTENSION: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}

function appendVersion(url: string, version?: string | number) {
    if (version === undefined || version === null || version === "") {
        return url
    }

    return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(String(version))}`
}

export function isAllowedAvatarMimeType(value: string) {
    return Object.hasOwn(AVATAR_MIME_TYPE_TO_EXTENSION, value)
}

export function getAvatarFileExtension(fileName: string, mimeType: string) {
    const fromMimeType = AVATAR_MIME_TYPE_TO_EXTENSION[mimeType]

    if (fromMimeType) {
        return fromMimeType
    }

    const nameParts = fileName.split(".")
    const fromFileName = nameParts.length > 1 ? nameParts[nameParts.length - 1]?.toLowerCase() : ""

    return fromFileName || "jpg"
}

export function buildUserAvatarStoragePath({
    userId,
    extension,
}: {
    userId: string
    extension: string
}) {
    return `users/${userId}/avatars/${Date.now()}-${crypto.randomUUID()}.${extension}`
}

export function isStoredAvatarPath(value?: string | null): value is string {
    if (!value || value === DEFAULT_AVATAR_URL) {
        return false
    }

    return !/^https?:\/\//i.test(value) && !value.startsWith("/")
}

export function getUserAvatarUrl({
    userId,
    avatar,
    version,
}: {
    userId?: string | null
    avatar?: string | null
    version?: string | number
}) {
    if (!avatar) {
        return DEFAULT_AVATAR_URL
    }

    if (/^https?:\/\//i.test(avatar) || avatar.startsWith("/")) {
        return appendVersion(avatar, version)
    }

    if (!userId) {
        return DEFAULT_AVATAR_URL
    }

    return appendVersion(`/api/public/users/${userId}/avatar`, version)
}