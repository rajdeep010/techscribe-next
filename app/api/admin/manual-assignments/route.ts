import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminSession } from "@/lib/auth/admin";
import dbConnect from "@/lib/dbConnect";
import ManualAssignmentEntryModel from "@/model/ManualAssignmentEntry";
import AuditLogModel from "@/model/AuditLog";
import UserModel from "@/model/User";
import { manualAssignmentSchema } from "@/lib/validations/manual-assignment";

function serializeEntry(entry: {
    _id: unknown;
    title: string;
    subject?: string;
    clientName: string;
    clientContact: string;
    handledBy: unknown;
    handledByName: string;
    status: string;
    deliveryDate?: Date | null;
    notes?: string;
    recordedByName: string;
    createdAt: Date;
}) {
    return {
        id: String(entry._id),
        title: entry.title,
        subject: entry.subject || "",
        clientName: entry.clientName,
        clientContact: entry.clientContact,
        handledById: String(entry.handledBy),
        handledByName: entry.handledByName,
        status: entry.status,
        deliveryDate: entry.deliveryDate ? new Date(entry.deliveryDate).toISOString() : null,
        notes: entry.notes || "",
        recordedByName: entry.recordedByName,
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

        const entries = await ManualAssignmentEntryModel.find({}).sort({ createdAt: -1 }).limit(200).lean();

        return NextResponse.json({
            success: true,
            entries: entries.map(serializeEntry),
        });
    } catch (error) {
        console.error("Failed to load manual assignment entries:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load manual assignment entries" },
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
        const adminName = auth.session.user.name || auth.session.user.username || "Admin";

        const entry = await ManualAssignmentEntryModel.create({
            title: parsed.data.title,
            subject: parsed.data.subject || "",
            clientName: parsed.data.clientName,
            clientContact: parsed.data.clientContact,
            handledBy: parsed.data.handledBy,
            handledByName: handlerName,
            status: parsed.data.status,
            deliveryDate: parsed.data.deliveryDate ? new Date(parsed.data.deliveryDate) : null,
            notes: parsed.data.notes || "",
            recordedBy: auth.session.user._id,
            recordedByName: adminName,
        });

        await AuditLogModel.create({
            action: "manual-assignment.created",
            summary: `${adminName} manually logged "${parsed.data.title}" for ${parsed.data.clientName}, handled by ${handlerName}`,
            performedBy: auth.session.user._id,
            performedByName: adminName,
            manualAssignment: entry._id,
        });

        return NextResponse.json({ success: true, entry: serializeEntry(entry) }, { status: 201 });
    } catch (error) {
        console.error("Failed to record manual assignment entry:", error);
        return NextResponse.json(
            { success: false, message: "Failed to record manual assignment entry" },
            { status: 500 }
        );
    }
}
