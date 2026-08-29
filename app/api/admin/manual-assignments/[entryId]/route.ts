import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import ManualAssignmentEntryModel from "@/model/ManualAssignmentEntry";
import AuditLogModel from "@/model/AuditLog";
import UserModel from "@/model/User";
import { manualAssignmentSchema } from "@/lib/validations/manual-assignment";
import { diffField, buildUpdateSummary } from "@/lib/admin/audit-summary";

const STATUS_LABELS: Record<string, string> = {
    "in-progress": "In Progress",
    delivered: "Delivered",
    completed: "Completed",
};

export async function PATCH(
    request: Request,
    context: { params: Promise<{ entryId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok || !auth.session.user?._id) {
            return NextResponse.json({ success: false, message: auth.ok ? "Unauthorized" : auth.message }, { status: auth.ok ? 401 : auth.status });
        }

        const { entryId } = await context.params;
        const body = await request.json();
        const parsed = manualAssignmentSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0]?.message || "Invalid entry" },
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(parsed.data.handledBy)) {
            return NextResponse.json({ success: false, message: "Invalid reviewer selected" }, { status: 400 });
        }

        await dbConnect();

        const handler = await UserModel.findOne({ _id: parsed.data.handledBy, role: "admin" })
            .select("name username")
            .lean();

        if (!handler) {
            return NextResponse.json({ success: false, message: "Selected reviewer not found" }, { status: 400 });
        }

        const handlerName = handler.name || `@${handler.username}`;

        const before = await ManualAssignmentEntryModel.findById(entryId).lean();

        if (!before) {
            return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
        }

        const newDeliveryDate = parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null;

        const entry = await ManualAssignmentEntryModel.findByIdAndUpdate(
            entryId,
            {
                title: parsed.data.title,
                subject: parsed.data.subject || "",
                clientName: parsed.data.clientName,
                clientContact: parsed.data.clientContact,
                handledBy: parsed.data.handledBy,
                handledByName: handlerName,
                status: parsed.data.status,
                deliveryDate: newDeliveryDate,
                notes: parsed.data.notes || "",
            },
            { new: true }
        );

        if (!entry) {
            return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
        }

        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        const formatDeliveryDate = (value: Date | null | undefined) =>
            value ? new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" }) : "";

        const summary = buildUpdateSummary(adminName, `the manual entry "${before.title}"`, [
            diffField("Title", before.title, parsed.data.title),
            diffField("Subject", before.subject || "", parsed.data.subject || ""),
            diffField("Client", before.clientName, parsed.data.clientName),
            diffField("Contact", before.clientContact, parsed.data.clientContact),
            diffField("Handled by", before.handledByName, handlerName),
            diffField("Status", STATUS_LABELS[before.status] ?? before.status, STATUS_LABELS[parsed.data.status] ?? parsed.data.status),
            diffField("Delivery date", formatDeliveryDate(before.deliveryDate), formatDeliveryDate(newDeliveryDate)),
            diffField("Notes", before.notes || "", parsed.data.notes || ""),
        ]);

        await AuditLogModel.create({
            action: "manual-assignment.updated",
            summary,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            manualAssignment: entry._id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update manual assignment entry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update manual assignment entry" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ entryId: string }> }
) {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok || !auth.session.user?._id) {
            return NextResponse.json({ success: false, message: auth.ok ? "Unauthorized" : auth.message }, { status: auth.ok ? 401 : auth.status });
        }

        const { entryId } = await context.params;

        await dbConnect();

        const entry = await ManualAssignmentEntryModel.findByIdAndDelete(entryId);

        if (!entry) {
            return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
        }

        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        await AuditLogModel.create({
            action: "manual-assignment.deleted",
            summary: `${adminName} deleted the manual entry "${entry.title}" for ${entry.clientName} (was handled by ${entry.handledByName})`,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            manualAssignment: entry._id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete manual assignment entry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete manual assignment entry" },
            { status: 500 }
        );
    }
}
