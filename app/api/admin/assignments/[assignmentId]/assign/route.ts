import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import { assignReviewerSchema } from "@/lib/validations/assignment";
import AssignmentModel from "@/model/Assignment";
import UserModel from "@/model/User";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ assignmentId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        const { assignmentId } = await context.params;

        if (!Types.ObjectId.isValid(assignmentId)) {
            return NextResponse.json(
                { success: false, message: "Invalid assignment id" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const parsed = assignReviewerSchema.safeParse(body);

        if (!parsed.success || !Types.ObjectId.isValid(parsed.data.reviewerId)) {
            return NextResponse.json(
                { success: false, message: "Invalid reviewer id" },
                { status: 400 }
            );
        }

        await dbConnect();

        const reviewer = await UserModel.findOne({
            _id: parsed.data.reviewerId,
            role: "admin",
        })
            .select("name username")
            .lean();

        if (!reviewer) {
            return NextResponse.json(
                { success: false, message: "Reviewer not found" },
                { status: 404 }
            );
        }

        const assignment = await AssignmentModel.findById(assignmentId);

        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "Assignment not found" },
                { status: 404 }
            );
        }

        assignment.assignedReviewer = new Types.ObjectId(parsed.data.reviewerId);
        assignment.status = assignment.status === "submitted" ? "assigned" : assignment.status;
        assignment.assignmentLockedAt = assignment.assignmentLockedAt ?? new Date();
        await assignment.save();

        return NextResponse.json({
            success: true,
            message: "Reviewer assigned successfully",
            reviewer: {
                id: String(reviewer._id),
                name: reviewer.name ?? "",
                username: reviewer.username ?? "",
            },
            status: assignment.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to assign reviewer",
            },
            { status: 500 }
        );
    }
}