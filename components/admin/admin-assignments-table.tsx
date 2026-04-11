"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { toast } from "sonner";

import type { AdminAssignmentListItem } from "@/lib/types";
import { useAdminAssignments } from "@/context/AdminAssignmentsProvider";
import { formatBytes } from "@/lib/assignments/files";
import { cn } from "@/lib/utils";
import { AgGridShell } from "@/components/data-grid/ag-grid-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
    submitted: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    "under-review": "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    assigned: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    "in-progress": "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "awaiting-user": "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    delivered: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    completed: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
    cancelled: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    archived: "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
} as const;

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value));
}

function formatStatus(value: string) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

type GridRow = AdminAssignmentListItem & {
    studentDisplay: string;
    reviewerDisplay: string;
};

export function AdminAssignmentsTable({
    adminOptions,
}: {
    adminOptions: Array<{ id: string; label: string }>;
}) {
    const {
        assignments,
        isLoading,
        error,
        searchQuery,
        fetchAssignments,
        assignReviewer,
        setSearchQuery,
    } = useAdminAssignments();

    const [statusFilter, setStatusFilter] = useState("all");
    const [reviewerFilter, setReviewerFilter] = useState("all");

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    async function handleAssign(assignmentId: string, reviewerId: string) {
        const result = await assignReviewer(assignmentId, reviewerId);

        if (!result.success) {
            toast.error(result.message || "Failed to assign reviewer");
            return;
        }

        toast.success("Reviewer assigned");
    }

    const rowData = useMemo<GridRow[]>(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return assignments
            .filter((assignment) => {
                const matchesStatus =
                    statusFilter === "all" ? true : assignment.status === statusFilter;

                const reviewerId = assignment.assignedReviewer?.id ?? "unassigned";
                const matchesReviewer =
                    reviewerFilter === "all"
                        ? true
                        : reviewerFilter === "unassigned"
                            ? !assignment.assignedReviewer
                            : reviewerId === reviewerFilter;

                const matchesSearch = !normalizedQuery
                    ? true
                    : [
                        assignment.id,
                        assignment.title,
                        assignment.subject,
                        assignment.user.name,
                        assignment.user.username,
                        assignment.user.email,
                        assignment.assignedReviewer?.name ?? "",
                        assignment.assignedReviewer?.username ?? "",
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(normalizedQuery);

                return matchesStatus && matchesReviewer && matchesSearch;
            })
            .map((assignment) => ({
                ...assignment,
                studentDisplay: assignment.user.name || `@${assignment.user.username}`,
                reviewerDisplay: assignment.assignedReviewer
                    ? assignment.assignedReviewer.name || `@${assignment.assignedReviewer.username}`
                    : "Not assigned",
            }));
    }, [assignments, reviewerFilter, searchQuery, statusFilter]);

    const columnDefs = useMemo<ColDef<GridRow>[]>(
        () => [
            {
                headerName: "Task",
                field: "title",
                minWidth: 220,
                flex: 1.4,
                cellRenderer: (params: { data: GridRow }) => (
                    <div className="flex h-full min-w-0 flex-col justify-center">
                        <div className="truncate font-medium text-foreground">
                            {params.data.title}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                            {params.data.subject || "General assignment"}
                        </div>
                    </div>
                ),
            },
            {
                headerName: "Student",
                field: "studentDisplay",
                minWidth: 220,
                flex: 1.25,
                cellRenderer: (params: { data: GridRow }) => (
                    <div className="flex h-full min-w-0 flex-col justify-center">
                        <div className="truncate font-medium">
                            {params.data.studentDisplay}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                            {params.data.user.email}
                        </div>
                    </div>
                ),
            },
            {
                headerName: "Status",
                field: "status",
                minWidth: 160,
                maxWidth: 180,
                filter: "agTextColumnFilter",
                cellRenderer: (params: { value: GridRow["status"] }) => (
                    <Badge
                        variant="outline"
                        className={cn(
                            "rounded-full font-normal whitespace-nowrap",
                            statusConfig[params.value]
                        )}
                    >
                        {formatStatus(params.value)}
                    </Badge>
                ),
            },
            {
                headerName: "Reviewer",
                field: "reviewerDisplay",
                minWidth: 180,
                flex: 1,
            },
            {
                headerName: "Due Date",
                field: "deliveryDeadline",
                minWidth: 150,
                filter: "agDateColumnFilter",
                valueFormatter: (params) => formatDate(params.value),
            },
            {
                headerName: "Files",
                field: "fileCount",
                minWidth: 110,
                maxWidth: 130,
                filter: "agNumberColumnFilter",
            },
            {
                headerName: "Storage",
                field: "totalFileSizeBytes",
                minWidth: 140,
                maxWidth: 160,
                filter: "agNumberColumnFilter",
                valueFormatter: (params) => formatBytes(params.value),
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
                cellRenderer: (params: { data: GridRow }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Assign reviewer</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {adminOptions.length === 0 ? (
                                <DropdownMenuItem disabled>No admins available</DropdownMenuItem>
                            ) : (
                                adminOptions.map((admin) => (
                                    <DropdownMenuItem
                                        key={admin.id}
                                        onClick={() => handleAssign(params.data.id, admin.id)}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        {admin.label}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [adminOptions]
    );

    const toolbarActions = (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-xl border bg-background px-3 text-sm text-foreground"
            >
                <option value="all">All statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under review</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In progress</option>
                <option value="awaiting-user">Awaiting user</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="archived">Archived</option>
            </select>

            <select
                value={reviewerFilter}
                onChange={(event) => setReviewerFilter(event.target.value)}
                className="h-11 rounded-xl border bg-background px-3 text-sm text-foreground"
            >
                <option value="all">All reviewers</option>
                <option value="unassigned">Not assigned</option>
                {adminOptions.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                        {admin.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <AgGridShell
            title="Assignments"
            description="Review submissions, assign reviewers, and keep the work queue organized."
            rowData={rowData}
            columnDefs={columnDefs}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by task, student, reviewer, or email"
            actions={toolbarActions}
            isLoading={isLoading}
            error={error}
            emptyMessage="No assignments found."
            csvFileName="assignments.csv"
            height={560}
        />
    );
}