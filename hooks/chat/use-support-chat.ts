"use client";

import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { ChatConversation, ChatMessage } from "@/lib/chat/types";
import { getAblyRealtimeClient } from "@/lib/realtime/ably-client";
import { getConversationChannelName } from "@/lib/chat/constants";

type UIMessage = ChatMessage & {
    pending?: boolean;
    failed?: boolean;
};

type SupportChatStore = {
    isOpen: boolean;
    conversation: ChatConversation | null;
    messages: UIMessage[];
    isLoadingConversation: boolean;
    isLoadingMessages: boolean;
    isSending: boolean;
    hasMore: boolean;
    nextCursor: string | null;
    error: string | null;
    connectionState: "connected" | "disconnected" | "connecting";
    setOpen: (open: boolean) => void;
    setConnectionState: (state: SupportChatStore["connectionState"]) => void;
    reset: () => void;
    setConversation: (conversation: ChatConversation | null) => void;
    setMessages: (messages: UIMessage[], options?: { append?: boolean }) => void;
    upsertMessage: (message: UIMessage) => void;
    replaceMessageByClientId: (clientMessageId: string, message: UIMessage) => void;
    setLoadingConversation: (value: boolean) => void;
    setLoadingMessages: (value: boolean) => void;
    setSending: (value: boolean) => void;
    setPagination: (params: { hasMore: boolean; nextCursor: string | null }) => void;
    setError: (message: string | null) => void;
};

const useSupportChatStore = create<SupportChatStore>((set) => ({
    isOpen: false,
    conversation: null,
    messages: [],
    isLoadingConversation: false,
    isLoadingMessages: false,
    isSending: false,
    hasMore: false,
    nextCursor: null,
    error: null,
    connectionState: "disconnected",
    setOpen: (open) => set({ isOpen: open }),
    setConnectionState: (connectionState) => set({ connectionState }),
    reset: () =>
        set({
            conversation: null,
            messages: [],
            hasMore: false,
            nextCursor: null,
            error: null,
        }),
    setConversation: (conversation) => set({ conversation }),
    setMessages: (messages, options) =>
        set((state) => ({
            messages: options?.append ? [...messages, ...state.messages] : messages,
        })),
    upsertMessage: (message) =>
        set((state) => {
            const exists = state.messages.some((item) => item.id === message.id);

            if (exists) {
                return {
                    messages: state.messages.map((item) =>
                        item.id === message.id ? { ...item, ...message } : item
                    ),
                };
            }

            return {
                messages: [...state.messages, message].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ),
            };
        }),
    replaceMessageByClientId: (clientMessageId, message) =>
        set((state) => ({
            messages: state.messages.map((item) =>
                item.clientMessageId === clientMessageId ? message : item
            ),
        })),
    setLoadingConversation: (isLoadingConversation) => set({ isLoadingConversation }),
    setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
    setSending: (isSending) => set({ isSending }),
    setPagination: ({ hasMore, nextCursor }) => set({ hasMore, nextCursor }),
    setError: (error) => set({ error }),
}));

async function parseJson<T>(response: Response): Promise<T> {
    return response.json() as Promise<T>;
}

