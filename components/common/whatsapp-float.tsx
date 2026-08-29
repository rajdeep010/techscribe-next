"use client";

import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const DEFAULT_MESSAGE =
    "Hi, I need help with my assignment. Can you assist me?";
const DEFAULT_PHONE = CONTACT_INFO.whatsappNumber;

const LOCAL_STORAGE_PHONE_KEY = "whatsapp_phone_number";
const LOCAL_STORAGE_MESSAGE_KEY = "whatsapp_prefill_message";

function normalizePhoneNumber(value: string) {
    return value.replace(/\D/g, "");
}

export function WhatsAppFloat() {
    const envPhone = normalizePhoneNumber(
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_PHONE
    );
    const envMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? DEFAULT_MESSAGE;

    const localPhone =
        typeof window !== "undefined"
            ? normalizePhoneNumber(window.localStorage.getItem(LOCAL_STORAGE_PHONE_KEY) ?? "")
            : "";

    const localMessage =
        typeof window !== "undefined"
            ? (window.localStorage.getItem(LOCAL_STORAGE_MESSAGE_KEY) ?? "").trim()
            : "";

    const phone = localPhone || envPhone || DEFAULT_PHONE;
    const message = localMessage || envMessage;

    if (!phone) {
        return null;
    }

    const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-5 left-5 z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
        >
            <span className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-[#25D366]/35 blur-md" />
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-7 w-7 fill-current"
            >
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.59 5.98L0 24l6.25-1.64a11.85 11.85 0 0 0 5.8 1.48h.01c6.6 0 11.96-5.36 11.96-11.95 0-3.19-1.24-6.2-3.5-8.41zm-8.46 18.4h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.61-.24-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.02 2.91a9.86 9.86 0 0 1 2.9 7.03c0 5.48-4.46 9.94-9.94 9.94zm5.45-7.4c-.3-.15-1.77-.87-2.04-.96-.27-.1-.46-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.9-2.17-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.08 2.94 1.23 3.14c.15.2 2.12 3.24 5.14 4.54.72.31 1.29.5 1.73.64.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34z" />
            </svg>
        </a>
    );
}
