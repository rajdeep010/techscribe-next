"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    ChevronsUpDownIcon,
    Info,
    LayoutDashboard,
    LifeBuoy,
    ListTodo,
    LogOut,
    MessagesSquare,
    PlusCircle,
    Settings,
    Shield,
    Star,
    UserCircle,
    Users,
} from "lucide-react";

import { useUser } from "@/context/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

function matchesPrefix(pathname: string, target: string) {
    return pathname === target || pathname.startsWith(`${target}/`);
}

export function SidebarIconExample() {
    const { user } = useUser();
    const pathname = usePathname();

    if (!user) return null;

    const dashboardBase = `/u/${user.username}`;
    const tasksBase = `/u/${user.username}/tasks`;

    const workspace = [
        {
            title: "Dashboard",
            url: dashboardBase,
            icon: <LayoutDashboard className="h-6 w-6" />,
            isActive: pathname === dashboardBase,
        },
        {
            title: "Tasks",
            url: tasksBase,
            icon: <ListTodo className="h-6 w-6" />,
            isActive:
                pathname === tasksBase ||
                (pathname.startsWith(`${tasksBase}/`) && pathname !== `${tasksBase}/new`),
        },
        {
            title: "New Task",
            url: `${tasksBase}/new`,
            icon: <PlusCircle className="h-6 w-6" />,
            isActive: pathname === `${tasksBase}/new`,
        },
        {
            title: "Queries",
            url: `/u/${user.username}/queries`,
            icon: <MessagesSquare className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, `/u/${user.username}/queries`),
        },
    ];

    const publicResources = [
        {
            title: "Experts",
            url: "/experts",
            icon: <Users className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, "/experts"),
        },
        {
            title: "Reviews",
            url: "/reviews",
            icon: <Star className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, "/reviews"),
        },
        {
            title: "About Us",
            url: "/about",
            icon: <Info className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, "/about"),
        },
    ];

    const settings = [
        {
            title: "Help & Support",
            url: `/u/${user.username}/help`,
            icon: <LifeBuoy className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, `/u/${user.username}/help`),
        },
        {
            title: "Security",
            url: `/u/${user.username}/security`,
            icon: <Shield className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, `/u/${user.username}/security`),
        },
        {
            title: "Settings",
            url: `/u/${user.username}/settings`,
            icon: <Settings className="h-6 w-6" />,
            isActive: matchesPrefix(pathname, `/u/${user.username}/settings`),
        },
    ];

    function matchesPrefix(pathname: string, target: string) {
        return pathname === target || pathname.startsWith(`${target}/`);
    }

    const avatarSrc = user.avatar || "https://github.com/shadcn.png";

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <Button size="icon-sm" asChild className="size-8">
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 256 256"
                                        >
                                            <rect width="256" height="256" fill="none" />
                                            <line
                                                x1="208"
                                                y1="128"
                                                x2="128"
                                                y2="208"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="32"
                                            />
                                            <line
                                                x1="192"
                                                y1="40"
                                                x2="40"
                                                y2="192"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="32"
                                            />
                                        </svg>
                                    </span>
                                </Button>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-xl font-bold">MyAssignmentHelp</span>
                                    <span className="text-xs text-muted-foreground">
                                        User panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-2 gap-2">
                            {workspace.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive}
                                    >
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Public Resources</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-2 gap-2">
                            {publicResources.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Support & Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-2 gap-2">
                            {settings.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive}
                                    >
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                                >
                                    <Avatar>
                                        <AvatarImage src={avatarSrc} alt={user.name} />
                                        <AvatarFallback className="rounded-lg">
                                            {user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>

                                    <ChevronsUpDownIcon className="h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        <Item size="xs">
                                            <ItemMedia>
                                                <Avatar>
                                                    <AvatarImage src={avatarSrc} alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle>{user.name}</ItemTitle>
                                                <ItemDescription>{user.email}</ItemDescription>
                                            </ItemContent>
                                        </Item>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={dashboardBase}>
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Account
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href={`/u/${user.username}/settings`}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}