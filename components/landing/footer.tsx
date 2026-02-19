import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
                    {/* Programming Help */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Programming Help
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    C++ Assignment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Java Assignment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Python Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    JavaScript Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    C# Assignment
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Academic Subjects */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Academic Subjects
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Math Assignment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Physics Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Chemistry Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Biology Assignment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Statistics Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business & Management */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Business Help
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    MBA Assignment
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Finance Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Accounting Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Marketing Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Economics Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Writing Services */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Writing Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Essay Writing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Research Paper
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Dissertation Help
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Thesis Writing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Case Study Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Our Experts
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Reviews
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                    DMCA Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Info & Payment Section */}
                <div className="mt-12 grid gap-8 border-t pt-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Contact Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Contact Us
                        </h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                                <div>
                                    <p>support@techscribe.com</p>
                                    <p>info@techscribe.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                                <div>
                                    <p>+1 (555) 123-4567</p>
                                    <p>+44 20 1234 5678</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                                <p>123 Academic Street, Education City, ED 12345</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Payment Methods
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                VISA
                            </div>
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                Mastercard
                            </div>
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                PayPal
                            </div>
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                Amex
                            </div>
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                GPay
                            </div>
                            <div className="rounded border bg-background px-3 py-2 text-xs font-medium">
                                UPI
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            All payments are secured with SSL encryption
                        </p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            Follow Us
                        </h3>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            Join our community of 50,000+ students
                        </p>
                    </div>
                </div>

                {/* Bottom Bar - Copyright */}
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} TechScribe. All rights reserved.</p>
                    <p className="mt-1">
                        Trusted by students worldwide for academic excellence since 2020.
                    </p>
                </div>
            </div>
        </footer>
    );
}