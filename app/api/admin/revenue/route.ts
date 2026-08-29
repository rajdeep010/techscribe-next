import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import RevenueModel from "@/model/Revenue";
import AuditLogModel from "@/model/AuditLog";
import { revenueSchema } from "@/lib/validations/revenue";
import { formatCurrency } from "@/lib/utils";

function serializeRevenue(entry: {
    _id: unknown;
    amount: number;
    category: string;
    description: string;
    assignment?: unknown;
    studentName?: string;
    recordedByName: string;
    receivedAt: Date;
    createdAt: Date;
}) {
    return {
        id: String(entry._id),
        amount: entry.amount,
        category: entry.category,
        description: entry.description,
        assignmentId: entry.assignment ? String(entry.assignment) : null,
        studentName: entry.studentName || "",
        recordedByName: entry.recordedByName,
        receivedAt: new Date(entry.receivedAt).toISOString(),
        createdAt: new Date(entry.createdAt).toISOString(),
    };
}

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        await dbConnect();

        const entries = await RevenueModel.find({}).sort({ receivedAt: -1 }).limit(200).lean();

        return NextResponse.json({
            success: true,
            entries: entries.map(serializeRevenue),
        });
    } catch (error) {
        console.error("Failed to load revenue entries:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load revenue entries" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok || !auth.session.user?._id) {
            return NextResponse.json({ success: false, message: auth.ok ? "Unauthorized" : auth.message }, { status: auth.ok ? 401 : auth.status });
        }

        const body = await request.json();
        const parsed = revenueSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0]?.message || "Invalid revenue entry" },
                { status: 400 }
            );
        }

        await dbConnect();

        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        const entry = await RevenueModel.create({
            amount: parsed.data.amount,
            category: parsed.data.category,
            description: parsed.data.description,
            assignment: parsed.data.assignmentId || null,
            studentName: parsed.data.studentName || "",
            recordedBy: auth.session.user._id,
            recordedByName: adminName,
            receivedAt: new Date(parsed.data.receivedAt),
        });

        await AuditLogModel.create({
            action: "revenue.created",
            summary: `${adminName} recorded a payment of ${formatCurrency(parsed.data.amount)} — ${parsed.data.description}`,
            amount: parsed.data.amount,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            revenue: entry._id,
        });

        return NextResponse.json(
            { success: true, entry: serializeRevenue(entry) },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to record revenue:", error);
        return NextResponse.json(
            { success: false, message: "Failed to record revenue" },
            { status: 500 }
        );
    }
}
