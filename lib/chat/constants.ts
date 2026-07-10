export const SUPPORT_GUEST_COOKIE = "support_guest_id";
export const SUPPORT_GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

export const SUPPORT_DASHBOARD_CHANNEL = "support-dashboard";

export function getConversationChannelName(conversationId: string) {
    return `chat:${conversationId}`;
}
