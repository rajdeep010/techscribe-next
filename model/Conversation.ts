import mongoose, { Document, Schema } from "mongoose";

export type ConversationParticipantType = "guest" | "user";
export type ConversationStatus = "open" | "closed";

export interface ConversationDocument extends Document {
    participantType: ConversationParticipantType;
    participantId: string;
    guestId?: string | null;
    userId?: string | null;
    assignedAdminId?: string | null;
    assignedAt?: Date | null;
    status: ConversationStatus;
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
    {
        participantType: {
            type: String,
            enum: ["guest", "user"],
            required: true,
            default: "guest",
        },
        participantId: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        guestId: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },
        userId: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },
        assignedAdminId: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },
        assignedAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
            required: true,
            index: true,
        },
        lastMessage: {
            type: String,
            default: "",
            trim: true,
            maxlength: 5000,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

ConversationSchema.index({ participantType: 1, participantId: 1 }, { unique: true });
ConversationSchema.index({ status: 1, lastMessageAt: -1 });

const ConversationModel =
    (mongoose.models.Conversation as mongoose.Model<ConversationDocument>) ||
    mongoose.model<ConversationDocument>("Conversation", ConversationSchema);

export default ConversationModel;
