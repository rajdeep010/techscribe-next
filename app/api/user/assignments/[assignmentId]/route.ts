import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { canUserEditAssignment } from "@/lib/assignments/access"
import { formatBytes } from "@/lib/assignments/files"
import { requireUserSession } from "@/lib/auth/user"
import dbConnect from "@/lib/dbConnect"
import AssignmentFileModel from "@/model/AssignmentFile"
import AssignmentModel from "@/model/Assignment"

function serializeAssignmentFile(file: any) {
    return {
        id: String(file._id),
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        sizeLabel: formatBytes(file.sizeBytes),
        status: file.status,
        createdAt: new Date(file.createdAt).toISOString(),
        downloadUrl: `/api/files/${String(file._id)}/download`,
    }
}

export async function GET(
    _request: Request,
    context: { params: Promise<{ assignmentId: string }> }
) {
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
            .populate("assignedReviewer", "name username")
            .lean()

        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            )
        }

        const files = await AssignmentFileModel.find({
            assignment: assignment._id,
            isVisibleToUser: true,
            status: { $in: ["active", "locked", "pending-delete"] },
        })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            assignment: {
                id: String(assignment._id),
                title: assignment.title,
                description: assignment.description,
                subject: assignment.subject ?? "",
                deliveryDeadline: new Date(assignment.deliveryDeadline).toISOString(),
                status: assignment.status,
                fileCount: assignment.fileCount ?? 0,
                totalFileSizeBytes: assignment.totalFileSizeBytes ?? 0,
                assignedReviewer: assignment.assignedReviewer
                    ? {
                        id: String((assignment.assignedReviewer as any)._id),
                        name: (assignment.assignedReviewer as any).name ?? "",
                        username: (assignment.assignedReviewer as any).username ?? "",
                    }
                    : null,
                createdAt: new Date(assignment.createdAt).toISOString(),
                updatedAt: new Date(assignment.updatedAt).toISOString(),
                files: files.map(serializeAssignmentFile),
            },
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch assignment",
            },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ assignmentId: string }> }
) {
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

        const body = await request.json()
        const description = typeof body.description === "string" ? body.description.trim() : ""

        if (description.length < 20 || description.length > 5000) {
            return NextResponse.json(
                { success: false, message: "Description must be between 20 and 5000 characters" },
                { status: 400 }
            )
        }

        assignment.description = description
        await assignment.save()

        return NextResponse.json({
            success: true,
            message: "Assignment updated successfully",
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update assignment",
            },
            { status: 500 }
        )
    }
}