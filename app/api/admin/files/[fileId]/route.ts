import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { requireAdminSession } from "@/lib/auth/admin"
import dbConnect from "@/lib/dbConnect"
import { storageProvider } from "@/lib/storage"
import AssignmentFileModel from "@/model/AssignmentFile"
import AssignmentModel from "@/model/Assignment"

async function recalculateAssignmentStorage(assignmentId: Types.ObjectId) {
    const remainingFiles = await AssignmentFileModel.find({
        assignment: assignmentId,
        status: { $ne: "deleted" },
    })
        .select("sizeBytes")
        .lean()

    const fileCount = remainingFiles.length
    const totalFileSizeBytes = remainingFiles.reduce(
        (sum, file) => sum + (file.sizeBytes ?? 0),
        0
    )

    await AssignmentModel.findByIdAndUpdate(assignmentId, {
        fileCount,
        totalFileSizeBytes,
    })
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ fileId: string }> }
) {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        const { fileId } = await context.params

        if (!Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { success: false, message: "Invalid file id" },
                { status: 400 }
            )
        }

        const body = await request.json().catch(() => ({}))
        const action =
            body?.action === "restore" ? "restore" : "mark-delete"

        await dbConnect()

        const file = await AssignmentFileModel.findById(fileId)

        if (!file || file.status === "deleted") {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            )
        }

        if (action === "mark-delete") {
            if (file.status !== "pending-delete") {
                file.statusBeforePendingDelete =
                    file.status === "active" ||
                        file.status === "replaced" ||
                        file.status === "locked"
                        ? file.status
                        : "active"
            }

            file.status = "pending-delete"
            file.markedForDeletionAt = new Date()
            file.deleteAfter = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            await file.save()

            return NextResponse.json({
                success: true,
                message: "File marked for deletion",
            })
        }

        file.status = file.statusBeforePendingDelete || "active"
        file.statusBeforePendingDelete = null
        file.markedForDeletionAt = null
        file.deleteAfter = null
        await file.save()

        return NextResponse.json({
            success: true,
            message: "Deletion mark removed",
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update file lifecycle",
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ fileId: string }> }
) {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        const { fileId } = await context.params

        if (!Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { success: false, message: "Invalid file id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const file = await AssignmentFileModel.findById(fileId)

        if (!file || file.status === "deleted") {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            )
        }

        await storageProvider.deleteFile({
            provider: file.storageProvider,
            bucket: file.bucket,
            path: file.storagePath,
        })

        file.status = "deleted"
        file.statusBeforePendingDelete = null
        file.markedForDeletionAt = null
        file.deleteAfter = null
        file.deletedAt = new Date()
        await file.save()

        await recalculateAssignmentStorage(file.assignment)

        return NextResponse.json({
            success: true,
            message: "File deleted permanently from storage",
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete file",
            },
            { status: 500 }
        )
    }
}