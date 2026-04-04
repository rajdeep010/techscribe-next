"use client";

import { useMemo } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Inbox,
    Mail,
    RefreshCw,
    Search,
    UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SupportTicketStatus } from "@/lib/types";
import { useAdminSupport } from "@/context/AdminProvider";

const statusStyles: Record<SupportTicketStatus, string> = {
    open: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    "in-progress": "bg-sky-500/10 text-sky-700 border-sky-500/20",
    resolved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};

const categoryLabels: Record<string, string> = {
    general: "General",
    billing: "Billing",
    technical: "Technical",
    account: "Account",
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function AdminSupportCenter() {
    const {
        tickets,
        isLoading,
        error,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        fetchTickets,
    } = useAdminSupport();

    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesStatus =
                statusFilter === "all" ? true : ticket.status === statusFilter;

            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = !query
                ? true
                : [
                    ticket.subject,
                    ticket.username,
                    ticket.email,
                    ticket.message,
                    ticket.category,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [tickets, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: tickets.length,
            open: tickets.filter((ticket) => ticket.status === "open").length,
            inProgress: tickets.filter((ticket) => ticket.status === "in-progress").length,
            resolved: tickets.filter((ticket) => ticket.status === "resolved").length,
        };
    }, [tickets]);

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-border/60 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <div className="text-sm text-muted-foreground">Total Tickets</div>
                            <div className="mt-2 text-3xl font-semibold">{stats.total}</div>
                        </div>
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <div className="text-sm text-muted-foreground">Open</div>
                            <div className="mt-2 text-3xl font-semibold">{stats.open}</div>
                        </div>
                        <AlertCircle className="h-8 w-8 text-amber-600" />
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <div className="text-sm text-muted-foreground">In Progress</div>
                            <div className="mt-2 text-3xl font-semibold">{stats.inProgress}</div>
                        </div>
                        <Clock3 className="h-8 w-8 text-sky-600" />
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <div className="text-sm text-muted-foreground">Resolved</div>
                            <div className="mt-2 text-3xl font-semibold">{stats.resolved}</div>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </CardContent>
                </Card>
            </div>

            <Card className="flex min-h-0 flex-1 flex-col border-border/60 shadow-sm">
                <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Support Inbox
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review support requests submitted by users.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex min-w-[280px]">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search by subject, user, or message"
                                    className="h-11 rounded-xl pl-9"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) =>
                                    setStatusFilter(value as "all" | SupportTicketStatus)
                                }
                            >
                                <SelectTrigger className="h-11 w-[180px] rounded-xl">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl"
                                onClick={() => void fetchTickets()}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                            Loading support tickets...
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-600">
                            {error}
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-10 text-center">
                            <p className="text-sm text-muted-foreground">
                                No support tickets found for the current filters.
                            </p>
                        </div>
                    ) : (
                        <div className="min-h-0 flex-1 space-y-4 max-h-[20rem] overflow-y-auto pr-2 support-scrollbar">
                            {filteredTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                                                <Badge
                                                    variant="outline"
                                                    className={statusStyles[ticket.status]}
                                                >
                                                    {ticket.status}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {categoryLabels[ticket.category] ?? ticket.category}
                                                </Badge>
                                            </div>

                                            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                                                {ticket.message}
                                            </p>
                                        </div>

                                        <div className="grid gap-2 text-sm text-muted-foreground lg:min-w-[250px]">
                                            <div className="flex items-center gap-2">
                                                <UserRound className="h-4 w-4" />
                                                <span>@{ticket.username}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                <span>{ticket.email}</span>
                                            </div>
                                            <div>Submitted: {formatDate(ticket.createdAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}