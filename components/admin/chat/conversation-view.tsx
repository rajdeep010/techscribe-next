"use client";

import { useEffect, useRef } from "react";
import { CornerDownLeft, MessageCircleMore } from "lucide-react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";
import { AdminConversationListItem, ChatMessage } from "@/lib/chat/types";

type Props = {
    conversation: AdminConversationListItem | null;
    messages: ChatMessage[];
    isLoadingMessages: boolean;
    isSending: boolean;
    onSend: (text: string) => Promise<void>;
};

export function ConversationView({
    conversation,
    messages,
    isLoadingMessages,
    isSending,
    onSend,
}: Props) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Select a conversation to view messages.
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
                <div>
                    <div className="text-sm font-semibold">
                        {conversation.userId || conversation.guestId || conversation.participantId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Conversation {conversation.id}
                    </div>
                </div>

                <div className="text-xs text-muted-foreground">Live conversation</div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-3">
                {isLoadingMessages ? (
                    <div className="text-sm text-muted-foreground">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="rounded-md border border-dashed bg-background p-4 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-2">
                            <MessageCircleMore className="h-4 w-4" />
                            No messages yet.
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwn={message.senderType === "admin"}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <div className="border-t p-3">
                <MessageInput isSending={isSending} onSend={onSend} />
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    Admin replies are realtime for user and all admins.
                </div>
            </div>
        </div>
    );
}
