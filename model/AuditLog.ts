import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Kept intentionally narrow: only revenue and manually-entered assignment events are
// audited today, so this collection stays small and reviewable rather than logging
// every action app-wide.
export type AuditAction =
    | "revenue.created"
    | "revenue.updated"
    | "revenue.deleted"
    | "manual-assignment.created"
    | "manual-assignment.updated"
    | "manual-assignment.deleted";

export interface AuditLogEntry extends Document {
    action: AuditAction;
    summary: string;
    amount?: number | null;
    performedBy: Types.ObjectId;
    performedByName: string;
    revenue?: Types.ObjectId | null;
    manualAssignment?: Types.ObjectId | null;
    createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogEntry>(
    {
        action: {
            type: String,
            enum: [
                "revenue.created",
                "revenue.updated",
                "revenue.deleted",
                "manual-assignment.created",
                "manual-assignment.updated",
                "manual-assignment.deleted",
            ],
            required: true,
            index: true,
        },
        summary: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        amount: {
            type: Number,
            default: null,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        performedByName: {
            type: String,
            required: true,
            trim: true,
        },
        revenue: {
            type: Schema.Types.ObjectId,
            ref: "Revenue",
            default: null,
        },
        manualAssignment: {
            type: Schema.Types.ObjectId,
            ref: "ManualAssignmentEntry",
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

auditLogSchema.index({ createdAt: -1 });

const AuditLogModel =
    (mongoose.models.AuditLog as Model<AuditLogEntry>) ||
    mongoose.model<AuditLogEntry>("AuditLog", auditLogSchema);

export default AuditLogModel;
