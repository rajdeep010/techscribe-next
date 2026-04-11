"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { Eye, MoreHorizontal, Plus, PlusCircleIcon } from "lucide-react";

import type { AssignmentListItem } from "@/lib/types";
import { useUser } from "@/context/UserProvider";
import { useUserAssignments } from "@/context/UserAssignmentsProvider";
import { formatBytes } from "@/lib/assignments/files";
import { cn } from "@/lib/utils";
import { AgGridShell } from "@/components/data-grid/ag-grid-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

type GridRow = AssignmentListItem;

export function AssignmentsTable() {
    const { user } = useUser();
    const {
        assignments,
        isLoading,
        error,
        searchQuery,
        fetchAssignments,
        setSearchQuery,
    } = useUserAssignments();

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const rowData = useMemo<GridRow[]>(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return assignments.filter((assignment) => {
            if (!normalizedQuery) return true;

            return [
                assignment.id,
                assignment.title,
                assignment.subject,
                assignment.description,
                assignment.assignedReviewer?.name ?? "",
                assignment.assignedReviewer?.username ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedQuery);
        });
    }, [assignments, searchQuery]);

    const columnDefs = useMemo<ColDef<GridRow>[]>(
        () => [
            {
                headerName: "Task",
                field: "title",
                minWidth: 240,
                flex: 1.4,
                cellRenderer: (params: { data: GridRow }) => (
                    <div className="flex h-full min-w-0 flex-col justify-center py-2">
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
                headerName: "Due Date",
                field: "deliveryDeadline",
                minWidth: 150,
                valueFormatter: (params) => formatDate(params.value),
                filter: "agDateColumnFilter",
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
                headerName: "Reviewer",
                field: "assignedReviewer",
                minWidth: 180,
                flex: 1,
                valueGetter: (params) => {
                    const assignment = params.data

                    if (!assignment?.assignedReviewer) {
                        return "Not assigned"
                    }

                    return (
                        assignment.assignedReviewer.name ||
                        `@${assignment.assignedReviewer.username}`
                    )
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
                cellRenderer: (params: { data: GridRow }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/u/${user?.username}/tasks/${params.data.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Open task
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [user?.username]
    );

    const toolbarActions = (
        <Button asChild className="h-11 rounded-xl px-5">
            <Link href={`/u/${user?.username}/tasks/new`}>
                <PlusCircleIcon className="h-4 w-4" />
                Add Task
            </Link>
        </Button>
    );

    return (
        <AgGridShell
            title="Your Tasks"
            description="Track submitted assignments, uploaded files, and reviewer status."
            rowData={rowData}
            columnDefs={columnDefs}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search your tasks"
            actions={toolbarActions}
            isLoading={isLoading}
            error={error}
            emptyMessage="No tasks found."
            csvFileName="my-tasks.csv"
            height={520}
        />
    );
}