"use client";

import { useEffect, useState } from "react";

export function useAdminChatUnread() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const fetchUnread = async () => {
            try {
                const response = await fetch("/api/admin/chat/unread", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = (await response.json()) as {
                    success: boolean;
                    unreadCount?: number;
                };

                if (!response.ok || !data.success) {
                    return;
                }

                if (!cancelled) {
                    setUnreadCount(data.unreadCount ?? 0);
                }
            } catch {
                // Silent fail; this badge is non-blocking UI.
            }
        };

        const intervalId = window.setInterval(() => {
            void fetchUnread();
        }, 10000);

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                void fetchUnread();
            }
        };

        const onFocus = () => {
            void fetchUnread();
        };

        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onFocus);
        void fetchUnread();

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    return { unreadCount };
}
