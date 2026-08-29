"use client";

import { useState } from "react";
import type { ColDef, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AgGridShell } from "@/components/data-grid/ag-grid-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AuditAction =
    | "revenue.created"
    | "revenue.updated"
    | "revenue.deleted"
    | "manual-assignment.created"
    | "manual-assignment.updated"
    | "manual-assignment.deleted";

export type AuditLogRow = {
    id: string;
    action: AuditAction;
    summary: string;
    performedByName: string;
    recordId: string | null;
    createdAt: string;
};

type GridRow = {
    id: string;
    reference: string;
    type: "Revenue" | "Manual Assignment";
    subtype: "create" | "edit" | "delete";
    summary: string;
    user: string;
    timestamp: number;
};

const typeStyles: Record<GridRow["type"], string> = {
    Revenue: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    "Manual Assignment": "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
};

const subtypeStyles: Record<GridRow["subtype"], string> = {
    create: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
    edit: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    delete: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
};

const subtypeLabels: Record<GridRow["subtype"], string> = {
    create: "Created",
    edit: "Edited",
    delete: "Deleted",
};

function toType(action: AuditAction): GridRow["type"] {
    return action.startsWith("revenue.") ? "Revenue" : "Manual Assignment";
}

function toSubtype(action: AuditAction): GridRow["subtype"] {
    if (action.endsWith(".created")) return "create";
    if (action.endsWith(".updated")) return "edit";
    return "delete";
}

function toReference(recordId: string | null) {
    if (!recordId) return "—";
    return `#${recordId.slice(-6).toUpperCase()}`;
}

function formatDateTime(value: number) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function AdminAuditTable({ logs, isLoading }: { logs: AuditLogRow[]; isLoading?: boolean }) {
    const [searchValue, setSearchValue] = useState("");

    const rowData: GridRow[] = logs.map((log) => ({
        id: log.id,
        reference: toReference(log.recordId),
        type: toType(log.action),
        subtype: toSubtype(log.action),
        summary: log.summary,
        user: log.performedByName,
        timestamp: new Date(log.createdAt).getTime(),
    }));

    const columnDefs: ColDef<GridRow>[] = [
        {
            headerName: "Ref",
            field: "reference",
            minWidth: 100,
            maxWidth: 120,
            filter: "agTextColumnFilter",
            cellRenderer: (params: ICellRendererParams<GridRow, string>) => (
                <span className="font-mono text-xs text-muted-foreground">{params.value}</span>
            ),
        },
        {
            headerName: "Type",
            field: "type",
            minWidth: 150,
            maxWidth: 180,
            filter: "agTextColumnFilter",
            cellRenderer: (params: ICellRendererParams<GridRow, GridRow["type"]>) => (
                <Badge variant="outline" className={cn("rounded-full font-normal", typeStyles[params.value!])}>
                    {params.value}
                </Badge>
            ),
        },
        {
            headerName: "Action",
            field: "subtype",
            minWidth: 110,
            maxWidth: 130,
            filter: "agTextColumnFilter",
            cellRenderer: (params: ICellRendererParams<GridRow, GridRow["subtype"]>) => (
                <Badge variant="outline" className={cn("rounded-full font-normal", subtypeStyles[params.value!])}>
                    {subtypeLabels[params.value!]}
                </Badge>
            ),
        },
        {
            headerName: "Summary",
            field: "summary",
            flex: 3,
            minWidth: 360,
            wrapText: true,
            autoHeight: true,
            cellClass: "audit-summary-cell",
            cellStyle: { whiteSpace: "normal", lineHeight: "1.5", paddingTop: "10px", paddingBottom: "10px" },
        },
        {
            headerName: "Performed By",
            field: "user",
            minWidth: 160,
            maxWidth: 200,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Date",
            field: "timestamp",
            minWidth: 190,
            maxWidth: 210,
            sort: "desc",
            filter: "agDateColumnFilter",
            valueFormatter: (params: ValueFormatterParams<GridRow, number>) =>
                params.value ? formatDateTime(params.value) : "",
        },
    ];

    return (
        <AgGridShell<GridRow>
            title="Audit Log"
            description="Every revenue and manual-assignment entry that's created, edited, or deleted — grouped by reference so you can trace a record's full history."
            rowData={rowData}
            columnDefs={columnDefs}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search summary, user..."
            isLoading={isLoading}
            emptyMessage="No audit log entries yet."
            csvFileName="audit-log.csv"
            rowHeight={64}
            height={560}
        />
    );
}
