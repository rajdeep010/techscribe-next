"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, Plus } from "lucide-react";
import { DocumentRow, ColumnDef } from "@/lib/types";
import { defaultColumns } from "@/lib/template-data";
import { TableRow } from "./admin-table-row";


interface AdminDataTableProps {
    documents: DocumentRow[];
}

export function AdminDataTable({ documents: initialDocuments }: AdminDataTableProps) {
    const [documents, setDocuments] = useState(initialDocuments);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [columns, setColumns] = useState<ColumnDef[]>(defaultColumns);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const visibleColumns = columns.filter((col) => col.visible);
    const allSelected = selectedRows.length === documents.length && documents.length > 0;

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setDocuments((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    function toggleColumn(columnId: string) {
        setColumns((prev) =>
            prev.map((col) =>
                col.id === columnId ? { ...col, visible: !col.visible } : col
            )
        );
    }

    function toggleRowSelection(id: string) {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }

    function toggleAllRows() {
        setSelectedRows((prev) =>
            prev.length === documents.length ? [] : documents.map((doc) => doc.id)
        );
    }

    return (
        <Card className="px-4 py-8">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-bold text-xl">Tasks list</h2>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="whitespace-nowrap">
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Customize Columns</span>
                                    <span className="sm:hidden">Columns</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5 text-sm font-semibold">Toggle columns</div>
                                {columns.map((column) => (
                                    <DropdownMenuItem
                                        key={column.id}
                                        className="flex items-center gap-2"
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            toggleColumn(column.id);
                                        }}
                                    >
                                        <Checkbox
                                            checked={column.visible}
                                            onCheckedChange={() => toggleColumn(column.id)}
                                            className="pointer-events-none"
                                        />
                                        <span>{column.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="whitespace-nowrap">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add Section</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <div className="overflow-x-auto">
                <CardContent className="p-0 min-w-[800px]">
                    {/* Table Header */}
                    <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-3 w-[60px]">
                            <div className="w-6" />
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={toggleAllRows}
                                aria-label="Select all"
                            />
                        </div>
                        <div className="flex-1 grid gap-4" style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
                            {visibleColumns.map((column) => (
                                <div key={column.id} className="truncate">
                                    {column.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Body */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div suppressHydrationWarning>
                            <SortableContext
                                items={documents.map((doc) => doc.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {documents.slice(0, parseInt(rowsPerPage)).map((document) => (
                                    <TableRow
                                        key={document.id}
                                        document={document}
                                        isSelected={selectedRows.includes(document.id)}
                                        onToggleSelect={toggleRowSelection}
                                        visibleColumns={visibleColumns}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </DndContext>

                    {/* Table Footer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border px-4 py-3">
                        <div className="text-sm text-muted-foreground">
                            {selectedRows.length} of {documents.length} row(s) selected.
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                                <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                                    <SelectTrigger className="h-8 w-16">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    Page 1 of {Math.ceil(documents.length / parseInt(rowsPerPage))}
                                </span>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                                        «
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                                        ‹
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        ›
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        »
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}