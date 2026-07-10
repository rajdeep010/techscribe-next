"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminConversationListItem } from "@/lib/chat/types";

type Props = {
    conversations: AdminConversationListItem[];
    selectedConversationId: string | null;
    search: string;
    unreadOnly: boolean;
    onSelect: (id: string) => void;
    onSearchChange: (value: string) => void;
    onUnreadOnlyChange: (value: boolean) => void;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function ConversationList({
    conversations,
    selectedConversationId,
    search,
    unreadOnly,
    onSelect,
    onSearchChange,
    onUnreadOnlyChange,
}: Props) {
    return (
        <div className="flex h-full flex-col border-r bg-background">
            <div className="space-y-3 border-b p-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search conversations"
                        className="h-10 rounded-md pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={unreadOnly ? "default" : "outline"}
                        className="h-8 rounded-md px-3 text-xs"
                        onClick={() => onUnreadOnlyChange(!unreadOnly)}
                    >
                        Unread
                    </Button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {conversations.length === 0 ? (
                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                        No conversations found.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                type="button"
                                onClick={() => onSelect(conversation.id)}
                                className={cn(
                                    "w-full rounded-md border p-3 text-left transition-colors",
                                    selectedConversationId === conversation.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:bg-muted/40"
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="truncate text-sm font-medium">
                                        {conversation.userId || conversation.guestId || conversation.participantId}
                                    </div>
                                    {conversation.unreadCount > 0 ? (
                                        <Badge variant="secondary">{conversation.unreadCount}</Badge>
                                    ) : null}
                                </div>
                                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                    {conversation.lastMessage || "No messages yet"}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[11px] text-muted-foreground">
                                        {conversation.unreadCount > 0
                                            ? `${conversation.unreadCount} unread`
                                            : "No unread"}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {formatDate(conversation.lastMessageAt)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
