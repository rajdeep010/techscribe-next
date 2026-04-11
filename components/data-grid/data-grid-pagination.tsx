"use client";

import type { Table } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function DataGridPagination<TData>({
    table,
    pageSizeOptions = [5, 10, 20],
}: {
    table: Table<TData>;
    pageSizeOptions?: number[];
}) {
    const filteredCount = table.getFilteredRowModel().rows.length;
    const {
        pageIndex,
        pageSize,
    } = table.getState().pagination;

    return (
        <div className="flex flex-col gap-4 border-t px-6 py-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <div>
                Showing{" "}
                {filteredCount === 0
                    ? 0
                    : pageIndex * pageSize + 1}{" "}
                to{" "}
                {Math.min((pageIndex + 1) * pageSize, filteredCount)}{" "}
                of {filteredCount} result{filteredCount === 1 ? "" : "s"}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                        value={pageSize}
                        onChange={(event) => table.setPageSize(Number(event.target.value))}
                        className="h-9 rounded-lg border bg-background px-3 text-sm text-foreground"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span>
                        Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(Math.max(0, table.getPageCount() - 1))}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}