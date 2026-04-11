export const MAX_ASSIGNMENT_FILES = 3
export const MAX_ASSIGNMENT_FILE_SIZE_BYTES = 10 * 1024 * 1024
export const MAX_ASSIGNMENT_TOTAL_FILE_SIZE_BYTES = 25 * 1024 * 1024
export const FILE_DOWNLOAD_URL_TTL_SECONDS = 60 * 5

export const ALLOWED_ASSIGNMENT_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "text/plain",
])

export function isAllowedAssignmentMimeType(mimeType: string) {
    return ALLOWED_ASSIGNMENT_MIME_TYPES.has(mimeType)
}

export function sanitizeFileName(fileName: string) {
    return fileName
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .toLowerCase()
}

export function buildAssignmentStoragePath(input: {
    userId: string
    assignmentId: string
    fileName: string
}) {
    const safeName = sanitizeFileName(input.fileName)
    return `assignments/${input.userId}/${input.assignmentId}/${Date.now()}-${safeName}`
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}