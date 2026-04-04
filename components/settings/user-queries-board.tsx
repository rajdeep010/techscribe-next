"use client";

import { useMemo } from "react";
import {
	AlertCircle,
	CheckCircle2,
	Clock3,
	Inbox,
	Loader2,
	RefreshCw,
	Search,
	ShieldCheck,
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
import { useUserSupport } from "@/context/UserSupportProvider";

const statusStyles: Record<SupportTicketStatus, string> = {
	open: "border-amber-500/20 bg-amber-500/10 text-amber-700",
	"in-progress": "border-sky-500/20 bg-sky-500/10 text-sky-700",
	resolved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
};

const statusLabels: Record<SupportTicketStatus, string> = {
	open: "Open",
	"in-progress": "In Review",
	resolved: "Resolved",
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

export default function UserQueriesBoard() {
	const {
		tickets,
		isLoading,
		error,
		searchQuery,
		statusFilter,
		resolvingTicketId,
		setSearchQuery,
		setStatusFilter,
		fetchTickets,
		resolveTicket,
	} = useUserSupport();

	const filteredTickets = useMemo(() => {
		return tickets.filter((ticket) => {
			const matchesStatus =
				statusFilter === "all" ? true : ticket.status === statusFilter;

			const query = searchQuery.trim().toLowerCase();
			const matchesSearch = !query
				? true
				: [
					ticket.subject,
					ticket.message,
					ticket.category,
					ticket.status,
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
			<Card className="overflow-hidden border-border/60 shadow-sm">
				<div className="bg-linear-to-r from-sky-500/15 via-cyan-500/10 to-emerald-500/15 px-8 py-8">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-2">
							<div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
								<Inbox className="h-4 w-4" />
								My Queries
							</div>
							<h2 className="text-3xl font-semibold tracking-tight">
								Track your support requests
							</h2>
							<p className="max-w-2xl text-sm text-muted-foreground">
								Review every query you have submitted, check its current status,
								and mark it resolved once the issue is fully handled.
							</p>
						</div>

						<div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
							<div className="text-xs uppercase tracking-wide text-muted-foreground">
								Important
							</div>
							<div className="mt-1 text-xs text-muted-foreground">
								You can close your own queries, but you cannot edit the original
								subject, category, or message after submission.
							</div>
						</div>
					</div>
				</div>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<Card className="border-border/60 shadow-sm">
					<CardContent className="flex items-center justify-between p-5">
						<div>
							<div className="text-sm text-muted-foreground">Total Queries</div>
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
							<div className="text-sm text-muted-foreground">In Review</div>
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
							<h3 className="text-xl font-semibold tracking-tight">
								Support Query History
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Search through your previous tickets and update only the final
								resolution state.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="relative flex min-w-[280px]">
								<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Search by subject, message, or category"
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
									<SelectItem value="in-progress">In Review</SelectItem>
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
							Loading your queries...
						</div>
					) : error ? (
						<div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-600">
							{error}
						</div>
					) : filteredTickets.length === 0 ? (
						<div className="rounded-2xl border border-dashed p-10 text-center">
							<p className="text-sm text-muted-foreground">
								No queries found for the current filters.
							</p>
						</div>
					) : (
						<div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2 support-scrollbar">
							{filteredTickets.map((ticket) => {
								const isResolved = ticket.status === "resolved";
								const isResolving = resolvingTicketId === ticket.id;

								return (
									<div
										key={ticket.id}
										className="rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20"
									>
										<div className="flex flex-col gap-5">
											<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
												<div className="space-y-3">
													<div className="flex flex-wrap items-center gap-2">
														<h4 className="text-lg font-semibold">
															{ticket.subject}
														</h4>

														<Badge
															variant="outline"
															className={statusStyles[ticket.status]}
														>
															{statusLabels[ticket.status]}
														</Badge>

														<Badge variant="secondary">
															{categoryLabels[ticket.category] ?? ticket.category}
														</Badge>
													</div>

													<p className="max-w-3xl text-sm leading-7 text-muted-foreground">
														{ticket.message}
													</p>
												</div>

												<div className="flex shrink-0">
													<Button
														type="button"
														disabled={isResolved || isResolving}
														className="h-10 rounded-xl"
														onClick={() => void resolveTicket(ticket.id)}
													>
														{isResolving ? (
															<>
																<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																Closing...
															</>
														) : isResolved ? (
															<>
																<CheckCircle2 className="mr-2 h-4 w-4" />
																Resolved
															</>
														) : (
															<>
																<ShieldCheck className="mr-2 h-4 w-4" />
																Mark as Resolved
															</>
														)}
													</Button>
												</div>
											</div>

											<div className="flex flex-col gap-2 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
												<span>Submitted: {formatDate(ticket.createdAt)}</span>
												<span>Last updated: {formatDate(ticket.updatedAt)}</span>
												<span>Ticket ID: {ticket.id.slice(-8).toUpperCase()}</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}