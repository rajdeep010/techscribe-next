"use client";

import { useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import {
    AdminConversationListItem,
    ChatConversation,
    ChatMessage,
} from "@/lib/chat/types";
import { SUPPORT_DASHBOARD_CHANNEL, getConversationChannelName } from "@/lib/chat/constants";
import { getAblyRealtimeClient } from "@/lib/realtime/ably-client";

type UIMessage = ChatMessage & {
    pending?: boolean;
    failed?: boolean;
};

type Filters = {
    search: string;
    status: "all" | "open" | "closed";
    unreadOnly: boolean;
    assigned: "all" | "me" | "unassigned";
};

type AdminChatStore = {
    conversations: AdminConversationListItem[];
    selectedConversationId: string | null;
    messagesByConversationId: Record<string, UIMessage[]>;
    filters: Filters;
    isLoadingConversations: boolean;
    isLoadingMessages: boolean;
    isSending: boolean;
    error: string | null;
    connectionState: "connected" | "disconnected" | "connecting";
    setFilters: (partial: Partial<Filters>) => void;
    setConversations: (rows: AdminConversationListItem[]) => void;
    upsertConversation: (row: AdminConversationListItem) => void;
    removeConversation: (conversationId: string) => void;
    setSelectedConversationId: (id: string | null) => void;
    setMessages: (conversationId: string, messages: UIMessage[]) => void;
    upsertMessage: (conversationId: string, message: UIMessage) => void;
    replaceMessageByClientId: (
        conversationId: string,
        clientMessageId: string,
        message: UIMessage
    ) => void;
    setLoadingConversations: (value: boolean) => void;
    setLoadingMessages: (value: boolean) => void;
    setSending: (value: boolean) => void;
    setError: (message: string | null) => void;
    setConnectionState: (state: AdminChatStore["connectionState"]) => void;
};

const useAdminChatStore = create<AdminChatStore>((set) => ({
    conversations: [],
    selectedConversationId: null,
    messagesByConversationId: {},
    filters: {
        search: "",
        status: "all",
        unreadOnly: false,
        assigned: "all",
    },
    isLoadingConversations: false,
    isLoadingMessages: false,
    isSending: false,
    error: null,
    connectionState: "disconnected",
    setFilters: (partial) =>
        set((state) => ({
            filters: {
                ...state.filters,
                ...partial,
            },
        })),
    setConversations: (conversations) => set({ conversations }),
    upsertConversation: (row) =>
        set((state) => {
            const exists = state.conversations.some((item) => item.id === row.id);
            const list = exists
                ? state.conversations.map((item) => (item.id === row.id ? { ...item, ...row } : item))
                : [row, ...state.conversations];

            return {
                conversations: list.sort(
                    (a, b) =>
                        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                ),
            };
        }),
    removeConversation: (conversationId) =>
        set((state) => ({
            conversations: state.conversations.filter((item) => item.id !== conversationId),
            selectedConversationId:
                state.selectedConversationId === conversationId
                    ? null
                    : state.selectedConversationId,
            messagesByConversationId: Object.fromEntries(
                Object.entries(state.messagesByConversationId).filter(
                    ([key]) => key !== conversationId
                )
            ),
        })),
    setSelectedConversationId: (selectedConversationId) => set({ selectedConversationId }),
    setMessages: (conversationId, messages) =>
        set((state) => ({
            messagesByConversationId: {
                ...state.messagesByConversationId,
                [conversationId]: messages,
            },
        })),
    upsertMessage: (conversationId, message) =>
        set((state) => {
            const current = state.messagesByConversationId[conversationId] || [];
            const exists = current.some((item) => item.id === message.id);
            const next = exists
                ? current.map((item) => (item.id === message.id ? { ...item, ...message } : item))
                : [...current, message];

            return {
                messagesByConversationId: {
                    ...state.messagesByConversationId,
                    [conversationId]: next.sort(
                        (a, b) =>
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    ),
                },
            };
        }),
    replaceMessageByClientId: (conversationId, clientMessageId, message) =>
        set((state) => {
            const current = state.messagesByConversationId[conversationId] || [];

            return {
                messagesByConversationId: {
                    ...state.messagesByConversationId,
                    [conversationId]: current.map((item) =>
                        item.clientMessageId === clientMessageId ? message : item
                    ),
                },
            };
        }),
    setLoadingConversations: (isLoadingConversations) => set({ isLoadingConversations }),
    setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
    setSending: (isSending) => set({ isSending }),
    setError: (error) => set({ error }),
    setConnectionState: (connectionState) => set({ connectionState }),
}));

async function parseJson<T>(response: Response): Promise<T> {
    return response.json() as Promise<T>;
}

export function useAdminSupportChat() {
    const store = useAdminChatStore();
    const notifiedMessageIdsRef = useRef<Set<string>>(new Set());

    const selectedConversation = useMemo(() => {
        return (
            store.conversations.find(
                (conversation) => conversation.id === store.selectedConversationId
            ) || null
        );
    }, [store.conversations, store.selectedConversationId]);

    const selectedMessages =
        (selectedConversation
            ? store.messagesByConversationId[selectedConversation.id]
            : undefined) || [];

    const fetchConversations = async () => {
        store.setLoadingConversations(true);
        store.setError(null);

        try {
            const params = new URLSearchParams();

            if (store.filters.search.trim()) {
                params.set("search", store.filters.search.trim());
            }

            if (store.filters.status !== "all") {
                params.set("status", store.filters.status);
            }

            if (store.filters.unreadOnly) {
                params.set("unread", "true");
            }

            if (store.filters.assigned !== "all") {
                params.set("assigned", store.filters.assigned);
            }

            const response = await fetch(`/api/admin/chat/conversations?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await parseJson<{
                success: boolean;
                conversations?: AdminConversationListItem[];
                message?: string;
            }>(response);

            if (!response.ok || !data.success || !data.conversations) {
                throw new Error(data.message || "Failed to fetch conversations");
            }

            store.setConversations(data.conversations);

            if (!store.selectedConversationId && data.conversations.length > 0) {
                store.setSelectedConversationId(data.conversations[0].id);
            }
        } catch (error) {
            store.setError(error instanceof Error ? error.message : "Failed to fetch conversations");
        } finally {
            store.setLoadingConversations(false);
        }
    };

    const fetchConversationMessages = async (conversationId: string) => {
        store.setLoadingMessages(true);
        store.setError(null);

        try {
            const response = await fetch(
                `/api/admin/chat/conversations/${conversationId}/messages?limit=60`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await parseJson<{
                success: boolean;
                messages?: ChatMessage[];
                message?: string;
            }>(response);

            if (!response.ok || !data.success || !data.messages) {
                throw new Error(data.message || "Failed to fetch messages");
            }

            store.setMessages(conversationId, data.messages);

            const currentConversation = store.conversations.find(
                (item) => item.id === conversationId
            );

            if (currentConversation) {
                store.upsertConversation({
                    ...currentConversation,
                    unreadCount: 0,
                });
            }
        } catch (error) {
            store.setError(error instanceof Error ? error.message : "Failed to fetch messages");
        } finally {
            store.setLoadingMessages(false);
        }
    };

    const sendAdminReply = async (text: string) => {
        if (!selectedConversation || !text.trim()) {
            return;
        }

        const messageText = text.trim();
        const clientMessageId = crypto.randomUUID();

        const optimisticMessage: UIMessage = {
            id: `temp-${clientMessageId}`,
            conversationId: selectedConversation.id,
            senderType: "admin",
            senderId: "admin",
            message: messageText,
            clientMessageId,
            createdAt: new Date().toISOString(),
            read: true,
            readAt: new Date().toISOString(),
            pending: true,
        };

        store.upsertMessage(selectedConversation.id, optimisticMessage);
        store.setSending(true);
        store.setError(null);

        try {
            const response = await fetch(
                `/api/admin/chat/conversations/${selectedConversation.id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: messageText,
                        clientMessageId,
                    }),
                }
            );

            const data = await parseJson<{
                success: boolean;
                message?: ChatMessage;
                conversation?: ChatConversation;
            }>(response);

            if (!response.ok || !data.success || !data.message || !data.conversation) {
                throw new Error("Failed to send message");
            }

            store.replaceMessageByClientId(
                selectedConversation.id,
                clientMessageId,
                data.message
            );
            store.upsertConversation({
                ...(selectedConversation as AdminConversationListItem),
                ...(data.conversation as AdminConversationListItem),
            });
        } catch (error) {
            store.upsertMessage(selectedConversation.id, {
                ...optimisticMessage,
                pending: false,
                failed: true,
            });
            store.setError(error instanceof Error ? error.message : "Failed to send message");
        } finally {
            store.setSending(false);
        }
    };

    const updateConversation = async (
        conversationId: string,
        action: "claim" | "unassign" | "open" | "close" | "mark-read"
    ) => {
        const response = await fetch(`/api/admin/chat/conversations/${conversationId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action }),
        });

        const data = await parseJson<{
            success: boolean;
            conversation?: AdminConversationListItem;
            message?: string;
        }>(response);

        if (!response.ok || !data.success || !data.conversation) {
            throw new Error(data.message || "Failed to update conversation");
        }

        store.upsertConversation(data.conversation);
    };

    const deleteConversation = async (conversationId: string) => {
        const response = await fetch(`/api/admin/chat/conversations/${conversationId}`, {
            method: "DELETE",
        });

        const data = (await response.json()) as {
            success: boolean;
            message?: string;
        };

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to delete conversation");
        }

        store.removeConversation(conversationId);
    };

    const cleanupUnusedConversations = async () => {
        const response = await fetch(`/api/admin/chat/conversations/cleanup`, {
            method: "POST",
        });

        const data = (await response.json()) as {
            success: boolean;
            deletedCount?: number;
            message?: string;
        };

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to cleanup conversations");
        }

        await fetchConversations();

        return data.deletedCount ?? 0;
    };

    useEffect(() => {
        void fetchConversations();
    }, [store.filters.search, store.filters.status, store.filters.unreadOnly, store.filters.assigned]);

    useEffect(() => {
        if (!store.selectedConversationId) {
            return;
        }

        if (store.messagesByConversationId[store.selectedConversationId]) {
            return;
        }

        void fetchConversationMessages(store.selectedConversationId);
    }, [store.selectedConversationId, store.messagesByConversationId]);

    useEffect(() => {
        const realtime = getAblyRealtimeClient();
        const dashboardChannel = realtime.channels.get(SUPPORT_DASHBOARD_CHANNEL);

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

        const dashboardHandler = (event: {
            data?: { conversation?: AdminConversationListItem; conversationId?: string };
        }) => {
            const conversation = event.data?.conversation;
            const conversationId = event.data?.conversationId;

            if (conversationId) {
                store.removeConversation(conversationId);
                return;
            }

            if (conversation) {
                store.upsertConversation(conversation);
            }
        };

        dashboardChannel.subscribe("conversation.created", dashboardHandler);
        dashboardChannel.subscribe("conversation.updated", dashboardHandler);
        dashboardChannel.subscribe("conversation.deleted", dashboardHandler);
        dashboardChannel.subscribe("message.created", dashboardHandler);

        return () => {
            dashboardChannel.unsubscribe("conversation.created", dashboardHandler);
            dashboardChannel.unsubscribe("conversation.updated", dashboardHandler);
            dashboardChannel.unsubscribe("conversation.deleted", dashboardHandler);
            dashboardChannel.unsubscribe("message.created", dashboardHandler);
            realtime.connection.off(handleConnectionState);
        };
    }, []);

    useEffect(() => {
        if (!store.selectedConversationId) {
            return;
        }

        const realtime = getAblyRealtimeClient();
        const channel = realtime.channels.get(
            getConversationChannelName(store.selectedConversationId)
        );

        const messageHandler = (event: {
            data?: { message?: ChatMessage; conversation?: AdminConversationListItem };
        }) => {
            const incomingMessage = event.data?.message;
            const conversation = event.data?.conversation;

            if (incomingMessage) {
                store.upsertMessage(store.selectedConversationId as string, incomingMessage);

                const shouldNotify =
                    incomingMessage.senderType === "user" &&
                    !document.hasFocus() &&
                    document.visibilityState !== "visible";

                if (
                    shouldNotify &&
                    !notifiedMessageIdsRef.current.has(incomingMessage.id) &&
                    typeof Notification !== "undefined" &&
                    Notification.permission === "granted"
                ) {
                    notifiedMessageIdsRef.current.add(incomingMessage.id);
                    const preview = incomingMessage.message.length > 80
                        ? `${incomingMessage.message.slice(0, 80)}...`
                        : incomingMessage.message;

                    new Notification("New Support Message", {
                        body: preview,
                        tag: `support-${incomingMessage.id}`,
                    });
                }
            }

            if (conversation) {
                store.upsertConversation(conversation);
            }
        };

        channel.subscribe("message.created", messageHandler);
        channel.subscribe("conversation.updated", messageHandler);

        return () => {
            channel.unsubscribe("message.created", messageHandler);
            channel.unsubscribe("conversation.updated", messageHandler);
        };
    }, [store.selectedConversationId]);

    useEffect(() => {
        if (typeof Notification === "undefined") {
            return;
        }

        if (Notification.permission === "default") {
            void Notification.requestPermission();
        }
    }, []);

    return {
        ...store,
        selectedConversation,
        selectedMessages,
        fetchConversations,
        fetchConversationMessages,
        sendAdminReply,
        updateConversation,
        deleteConversation,
        cleanupUnusedConversations,
    };
}
