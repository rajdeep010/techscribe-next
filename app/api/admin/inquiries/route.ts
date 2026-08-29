import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import InquiryModel from "@/model/Inquiry";

function serializeInquiry(inquiry: {
    _id: unknown;
    name?: string;
    email?: string;
    whatsappNumber: string;
    assignmentType?: string;
    deadline?: Date | null;
    message: string;
    source: string;
    hadAttachment: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}) {
    return {
        id: String(inquiry._id),
        name: inquiry.name || "",
        email: inquiry.email || "",
        whatsappNumber: inquiry.whatsappNumber,
        assignmentType: inquiry.assignmentType || "",
        deadline: inquiry.deadline ? new Date(inquiry.deadline).toISOString() : null,
        message: inquiry.message,
        source: inquiry.source,
        hadAttachment: inquiry.hadAttachment,
        status: inquiry.status,
        createdAt: new Date(inquiry.createdAt).toISOString(),
        updatedAt: new Date(inquiry.updatedAt).toISOString(),
    };
}

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        await dbConnect();

        const inquiries = await InquiryModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            inquiries: inquiries.map(serializeInquiry),
        });
    } catch (error) {
        console.error("Failed to load inquiries:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load inquiries" },
            { status: 500 }
        );
    }
}
