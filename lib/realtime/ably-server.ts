import Ably from "ably";

let ablyRest: Ably.Rest | null = null;

function getAblyKey() {
    const key = process.env.ABLY_API_KEY;

    if (!key) {
        throw new Error("ABLY_API_KEY is missing");
    }

    return key;
}

export function getAblyRestClient() {
    if (ablyRest) {
        return ablyRest;
    }

    ablyRest = new Ably.Rest({ key: getAblyKey() });
    return ablyRest;
}

export async function publishAblyEvent(
    channelName: string,
    eventName: string,
    payload: unknown
) {
    try {
        const client = getAblyRestClient();
        const channel = client.channels.get(channelName);
        await channel.publish(eventName, payload);
    } catch {
        // Realtime publish failures should not block the API response.
    }
}

export async function createAblyTokenRequest(clientId: string) {
    const client = getAblyRestClient();

    return client.auth.createTokenRequest({
        clientId,
        ttl: 1000 * 60 * 60,
    });
}
