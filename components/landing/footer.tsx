import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Resources", href: "/blogs" },
    { label: "Experts", href: "/experts" },
    { label: "Reviews", href: "/reviews" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];

const ourServices = [
    { label: "Assignment Help", href: "/contact?service=assignment-help" },
    { label: "Research & Reports", href: "/contact?service=research-reports" },
    { label: "Dissertation Help", href: "/contact?service=dissertation-help" },
    { label: "Presentation (PPT)", href: "/contact?service=presentation" },
    { label: "Referencing", href: "/contact?service=referencing" },
    { label: "Editing & Proofreading", href: "/contact?service=editing-proofreading" },
];

const support = [
    { label: "Help Center", href: "/contact" },
    { label: "FAQs", href: "/#faq" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Refund Policy", href: "#" },
];

export function Footer() {
    return (
        <footer className="relative z-10 border-t bg-muted/50 pointer-events-auto">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center">
                            <Logo />
                        </Link>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Trusted academic support for international students. We help you achieve your
                            academic goals with confidence.
                        </div>
                        <div className="mt-5 flex items-center gap-3">
                            <Link href="#" className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-primary">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-primary">
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-primary">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="rounded-full border p-2 text-muted-foreground transition-colors hover:text-primary">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Our Services</h3>
                        <ul className="space-y-2 text-sm">
                            {ourServices.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2 text-sm">
                            {support.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
                    <div className="lg:col-span-2">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <MessageCircle className="h-4 w-4 shrink-0" />
                                <span>WhatsApp: {CONTACT_INFO.whatsappDisplay}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>{CONTACT_INFO.supportEmail}</span>
                            </div>
                            <div className="text-xs">Working Hours: {CONTACT_INFO.workingHours}</div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:text-right">
                        <div className="text-sm font-semibold">Excellent</div>
                        <div className="mt-1 flex items-center gap-1 text-yellow-500 lg:justify-end">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} aria-hidden className="text-base leading-none">★</span>
                            ))}
                            <span className="ml-1 text-sm text-muted-foreground">4.8 / 5</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Based on 1,200+ reviews</div>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Assignment Consultants. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
