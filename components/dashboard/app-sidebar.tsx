"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
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
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    ListTodo,
    MessagesSquare,
    Users,
    Star,
    Info,
    LifeBuoy,
    Settings,
    UserCircle,
    ChevronsUpDownIcon,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useUser } from "@/context/UserProvider";

export function SidebarIconExample() {
    const { user } = useUser();

    if (!user) return null;

    const userDashboardUrl = `/u/${user.username}`;

    const data = {
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar || "https://github.com/shadcn.png",
        },
        workspace: [
            {
                title: "Dashboard",
                url: userDashboardUrl,
                icon: <LayoutDashboard className="h-6 w-6" />,
            },
            {
                title: "Tasks",
                url: `/u/${user.username}/tasks`,
                icon: <ListTodo className="h-6 w-6" />,
            },
            {
                title: "Queries",
                url: `/u/${user.username}/queries`,
                icon: <MessagesSquare className="h-6 w-6" />,
            },
        ],
        techscribe: [
            {
                title: "Experts",
                url: "/#experts",
                icon: <Users className="h-6 w-6" />,
            },
            {
                title: "Reviews",
                url: "/reviews",
                icon: <Star className="h-6 w-6" />,
            },
            {
                title: "About Us",
                url: "/about",
                icon: <Info className="h-6 w-6" />,
            },
        ],
        settings: [
            {
                title: "Help & Support",
                url: `/u/${user.username}/help`,
                icon: <LifeBuoy className="h-6 w-6" />,
            },
            {
                title: "Settings",
                url: `/u/${user.username}/settings`,
                icon: <Settings className="h-6 w-6" />,
            },
        ],
    };

    return (
        <>
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
                                        <span className="truncate font-bold text-xl">
                                            TechScribe
                                        </span>
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
                        <SidebarMenu className="mt-2 flex flex-col gap-2">
                            {data.workspace.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span className="text-md">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>TechScribe</SidebarGroupLabel>
                        <SidebarMenu className="mt-2 flex flex-col gap-2">
                            {data.techscribe.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span className="text-md">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Support & Settings</SidebarGroupLabel>
                        <SidebarMenu className="mt-2 flex flex-col gap-2">
                            {data.settings.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span className="text-md">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
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
                                            <AvatarImage
                                                src={data.user.avatar}
                                                alt={data.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                {data.user.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {data.user.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {data.user.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDownIcon />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            <Item size="xs">
                                                <ItemMedia>
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={data.user.avatar}
                                                            alt={data.user.name}
                                                        />
                                                        <AvatarFallback>
                                                            {data.user.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>{data.user.name}</ItemTitle>
                                                    <ItemDescription>{data.user.email}</ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href={userDashboardUrl}>
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
        </>
    );
}