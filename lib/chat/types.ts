export type ChatParticipantType = "guest" | "user";
export type ChatConversationStatus = "open" | "closed";
export type ChatSenderType = "user" | "admin";

export type ChatConversation = {
    id: string;
    participantType: ChatParticipantType;
    participantId: string;
    guestId?: string | null;
    userId?: string | null;
    assignedAdminId?: string | null;
    assignedAt?: string | null;
    status: ChatConversationStatus;
    lastMessage: string;
    lastMessageAt: string;
    createdAt: string;
    updatedAt: string;
};

export type ChatMessage = {
    id: string;
    conversationId: string;
    senderType: ChatSenderType;
    senderId: string;
    message: string;
    clientMessageId?: string | null;
    createdAt: string;
    read: boolean;
    readAt?: string | null;
};

export type AdminConversationListItem = ChatConversation & {
    unreadCount: number;
};
