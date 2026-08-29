import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import InquiryModel from "@/model/Inquiry";

const updateSchema = z.object({
    status: z.enum(["new", "contacted", "closed"]),
});

export async function PATCH(
    request: Request,
    context: { params: Promise<{ inquiryId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        const { inquiryId } = await context.params;
        const body = await request.json();
        const parsed = updateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        await dbConnect();

        const inquiry = await InquiryModel.findByIdAndUpdate(
            inquiryId,
            { status: parsed.data.status },
            { new: true }
        ).lean();

        if (!inquiry) {
            return NextResponse.json(
                { success: false, message: "Inquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, status: parsed.data.status });
    } catch (error) {
        console.error("Failed to update inquiry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update inquiry" },
            { status: 500 }
        );
    }
}
