"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AuditLog, AuditSubtype, ColumnVisibility } from "@/lib/types";
import { ArrowUpDown, SlidersHorizontal, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface AuditTableProps {
    logs: AuditLog[];
}

const subtypeColors = {
    create: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    edit: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    delete: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function AuditTable({ logs }: AuditTableProps) {
    const [search, setSearch] = useState("");
    const [selectedSubtypes, setSelectedSubtypes] = useState<AuditSubtype[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [sortField, setSortField] = useState<keyof AuditLog | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
        id: true,
        type: true,
        subtype: true,
        value: true,
        user: true,
        time: true,
    });

    // Get unique users for filter
    const uniqueUsers = useMemo(() => {
        return Array.from(new Set(logs.map((log) => log.user)));
    }, [logs]);

    // Filter and sort logs
    const filteredLogs = useMemo(() => {
        let filtered = logs.filter((log) => {
            const matchesSearch =
                search === "" ||
                Object.values(log).some((value) =>
                    value.toString().toLowerCase().includes(search.toLowerCase())
                );

            const matchesSubtype =
                selectedSubtypes.length === 0 ||
                selectedSubtypes.includes(log.subtype);

            const matchesUser =
                selectedUsers.length === 0 || selectedUsers.includes(log.user);

            return matchesSearch && matchesSubtype && matchesUser;
        });

        // Sort
        if (sortField) {
            filtered.sort((a: any, b: any) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (sortField === "timestamp") {
                    return sortDirection === "asc"
                        ? aValue - bValue
                        : bValue - aValue;
                }

                const comparison =
                    aValue.toString().localeCompare(bValue.toString());
                return sortDirection === "asc" ? comparison : -comparison;
            });
        }

        return filtered;
    }, [logs, search, selectedSubtypes, selectedUsers, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredLogs.slice(startIndex, startIndex + pageSize);
    }, [filteredLogs, currentPage, pageSize]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [search, selectedSubtypes, selectedUsers]);

    const handleSort = (field: keyof AuditLog) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const toggleSubtype = (subtype: AuditSubtype) => {
        setSelectedSubtypes((prev) =>
            prev.includes(subtype)
                ? prev.filter((s) => s !== subtype)
                : [...prev, subtype]
        );
    };

    const toggleUser = (user: string) => {
        setSelectedUsers((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    const resetFilters = () => {
        setSearch("");
        setSelectedSubtypes([]);
        setSelectedUsers([]);
    };

    const hasActiveFilters =
        search !== "" || selectedSubtypes.length > 0 || selectedUsers.length > 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: string) => {
        setPageSize(Number(size));
        setCurrentPage(1);
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                {/* Filters Bar */}
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Filter logs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* Subtype Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Subtype
                                {selectedSubtypes.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                                        {selectedSubtypes.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Subtype</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(["create", "edit", "delete"] as AuditSubtype[]).map(
                                (subtype) => (
                                    <DropdownMenuCheckboxItem
                                        key={subtype}
                                        checked={selectedSubtypes.includes(subtype)}
                                        onCheckedChange={() => toggleSubtype(subtype)}
                                    >
                                        <Badge
                                            variant="outline"
                                            className={cn("capitalize", subtypeColors[subtype])}
                                        >
                                            {subtype}
                                        </Badge>
                                    </DropdownMenuCheckboxItem>
                                )
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                User
                                {selectedUsers.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                                        {selectedUsers.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                            <DropdownMenuLabel>Filter by User</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {uniqueUsers.map((user) => (
                                <DropdownMenuCheckboxItem
                                    key={user}
                                    checked={selectedUsers.includes(user)}
                                    onCheckedChange={() => toggleUser(user)}
                                >
                                    {user}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}

                    {/* Column Visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.entries(columnVisibility).map(([key, value]) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={value}
                                    onCheckedChange={(checked) =>
                                        setColumnVisibility((prev) => ({
                                            ...prev,
                                            [key]: checked,
                                        }))
                                    }
                                    className="capitalize"
                                >
                                    {key}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columnVisibility.id && (
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("id")}
                                            className="-ml-4"
                                        >
                                            ID
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                )}
                                {columnVisibility.type && (
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("type")}
                                            className="-ml-4"
                                        >
                                            Type
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                )}
                                {columnVisibility.subtype && (
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("subtype")}
                                            className="-ml-4"
                                        >
                                            Subtype
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                )}
                                {columnVisibility.value && <TableHead>Value</TableHead>}
                                {columnVisibility.user && (
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("user")}
                                            className="-ml-4"
                                        >
                                            User
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                )}
                                {columnVisibility.time && (
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("timestamp")}
                                            className="-ml-4"
                                        >
                                            Time
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            Object.values(columnVisibility).filter(Boolean)
                                                .length
                                        }
                                        className="h-24 text-center"
                                    >
                                        No audit logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedLogs.map((log, idx) => (
                                    <TableRow key={idx}>
                                        {columnVisibility.id && (
                                            <TableCell className="font-medium">
                                                {log.id}
                                            </TableCell>
                                        )}
                                        {columnVisibility.type && (
                                            <TableCell>
                                                <Badge variant="outline">{log.type}</Badge>
                                            </TableCell>
                                        )}
                                        {columnVisibility.subtype && (
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "capitalize",
                                                        subtypeColors[log.subtype]
                                                    )}
                                                >
                                                    {log.subtype}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {columnVisibility.value && (
                                            <TableCell className="max-w-md truncate">
                                                {log.value}
                                            </TableCell>
                                        )}
                                        {columnVisibility.user && (
                                            <TableCell>{log.user}</TableCell>
                                        )}
                                        {columnVisibility.time && (
                                            <TableCell className="text-muted-foreground">
                                                {log.time}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination and Results Count */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">
                            {filteredLogs.length === 0
                                ? 0
                                : (currentPage - 1) * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {Math.min(currentPage * pageSize, filteredLogs.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredLogs.length}</span> audit
                        logs
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page</span>
                            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}