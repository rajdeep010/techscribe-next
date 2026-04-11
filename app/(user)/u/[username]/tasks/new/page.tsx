"use client";

import {
    CalendarClock,
    FileStack,
    FolderUp,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { SidebarIconExample } from "@/components/dashboard/app-sidebar";
import { TaskCreateForm } from "@/components/dashboard/task-create-form";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserAssignmentsProvider } from "@/context/UserAssignmentsProvider";
import {
    formatBytes,
    MAX_ASSIGNMENT_FILES,
    MAX_ASSIGNMENT_FILE_SIZE_BYTES,
} from "@/lib/assignments/files";

const uploadRules = [
    {
        title: "File count",
        value: `Up to ${MAX_ASSIGNMENT_FILES} files`,
        description: "Keep only the most useful source material and supporting docs.",
        icon: FileStack,
    },
    {
        title: "Per file size",
        value: formatBytes(MAX_ASSIGNMENT_FILE_SIZE_BYTES),
        description: "Large files are rejected before upload, so compress where needed.",
        icon: FolderUp,
    },
    {
        title: "Editing window",
        value: "Before assignment pickup",
        description: "You can update the brief and upload more files while the task is still editable.",
        icon: ShieldCheck,
    },
];

const checklist = [
    "Put the real instructions in the description, not only inside uploaded files.",
    "Use the deadline field carefully so the queue reflects your actual delivery expectation.",
    "Once the task moves past the early review stage, editing and uploads may be locked.",
];

export default function NewTaskPage() {
    return (
        <UserAssignmentsProvider>
            <SidebarProvider>
                <SidebarIconExample />
                <SidebarInset className="min-w-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_28%)]">
                    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex min-w-0 items-center gap-3 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-semibold tracking-tight">
                                    New Task
                                </h1>
                                <p className="hidden text-xs text-muted-foreground sm:block">
                                    Create a polished submission with the right brief, deadline, and files.
                                </p>
                            </div>
                        </div>

                        <div className="px-4">
                            <ThemeToggle />
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col p-4 sm:p-6">
                        <div className="mx-auto w-full max-w-7xl space-y-6">
                            <Card className="overflow-hidden border-border/60 shadow-sm">
                                <CardContent className="p-0">
                                    <div className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-cyan-900 to-slate-900 px-6 py-8 text-white md:px-8 md:py-10">
                                        <div className="absolute inset-0 opacity-30">
                                            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                                            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                                        </div>

                                        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_380px]">
                                            <div className="space-y-5">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                                                        Assignment submission
                                                    </Badge>
                                                    <span className="inline-flex items-center gap-2 text-sm text-white/75">
                                                        <Sparkles className="h-4 w-4" />
                                                        Clear brief in, clean workflow out
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                                                        Submit a task that is easy to review
                                                    </h2>
                                                    <p className="max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                                                        Add the assignment title, instructions, deadline, and only the files
                                                        that actually matter. A tighter submission usually gets processed
                                                        faster and with fewer back-and-forth clarifications.
                                                    </p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                                                        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                                                            Max files
                                                        </div>
                                                        <div className="mt-3 text-lg font-semibold">
                                                            {MAX_ASSIGNMENT_FILES}
                                                        </div>
                                                        <div className="mt-1 text-sm text-white/65">
                                                            Keep uploads focused
                                                        </div>
                                                    </div>

                                                    <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                                                        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                                                            Per file
                                                        </div>
                                                        <div className="mt-3 text-lg font-semibold">
                                                            {formatBytes(MAX_ASSIGNMENT_FILE_SIZE_BYTES)}
                                                        </div>
                                                        <div className="mt-1 text-sm text-white/65">
                                                            Checked before upload
                                                        </div>
                                                    </div>

                                                    <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                                                        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                                                            Best practice
                                                        </div>
                                                        <div className="mt-3 text-lg font-semibold">
                                                            One complete brief
                                                        </div>
                                                        <div className="mt-1 text-sm text-white/65">
                                                            Fewer follow-ups later
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur">
                                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                                    <CalendarClock className="h-4 w-4" />
                                                    Before you submit
                                                </div>

                                                <div className="mt-4 space-y-3">
                                                    {checklist.map((item, index) => (
                                                        <div
                                                            key={item}
                                                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
                                                        >
                                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-white">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-sm leading-6 text-white/80">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
                                <div className="min-w-0">
                                    <TaskCreateForm />
                                </div>

                                <div className="space-y-6">
                                    <Card className="border-border/60 bg-card/95 shadow-sm">
                                        <CardContent className="space-y-4 p-6">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold">Upload rules</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    These are the limits applied when you attach files.
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                {uploadRules.map((rule) => (
                                                    <div
                                                        key={rule.title}
                                                        className="rounded-3xl border bg-muted/20 p-4"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="text-sm font-medium">{rule.title}</div>
                                                            <rule.icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="mt-2 text-base font-semibold">
                                                            {rule.value}
                                                        </div>
                                                        <div className="mt-1 text-sm leading-6 text-muted-foreground">
                                                            {rule.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* <Card className="border-border/60 bg-card/95 shadow-sm">
                                        <CardContent className="space-y-4 p-6">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold">Submission notes</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    A few practical rules that improve turnaround.
                                                </p>
                                            </div>

                                            <div className="space-y-3 text-sm text-muted-foreground">
                                                <div className="rounded-2xl border bg-muted/20 p-4">
                                                    Put the real instructions in the description, not only inside uploaded files.
                                                </div>
                                                <div className="rounded-2xl border bg-muted/20 p-4">
                                                    Use the deadline field carefully so the queue reflects your actual delivery expectation.
                                                </div>
                                                <div className="rounded-2xl border bg-muted/20 p-4">
                                                    Once the task moves past the early review stage, editing and uploads may be locked.
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </UserAssignmentsProvider>
    );
}