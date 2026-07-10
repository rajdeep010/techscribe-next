"use client";

import { useEffect, useRef } from "react";
import { Circle, MessageCircleMore, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";
import { useSupportChat } from "@/hooks/chat/use-support-chat";

export function UserSupportChat() {
    const {
        setOpen,
        messages,
        isLoadingConversation,
        isLoadingMessages,
        isSending,
        error,
        hasMore,
        loadOlderMessages,
        sendMessage,
        connectionState,
    } = useSupportChat();

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setOpen(true);

        return () => {
            setOpen(false);
        };
    }, [setOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    return (
        <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b bg-background px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageCircleMore className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="text-base font-semibold">Support Chat</h2>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            {connectionState === "connected" ? (
                                <>
                                    <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                                    Online
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3 w-3" />
                                    Reconnecting...
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col bg-muted/20">
                <div className="flex-1 overflow-y-auto px-3 py-3">
                    {isLoadingConversation || isLoadingMessages ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Loading conversation...
                        </div>
                    ) : null}

                    {!isLoadingConversation && !isLoadingMessages && hasMore ? (
                        <div className="mb-3 flex justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-9 rounded-md px-4 text-xs"
                                onClick={() => void loadOlderMessages()}
                            >
                                Load older messages
                            </Button>
                        </div>
                    ) : null}

                    {!isLoadingConversation && !isLoadingMessages && messages.length === 0 ? (
                        <div className="rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground">
                            Start a conversation with support. We usually reply quickly.
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwn={message.senderType === "user"}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {error ? (
                        <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                            {error}
                        </div>
                    ) : null}
                </div>

                <MessageInput isSending={isSending} onSend={sendMessage} />
            </div>
        </div>
    );
}
