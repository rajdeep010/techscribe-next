"use client";

import Link from "next/link";
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, BRAND_NAME } from "@/components/common/logo";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { publicServices } from "@/lib/site-content/public-pages";

const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Experts", href: "/experts" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blogs" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const isSignupPage = pathname === "/signup";

    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center" aria-label={`${BRAND_NAME} home`}>
                    <Logo showText={false} markClassName="h-11 w-11 text-xl" />
                </Link>

                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-1">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[360px] gap-1 p-2">
                                        {publicServices.map((item) => (
                                            <li key={item.title}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={item.href}
                                                        className="block rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium">
                                                            {item.title}
                                                        </div>
                                                        {/* <div className="mt-1 text-xs text-muted-foreground">
                                                            {item.description}
                                                        </div> */}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {primaryLinks.map((item) => (
                                <NavigationMenuItem key={item.label}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    {isLoginPage && (
                        <>
                            <span className="text-sm text-muted-foreground">Don&apos;t have an account?</span>
                            <Button className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                                <Link href="/signup" className="inline-flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up
                                </Link>
                            </Button>
                        </>
                    )}
                    {isSignupPage && (
                        <>
                            <span className="text-sm text-muted-foreground">Already have an account?</span>
                            <Button className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                                <Link href="/login" className="inline-flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                        </>
                    )}
                    {!isLoginPage && !isSignupPage && (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Button variant="ghost" className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                                        <Link
                                            href={
                                                session?.user?.username
                                                    ? session.user.role === "admin"
                                                        ? `/admin/${session.user.username}`
                                                        : `/u/${session.user.username}`
                                                    : "/"
                                            }
                                            className="inline-flex items-center gap-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button className="h-11 rounded-md px-5 text-sm font-semibold" variant="default" onClick={() => signOut({ callbackUrl: "/" })}>
                                        <span className="inline-flex items-center gap-2">
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                                        <Link href="/login" className="inline-flex items-center gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                                        <Link href="/contact" className="inline-flex items-center gap-2">
                                            Get Free Brief Check
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] px-6 py-4 sm:w-[400px]">
                            <SheetTitle className="flex items-center">
                                <Logo showText={false} markClassName="h-11 w-11 text-xl" />
                                <span className="sr-only">{BRAND_NAME}</span>
                            </SheetTitle>

                            <nav className="mt-8 flex flex-col gap-4">
                                {publicServices.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="text-base font-medium transition-colors hover:text-primary"
                                    >
                                        {item.title}
                                    </Link>
                                ))}

                                {primaryLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-base font-medium transition-colors hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="flex flex-col gap-2 border-t pt-6">
                                    {isAuthenticated ? (
                                        <>
                                            <Button variant="outline" className="h-11 w-full rounded-md text-sm font-semibold" asChild>
                                                <Link
                                                    href={
                                                        session?.user?.username
                                                            ? session.user.role === "admin"
                                                                ? `/admin/${session.user.username}`
                                                                : `/u/${session.user.username}`
                                                            : "/"
                                                    }
                                                    className="inline-flex items-center justify-center gap-2"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </Button>
                                            <Button
                                                className="h-11 w-full rounded-md text-sm font-semibold"
                                                variant="outline"
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </span>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="h-11 w-full rounded-md text-sm font-semibold" asChild>
                                                <Link href="/login" className="inline-flex items-center justify-center gap-2">
                                                    <LogIn className="h-4 w-4" />
                                                    Sign In
                                                </Link>
                                            </Button>
                                            <Button className="h-11 w-full rounded-md text-sm font-semibold" asChild>
                                                <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                                                    Get Free Brief Check
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}