export function useSupportChat() {
    const store = useSupportChatStore();

    const conversationId = store.conversation?.id;

    useEffect(() => {
        if (!store.isOpen) {
            return;
        }

        if (store.conversation) {
            return;
        }

        let cancelled = false;

        const loadConversation = async () => {
            store.setLoadingConversation(true);
            store.setError(null);

            try {
                const response = await fetch("/api/chat/conversation", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await parseJson<{
                    success: boolean;
                    conversation?: ChatConversation | null;
                    message?: string;
                }>(response);

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load conversation");
                }

                if (!cancelled) {
                    store.setConversation(data.conversation || null);

                    if (!data.conversation) {
                        store.setMessages([]);
                        store.setPagination({ hasMore: false, nextCursor: null });
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    store.setError(error instanceof Error ? error.message : "Failed to load conversation");
                }
            } finally {
                if (!cancelled) {
                    store.setLoadingConversation(false);
                }
            }
        };

        void loadConversation();

        return () => {
            cancelled = true;
        };
    }, [store.isOpen, store.conversation]);

    useEffect(() => {
        if (!store.isOpen || !conversationId || store.messages.length > 0) {
            return;
        }

        let cancelled = false;

        const loadMessages = async () => {
            store.setLoadingMessages(true);
            store.setError(null);

            try {
                const response = await fetch(
                    `/api/chat/messages?conversationId=${conversationId}&limit=30`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const data = await parseJson<{
                    success: boolean;
                    messages?: ChatMessage[];
                    hasMore?: boolean;
                    nextCursor?: string | null;
                    message?: string;
                }>(response);

                if (!response.ok || !data.success || !data.messages) {
                    throw new Error(data.message || "Failed to load messages");
                }

                if (!cancelled) {
                    store.setMessages(data.messages);
                    store.setPagination({
                        hasMore: Boolean(data.hasMore),
                        nextCursor: data.nextCursor || null,
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    store.setError(error instanceof Error ? error.message : "Failed to load messages");
                }
            } finally {
                if (!cancelled) {
                    store.setLoadingMessages(false);
                }
            }
        };

        void loadMessages();

        return () => {
            cancelled = true;
        };
    }, [store.isOpen, conversationId, store.messages.length]);

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const realtime = getAblyRealtimeClient();
        const channel = realtime.channels.get(getConversationChannelName(conversationId));

        const handleConnectionState = () => {
            if (realtime.connection.state === "connected") {
                store.setConnectionState("connected");
            } else if (realtime.connection.state === "connecting") {
                store.setConnectionState("connecting");
            } else {
                store.setConnectionState("disconnected");
            }
        };

        handleConnectionState();

        realtime.connection.on(handleConnectionState);

        const handler = (message: { data?: { message?: ChatMessage } }) => {
            const incoming = message.data?.message;

            if (!incoming) {
                return;
            }

            store.upsertMessage(incoming);
        };

        channel.subscribe("message.created", handler);

        return () => {
            channel.unsubscribe("message.created", handler);
            realtime.connection.off(handleConnectionState);
        };
    }, [conversationId]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) {
            return;
        }

        const messageText = text.trim();
        const clientMessageId = crypto.randomUUID();
        if (conversationId) {
            const optimisticMessage: UIMessage = {
                id: `temp-${clientMessageId}`,
                conversationId,
                senderType: "user",
                senderId: store.conversation?.participantId || "user",
                message: messageText,
                clientMessageId,
                createdAt: new Date().toISOString(),
                read: false,
                readAt: null,
                pending: true,
            };

            store.upsertMessage(optimisticMessage);
        }

        store.setSending(true);
        store.setError(null);

        try {
            const response = await fetch("/api/chat/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversationId: conversationId || undefined,
                    message: messageText,
                    clientMessageId,
                }),
            });

            const data = await parseJson<{
                success: boolean;
                message?: ChatMessage;
                conversation?: ChatConversation;
                duplicate?: boolean;
            }>(response);

            if (!response.ok || !data.success || !data.message) {
                throw new Error("Failed to send message");
            }

            if (conversationId) {
                store.replaceMessageByClientId(clientMessageId, data.message);
            } else {
                store.upsertMessage(data.message);
            }

            if (data.conversation) {
                store.setConversation(data.conversation);
            }
        } catch {
            if (conversationId) {
                store.upsertMessage({
                    id: `temp-${clientMessageId}`,
                    conversationId,
                    senderType: "user",
                    senderId: store.conversation?.participantId || "user",
                    message: messageText,
                    clientMessageId,
                    createdAt: new Date().toISOString(),
                    read: false,
                    readAt: null,
                    pending: false,
                    failed: true,
                });
            }
            store.setError("Message failed to send. Please retry.");
        } finally {
            store.setSending(false);
        }
    };

    const loadOlderMessages = async () => {
        if (!conversationId || !store.nextCursor || store.isLoadingMessages) {
            return;
        }

        store.setLoadingMessages(true);

        try {
            const response = await fetch(
                `/api/chat/messages?conversationId=${conversationId}&limit=30&cursor=${encodeURIComponent(
                    store.nextCursor
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await parseJson<{
                success: boolean;
                messages?: ChatMessage[];
                hasMore?: boolean;
                nextCursor?: string | null;
            }>(response);

            if (!response.ok || !data.success || !data.messages) {
                throw new Error("Failed to load older messages");
            }

            store.setMessages(data.messages, { append: true });
            store.setPagination({
                hasMore: Boolean(data.hasMore),
                nextCursor: data.nextCursor || null,
            });
        } catch {
            store.setError("Failed to load older messages");
        } finally {
            store.setLoadingMessages(false);
        }
    };

    return useMemo(
        () => ({
            ...store,
            sendMessage,
            loadOlderMessages,
        }),
        [store]
    );
}
