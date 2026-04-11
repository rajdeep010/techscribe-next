"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    CalendarClock,
    Clock3,
    Download,
    FileText,
    FolderUp,
    Layers3,
    Loader2,
    PencilLine,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";

import type { AssignmentDetailItem } from "@/lib/types";
import {
    formatBytes,
    MAX_ASSIGNMENT_FILES,
    MAX_ASSIGNMENT_FILE_SIZE_BYTES,
} from "@/lib/assignments/files";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const statusConfig: Record<
    string,
    {
        badge: string;
        surface: string;
        label: string;
    }
> = {
    submitted: {
        badge: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
        surface: "from-slate-950 via-slate-900 to-slate-800",
        label: "Submitted and waiting for review",
    },
    "under-review": {
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        surface: "from-amber-950 via-amber-900 to-slate-900",
        label: "Currently being reviewed",
    },
    assigned: {
        badge: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        surface: "from-sky-950 via-sky-900 to-slate-900",
        label: "Assigned to a reviewer",
    },
    "in-progress": {
        badge: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
        surface: "from-blue-950 via-blue-900 to-slate-900",
        label: "Work is in progress",
    },
    "awaiting-user": {
        badge: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
        surface: "from-orange-950 via-orange-900 to-slate-900",
        label: "Waiting for your response",
    },
    delivered: {
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        surface: "from-emerald-950 via-emerald-900 to-slate-900",
        label: "Delivered to you",
    },
    completed: {
        badge: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
        surface: "from-green-950 via-green-900 to-slate-900",
        label: "Task completed",
    },
    cancelled: {
        badge: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
        surface: "from-red-950 via-red-900 to-slate-900",
        label: "Task cancelled",
    },
    archived: {
        badge: "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
        surface: "from-zinc-950 via-zinc-900 to-slate-900",
        label: "Archived for record keeping",
    },
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatStatus(value: string) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function getStatusMeta(status: string) {
    return (
        statusConfig[status] ?? {
            badge: "border-border bg-muted/40 text-foreground",
            surface: "from-slate-950 via-slate-900 to-slate-800",
            label: "Assignment status updated",
        }
    );
}

export function TaskDetail() {
    const params = useParams<{ assignmentId: string }>();
    const [assignment, setAssignment] = useState<AssignmentDetailItem | null>(null);
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const loadAssignment = useCallback(async () => {
        setIsLoading(true);

        const response = await fetch(`/api/user/assignments/${params.assignmentId}`, {
            cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Failed to load task");
            setIsLoading(false);
            return;
        }

        setAssignment(data.assignment);
        setDescription(data.assignment.description);
        setIsLoading(false);
    }, [params.assignmentId]);

    useEffect(() => {
        loadAssignment();
    }, [loadAssignment]);

    async function handleSaveDescription() {
        if (!assignment) return;

        setIsSaving(true);

        const response = await fetch(`/api/user/assignments/${params.assignmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }),
        });

        const data = await response.json();
        setIsSaving(false);

        if (!response.ok) {
            toast.error(data.message || "Failed to update task");
            return;
        }

        toast.success("Description updated");
        await loadAssignment();
    }

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        const existingFileCount = assignment?.fileCount ?? 0;

        if (existingFileCount + files.length > MAX_ASSIGNMENT_FILES) {
            toast.error(`You can keep up to ${MAX_ASSIGNMENT_FILES} files on a task`);
            event.target.value = "";
            return;
        }

        for (const file of files) {
            if (file.size > MAX_ASSIGNMENT_FILE_SIZE_BYTES) {
                toast.error(`${file.name} exceeds the 10 MB limit`);
                event.target.value = "";
                return;
            }
        }

        setIsUploading(true);

        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }

        const response = await fetch(`/api/user/assignments/${params.assignmentId}/files`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setIsUploading(false);
        event.target.value = "";

        if (!response.ok) {
            toast.error(data.message || "Failed to upload files");
            return;
        }

        toast.success("Files uploaded");
        await loadAssignment();
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="overflow-hidden border-border/60 shadow-sm">
                    <CardContent className="p-0">
                        <div className="h-52 animate-pulse bg-muted/40" />
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="h-6 w-40 animate-pulse rounded bg-muted/40" />
                            <div className="h-32 animate-pulse rounded-2xl bg-muted/40" />
                            <div className="flex justify-end">
                                <div className="h-11 w-32 animate-pulse rounded-xl bg-muted/40" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/60 shadow-sm">
                            <CardContent className="space-y-4 p-6">
                                <div className="h-6 w-32 animate-pulse rounded bg-muted/40" />
                                <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
                                <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <Card className="border-border/60 shadow-sm">
                <CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">Task not found</h2>
                        <p className="text-sm text-muted-foreground">
                            This task may have been removed or the link is no longer valid.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const canEdit =
        assignment.status === "submitted" || assignment.status === "under-review";

    const canUploadMore = canEdit && assignment.fileCount < MAX_ASSIGNMENT_FILES;
    const statusMeta = getStatusMeta(assignment.status);
    const reviewerLabel = assignment.assignedReviewer
        ? assignment.assignedReviewer.name || `@${assignment.assignedReviewer.username}`
        : "Not assigned yet";
    const descriptionChanged =
        description.trim() !== assignment.description.trim();
    const remainingFileSlots = Math.max(0, MAX_ASSIGNMENT_FILES - assignment.fileCount);
    const uploadInputId = `task-files-${assignment.id}`;

    const topStats = [
        {
            label: "Files attached",
            value: String(assignment.fileCount),
            helper: `${remainingFileSlots} slot${remainingFileSlots === 1 ? "" : "s"} left`,
            icon: Layers3,
        },
        {
            label: "Storage used",
            value: formatBytes(assignment.totalFileSizeBytes),
            helper: "Across all visible attachments",
            icon: FolderUp,
        },
        {
            label: "Reviewer",
            value: reviewerLabel,
            helper: canEdit ? "Editable stage still active" : "Task is locked for changes",
            icon: UserRound,
        },
    ];

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-0">
                    <div
                        className={cn(
                            "relative overflow-hidden bg-gradient-to-br px-6 py-8 text-white md:px-8 md:py-10",
                            statusMeta.surface
                        )}
                    >
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl" />
                        </div>

                        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px]">
                            <div className="space-y-5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                                        {formatStatus(assignment.status)}
                                    </Badge>
                                    <span className="text-sm text-white/75">
                                        {statusMeta.label}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                                        {assignment.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                                            {assignment.subject || "General assignment"}
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                                            <CalendarClock className="h-4 w-4" />
                                            Due {formatDate(assignment.deliveryDeadline)}
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                                            <Clock3 className="h-4 w-4" />
                                            Updated {formatDate(assignment.updatedAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="max-w-2xl rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                                        <div className="space-y-1">
                                            <div className="font-medium">Editing policy</div>
                                            <p className="text-sm leading-6 text-white/75">
                                                You can update the description and add more files while
                                                the task is still in the submitted or under-review stage.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                                {topStats.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                                                {item.label}
                                            </div>
                                            <item.icon className="h-4 w-4 text-white/70" />
                                        </div>
                                        <div className="mt-3 text-lg font-semibold leading-tight text-white">
                                            {item.value}
                                        </div>
                                        <div className="mt-1 text-sm text-white/65">
                                            {item.helper}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
                <Card className="border-border/60 bg-card/95 shadow-sm">
                    <CardContent className="space-y-5 p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <PencilLine className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold">Task brief</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Keep the instructions precise so the reviewer has everything in one place.
                                </p>
                            </div>

                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-full px-3 py-1 font-normal",
                                    canEdit
                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                        : "border-border bg-muted/40 text-muted-foreground"
                                )}
                            >
                                {canEdit ? "Editing enabled" : "Editing locked"}
                            </Badge>
                        </div>

                        <Textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            disabled={!canEdit}
                            className="min-h-64 rounded-3xl border-border/60 bg-background/60 p-5 text-sm leading-7 shadow-none"
                            placeholder="Add task notes, reference links, formatting rules, and anything else the reviewer should know."
                        />

                        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                {canEdit
                                    ? "Changes here update the core task instructions."
                                    : "This task is no longer editable because it has moved beyond the editable stage."}
                            </p>

                            {canEdit ? (
                                <Button
                                    onClick={handleSaveDescription}
                                    disabled={isSaving || !descriptionChanged}
                                    className="h-11 rounded-xl px-5"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save changes"
                                    )}
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/60 bg-card/95 shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Overview</h3>
                                <p className="text-sm text-muted-foreground">
                                    Important task metadata at a glance.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Created
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        {formatDate(assignment.createdAt)}
                                    </div>
                                </div>

                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Last updated
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        {formatDate(assignment.updatedAt)}
                                    </div>
                                </div>

                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Reviewer
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        {reviewerLabel}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="border-border/60 bg-card/95 shadow-sm">
                        <CardContent className="space-y-4 p-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Upload rules</h3>
                                <p className="text-sm text-muted-foreground">
                                    These limits are enforced before files are sent.
                                </p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <div className="font-medium">File count</div>
                                    <div className="mt-1 text-muted-foreground">
                                        Up to {MAX_ASSIGNMENT_FILES} files per task.
                                    </div>
                                </div>

                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <div className="font-medium">File size</div>
                                    <div className="mt-1 text-muted-foreground">
                                        Each file must stay under {formatBytes(MAX_ASSIGNMENT_FILE_SIZE_BYTES)}.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>

            <Card className="border-border/60 bg-card/95 shadow-sm">
                <CardContent className="space-y-5 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Attachments</h3>
                            <p className="text-sm text-muted-foreground">
                                Review existing files and upload supporting material while editing is still open.
                            </p>
                        </div>

                        <Badge variant="outline" className="rounded-full px-3 py-1 font-normal">
                            {assignment.fileCount} / {MAX_ASSIGNMENT_FILES} files used
                        </Badge>
                    </div>

                    {canUploadMore ? (
                        <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 p-2">
                            <label
                                htmlFor={uploadInputId}
                                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] border border-transparent px-6 py-10 text-center transition hover:border-border/60 hover:bg-background/70"
                            >
                                <div className="rounded-2xl border bg-background p-3 shadow-sm">
                                    <FolderUp className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-medium">Upload more files</div>
                                    <div className="text-sm text-muted-foreground">
                                        Add documents, PDFs, screenshots, or other supporting files.
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {remainingFileSlots} slot{remainingFileSlots === 1 ? "" : "s"} remaining
                                </div>
                            </label>

                            <Input
                                id={uploadInputId}
                                type="file"
                                multiple
                                onChange={handleUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="rounded-3xl border bg-muted/20 p-5 text-sm text-muted-foreground">
                            {canEdit
                                ? "File limit reached for this task."
                                : "Uploads are disabled because this task is no longer editable."}
                        </div>
                    )}

                    {isUploading ? (
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading files...
                        </div>
                    ) : null}

                    <div className="grid gap-4">
                        {assignment.files.length === 0 ? (
                            <div className="rounded-3xl border border-dashed bg-muted/10 px-6 py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border bg-background">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h4 className="font-medium">No files uploaded yet</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Attach source material or task documents to keep everything in one place.
                                </p>
                            </div>
                        ) : (
                            assignment.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/60 p-5 transition hover:border-border hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="rounded-2xl border bg-muted/30 p-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="truncate text-sm font-semibold">
                                                {file.originalName}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                                <span>{file.sizeLabel}</span>
                                                <span>{file.mimeType}</span>
                                                <span>Added {formatDate(file.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                                        <a href={file.downloadUrl} target="_blank" rel="noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Open file
                                        </a>
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}