"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AllCommunityModule,
    ModuleRegistry,
    type ColDef,
    type GridApi,
    type GridReadyEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgGridToolbar } from "./ag-grid-toolbar";

ModuleRegistry.registerModules([AllCommunityModule]);

type ToolbarColumn = {
    id: string;
    label: string;
    visible: boolean;
    disabled?: boolean;
};

function getColumnId<TData>(columnDef: ColDef<TData>, index: number) {
    if (columnDef.colId) return columnDef.colId;
    if (typeof columnDef.field === "string" && columnDef.field.trim()) {
        return columnDef.field;
    }

    return `column-${index}`;
}

function formatColumnLabel(value: string) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getColumnLabel<TData>(columnDef: ColDef<TData>, index: number) {
    if (typeof columnDef.headerName === "string" && columnDef.headerName.trim()) {
        return columnDef.headerName;
    }

    if (typeof columnDef.field === "string" && columnDef.field.trim()) {
        return formatColumnLabel(columnDef.field);
    }

    return `Column ${index + 1}`;
}

function isColumnToggleDisabled<TData>(columnDef: ColDef<TData>) {
    return columnDef.lockVisible === true || columnDef.suppressColumnsToolPanel === true;
}

export function AgGridShell<TData>({
    title,
    description,
    rowData,
    columnDefs,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    actions,
    isLoading = false,
    error = null,
    emptyMessage = "No rows found.",
    csvFileName,
    height = 520,
    rowHeight = 56,
    headerHeight = 44,
    floatingFiltersHeight = 40,
}: {
    title: string;
    description?: string;
    rowData: TData[];
    columnDefs: ColDef<TData>[];
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    actions?: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    csvFileName?: string;
    height?: number;
    rowHeight?: number;
    headerHeight?: number;
    floatingFiltersHeight?: number;
}) {
    const gridApiRef = useRef<GridApi<TData> | null>(null);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setColumnVisibility((current) => {
            const next: Record<string, boolean> = {};

            columnDefs.forEach((columnDef, index) => {
                const columnId = getColumnId(columnDef, index);
                next[columnId] = current[columnId] ?? columnDef.hide !== true;
            });

            return next;
        });
    }, [columnDefs]);

    const applyColumnVisibility = useCallback(
        (visibility: Record<string, boolean>) => {
            const api = gridApiRef.current;
            if (!api) return;

            api.applyColumnState({
                state: columnDefs.map((columnDef, index) => {
                    const columnId = getColumnId(columnDef, index);

                    return {
                        colId: columnId,
                        hide: visibility[columnId] === false,
                    };
                }),
                applyOrder: false,
            });
        },
        [columnDefs]
    );

    const toolbarColumns = useMemo<ToolbarColumn[]>(() => {
        return columnDefs.map((columnDef, index) => {
            const columnId = getColumnId(columnDef, index);

            return {
                id: columnId,
                label: getColumnLabel(columnDef, index),
                visible: columnVisibility[columnId] ?? columnDef.hide !== true,
                disabled: isColumnToggleDisabled(columnDef),
            };
        });
    }, [columnDefs, columnVisibility]);

    const handleColumnVisibilityChange = useCallback(
        (columnId: string, visible: boolean) => {
            setColumnVisibility((current) => {
                const next = {
                    ...current,
                    [columnId]: visible,
                };

                applyColumnVisibility(next);
                return next;
            });
        },
        [applyColumnVisibility]
    );

    const handleResetColumns = useCallback(() => {
        const next: Record<string, boolean> = {};

        columnDefs.forEach((columnDef, index) => {
            const columnId = getColumnId(columnDef, index);
            next[columnId] = columnDef.hide !== true;
        });

        setColumnVisibility(next);
        applyColumnVisibility(next);
    }, [applyColumnVisibility, columnDefs]);

    const handleGridReady = useCallback(
        (event: GridReadyEvent<TData>) => {
            gridApiRef.current = event.api;

            if (searchValue.trim()) {
                event.api.setGridOption("quickFilterText", searchValue);
            }

            applyColumnVisibility(columnVisibility);
        },
        [applyColumnVisibility, columnVisibility, searchValue]
    );

    const mergedActions = useMemo(() => {
        return (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {csvFileName ? (
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl"
                        onClick={() => gridApiRef.current?.exportDataAsCsv({ fileName: csvFileName })}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                ) : null}
                {actions}
            </div>
        );
    }, [actions, csvFileName]);

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

                    <AgGridToolbar
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                        searchPlaceholder={searchPlaceholder}
                        columns={toolbarColumns}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        onResetColumns={handleResetColumns}
                        actions={mergedActions}
                    />
                </div>

                {error ? (
                    <div className="px-6 py-16 text-center text-sm text-red-600">{error}</div>
                ) : isLoading ? (
                    <div className="px-6 py-16 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                        </div>
                    </div>
                ) : (
                    <div className="px-4 py-4">
                        <div
                            className="ag-theme-quartz techscribe-ag-grid w-full overflow-hidden rounded-2xl"
                            style={{ height }}
                        >
                            <AgGridReact<TData>
                                theme="legacy"
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={{
                                    sortable: true,
                                    filter: true,
                                    floatingFilter: true,
                                    resizable: true,
                                    minWidth: 120,
                                    flex: 1,
                                    suppressHeaderMenuButton: true,
                                }}
                                rowHeight={rowHeight}
                                headerHeight={headerHeight}
                                floatingFiltersHeight={floatingFiltersHeight}
                                animateRows
                                pagination
                                paginationPageSize={8}
                                paginationPageSizeSelector={[5, 8, 12, 20]}
                                suppressCellFocus
                                suppressDragLeaveHidesColumns
                                suppressMovableColumns={false}
                                onGridReady={handleGridReady}
                                quickFilterText={searchValue}
                                overlayNoRowsTemplate={`<span class="ag-overlay-no-rows-center">${emptyMessage}</span>`}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}