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
                                    <ul className="grid w-[320px] gap-1 p-2">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    Assignment Help
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    Proofreading
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    Tutoring
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[240px] gap-1 p-2">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    Blog
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    Samples
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        Experts
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        Reviews
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        About Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                        Contact Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center gap-2">
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
                                        >Dashboard</Link>
                                    </Button>
                                    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
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

                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] px-6 py-4">
                            {/* <VisuallyHidden> */}
                            <SheetTitle>TechScribe</SheetTitle>
                            {/* </VisuallyHidden> */}
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Services
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Experts
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Reviews
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    About Us
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Contact Us
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Blog
                                </Link>
                                <Link href="#" className="text-base font-medium transition-colors hover:text-primary">
                                    Samples
                                </Link>
                                {/* <div className="flex flex-col gap-2 pt-6 border-t">
                                    <Button variant="outline" className="w-full">Sign In</Button>
                                    <Button className="w-full">Get Started</Button>
                                </div> */}

                                <div className="flex flex-col gap-2 pt-6 border-t">
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