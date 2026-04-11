"use client";

import type { Table } from "@tanstack/react-table";
import { Columns3, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type DataGridToolbarMeta = {
    label?: string;
    excludeFromVisibility?: boolean;
};

export function DataGridToolbar<TData>({
    table,
    searchColumnId,
    searchPlaceholder = "Search...",
    actions,
}: {
    table: Table<TData>;
    searchColumnId?: string;
    searchPlaceholder?: string;
    actions?: React.ReactNode;
}) {
    const searchColumn = searchColumnId ? table.getColumn(searchColumnId) : null;
    const searchValue = (searchColumn?.getFilterValue() as string) ?? "";

    const hideableColumns = table.getAllLeafColumns().filter((column) => {
        const meta = column.columnDef.meta as DataGridToolbarMeta | undefined;
        return column.getCanHide() && !meta?.excludeFromVisibility;
    });

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                {searchColumn ? (
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchValue}
                            onChange={(event) => searchColumn.setFilterValue(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-11 rounded-xl pl-9 pr-9"
                        />
                        {searchValue ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg"
                                onClick={() => searchColumn.setFilterValue("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-11 rounded-xl">
                            <Columns3 className="mr-2 h-4 w-4" />
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        {hideableColumns.map((column) => {
                            const meta = column.columnDef.meta as DataGridToolbarMeta | undefined;
                            const label =
                                meta?.label ??
                                column.id
                                    .replace(/_/g, " ")
                                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                                    .replace(/\b\w/g, (char) => char.toUpperCase());

                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                                >
                                    {label}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {actions}
            </div>
        </div>
    );
}