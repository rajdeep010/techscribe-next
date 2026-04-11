"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DataGridColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: {
    column: Column<TData, TValue>;
    title: string;
    className?: string;
}) {
    if (!column.getCanSort()) {
        return <div className={cn("truncate font-medium", className)}>{title}</div>;
    }

    const sorted = column.getIsSorted();

    return (
        <Button
            type="button"
            variant="ghost"
            className={cn("h-8 px-2 text-sm font-medium hover:bg-muted/60", className)}
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            <span className="truncate">{title}</span>
            {sorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : sorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    );
}