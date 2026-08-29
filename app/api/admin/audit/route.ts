import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import AuditLogModel from "@/model/AuditLog";

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        await dbConnect();

        const logs = await AuditLogModel.find({}).sort({ createdAt: -1 }).limit(200).lean();

        return NextResponse.json({
            success: true,
            logs: logs.map((log) => ({
                id: String(log._id),
                action: log.action,
                summary: log.summary,
                amount: log.amount ?? null,
                performedByName: log.performedByName,
                // Same record keeps the same recordId across create/update/delete —
                // even after deletion — so related entries can be correlated.
                recordId: log.revenue
                    ? String(log.revenue)
                    : log.manualAssignment
                        ? String(log.manualAssignment)
                        : null,
                createdAt: new Date(log.createdAt).toISOString(),
            })),
        });
    } catch (error) {
        console.error("Failed to load audit log:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load audit log" },
            { status: 500 }
        );
    }
}
