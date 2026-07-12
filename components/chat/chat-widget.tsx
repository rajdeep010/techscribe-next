"use client";

import { MessageCircleMore } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChatDrawer } from "@/components/chat/chat-drawer";
import { useSupportChat } from "@/hooks/chat/use-support-chat";

export function ChatWidget() {
    const { status } = useSession();
    const { isOpen, setOpen } = useSupportChat();

    if (status === "authenticated") {
        return null;
    }

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-[70] transition-opacity ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                <Button
                    type="button"
                    className="rounded-full h-14 w-14 shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.9)]"
                    onClick={() => setOpen(!isOpen)}
                    aria-label="Open support chat"
                >
                    <MessageCircleMore className="h-16 w-16" />
                </Button>
            </div>

            <ChatDrawer />
        </>
    );
}
