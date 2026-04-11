import { NextResponse } from "next/server"

import { requireUserSession } from "@/lib/auth/user"
import dbConnect from "@/lib/dbConnect"
import { createAssignmentSchema } from "@/lib/validations/assignment"
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
        createdAt: new Date(assignment.createdAt).toISOString(),
        updatedAt: new Date(assignment.updatedAt).toISOString(),
    }
}

export async function GET() {
    try {
        const auth = await requireUserSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        await dbConnect()

        const assignments = await AssignmentModel.find({
            user: auth.session.user._id,
        })
            .sort({ createdAt: -1 })
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

export async function POST(request: Request) {
    try {
        const auth = await requireUserSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        await dbConnect()

        const body = await request.json()
        const parsed = createAssignmentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsed.error.issues[0]?.message || "Invalid assignment payload",
                },
                { status: 400 }
            )
        }

        const assignment = await AssignmentModel.create({
            user: auth.session.user._id,
            title: parsed.data.title,
            description: parsed.data.description,
            subject: parsed.data.subject || "",
            deliveryDeadline: new Date(parsed.data.deliveryDeadline),
            status: "submitted",
            fileCount: 0,
            totalFileSizeBytes: 0,
        })

        return NextResponse.json({
            success: true,
            message: "Assignment created successfully",
            assignment: serializeAssignment(assignment),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to create assignment",
            },
            { status: 500 }
        )
    }
}