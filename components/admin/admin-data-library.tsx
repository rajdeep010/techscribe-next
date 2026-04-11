"use client";

import { useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import {
    AlertTriangle,
    Download,
    HardDrive,
    MoreHorizontal,
    RefreshCw,
    RotateCcw,
    ShieldAlert,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AgGridShell } from "@/components/data-grid/ag-grid-shell";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatBytes } from "@/lib/assignments/files";
import { cn } from "@/lib/utils";

export type AdminDataLibraryFileItem = {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    sizeLabel: string;
    status: "active" | "replaced" | "locked" | "pending-delete";
    storageProvider: "supabase" | "r2";
    bucket: string;
    storagePath: string;
    isVisibleToUser: boolean;
    createdAt: string;
    markedForDeletionAt: string | null;
    deleteAfter: string | null;
    downloadUrl: string;
    assignment: {
        id: string;
        title: string;
        status: string;
    };
    owner: {
        id: string;
        name: string;
        username: string;
        email: string;
    };
};

type GridRow = AdminDataLibraryFileItem & {
    fileDisplay: string;
    assignmentTitle: string;
    assignmentStatus: string;
    ownerDisplay: string;
    providerDisplay: string;
};

const fileStatusStyles = {
    active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    replaced: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    locked: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    "pending-delete":
        "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
} as const;

const assignmentStatusStyles: Record<string, string> = {
    submitted: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    "under-review":
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    assigned: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    "in-progress":
        "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "awaiting-user":
        "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    delivered:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    completed:
        "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
    cancelled: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    archived: "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
};

