import { NextResponse } from "next/server"

import { requireAdminSession } from "@/lib/auth/admin"
import dbConnect from "@/lib/dbConnect"
import AssignmentModel from "@/model/Assignment"

function serializeAssignment(assignment: any) {
    return {
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
                id: String(assignment.assignedReviewer._id),
                name: assignment.assignedReviewer.name ?? "",
                username: assignment.assignedReviewer.username ?? "",
            }
            : null,
        user: {
            id: String(assignment.user._id),
            name: assignment.user.name ?? "",
            username: assignment.user.username ?? "",
            email: assignment.user.email ?? "",
        },
        createdAt: new Date(assignment.createdAt).toISOString(),
        updatedAt: new Date(assignment.updatedAt).toISOString(),
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

        const assignments = await AssignmentModel.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name username email")
            .populate("assignedReviewer", "name username")
            .lean()

        return NextResponse.json({
            success: true,
            assignments: assignments.map(serializeAssignment),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch assignments",
            },
            { status: 500 }
        )
    }
}