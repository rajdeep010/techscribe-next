"use client";

import { ChatMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

type Props = {
    message: ChatMessage & { pending?: boolean; failed?: boolean };
    isOwn: boolean;
};

function formatTime(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function MessageBubble({ message, isOwn }: Props) {
    return (
        <div className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    isOwn
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground"
                )}
            >
                <p className="whitespace-pre-wrap break-words leading-6">{message.message}</p>
                <div
                    className={cn(
                        "mt-1 text-[11px]",
                        isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                >
                    {formatTime(message.createdAt)}
                    {message.pending ? " • Sending..." : ""}
                    {message.failed ? " • Failed" : ""}
                </div>
            </div>
        </div>
    );
}
