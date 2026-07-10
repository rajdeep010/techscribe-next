import { HydratedDocument } from "mongoose";
import type { ChatConversation, ChatMessage } from "@/lib/chat/types";
import { ConversationDocument } from "@/model/Conversation";
import { MessageDocument } from "@/model/Message";

export function serializeConversation(
    conversation: ConversationDocument | HydratedDocument<ConversationDocument>
): ChatConversation {
    return {
        id: String(conversation._id),
        participantType: conversation.participantType,
        participantId: conversation.participantId,
        guestId: conversation.guestId ?? null,
        userId: conversation.userId ?? null,
        assignedAdminId: conversation.assignedAdminId ?? null,
        assignedAt: conversation.assignedAt ? new Date(conversation.assignedAt).toISOString() : null,
        status: conversation.status,
        lastMessage: conversation.lastMessage,
        lastMessageAt: new Date(conversation.lastMessageAt).toISOString(),
        createdAt: new Date(conversation.createdAt).toISOString(),
        updatedAt: new Date(conversation.updatedAt).toISOString(),
    };
}

export function serializeMessage(
    message: MessageDocument | HydratedDocument<MessageDocument>
): ChatMessage {
    return {
        id: String(message._id),
        conversationId: String(message.conversationId),
        senderType: message.senderType,
        senderId: message.senderId,
        message: message.message,
        clientMessageId: message.clientMessageId ?? null,
        createdAt: new Date(message.createdAt).toISOString(),
        read: Boolean(message.read),
        readAt: message.readAt ? new Date(message.readAt).toISOString() : null,
    };
}
