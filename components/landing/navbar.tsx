"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const resourceLinks = [
    { label: "Blog", href: "/blogs" },
    { label: "Reviews", href: "/reviews" },
    { label: "Experts", href: "/experts" },
];

const primaryLinks = [
    { label: "Experts", href: "/experts" },
    { label: "Reviews", href: "/reviews" },
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
                <Link href="/" className="text-xl font-bold tracking-tight">
                    TechScribe
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

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[240px] gap-1 p-2">
                                        {resourceLinks.map((item) => (
                                            <li key={item.label}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={item.href}
                                                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        {item.label}
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
                            <span className="text-sm text-muted-foreground">Don't have an account?</span>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                    {isSignupPage && (
                        <>
                            <span className="text-sm text-muted-foreground">Already have an account?</span>
                            <Button asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </>
                    )}
                    {!isLoginPage && !isSignupPage && (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link
                                            href={
                                                session?.user?.username
                                                    ? session.user.role === "admin"
                                                        ? `/admin/${session.user.username}`
                                                        : `/u/${session.user.username}`
                                                    : "/"
                                            }
                                        >
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button variant="default" onClick={() => signOut({ callbackUrl: "/" })}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/signup">Get Started</Link>
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
                            <SheetTitle>TechScribe</SheetTitle>

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

                                {resourceLinks.map((item) => (
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
                                            <Button variant="outline" className="w-full" asChild>
                                                <Link
                                                    href={
                                                        session?.user?.username
                                                            ? session.user.role === "admin"
                                                                ? `/admin/${session.user.username}`
                                                                : `/u/${session.user.username}`
                                                            : "/"
                                                    }
                                                >
                                                    Dashboard
                                                </Link>
                                            </Button>
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="w-full" asChild>
                                                <Link href="/login">Sign In</Link>
                                            </Button>
                                            <Button className="w-full" asChild>
                                                <Link href="/signup">Get Started</Link>
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