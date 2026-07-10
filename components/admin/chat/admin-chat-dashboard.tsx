"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ConversationList } from "@/components/admin/chat/conversation-list";
import { ConversationView } from "@/components/admin/chat/conversation-view";
import { useAdminSupportChat } from "@/hooks/chat/use-admin-support-chat";

export function AdminChatDashboard() {
    const [isDeletingConversation, setIsDeletingConversation] = useState(false);

    const {
        conversations,
        selectedConversationId,
        selectedConversation,
        selectedMessages,
        filters,
        isLoadingConversations,
        isLoadingMessages,
        isSending,
        error,
        connectionState,
        setFilters,
        setSelectedConversationId,
        fetchConversations,
        fetchConversationMessages,
        sendAdminReply,
        deleteConversation,
        cleanupUnusedConversations,
    } = useAdminSupportChat();

    const unreadTotal = conversations.reduce(
        (sum, conversation) => sum + conversation.unreadCount,
        0
    );

    useEffect(() => {
        if (selectedConversationId) {
            void fetchConversationMessages(selectedConversationId);
        }
    }, [selectedConversationId]);

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
                <div>
                    <h2 className="text-xl font-semibold">Realtime Support Chat</h2>
                    <p className="text-sm text-muted-foreground">
                        Live support inbox for customer conversations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                        {connectionState === "connected" ? "Realtime connected" : "Reconnecting..."}
                    </div>
                    {connectionState !== "connected" ? (
                        <WifiOff className="h-4 w-4 text-muted-foreground" />
                    ) : null}
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-md px-4 text-sm"
                        onClick={() => void fetchConversations()}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
                <div className="space-y-1">
                    <div className="text-sm font-medium">Chat Management</div>
                    <div className="text-xs text-muted-foreground">
                        {conversations.length} conversations, {unreadTotal} unread messages
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-md px-4 text-sm"
                        onClick={async () => {
                            try {
                                const deleted = await cleanupUnusedConversations();
                                toast.success(
                                    deleted > 0
                                        ? `Removed ${deleted} unused conversations`
                                        : "No unused conversations found"
                                );
                            } catch (cleanupError) {
                                toast.error(
                                    cleanupError instanceof Error
                                        ? cleanupError.message
                                        : "Cleanup failed"
                                );
                            }
                        }}
                    >
                        Cleanup Unused
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                className="h-9 rounded-md px-4 text-sm"
                                disabled={!selectedConversationId || isDeletingConversation}
                            >
                                Delete Selected Chat
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Delete this conversation and all its messages? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        if (!selectedConversationId) return;

                                        setIsDeletingConversation(true);

                                        try {
                                            await deleteConversation(selectedConversationId);
                                            toast.success("Conversation deleted");
                                        } catch (deleteError) {
                                            toast.error(
                                                deleteError instanceof Error
                                                    ? deleteError.message
                                                    : "Delete failed"
                                            );
                                        } finally {
                                            setIsDeletingConversation(false);
                                        }
                                    }}
                                >
                                    {isDeletingConversation ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {error}
                </div>
            ) : null}

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
                <div className="min-h-0 overflow-hidden rounded-xl border bg-card">
                    <ConversationList
                        conversations={conversations}
                        selectedConversationId={selectedConversationId}
                        search={filters.search}
                        unreadOnly={filters.unreadOnly}
                        onSelect={setSelectedConversationId}
                        onSearchChange={(value) => setFilters({ search: value })}
                        onUnreadOnlyChange={(value) => setFilters({ unreadOnly: value })}
                    />
                </div>

                <div className="min-h-0 overflow-hidden rounded-xl border bg-card">
                    {isLoadingConversations && conversations.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">
                            Loading conversations...
                        </div>
                    ) : (
                        <ConversationView
                            conversation={selectedConversation}
                            messages={selectedMessages}
                            isLoadingMessages={isLoadingMessages}
                            isSending={isSending}
                            onSend={sendAdminReply}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
