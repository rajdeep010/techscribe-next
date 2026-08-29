"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ManualAssignmentStatus = "in-progress" | "delivered" | "completed";

export type ManualAssignmentItem = {
    id: string;
    title: string;
    subject: string;
    clientName: string;
    clientContact: string;
    handledById: string;
    handledByName: string;
    status: ManualAssignmentStatus;
    deliveryDate: string | null;
    notes: string;
    recordedByName: string;
    createdAt: string;
};

type ReviewerOption = { id: string; label: string };

type FormState = {
    title: string;
    subject: string;
    clientName: string;
    clientContact: string;
    handledBy: string;
    status: ManualAssignmentStatus;
    deliveryDate: string;
    notes: string;
};

function emptyForm(): FormState {
    return {
        title: "",
        subject: "",
        clientName: "",
        clientContact: "",
        handledBy: "",
        status: "completed",
        deliveryDate: "",
        notes: "",
    };
}

const statusStyles: Record<ManualAssignmentStatus, string> = {
    "in-progress": "bg-amber-500/10 text-amber-700 border-amber-500/20",
    delivered: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};

const statusLabels: Record<ManualAssignmentStatus, string> = {
    "in-progress": "In Progress",
    delivered: "Delivered",
    completed: "Completed",
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function AdminManualAssignments({ initialEntries }: { initialEntries: ManualAssignmentItem[] }) {
    const [entries, setEntries] = useState<ManualAssignmentItem[]>(initialEntries);
    const [reviewers, setReviewers] = useState<ReviewerOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function refresh() {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/manual-assignments", { cache: "no-store" });
            const data = await response.json();
            if (response.ok && data.success) {
                setEntries(data.entries);
            } else {
                toast.error(data.message || "Failed to load manual entries");
            }
        } catch {
            toast.error("Failed to load manual entries");
        } finally {
            setIsLoading(false);
        }
    }

    async function loadReviewers() {
        try {
            const response = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await response.json();
            if (!response.ok) return;

            const admins = (data.users || [])
                .filter((user: { role: string }) => user.role === "admin")
                .map((user: { id: string; name?: string; username: string }) => ({
                    id: user.id,
                    label: user.name?.trim() || `@${user.username}`,
                }));

            setReviewers(admins);
        } catch {
            // Non-fatal — the "handled by" select will just show no options.
        }
    }

    useEffect(() => {
        refresh();
        loadReviewers();
    }, []);

    function openCreateForm() {
        setEditingId(null);
        setForm(emptyForm());
        setIsFormOpen(true);
    }

    function openEditForm(entry: ManualAssignmentItem) {
        setEditingId(entry.id);
        setForm({
            title: entry.title,
            subject: entry.subject,
            clientName: entry.clientName,
            clientContact: entry.clientContact,
            handledBy: entry.handledById,
            status: entry.status,
            deliveryDate: entry.deliveryDate ? entry.deliveryDate.slice(0, 10) : "",
            notes: entry.notes,
        });
        setIsFormOpen(true);
    }

    function closeForm() {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(emptyForm());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.handledBy) {
            toast.error("Select who handled the work");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(
                editingId ? `/api/admin/manual-assignments/${editingId}` : "/api/admin/manual-assignments",
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );
            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Failed to save entry");
                return;
            }

            toast.success(editingId ? "Entry updated" : "Manual entry logged");
            closeForm();
            refresh();
        } catch {
            toast.error("Failed to save entry");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/manual-assignments/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Failed to delete entry");
                return;
            }

            toast.success("Entry deleted");
            setEntries((current) => current.filter((entry) => entry.id !== id));
        } catch {
            toast.error("Failed to delete entry");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Manual Assignment Entries</h2>
                    <div className="text-sm text-muted-foreground">
                        Log work taken on outside the normal submission flow (e.g. a WhatsApp or phone client).
                    </div>
                </div>
                <Button size="sm" onClick={openCreateForm}>
                    <Plus className="h-4 w-4" />
                    Log Entry
                </Button>
            </div>

            {isFormOpen && (
                <Card className="border-primary/20">
                    <CardContent className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                {editingId ? "Edit Manual Entry" : "Log New Manual Entry"}
                            </h3>
                            <Button variant="ghost" size="icon-sm" onClick={closeForm} aria-label="Close form">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ma-title">Title</Label>
                                    <Input
                                        id="ma-title"
                                        value={form.title}
                                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. Marketing Dissertation Review"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ma-subject">Subject (optional)</Label>
                                    <Input
                                        id="ma-subject"
                                        value={form.subject}
                                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ma-client">Client Name</Label>
                                    <Input
                                        id="ma-client"
                                        value={form.clientName}
                                        onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ma-contact">Client Contact (phone/WhatsApp/email)</Label>
                                    <Input
                                        id="ma-contact"
                                        value={form.clientContact}
                                        onChange={(e) => setForm((f) => ({ ...f, clientContact: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="ma-handled-by">Handled By</Label>
                                    <Select
                                        value={form.handledBy}
                                        onValueChange={(value) => setForm((f) => ({ ...f, handledBy: value }))}
                                    >
                                        <SelectTrigger id="ma-handled-by" className="w-full">
                                            <SelectValue placeholder="Select reviewer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reviewers.map((reviewer) => (
                                                <SelectItem key={reviewer.id} value={reviewer.id}>
                                                    {reviewer.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ma-status">Status</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value) =>
                                            setForm((f) => ({ ...f, status: value as ManualAssignmentStatus }))
                                        }
                                    >
                                        <SelectTrigger id="ma-status" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ma-date">Delivery Date (optional)</Label>
                                    <Input
                                        id="ma-date"
                                        type="date"
                                        value={form.deliveryDate}
                                        onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ma-notes">Notes (optional)</Label>
                                <Textarea
                                    id="ma-notes"
                                    value={form.notes}
                                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                    placeholder="Any additional context worth recording"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {editingId ? "Save Changes" : "Log Entry"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {entries.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading entries..." : "No manual entries logged yet."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="border-primary/15 dark:border-primary/25">
                            <CardContent className="flex flex-wrap items-start justify-between gap-3 p-5">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold">{entry.title}</span>
                                        <Badge variant="outline" className={`rounded-full text-[11px] ${statusStyles[entry.status]}`}>
                                            {statusLabels[entry.status]}
                                        </Badge>
                                        {entry.subject && (
                                            <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                                                {entry.subject}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        <span>Client: {entry.clientName} ({entry.clientContact})</span>
                                        <span className="inline-flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            Handled by {entry.handledByName}
                                        </span>
                                        {entry.deliveryDate && <span>Delivered {formatDate(entry.deliveryDate)}</span>}
                                        <span>Logged by {entry.recordedByName}</span>
                                    </div>
                                    {entry.notes && (
                                        <p className="mt-2 text-sm text-muted-foreground">{entry.notes}</p>
                                    )}
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button variant="outline" size="icon-sm" onClick={() => openEditForm(entry)} aria-label="Edit entry">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => handleDelete(entry.id)}
                                        disabled={deletingId === entry.id}
                                        aria-label="Delete entry"
                                    >
                                        {deletingId === entry.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
