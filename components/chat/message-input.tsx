"use client";

import { KeyboardEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    isSending?: boolean;
    onSend: (value: string) => Promise<void> | void;
};

export function MessageInput({ isSending = false, onSend }: Props) {
    const [value, setValue] = useState("");

    const submit = async () => {
        const text = value.trim();

        if (!text || isSending) {
            return;
        }

        await onSend(text);
        setValue("");
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void submit();
        }
    };

    return (
        <div className="border-t bg-background p-3">
            <div className="flex items-end gap-2">
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    className="max-h-32 min-h-11 resize-none rounded-md"
                />
                <Button
                    type="button"
                    className="h-11 rounded-md px-4 text-sm font-semibold"
                    disabled={isSending || !value.trim()}
                    onClick={() => void submit()}
                >
                    <SendHorizontal className="h-4 w-4" />
                </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
                Press Enter to send, Shift+Enter for newline.
            </p>
        </div>
    );
}
