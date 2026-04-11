import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { requireAdminSession } from "@/lib/auth/admin"
import dbConnect from "@/lib/dbConnect"
import { storageProvider } from "@/lib/storage"
import AssignmentFileModel from "@/model/AssignmentFile"
import AssignmentModel from "@/model/Assignment"

export async function PATCH(
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

        file.status = "pending-delete"
        file.markedForDeletionAt = new Date()
        file.deleteAfter = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await file.save()

        return NextResponse.json({
            success: true,
            message: "File marked for deletion",
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to mark file for deletion",
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

        await AssignmentModel.findByIdAndUpdate(file.assignment, {
            $inc: {
                fileCount: -1,
                totalFileSizeBytes: -file.sizeBytes,
            },
        })

        file.status = "deleted"
        file.deletedAt = new Date()
        await file.save()

        return NextResponse.json({
            success: true,
            message: "File deleted permanently",
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete file",
            },
            { status: 500 }
        )
    }
}