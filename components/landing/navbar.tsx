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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/theme-toggle-button";


export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="text-lg font-semibold">
                    TechScribe
                </Link>

                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid md:w-[320px]">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block">
                                                    Assignment Help
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block">
                                                    Proofreading
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block">
                                                    Tutoring
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="text-sm font-medium">
                                        Experts
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="text-sm font-medium">
                                        Reviews
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="text-sm font-medium">
                                        About Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className="text-sm font-medium">
                                        Contact Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid md:w-[240px]">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block">
                                                    Blog
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link href="#" className="block">
                                                    Samples
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="outline">Sign In</Button>
                    <Button>Get Started</Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="space-y-4">
                            <Link href="#" className="block text-sm font-medium">Services</Link>
                            <Link href="#" className="block text-sm font-medium">Experts</Link>
                            <Link href="#" className="block text-sm font-medium">Reviews</Link>
                            <Link href="#" className="block text-sm font-medium">About Us</Link>
                            <Link href="#" className="block text-sm font-medium">Contact Us</Link>
                            <Link href="#" className="block text-sm font-medium">Blog</Link>
                            <Link href="#" className="block text-sm font-medium">Samples</Link>
                            <div className="flex gap-2 pt-4">
                                <Button variant="outline" className="w-full">Sign In</Button>
                                <Button className="w-full">Get Started</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}