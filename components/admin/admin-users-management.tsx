"use client";

import { useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Crown,
    Loader2,
    RefreshCw,
    Search,
    ShieldCheck,
    UserCheck,
    UserRound,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers } from "@/context/AdminUsersProvider";
import { AdminUserListItem } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value));
}

function getDisplayName(user: AdminUserListItem) {
    return user.name?.trim() || `@${user.username}`;
}

const roleStyles = {
    admin: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    user: "border-slate-500/20 bg-slate-500/10 text-slate-700",
};

const verificationStyles = {
    verified: "border-sky-500/20 bg-sky-500/10 text-sky-700",
    unverified: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

export function AdminUsersManagement() {
    const {
        users,
        isLoading,
        error,
        searchQuery,
        roleFilter,
        verificationFilter,
        promotingUserId,
        fetchUsers,
        promoteUser,
        setSearchQuery,
        setRoleFilter,
        setVerificationFilter,
    } = useAdminUsers();

    const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch = !query
                ? true
                : [
                    user.name,
                    user.username,
                    user.email,
                    user.location,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;

            const matchesVerification =
                verificationFilter === "all"
                    ? true
                    : verificationFilter === "verified"
                        ? user.isVerified
                        : !user.isVerified;

            return matchesSearch && matchesRole && matchesVerification;
        });
    }, [users, searchQuery, roleFilter, verificationFilter]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            admins: users.filter((user) => user.role === "admin").length,
            verified: users.filter((user) => user.isVerified).length,
            unverified: users.filter((user) => !user.isVerified).length,
        };
    }, [users]);

    async function handlePromote() {
        if (!selectedUser) return;

        const result = await promoteUser(selectedUser.id);

        if (result.success) {
            toast.success(result.message || "User promoted successfully");
            setSelectedUser(null);
            return;
        }

        toast.error(result.message || "Failed to promote user");
    }

    return (
        <>
            <div className="flex min-h-0 flex-1 flex-col gap-6">
                <Card className="overflow-hidden border-border/60 shadow-sm">
                    <div className="bg-linear-to-r from-sky-500/15 via-cyan-500/10 to-emerald-500/15 px-8 py-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
                                    <Users className="h-4 w-4" />
                                    User Administration
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight">
                                    Manage platform users and access roles
                                </h2>
                                <p className="max-w-2xl text-sm text-muted-foreground">
                                    Review registered users, check verification state, and promote trusted
                                    members to admin with confirmation.
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Access note
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    Role promotion is permanent until you build a separate demotion flow.
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Total Users</div>
                                <div className="mt-2 text-3xl font-semibold">{stats.total}</div>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Admins</div>
                                <div className="mt-2 text-3xl font-semibold">{stats.admins}</div>
                            </div>
                            <Crown className="h-8 w-8 text-emerald-600" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Verified</div>
                                <div className="mt-2 text-3xl font-semibold">{stats.verified}</div>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-sky-600" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <div className="text-sm text-muted-foreground">Unverified</div>
                                <div className="mt-2 text-3xl font-semibold">{stats.unverified}</div>
                            </div>
                            <AlertCircle className="h-8 w-8 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="flex min-h-0 flex-1 flex-col border-border/60 shadow-sm">
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">All Users</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Search, filter, and promote eligible users to admin.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                                <div className="relative flex min-w-[280px]">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search by name, username, or email"
                                        className="h-11 rounded-xl pl-9"
                                    />
                                </div>

                                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | "admin" | "user")}>
                                    <SelectTrigger className="h-11 w-[160px] rounded-xl">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        <SelectItem value="user">Users</SelectItem>
                                        <SelectItem value="admin">Admins</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={verificationFilter}
                                    onValueChange={(value) =>
                                        setVerificationFilter(value as "all" | "verified" | "unverified")
                                    }
                                >
                                    <SelectTrigger className="h-11 w-[180px] rounded-xl">
                                        <SelectValue placeholder="Verification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="verified">Verified</SelectItem>
                                        <SelectItem value="unverified">Unverified</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-xl"
                                    onClick={() => void fetchUsers()}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                Loading users...
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-600">
                                {error}
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="rounded-2xl border border-dashed p-10 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No users found for the current filters.
                                </p>
                            </div>
                        ) : (
                            <div className="min-h-0 flex-1 overflow-auto rounded-2xl border support-scrollbar">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-4">User</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Verification</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="pr-4 text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => {
                                            const isPromoting = promotingUserId === user.id;
                                            const canPromote = user.role === "user";

                                            return (
                                                <TableRow key={user.id}>
                                                    <TableCell className="pl-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 border">
                                                                <AvatarImage src={user.avatar} alt={getDisplayName(user)} />
                                                                <AvatarFallback>
                                                                    {getDisplayName(user).slice(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <div className="truncate font-medium">
                                                                    {getDisplayName(user)}
                                                                </div>
                                                                <div className="truncate text-xs text-muted-foreground">
                                                                    {user.location || "No location added"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>@{user.username}</TableCell>
                                                    <TableCell className="max-w-[220px] truncate">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={roleStyles[user.role]}
                                                        >
                                                            {user.role === "admin" ? "Admin" : "User"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                user.isVerified
                                                                    ? verificationStyles.verified
                                                                    : verificationStyles.unverified
                                                            }
                                                        >
                                                            {user.isVerified ? "Verified" : "Unverified"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                                    <TableCell className="pr-4 text-right">
                                                        {canPromote ? (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="rounded-lg"
                                                                disabled={isPromoting}
                                                                onClick={() => setSelectedUser(user)}
                                                            >
                                                                {isPromoting ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Promoting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                                                        Make Admin
                                                                    </>
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                className="rounded-lg"
                                                                disabled
                                                            >
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Already Admin
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia>
                            <Crown className="h-5 w-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Promote user to admin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser ? (
                                <>
                                    <span className="font-medium text-foreground">
                                        {getDisplayName(selectedUser)}
                                    </span>{" "}
                                    will gain admin access and be able to manage users, support, and
                                    protected admin pages.
                                </>
                            ) : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedUser(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => void handlePromote()}
                            disabled={!selectedUser || promotingUserId === selectedUser?.id}
                        >
                            {promotingUserId === selectedUser?.id ? "Promoting..." : "Confirm Promotion"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}