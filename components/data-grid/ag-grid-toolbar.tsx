"use client";

import { Columns3, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type ToolbarColumn = {
    id: string;
    label: string;
    visible: boolean;
    disabled?: boolean;
};

export function AgGridToolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    columns = [],
    onColumnVisibilityChange,
    onResetColumns,
    actions,
}: {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    columns?: ToolbarColumn[];
    onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
    onResetColumns?: () => void;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="h-11 rounded-xl pr-9 pl-9"
                    />
                    {searchValue ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-lg"
                            onClick={() => onSearchChange("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {columns.length > 0 ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" className="h-11 rounded-xl">
                                <Columns3 className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {columns.map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.visible}
                                    disabled={column.disabled}
                                    onCheckedChange={(checked) =>
                                        onColumnVisibilityChange?.(column.id, checked === true)
                                    }
                                >
                                    {column.label}
                                </DropdownMenuCheckboxItem>
                            ))}

                            {onResetColumns ? (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onResetColumns}>
                                        Reset columns
                                    </DropdownMenuItem>
                                </>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}

                {actions}
            </div>
        </div>
    );
}