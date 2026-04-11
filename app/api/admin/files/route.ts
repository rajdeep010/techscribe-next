import { NextResponse } from "next/server"

import { requireAdminSession } from "@/lib/auth/admin"
import { formatBytes } from "@/lib/assignments/files"
import dbConnect from "@/lib/dbConnect"
import AssignmentFileModel from "@/model/AssignmentFile"

function serializeAssignmentFile(file: any) {
    return {
        id: String(file._id),
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        sizeLabel: formatBytes(file.sizeBytes),
        status: file.status,
        storageProvider: file.storageProvider,
        bucket: file.bucket,
        storagePath: file.storagePath,
        isVisibleToUser: Boolean(file.isVisibleToUser),
        createdAt: new Date(file.createdAt).toISOString(),
        markedForDeletionAt: file.markedForDeletionAt
            ? new Date(file.markedForDeletionAt).toISOString()
            : null,
        deleteAfter: file.deleteAfter ? new Date(file.deleteAfter).toISOString() : null,
        downloadUrl: `/api/files/${String(file._id)}/download`,
        assignment: {
            id: String(file.assignment?._id ?? ""),
            title: file.assignment?.title ?? "Untitled assignment",
            status: file.assignment?.status ?? "submitted",
        },
        owner: {
            id: String(file.ownerUser?._id ?? ""),
            name: file.ownerUser?.name ?? "",
            username: file.ownerUser?.username ?? "",
            email: file.ownerUser?.email ?? "",
        },
    }
}

export async function GET() {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        await dbConnect()

        const files = await AssignmentFileModel.find({
            status: { $ne: "deleted" },
        })
            .populate("assignment", "title status")
            .populate("ownerUser", "name username email")
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            files: files.map(serializeAssignmentFile),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch files",
            },
            { status: 500 }
        )
    }
}