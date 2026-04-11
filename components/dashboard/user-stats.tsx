"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileStack,
    ListTodo,
    Mail,
    PlusCircle,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react";

import { useUser } from "@/context/UserProvider";
import { useUserAssignments } from "@/context/UserAssignmentsProvider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const statStyles = {
    total: {
        icon: FileStack,
        iconClassName: "text-sky-600 dark:text-sky-300",
        surfaceClassName: "bg-sky-50/80 dark:bg-sky-950/40",
    },
    active: {
        icon: Clock3,
        iconClassName: "text-amber-600 dark:text-amber-300",
        surfaceClassName: "bg-amber-50/80 dark:bg-amber-950/40",
    },
    completed: {
        icon: CheckCircle2,
        iconClassName: "text-emerald-600 dark:text-emerald-300",
        surfaceClassName: "bg-emerald-50/80 dark:bg-emerald-950/40",
    },
    review: {
        icon: ShieldCheck,
        iconClassName: "text-violet-600 dark:text-violet-300",
        surfaceClassName: "bg-violet-50/80 dark:bg-violet-950/40",
    },
};

function formatRole(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

export function UserProfileSection() {
    const { user } = useUser();
    const { assignments, isLoading } = useUserAssignments();

    if (!user) return null;

    const stats = useMemo(() => {
        const activeStatuses = new Set([
            "submitted",
            "under-review",
            "assigned",
            "in-progress",
            "awaiting-user",
            "delivered",
        ]);

        const reviewStatuses = new Set(["submitted", "under-review", "assigned"]);

        return {
            total: assignments.length,
            active: assignments.filter((assignment) => activeStatuses.has(assignment.status)).length,
            completed: assignments.filter((assignment) => assignment.status === "completed").length,
            review: assignments.filter((assignment) => reviewStatuses.has(assignment.status)).length,
        };
    }, [assignments]);

    const statItems = [
        {
            key: "total",
            label: "Total tasks",
            value: stats.total,
            helper: "All submitted assignments",
            ...statStyles.total,
        },
        {
            key: "active",
            label: "Active work",
            value: stats.active,
            helper: "Currently moving through the queue",
            ...statStyles.active,
        },
        {
            key: "completed",
            label: "Completed",
            value: stats.completed,
            helper: "Finished and closed assignments",
            ...statStyles.completed,
        },
        {
            key: "review",
            label: "In review flow",
            value: stats.review,
            helper: "Awaiting review or assignment",
            ...statStyles.review,
        },
    ];

    const displayName = user.name || user.username || "User";
    const avatarFallback = displayName.slice(0, 2).toUpperCase();
    const memberId = user.id ? user.id.slice(-8).toUpperCase() : "PROFILE";
    const dashboardBase = `/u/${user.username}`;

    return (
        <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm">
            <CardContent className="p-0">
                <div className="relative overflow-hidden px-6 py-8 text-slate-950 md:px-8 md:py-10 dark:text-white bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#e0f2fe_48%,#cffafe_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_26%),linear-gradient(135deg,#020617_0%,#082f49_48%,#164e63_100%)]">
                    <div className="absolute inset-0 opacity-70 dark:opacity-30">
                        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/40 blur-3xl dark:bg-white/10" />
                        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky-300/40 blur-3xl dark:bg-cyan-400/20" />
                    </div>

                    <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_360px]">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-slate-900 hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/10">
                                    User workspace
                                </Badge>
                                <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-white/75">
                                    <Sparkles className="h-4 w-4" />
                                    Central view for profile and task activity
                                </span>
                            </div>

                            <div className="flex flex-col gap-5 md:flex-row md:items-center">
                                <Avatar className="h-20 w-20 border-4 border-slate-900/10 shadow-xl dark:border-white/15">
                                    <AvatarImage src={user.avatar} alt={displayName} />
                                    <AvatarFallback className="bg-white/70 text-lg font-semibold text-slate-900 dark:bg-white/10 dark:text-white">
                                        {avatarFallback}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="truncate text-3xl font-semibold tracking-tight md:text-4xl">
                                                {displayName}
                                            </h2>
                                            <Badge className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-slate-900 hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/10">
                                                {formatRole(user.role)}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-white/75">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 dark:border-white/15 dark:bg-white/10">
                                                <UserRound className="h-4 w-4" />
                                                @{user.username}
                                            </span>
                                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 dark:border-white/15 dark:bg-white/10">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="max-w-2xl text-sm leading-7 text-slate-700 dark:text-white/75 md:text-base">
                                        Track your assignment activity, keep your submissions organized,
                                        and jump back into the task queue without digging through pages.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="h-11 rounded-xl border border-slate-900/10 bg-slate-950 text-white hover:bg-slate-900 dark:border-white/15 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
                                >
                                    <Link href={`${dashboardBase}/tasks/new`}>
                                        <PlusCircle className="h-4 w-4" />
                                        Create New Task
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-11 rounded-xl border-slate-900/10 bg-white/70 text-slate-900 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                                >
                                    <Link href={`${dashboardBase}/tasks`}>
                                        <ListTodo className="h-4 w-4" />
                                        View All Tasks
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                            <div className="rounded-3xl border border-slate-900/10 bg-white/65 p-4 backdrop-blur dark:border-white/12 dark:bg-white/10">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-white/60">
                                    Member ID
                                </div>
                                <div className="mt-3 text-lg font-semibold">{memberId}</div>
                                <div className="mt-1 text-sm text-slate-600 dark:text-white/65">
                                    Short reference from your account
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-900/10 bg-white/65 p-4 backdrop-blur dark:border-white/12 dark:bg-white/10">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-white/60">
                                    Role
                                </div>
                                <div className="mt-3 text-lg font-semibold">
                                    {formatRole(user.role)}
                                </div>
                                <div className="mt-1 text-sm text-slate-600 dark:text-white/65">
                                    Access level for this workspace
                                </div>
                            </div>

                            {/* <div className="rounded-3xl border border-slate-900/10 bg-white/65 p-4 backdrop-blur dark:border-white/12 dark:bg-white/10">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-white/60">
                                    Language
                                </div>
                                <div className="mt-3 text-lg font-semibold capitalize">
                                    {user.language || "English"}
                                </div>
                                <div className="mt-1 text-sm text-slate-600 dark:text-white/65">
                                    Current profile preference
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 border-t border-border/60 bg-background/70 p-6 md:grid-cols-2 xl:grid-cols-4">
                    {statItems.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.key}
                                className={cn(
                                    "rounded-3xl border border-border/60 p-5 transition-colors",
                                    stat.surfaceClassName
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            {stat.label}
                                        </div>
                                        <div className="text-3xl font-semibold tracking-tight">
                                            {isLoading ? "..." : stat.value}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {stat.helper}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border/60 bg-background/70 p-3 shadow-sm">
                                        <Icon className={cn("h-5 w-5", stat.iconClassName)} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-4 border-t border-border/60 p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-3xl border border-border/60 bg-muted/20 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold">Workspace snapshot</h3>
                                <p className="text-sm text-muted-foreground">
                                    A clean view of your current account and assignment activity.
                                </p>
                            </div>

                            <Button asChild variant="ghost" className="h-10 rounded-xl px-3">
                                <Link href={`${dashboardBase}/settings`}>
                                    Manage settings
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/60 bg-muted/20 p-5">
                        <div className="text-sm font-medium">Primary contact</div>
                        <div className="mt-2 break-all text-sm text-muted-foreground">
                            {user.email}
                        </div>
                        <div className="mt-4 text-sm font-medium">Username</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            @{user.username}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}