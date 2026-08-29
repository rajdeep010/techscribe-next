import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type RevenueCategory = "assignment-payment" | "other";

export interface Revenue extends Document {
    amount: number;
    category: RevenueCategory;
    description: string;
    assignment?: Types.ObjectId | null;
    studentName?: string;
    recordedBy: Types.ObjectId;
    recordedByName: string;
    receivedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const revenueSchema = new Schema<Revenue>(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: ["assignment-payment", "other"],
            default: "assignment-payment",
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        assignment: {
            type: Schema.Types.ObjectId,
            ref: "Assignment",
            default: null,
        },
        studentName: {
            type: String,
            trim: true,
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
        receivedAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

revenueSchema.index({ receivedAt: -1 });

const RevenueModel =
    (mongoose.models.Revenue as Model<Revenue>) ||
    mongoose.model<Revenue>("Revenue", revenueSchema);

export default RevenueModel;
