"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Calendar,
    Loader2,
    Mail,
    MessageCircle,
    Paperclip,
    RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type InquiryStatus = "new" | "contacted" | "closed";

export type AdminInquiryItem = {
    id: string;
    name: string;
    email: string;
    whatsappNumber: string;
    assignmentType: string;
    deadline: string | null;
    message: string;
    source: "contact-form" | "order-form";
    hadAttachment: boolean;
    status: InquiryStatus;
    createdAt: string;
};

const statusStyles: Record<InquiryStatus, string> = {
    new: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    contacted: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    closed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};

const sourceLabels: Record<AdminInquiryItem["source"], string> = {
    "contact-form": "Contact page",
    "order-form": "Free brief check",
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function AdminInquiries({ initialInquiries }: { initialInquiries: AdminInquiryItem[] }) {
    const [inquiries, setInquiries] = useState<AdminInquiryItem[]>(initialInquiries);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    async function refresh() {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/inquiries", { cache: "no-store" });
            const data = await response.json();
            if (response.ok && data.success) {
                setInquiries(data.inquiries);
            } else {
                toast.error(data.message || "Failed to load inquiries");
            }
        } catch {
            toast.error("Failed to load inquiries");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function updateStatus(id: string, status: InquiryStatus) {
        setUpdatingId(id);
        try {
            const response = await fetch(`/api/admin/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setInquiries((current) =>
                    current.map((item) => (item.id === id ? { ...item, status } : item))
                );
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Website Inquiries</h2>
                    <div className="text-sm text-muted-foreground">
                        Leads submitted from the Contact page and homepage brief-check form.
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh
                </Button>
            </div>

            {inquiries.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading inquiries..." : "No website inquiries yet."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {inquiries.map((inquiry) => (
                        <Card key={inquiry.id} className="border-primary/15 dark:border-primary/25">
                            <CardContent className="space-y-3 p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{inquiry.name || "Unnamed lead"}</span>
                                            <Badge variant="outline" className="rounded-full text-[11px]">
                                                {sourceLabels[inquiry.source]}
                                            </Badge>
                                            {inquiry.hadAttachment && (
                                                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                {inquiry.whatsappNumber}
                                            </span>
                                            {inquiry.email && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {inquiry.email}
                                                </span>
                                            )}
                                            {inquiry.deadline && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(inquiry.deadline))}
                                                </span>
                                            )}
                                            <span>{formatDate(inquiry.createdAt)}</span>
                                        </div>
                                    </div>
                                    <Select
                                        value={inquiry.status}
                                        onValueChange={(value) => updateStatus(inquiry.id, value as InquiryStatus)}
                                        disabled={updatingId === inquiry.id}
                                    >
                                        <SelectTrigger className={`h-8 w-[130px] text-xs ${statusStyles[inquiry.status]}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="contacted">Contacted</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {inquiry.assignmentType && (
                                    <div className="text-xs text-muted-foreground">
                                        Assignment type: <span className="text-foreground">{inquiry.assignmentType}</span>
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed text-muted-foreground">{inquiry.message}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
