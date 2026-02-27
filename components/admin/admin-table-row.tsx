"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    GripVertical,
    MoreHorizontal,
    Edit,
    Copy,
    UserPlus,
    Trash2,
} from "lucide-react";
import { DocumentRow, ColumnDef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TableRowProps {
    document: DocumentRow;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    visibleColumns: ColumnDef[];
}

const STATUS_COLORS = {
    Done: "bg-green-500/10 text-green-600 border-green-500/20",
    "In Progress": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Pending: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const;

export function TableRow({ document, isSelected, onToggleSelect, visibleColumns }: TableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: document.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderCell = (columnId: string) => {
        switch (columnId) {
            case "header":
                return <div className="font-medium text-sm truncate">{document.header}</div>;
            case "sectionType":
                return (
                    <Badge variant="outline" className="font-normal">
                        {document.sectionType}
                    </Badge>
                );
            case "status":
                return (
                    <Badge variant="outline" className={STATUS_COLORS[document.status]}>
                        {document.status}
                    </Badge>
                );
            case "target":
                return <div className="text-sm text-muted-foreground">{document.target}</div>;
            case "limit":
                return <div className="text-sm text-muted-foreground">{document.limit}</div>;
            case "reviewer":
                return (
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground truncate">
                            {document.reviewer}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Assign
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-4 border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors",
                isDragging && "opacity-50"
            )}
        >
            <div className="flex items-center gap-3 w-[60px]">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(document.id)}
                />
            </div>

            <div className="flex-1 grid gap-4 items-center" style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
                {visibleColumns.map((column) => (
                    <div key={column.id} className="min-w-0">
                        {renderCell(column.id)}
                    </div>
                ))}
            </div>
        </div>
    );
}