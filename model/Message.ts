import mongoose, { Document, Schema, Types } from "mongoose";

export type MessageSenderType = "user" | "admin";

export interface MessageDocument extends Document {
    conversationId: Types.ObjectId;
    senderType: MessageSenderType;
    senderId: string;
    message: string;
    clientMessageId?: string | null;
    createdAt: Date;
    read: boolean;
    readAt?: Date | null;
}

const MessageSchema = new Schema<MessageDocument>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        senderType: {
            type: String,
            enum: ["user", "admin"],
            required: true,
            index: true,
        },
        senderId: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        clientMessageId: {
            type: String,
            trim: true,
            default: null,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index(
    { conversationId: 1, senderId: 1, clientMessageId: 1 },
    { unique: true, sparse: true }
);

const MessageModel =
    (mongoose.models.Message as mongoose.Model<MessageDocument>) ||
    mongoose.model<MessageDocument>("Message", MessageSchema);

export default MessageModel;