function formatDate(value: string | null) {
    if (!value) return "Not scheduled";

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

function getOwnerName(file: AdminDataLibraryFileItem) {
    return file.owner.name?.trim() || `@${file.owner.username}`;
}

export function AdminDataLibrary({
    initialFiles,
}: {
    initialFiles: AdminDataLibraryFileItem[];
}) {
    const [files, setFiles] = useState(initialFiles);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "replaced" | "locked" | "pending-delete"
    >("all");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actioningFileId, setActioningFileId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminDataLibraryFileItem | null>(null);

    async function refreshFiles() {
        setIsRefreshing(true);

        try {
            const response = await fetch("/api/admin/files", {
                method: "GET",
                cache: "no-store",
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to refresh files");
                return;
            }

            setFiles(data.files || []);
        } catch {
            toast.error("Failed to refresh files");
        } finally {
            setIsRefreshing(false);
        }
    }

    async function handleMarkForDeletion(fileId: string) {
        setActioningFileId(fileId);

        try {
            const response = await fetch(`/api/admin/files/${fileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "mark-delete" }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to mark file for deletion");
                return;
            }

            toast.success("File marked for deletion");
            await refreshFiles();
        } catch {
            toast.error("Failed to mark file for deletion");
        } finally {
            setActioningFileId(null);
        }
    }

    async function handleRestore(fileId: string) {
        setActioningFileId(fileId);

        try {
            const response = await fetch(`/api/admin/files/${fileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "restore" }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to restore file");
                return;
            }

            toast.success("Deletion mark removed");
            await refreshFiles();
        } catch {
            toast.error("Failed to restore file");
        } finally {
            setActioningFileId(null);
        }
    }

    async function handlePermanentDelete() {
        if (!deleteTarget) return;

        setActioningFileId(deleteTarget.id);

        try {
            const response = await fetch(`/api/admin/files/${deleteTarget.id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to delete file permanently");
                return;
            }

            toast.success("File removed from Supabase storage");
            setDeleteTarget(null);
            await refreshFiles();
        } catch {
            toast.error("Failed to delete file permanently");
        } finally {
            setActioningFileId(null);
        }
    }

    const rowData = useMemo<GridRow[]>(() => {
        const query = searchQuery.trim().toLowerCase();

        return [...files]
            .filter((file) => {
                const matchesStatus =
                    statusFilter === "all" ? true : file.status === statusFilter;

                const ownerDisplay = getOwnerName(file);
                const matchesSearch = !query
                    ? true
                    : [
                        file.originalName,
                        file.mimeType,
                        file.storagePath,
                        file.assignment.title,
                        file.assignment.status,
                        ownerDisplay,
                        file.owner.username,
                        file.owner.email,
                        file.storageProvider,
                        file.bucket,
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(query);

                return matchesStatus && matchesSearch;
            })
            .sort((left, right) => {
                if (left.status === "pending-delete" && right.status !== "pending-delete") {
                    return -1;
                }

                if (left.status !== "pending-delete" && right.status === "pending-delete") {
                    return 1;
                }

                return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
            })
            .map((file) => ({
                ...file,
                fileDisplay: file.originalName,
                assignmentTitle: file.assignment.title,
                assignmentStatus: file.assignment.status,
                ownerDisplay: getOwnerName(file),
                providerDisplay: `${file.storageProvider}:${file.bucket}`,
            }));
    }, [files, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const pendingDelete = files.filter((file) => file.status === "pending-delete");
        const readyToPurge = pendingDelete.filter((file) => {
            if (!file.deleteAfter) return false;
            return new Date(file.deleteAfter).getTime() <= Date.now();
        });

        return {
            totalFiles: files.length,
            pendingDelete: pendingDelete.length,
            totalStorageBytes: files.reduce((sum, file) => sum + file.sizeBytes, 0),
            readyToPurge: readyToPurge.length,
        };
    }, [files]);

    const columnDefs = useMemo<ColDef<GridRow>[]>(
        () => [
            {
                headerName: "File",
                field: "fileDisplay",
                minWidth: 280,
                maxWidth: 360,
                flex: 1.35,
                tooltipValueGetter: (params) =>
                    params.data
                        ? `${params.data.originalName}\n${params.data.mimeType}\n${params.data.storagePath}`
                        : "",
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    return (
                        <div className="flex h-full min-w-0 flex-col justify-center">
                            <div className="truncate font-medium text-foreground" title={file.originalName}>
                                {file.originalName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate" title={file.mimeType}>
                                    {file.mimeType}
                                </span>
                                <span className="shrink-0">•</span>
                                <span className="shrink-0">{file.sizeLabel}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Assignment",
                field: "assignmentTitle",
                minWidth: 220,
                maxWidth: 300,
                flex: 1.1,
                tooltipValueGetter: (params) =>
                    params.data ? params.data.assignment.title : "",
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    return (
                        <div className="flex h-full min-w-0 flex-row gap-2 justify-center items-center">
                            <div className="truncate font-medium text-foreground" title={file.assignment.title}>
                                {file.assignment.title}
                            </div>
                            <div className="mt-0">
                                <Badge
                                    variant="outline"
                                    className={
                                        assignmentStatusStyles[file.assignment.status] ||
                                        "border-border bg-muted/40 text-muted-foreground"
                                    }
                                >
                                    {formatStatus(file.assignment.status)}
                                </Badge>
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Owner",
                field: "ownerDisplay",
                minWidth: 210,
                maxWidth: 270,
                flex: 1,
                tooltipValueGetter: (params) =>
                    params.data
                        ? `${params.data.ownerDisplay}\n@${params.data.owner.username}\n${params.data.owner.email}`
                        : "",
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    return (
                        <div className="flex h-full min-w-0 flex-col justify-center">
                            <div className="truncate font-medium" title={file.ownerDisplay}>
                                {file.ownerDisplay}
                            </div>
                            <div className="truncate text-xs text-muted-foreground" title={file.owner.email}>
                                {file.owner.email}
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Lifecycle",
                field: "status",
                minWidth: 150,
                maxWidth: 170,
                filter: "agTextColumnFilter",
                cellRenderer: (params: { value?: GridRow["status"] }) => {
                    if (!params.value) return null;

                    return (
                        <Badge
                            variant="outline"
                            className={fileStatusStyles[params.value]}
                        >
                            {formatStatus(params.value)}
                        </Badge>
                    );
                },
            },
            {
                headerName: "Storage",
                field: "providerDisplay",
                minWidth: 150,
                maxWidth: 190,
                filter: "agTextColumnFilter",
                tooltipValueGetter: (params) =>
                    params.data
                        ? `${params.data.storageProvider}:${params.data.bucket}\n${params.data.storagePath}`
                        : "",
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    return (
                        <div className="flex h-full min-w-0 flex-col justify-center">
                            <div className="truncate font-medium" title={`${file.storageProvider}:${file.bucket}`}>
                                {file.storageProvider}:{file.bucket}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Path in tooltip
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Deletion",
                field: "deleteAfter",
                minWidth: 180,
                maxWidth: 220,
                flex: 0.85,
                tooltipValueGetter: (params) =>
                    params.data?.status === "pending-delete"
                        ? `Delete after: ${formatDate(params.data.deleteAfter)}\nMarked: ${formatDate(params.data.markedForDeletionAt)}`
                        : "Not scheduled",
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    if (file.status !== "pending-delete") {
                        return (
                            <span className="text-sm text-muted-foreground">
                                Not scheduled
                            </span>
                        );
                    }

                    return (
                        <div className="flex h-full min-w-0 flex-col justify-center">
                            <div className="font-medium text-red-600 dark:text-red-300">
                                {formatDate(file.deleteAfter)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Marked {formatDate(file.markedForDeletionAt)}
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Actions",
                colId: "actions",
                minWidth: 88,
                maxWidth: 88,
                sortable: false,
                filter: false,
                resizable: false,
                pinned: "right",
                suppressColumnsToolPanel: true,
                cellRenderer: (params: { data?: GridRow }) => {
                    const file = params.data;
                    if (!file) return null;

                    const isActioning = actioningFileId === file.id;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg"
                                    disabled={isActioning}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <a href={file.downloadUrl} target="_blank" rel="noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Open file
                                    </a>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {file.status === "pending-delete" ? (
                                    <DropdownMenuItem
                                        onClick={() => void handleRestore(file.id)}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Remove deletion mark
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => void handleMarkForDeletion(file.id)}
                                    >
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Mark for deletion
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 dark:text-red-300 dark:focus:text-red-300"
                                    onClick={() => setDeleteTarget(file)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete permanently
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [actioningFileId]
    );

    const toolbarActions = (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
                value={statusFilter}
                onValueChange={(value) =>
                    setStatusFilter(
                        value as "all" | "active" | "replaced" | "locked" | "pending-delete"
                    )
                }
            >
                <SelectTrigger className="h-11 w-[190px] rounded-xl">
                    <SelectValue placeholder="Lifecycle" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All files</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="replaced">Replaced</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="pending-delete">Pending delete</SelectItem>
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => void refreshFiles()}
                disabled={isRefreshing}
            >
                <RefreshCw
                    className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
                />
                Refresh
            </Button>
        </div>
    );

    return (
        <>
            <div className="flex min-h-0 flex-1 flex-col gap-6">
                <Card className="overflow-hidden border-border/60 shadow-sm">
                    <div className="bg-linear-to-r from-red-500/10 via-orange-500/10 to-sky-500/10 px-8 py-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
                                    <HardDrive className="h-4 w-4" />
                                    Storage Governance
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight">
                                    Manage uploaded files, retention, and hard deletes
                                </h2>
                                <p className="max-w-2xl text-sm text-muted-foreground">
                                    This library shows assignment files stored in Supabase. Admins can
                                    mark files for deletion, remove the deletion mark, or permanently
                                    delete files from storage.
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Safety note
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    Permanent delete removes the file from storage immediately.
                                    Use mark-for-deletion when you want a reversible review step.
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Tracked Files</div>
                                <div className="mt-2 text-3xl font-semibold">
                                    {stats.totalFiles}
                                </div>
                            </div>
                            <HardDrive className="h-8 w-8 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Pending Delete</div>
                                <div className="mt-2 text-3xl font-semibold">
                                    {stats.pendingDelete}
                                </div>
                            </div>
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Storage In Use</div>
                                <div className="mt-2 text-3xl font-semibold">
                                    {formatBytes(stats.totalStorageBytes)}
                                </div>
                            </div>
                            <HardDrive className="h-8 w-8 text-sky-600" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Ready To Purge</div>
                                <div className="mt-2 text-3xl font-semibold">
                                    {stats.readyToPurge}
                                </div>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <AgGridShell
                    title="File Library"
                    description="Search uploaded files, inspect ownership, and manage storage lifecycle from one grid."
                    rowData={rowData}
                    columnDefs={columnDefs}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by file, assignment, student, email, or path"
                    actions={toolbarActions}
                    emptyMessage="No files found."
                    csvFileName="data-library-files.csv"
                    height={620}
                    rowHeight={72}
                />
            </div>

            <AlertDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete file permanently</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the file from Supabase storage immediately and
                            cannot be undone. The database record will be marked as deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {deleteTarget ? (
                        <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
                            <div className="font-medium">{deleteTarget.originalName}</div>
                            <div className="mt-1 text-muted-foreground">
                                {deleteTarget.assignment.title}
                            </div>
                            <div className="mt-1 text-muted-foreground">
                                {getOwnerName(deleteTarget)} • {deleteTarget.sizeLabel}
                            </div>
                        </div>
                    ) : null}

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={Boolean(actioningFileId)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void handlePermanentDelete();
                            }}
                            disabled={Boolean(actioningFileId)}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}