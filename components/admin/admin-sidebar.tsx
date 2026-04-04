"use client";

import * as React from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Users,
    UserCheck,
    Database,
    Bell,
    Shield,
    Settings,
    HelpCircle,
    LogOut,
    UserCircle,
    ChevronsUpDown,
} from "lucide-react";
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
import { useUser } from "@/context/UserProvider";
import { signOut } from "next-auth/react";



export function AdminSidebar() {
    const { user } = useUser();
    if (!user) return null;

    const mainMenu = [
        {
            title: "Dashboard",
            url: `/u/${user.username}`,
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            title: "Analytics",
            url: `/u/${user.username}/analytics`,
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            title: "Audit Logs",
            url: `/u/${user.username}/audit`,
            icon: <FileText className="h-5 w-5" />,
        },
    ];

    const adminMenu = [
        {
            title: "Users",
            url: `/u/${user.username}/users`,
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: "Experts",
            url: `/u/${user.username}/experts`,
            icon: <UserCheck className="h-5 w-5" />,
        },
        {
            title: "Data Library",
            url: `/u/${user.username}/data-library`,
            icon: <Database className="h-5 w-5" />,
        },
        {
            title: "Notifications",
            url: `/u/${user.username}/notifications`,
            icon: <Bell className="h-5 w-5" />,
        },
        {
            title: "Security",
            url: `/u/${user.username}/security`,
            icon: <Shield className="h-5 w-5" />,
        },
    ];

    const settingsMenu = [
        {
            title: "Settings",
            url: `/u/${user.username}/settings`, // Make sure it uses this format
            icon: <Settings className="h-5 w-5" />,
        },
        {
            title: "Help & Support",
            url: `/u/${user.username}/help`,
            icon: <HelpCircle className="h-5 w-5" />,
        },
    ];

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
                                            <rect width="256" height="256" fill="none"></rect>
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
                                            ></line>
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
                                            ></line>
                                        </svg>
                                    </span>
                                </Button>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-xl">
                                        TechScribe
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {mainMenu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
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
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {adminMenu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
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
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {settingsMenu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
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
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg">
                                            {user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user.email}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <Item size="sm">
                                        <ItemMedia>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
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
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/u/${user.username}`}>
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
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}