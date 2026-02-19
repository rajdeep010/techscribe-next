import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Navbar() {
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
                        <NavigationMenuIndicator />
                        <NavigationMenuViewport />
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost">Sign In</Button>
                    <Button>Get Started</Button>
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
                                <div className="flex flex-col gap-2 pt-6 border-t">
                                    <Button variant="outline" className="w-full">Sign In</Button>
                                    <Button className="w-full">Get Started</Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}