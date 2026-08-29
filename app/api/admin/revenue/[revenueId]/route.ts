import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import RevenueModel from "@/model/Revenue";
import AuditLogModel from "@/model/AuditLog";
import { revenueSchema } from "@/lib/validations/revenue";
import { formatCurrency } from "@/lib/utils";
import { diffField, buildUpdateSummary } from "@/lib/admin/audit-summary";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ revenueId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok || !auth.session.user?._id) {
            return NextResponse.json({ success: false, message: auth.ok ? "Unauthorized" : auth.message }, { status: auth.ok ? 401 : auth.status });
        }

        const { revenueId } = await context.params;
        const body = await request.json();
        const parsed = revenueSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0]?.message || "Invalid revenue entry" },
                { status: 400 }
            );
        }

        await dbConnect();

        const before = await RevenueModel.findById(revenueId).lean();

        if (!before) {
            return NextResponse.json({ success: false, message: "Revenue entry not found" }, { status: 404 });
        }

        const newReceivedAt = new Date(parsed.data.receivedAt);

        const entry = await RevenueModel.findByIdAndUpdate(
            revenueId,
            {
                amount: parsed.data.amount,
                category: parsed.data.category,
                description: parsed.data.description,
                assignment: parsed.data.assignmentId || null,
                studentName: parsed.data.studentName || "",
                receivedAt: newReceivedAt,
            },
            { new: true }
        );

        if (!entry) {
            return NextResponse.json({ success: false, message: "Revenue entry not found" }, { status: 404 });
        }

        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        const summary = buildUpdateSummary(adminName, "a revenue entry", [
            diffField("Amount", formatCurrency(before.amount), formatCurrency(parsed.data.amount)),
            diffField("Description", before.description, parsed.data.description),
            diffField("Category", before.category, parsed.data.category),
            diffField("Student", before.studentName || "", parsed.data.studentName || ""),
            diffField(
                "Received",
                new Date(before.receivedAt).toLocaleDateString("en-US", { dateStyle: "medium" }),
                newReceivedAt.toLocaleDateString("en-US", { dateStyle: "medium" })
            ),
        ]);

        await AuditLogModel.create({
            action: "revenue.updated",
            summary,
            amount: parsed.data.amount,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            revenue: entry._id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update revenue entry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update revenue entry" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ revenueId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok || !auth.session.user?._id) {
            return NextResponse.json({ success: false, message: auth.ok ? "Unauthorized" : auth.message }, { status: auth.ok ? 401 : auth.status });
        }

        const { revenueId } = await context.params;

        await dbConnect();

        const entry = await RevenueModel.findByIdAndDelete(revenueId);

        if (!entry) {
            return NextResponse.json({ success: false, message: "Revenue entry not found" }, { status: 404 });
        }

        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        await AuditLogModel.create({
            action: "revenue.deleted",
            summary: `${adminName} deleted a revenue entry of ${formatCurrency(entry.amount)} — ${entry.description}`,
            amount: entry.amount,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            revenue: entry._id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete revenue entry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete revenue entry" },
            { status: 500 }
        );
    }
}
