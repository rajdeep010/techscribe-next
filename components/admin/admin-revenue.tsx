"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export type RevenueEntry = {
    id: string;
    amount: number;
    category: "assignment-payment" | "other";
    description: string;
    assignmentId: string | null;
    studentName: string;
    recordedByName: string;
    receivedAt: string;
    createdAt: string;
};

type FormState = {
    amount: string;
    category: "assignment-payment" | "other";
    description: string;
    studentName: string;
    receivedAt: string;
};

function emptyForm(): FormState {
    return {
        amount: "",
        category: "assignment-payment",
        description: "",
        studentName: "",
        receivedAt: new Date().toISOString().slice(0, 10),
    };
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function AdminRevenue({ initialEntries }: { initialEntries: RevenueEntry[] }) {
    const [entries, setEntries] = useState<RevenueEntry[]>(initialEntries);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function refresh() {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/revenue", { cache: "no-store" });
            const data = await response.json();
            if (response.ok && data.success) {
                setEntries(data.entries);
            } else {
                toast.error(data.message || "Failed to load revenue entries");
            }
        } catch {
            toast.error("Failed to load revenue entries");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    function openCreateForm() {
        setEditingId(null);
        setForm(emptyForm());
        setIsFormOpen(true);
    }

    function openEditForm(entry: RevenueEntry) {
        setEditingId(entry.id);
        setForm({
            amount: String(entry.amount),
            category: entry.category,
            description: entry.description,
            studentName: entry.studentName,
            receivedAt: entry.receivedAt.slice(0, 10),
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
        setIsSubmitting(true);

        try {
            const payload = {
                amount: form.amount,
                category: form.category,
                description: form.description,
                studentName: form.studentName,
                receivedAt: form.receivedAt,
            };

            const response = await fetch(
                editingId ? `/api/admin/revenue/${editingId}` : "/api/admin/revenue",
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Failed to save revenue entry");
                return;
            }

            toast.success(editingId ? "Revenue entry updated" : "Revenue entry recorded");
            closeForm();
            refresh();
        } catch {
            toast.error("Failed to save revenue entry");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/revenue/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Failed to delete revenue entry");
                return;
            }

            toast.success("Revenue entry deleted");
            setEntries((current) => current.filter((entry) => entry.id !== id));
        } catch {
            toast.error("Failed to delete revenue entry");
        } finally {
            setDeletingId(null);
        }
    }

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Revenue</h2>
                    <div className="text-sm text-muted-foreground">
                        {entries.length} record{entries.length === 1 ? "" : "s"} &middot; {formatCurrency(total)} total
                    </div>
                </div>
                <Button size="sm" onClick={openCreateForm}>
                    <Plus className="h-4 w-4" />
                    Record Payment
                </Button>
            </div>

            {isFormOpen && (
                <Card className="border-primary/20">
                    <CardContent className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                {editingId ? "Edit Revenue Entry" : "Record New Payment"}
                            </h3>
                            <Button variant="ghost" size="icon-sm" onClick={closeForm} aria-label="Close form">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="revenue-amount">Amount (₹)</Label>
                                    <Input
                                        id="revenue-amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.amount}
                                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="revenue-date">Date Received</Label>
                                    <Input
                                        id="revenue-date"
                                        type="date"
                                        value={form.receivedAt}
                                        onChange={(e) => setForm((f) => ({ ...f, receivedAt: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="revenue-category">Category</Label>
                                    <Select
                                        value={form.category}
                                        onValueChange={(value) =>
                                            setForm((f) => ({ ...f, category: value as FormState["category"] }))
                                        }
                                    >
                                        <SelectTrigger id="revenue-category" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="assignment-payment">Assignment Payment</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="revenue-student">Student Name (optional)</Label>
                                    <Input
                                        id="revenue-student"
                                        value={form.studentName}
                                        onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="revenue-description">Description</Label>
                                <Textarea
                                    id="revenue-description"
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="e.g. Final payment for dissertation review"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {editingId ? "Save Changes" : "Record Payment"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {entries.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading revenue entries..." : "No revenue recorded yet."}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="border-primary/15 dark:border-primary/25">
                            <CardContent className="flex flex-wrap items-start justify-between gap-3 p-5">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-semibold">{formatCurrency(entry.amount)}</span>
                                        <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                                            {entry.category === "assignment-payment" ? "Assignment Payment" : "Other"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
                                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {entry.studentName && <span>Student: {entry.studentName}</span>}
                                        <span>Received {formatDate(entry.receivedAt)}</span>
                                        <span>Recorded by {entry.recordedByName}</span>
                                    </div>
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
