import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { canUserEditAssignment } from "@/lib/assignments/access"
import {
    buildAssignmentStoragePath,
    isAllowedAssignmentMimeType,
    MAX_ASSIGNMENT_FILES,
    MAX_ASSIGNMENT_FILE_SIZE_BYTES,
    MAX_ASSIGNMENT_TOTAL_FILE_SIZE_BYTES,
} from "@/lib/assignments/files"
import { requireUserSession } from "@/lib/auth/user"
import dbConnect from "@/lib/dbConnect"
import { ASSIGNMENT_FILES_BUCKET, storageProvider } from "@/lib/storage"
import AssignmentFileModel from "@/model/AssignmentFile"
import AssignmentModel from "@/model/Assignment"

export async function POST(
    request: Request,
    context: { params: Promise<{ assignmentId: string }> }
) {
    const uploadedRefs: Array<{ bucket: string; path: string; provider: "supabase" | "r2" }> = []

    try {
        const auth = await requireUserSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        const { assignmentId } = await context.params

        if (!Types.ObjectId.isValid(assignmentId)) {
            return NextResponse.json(
                { success: false, message: "Invalid assignment id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const assignment = await AssignmentModel.findOne({
            _id: assignmentId,
            user: auth.session.user._id,
        })

        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            )
        }

        const canEdit = canUserEditAssignment({
            session: auth.session,
            ownerUserId: String(assignment.user),
            status: assignment.status,
            assignedReviewerId: assignment.assignedReviewer
                ? String(assignment.assignedReviewer)
                : null,
        })

        if (!canEdit) {
            return NextResponse.json(
                { success: false, message: "This assignment can no longer be edited" },
                { status: 403 }
            )
        }

        const formData = await request.formData()
        const incomingFiles = formData
            .getAll("files")
            .filter((value): value is File => value instanceof File)

        if (incomingFiles.length === 0) {
            return NextResponse.json(
                { success: false, message: "No files uploaded" },
                { status: 400 }
            )
        }

        const existingActiveFiles = await AssignmentFileModel.find({
            assignment: assignment._id,
            status: { $in: ["active", "locked", "pending-delete"] },
        }).lean()

        if (existingActiveFiles.length + incomingFiles.length > MAX_ASSIGNMENT_FILES) {
            return NextResponse.json(
                {
                    success: false,
                    message: `You can keep at most ${MAX_ASSIGNMENT_FILES} files on one assignment`,
                },
                { status: 400 }
            )
        }

        const existingTotalBytes = existingActiveFiles.reduce(
            (sum, file) => sum + file.sizeBytes,
            0
        )

        const incomingTotalBytes = incomingFiles.reduce(
            (sum, file) => sum + file.size,
            0
        )

        if (existingTotalBytes + incomingTotalBytes > MAX_ASSIGNMENT_TOTAL_FILE_SIZE_BYTES) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Total file size limit exceeded for this assignment",
                },
                { status: 400 }
            )
        }

        for (const file of incomingFiles) {
            if (file.size > MAX_ASSIGNMENT_FILE_SIZE_BYTES) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${file.name} is larger than 10 MB`,
                    },
                    { status: 400 }
                )
            }

            if (!isAllowedAssignmentMimeType(file.type)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${file.name} has an unsupported file type`,
                    },
                    { status: 400 }
                )
            }
        }

        const fileDocs = []

        for (const file of incomingFiles) {
            const path = buildAssignmentStoragePath({
                userId: String(auth.session.user._id),
                assignmentId,
                fileName: file.name,
            })

            const body = Buffer.from(await file.arrayBuffer())

            const uploaded = await storageProvider.upload({
                bucket: ASSIGNMENT_FILES_BUCKET,
                path,
                body,
                contentType: file.type || "application/octet-stream",
            })

            uploadedRefs.push(uploaded)

            fileDocs.push({
                assignment: assignment._id,
                ownerUser: assignment.user,
                uploadedBy: auth.session.user._id,
                storageProvider: uploaded.provider,
                bucket: uploaded.bucket,
                storagePath: uploaded.path,
                originalName: file.name,
                mimeType: file.type || "application/octet-stream",
                sizeBytes: file.size,
                status: "active",
                isVisibleToUser: true,
            })
        }

        await AssignmentFileModel.insertMany(fileDocs)

        assignment.fileCount = existingActiveFiles.length + fileDocs.length
        assignment.totalFileSizeBytes = existingTotalBytes + incomingTotalBytes
        await assignment.save()

        return NextResponse.json({
            success: true,
            message: "Files uploaded successfully",
        })
    } catch (error) {
        for (const ref of uploadedRefs) {
            try {
                await storageProvider.deleteFile(ref)
            } catch {
                // best-effort cleanup
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to upload files",
            },
            { status: 500 }
        )
    }
}