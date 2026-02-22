"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Info, Edit, Trash2, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

const assignments = [
    {
        id: 1,
        name: "Machine Learning Research Paper",
        submissionDate: "2024-02-15",
        deliveryDate: "2024-02-20",
        status: "completed",
    },
    {
        id: 2,
        name: "Database Management System Design",
        submissionDate: "2024-02-18",
        deliveryDate: "2024-02-25",
        status: "in-progress",
    },
    {
        id: 3,
        name: "Financial Analysis Report",
        submissionDate: "2024-02-10",
        deliveryDate: "2024-02-15",
        status: "completed",
    },
    {
        id: 4,
        name: "Web Development Project",
        submissionDate: "2024-02-20",
        deliveryDate: "2024-02-28",
        status: "todo",
    },
    {
        id: 5,
        name: "Data Structures Implementation",
        submissionDate: "2024-02-22",
        deliveryDate: "2024-03-01",
        status: "backlog",
    },
    {
        id: 6,
        name: "Cloud Computing Architecture",
        submissionDate: "2024-02-16",
        deliveryDate: "2024-02-21",
        status: "cancelled",
    },
    {
        id: 7,
        name: "Artificial Intelligence Project",
        submissionDate: "2024-02-25",
        deliveryDate: "2024-03-05",
        status: "in-progress",
    },
    {
        id: 8,
        name: "Network Security Analysis",
        submissionDate: "2024-02-28",
        deliveryDate: "2024-03-10",
        status: "todo",
    },
];

const statusConfig = {
    completed: {
        label: "Done",
        icon: "✓",
        class: "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
    },
    "in-progress": {
        label: "In Progress",
        icon: "○",
        class: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20",
    },
    todo: {
        label: "Todo",
        icon: "○",
        class: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20",
    },
    backlog: {
        label: "Backlog",
        icon: "?",
        class: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20",
    },
    cancelled: {
        label: "Canceled",
        icon: "⊘",
        class: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
    },
};

type SortField = "id" | "name" | "submissionDate" | "deliveryDate" | "status";
type SortOrder = "asc" | "desc";

export function AssignmentsTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [visibleColumns, setVisibleColumns] = useState({
        title: true,
        status: true,
        submission: true,
        delivery: true,
    });

    const pageSize = 5;

    const filteredAssignments = assignments.filter(
        (assignment) =>
            assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.id.toString().includes(searchQuery)
    );

    const sortedAssignments = [...filteredAssignments].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === "submissionDate" || sortField === "deliveryDate") {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        } else if (sortField === "id") {
            aValue = Number(aValue);
            bValue = Number(bValue);
        } else if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedAssignments.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentAssignments = sortedAssignments.slice(startIndex, endIndex);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <Card>
            <CardContent className="px-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-9 bg-muted/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-2">
                                    <Columns3 className="h-4 w-4" />
                                    View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.title}
                                    onCheckedChange={() => toggleColumn("title")}
                                >
                                    Title
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.status}
                                    onCheckedChange={() => toggleColumn("status")}
                                >
                                    Status
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.submission}
                                    onCheckedChange={() => toggleColumn("submission")}
                                >
                                    Submission
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={visibleColumns.delivery}
                                    onCheckedChange={() => toggleColumn("delivery")}
                                >
                                    Delivery
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="h-9 gap-2">
                            <Plus className="h-4 w-4" />
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b">
                                {visibleColumns.title && (
                                    <TableHead
                                        className="font-medium cursor-pointer select-none"
                                        onClick={() => handleSort("name")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Title
                                            {sortField === "name" && (
                                                <span className="text-xs">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.status && (
                                    <TableHead
                                        className="font-medium cursor-pointer select-none"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Status
                                            {sortField === "status" && (
                                                <span className="text-xs">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.submission && (
                                    <TableHead
                                        className="font-medium cursor-pointer select-none"
                                        onClick={() => handleSort("submissionDate")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Submission
                                            {sortField === "submissionDate" && (
                                                <span className="text-xs">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.delivery && (
                                    <TableHead
                                        className="font-medium cursor-pointer select-none"
                                        onClick={() => handleSort("deliveryDate")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Delivery
                                            {sortField === "deliveryDate" && (
                                                <span className="text-xs">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                )}
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentAssignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            No assignments found
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentAssignments.map((assignment) => (
                                    <TableRow
                                        key={assignment.id}
                                        className="border-b hover:bg-muted/30 transition-colors"
                                    >
                                        {visibleColumns.title && (
                                            <TableCell>
                                                <span className="font-medium">
                                                    {assignment.name}
                                                </span>
                                            </TableCell>
                                        )}
                                        {visibleColumns.status && (
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "gap-1.5 font-normal",
                                                        statusConfig[
                                                            assignment.status as keyof typeof statusConfig
                                                        ].class
                                                    )}
                                                >
                                                    <span>
                                                        {
                                                            statusConfig[
                                                                assignment.status as keyof typeof statusConfig
                                                            ].icon
                                                        }
                                                    </span>
                                                    {
                                                        statusConfig[
                                                            assignment.status as keyof typeof statusConfig
                                                        ].label
                                                    }
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.submission && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(assignment.submissionDate)}
                                            </TableCell>
                                        )}
                                        {visibleColumns.delivery && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(assignment.deliveryDate)}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="flex flex-col gap-0.5 px-1">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <Info className="h-4 w-4" />
                                                        Info
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            Showing {startIndex + 1} to {Math.min(endIndex, sortedAssignments.length)} of {sortedAssignments.length} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}