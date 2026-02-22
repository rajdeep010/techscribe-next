"use client"

import * as React from "react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { LayoutDashboard, BookOpen, Users, MessageSquare, Info, PhoneCall, HelpCircle, Settings, UserCircle, CreditCard, ChevronsUpDownIcon, LogOut } from "lucide-react"
import { ThemeToggle } from "../common/theme-toggle-button"
import { UserProfileSection } from "./user-stats"
import { AssignmentsTable } from "./assignment-table"
import Link from "next/link"

export function SidebarIconExample() {
    const data = {
        user: {
            name: "techscribe",
            email: "techscribe@example.com",
            avatar: "/avatars/techscribe.jpg",
        },
        mainMenu: [
            {
                title: "Dashboard",
                url: "#",
                icon: <LayoutDashboard className="h-6 w-6" />,
            },
            {
                title: "Services",
                url: "#",
                icon: <BookOpen className="h-6 w-6" />,
            },
            {
                title: "Experts",
                url: "#",
                icon: <Users className="h-6 w-6" />,
            },
            {
                title: "Reviews",
                url: "#",
                icon: <MessageSquare className="h-6 w-6" />,
            },
            {
                title: "About Us",
                url: "#",
                icon: <Info className="h-6 w-6"/>,
            },
        ],
        settings: [
            {
                title: "Help & Support",
                url: "#",
                icon: <HelpCircle className="h-6 w-6" />,
            },
            {
                title: "Settings",
                url: "#",
                icon: <Settings className="h-6 w-6" />,
            },
        ],
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={'/'}>
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
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                        <SidebarMenu className="flex flex-col gap-2 mt-2">
                            {data.mainMenu.map((item) => (
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
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>
                        <SidebarMenu className="flex flex-col gap-2 mt-2">
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
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
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
                                                        <AvatarFallback>CN</AvatarFallback>
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
                                        <DropdownMenuItem>
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
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
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-6">
                    <UserProfileSection />
                    <AssignmentsTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}