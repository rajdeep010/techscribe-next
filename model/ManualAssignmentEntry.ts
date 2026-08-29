import mongoose, { Document, Model, Schema, Types } from "mongoose";

// For work taken on outside the normal in-app submission flow (e.g. a WhatsApp/phone
// lead with no platform account). Kept as its own collection so it never has to touch
// the real Assignment schema/flow that logged-in students use.
export type ManualAssignmentStatus = "in-progress" | "delivered" | "completed";

export interface ManualAssignmentEntry extends Document {
    title: string;
    subject?: string;
    clientName: string;
    clientContact: string;
    handledBy: Types.ObjectId;
    handledByName: string;
    status: ManualAssignmentStatus;
    deliveryDate?: Date | null;
    notes?: string;
    recordedBy: Types.ObjectId;
    recordedByName: string;
    createdAt: Date;
    updatedAt: Date;
}

const manualAssignmentEntrySchema = new Schema<ManualAssignmentEntry>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        subject: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        clientContact: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60,
        },
        handledBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        handledByName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["in-progress", "delivered", "completed"],
            default: "completed",
        },
        deliveryDate: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },
        recordedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recordedByName: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

manualAssignmentEntrySchema.index({ createdAt: -1 });

const ManualAssignmentEntryModel =
    (mongoose.models.ManualAssignmentEntry as Model<ManualAssignmentEntry>) ||
    mongoose.model<ManualAssignmentEntry>("ManualAssignmentEntry", manualAssignmentEntrySchema);

export default ManualAssignmentEntryModel;
