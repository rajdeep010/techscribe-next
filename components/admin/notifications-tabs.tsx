"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSupportCenter } from "@/components/admin/admin-support-center";
import { AdminInquiries, type AdminInquiryItem } from "@/components/admin/admin-inquiries";
import { AdminSupportProvider } from "@/context/AdminProvider";
import type { SupportTicketItem } from "@/lib/types";

const tabs = [
    { id: "support", label: "Support Tickets" },
    { id: "inquiries", label: "Website Inquiries" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function NotificationsTabs({
    initialTickets,
    initialInquiries,
}: {
    initialTickets: SupportTicketItem[];
    initialInquiries: AdminInquiryItem[];
}) {
    const [activeTab, setActiveTab] = useState<TabId>("support");

    return (
        <div className="space-y-6">
            <div className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                            activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "support" ? (
                <AdminSupportProvider initialTickets={initialTickets}>
                    <AdminSupportCenter />
                </AdminSupportProvider>
            ) : (
                <AdminInquiries initialInquiries={initialInquiries} />
            )}
        </div>
    );
}
