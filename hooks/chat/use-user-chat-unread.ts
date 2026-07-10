"use client";

import { useEffect, useState } from "react";

export function useUserChatUnread() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchUnread = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/chat/unread", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = (await response.json()) as {
                    success: boolean;
                    unreadCount?: number;
                    message?: string;
                };

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to fetch unread count");
                }

                if (!cancelled) {
                    setUnreadCount(data.unreadCount ?? 0);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error ? error.message : "Failed to fetch unread count"
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        const intervalId = window.setInterval(() => {
            void fetchUnread();
        }, 15000);

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                void fetchUnread();
            }
        };

        document.addEventListener("visibilitychange", onVisible);
        void fetchUnread();

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    return {
        unreadCount,
        isLoading,
        error,
    };
}
