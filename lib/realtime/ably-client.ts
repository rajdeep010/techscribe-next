"use client";

import Ably from "ably";

let realtimeClient: Ably.Realtime | null = null;

export function getAblyRealtimeClient() {
    if (realtimeClient) {
        return realtimeClient;
    }

    realtimeClient = new Ably.Realtime({
        authUrl: "/api/realtime/token",
        autoConnect: true,
    });

    return realtimeClient;
}
