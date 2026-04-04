import mongoose, { Document, Schema } from "mongoose";

export interface SupportTicket extends Document {
    userId: string;
    username: string;
    email: string;
    role: "user" | "admin";
    subject: string;
    category: "general" | "billing" | "technical" | "account";
    message: string;
    status: "open" | "in-progress" | "resolved";
    resolvedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const SupportTicketSchema = new Schema<SupportTicket>(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        category: {
            type: String,
            enum: ["general", "billing", "technical", "account"],
            default: "general",
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved"],
            default: "open",
            required: true,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const SupportTicketModel =
    (mongoose.models.SupportTicket as mongoose.Model<SupportTicket>) ||
    mongoose.model<SupportTicket>("SupportTicket", SupportTicketSchema);

export default SupportTicketModel;