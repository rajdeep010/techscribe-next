import { NextResponse } from "next/server"
import { Types } from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { canReadAssignment } from "@/lib/assignments/access"
import { FILE_DOWNLOAD_URL_TTL_SECONDS } from "@/lib/assignments/files"
import dbConnect from "@/lib/dbConnect"
import { storageProvider } from "@/lib/storage"
import AssignmentFileModel from "@/model/AssignmentFile"

export async function GET(
    _request: Request,
    context: { params: Promise<{ fileId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { fileId } = await context.params

        if (!Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { success: false, message: "Invalid file id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const file = await AssignmentFileModel.findById(fileId)
            .populate("assignment", "user")
            .lean()

        if (!file || file.status === "deleted") {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            )
        }

        const ownerUserId = String((file.assignment as any).user)

        if (!canReadAssignment(session, ownerUserId)) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            )
        }

        if (session?.user?.role === "user" && !file.isVisibleToUser) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            )
        }

        const signed = await storageProvider.createSignedDownloadUrl({
            provider: file.storageProvider,
            bucket: file.bucket,
            path: file.storagePath,
            expiresInSeconds: FILE_DOWNLOAD_URL_TTL_SECONDS,
            downloadFileName: file.originalName,
        })

        return NextResponse.redirect(signed.url)
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to create download link",
            },
            { status: 500 }
        )
    }
}