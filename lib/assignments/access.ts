import type { Session } from "next-auth"

export function canReadAssignment(session: Session | null, ownerUserId: string) {
    if (!session?.user?._id) return false
    return session.user.role === "admin" || session.user._id === ownerUserId
}

export function canDeleteAssignmentFiles(session: Session | null) {
    return session?.user?.role === "admin"
}

export function canUserEditAssignment(input: {
    session: Session | null
    ownerUserId: string
    status: string
    assignedReviewerId?: string | null
}) {
    if (!input.session?.user?._id) return false
    if (input.session.user.role !== "user") return false
    if (input.session.user._id !== input.ownerUserId) return false

    const editableStatus =
        input.status === "submitted" || input.status === "under-review"

    return editableStatus && !input.assignedReviewerId
}