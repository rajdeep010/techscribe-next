"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataGridPagination } from "./data-grid-pagination";
import { DataGridToolbar } from "./data-grid-toolbar";

export function DataGrid<TData, TValue>({
    columns,
    data,
    title,
    description,
    searchColumnId,
    searchPlaceholder,
    toolbarActions,
    isLoading = false,
    error = null,
    emptyMessage = "No results found.",
    hiddenColumnIds = [],
    initialPageSize = 8,
    tableClassName,
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    title: string;
    description?: string;
    searchColumnId?: string;
    searchPlaceholder?: string;
    toolbarActions?: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    hiddenColumnIds?: string[];
    initialPageSize?: number;
    tableClassName?: string;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() =>
        Object.fromEntries(hiddenColumnIds.map((id) => [id, false]))
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        initialState: {
            pagination: {
                pageSize: initialPageSize,
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const columnCount = table.getVisibleLeafColumns().length || 1;

    return (
        <Card className="min-w-0 overflow-hidden border-border/60 bg-card/95 shadow-sm">
            <CardContent className="min-w-0 p-0">
                <div className="border-b p-6">
                    <div className="mb-5 space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                        {description ? (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        ) : null}
                    </div>

                    <DataGridToolbar
                        table={table}
                        searchColumnId={searchColumnId}
                        searchPlaceholder={searchPlaceholder}
                        actions={toolbarActions}
                    />
                </div>

                <div className="min-w-0">
                    <Table className={cn("table-auto", tableClassName)}>
                        <TableHeader className="bg-muted/30">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        const meta = header.column.columnDef.meta as
                                            | { headerClassName?: string }
                                            | undefined;

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn("h-12 px-4", meta?.headerClassName)}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columnCount} className="py-16 text-center">
                                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columnCount}
                                        className="py-16 text-center text-sm text-red-600"
                                    >
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-muted/20">
                                        {row.getVisibleCells().map((cell) => {
                                            const meta = cell.column.columnDef.meta as
                                                | { cellClassName?: string }
                                                | undefined;

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn("px-4 py-4", meta?.cellClassName)}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columnCount}
                                        className="py-16 text-center text-sm text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataGridPagination table={table} />
            </CardContent>
        </Card>
    );
}