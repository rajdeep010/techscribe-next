// app/contact/page.tsx
import Link from "next/link";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactPageData, publicServices } from "@/lib/site-content/public-pages";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone, Sparkles } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/7 via-emerald-500/8 to-cyan-500/8 p-6 dark:border-primary/25 dark:from-primary/10 dark:via-emerald-400/10 dark:to-cyan-400/10 sm:p-8">
                    <Badge variant="outline" className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {contactPageData.eyebrow}
                    </Badge>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {contactPageData.title}
                        </h1>
                        <p className="text-base leading-6 text-muted-foreground sm:text-lg sm:leading-7">
                            {contactPageData.description}
                        </p>
                    </div>
                </section>

                <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-6 md:grid-cols-2">
                        {publicServices.map((service, index) => (
                            <Card key={service.title} className="border-primary/20 bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-primary/30">
                                <CardContent className="space-y-4 p-6">
                                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${index % 3 === 0
                                        ? "border-primary/25 bg-primary/10 text-primary"
                                        : index % 3 === 1
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                                            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
                                        }`}>
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-lg font-semibold">{service.title}</h2>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {service.description}
                                    </p>
                                    <Button asChild variant="outline" className="h-11 rounded-md px-5 text-sm font-semibold">
                                        <Link href={service.href} className="inline-flex items-center gap-1.5">
                                            Ask About This Service
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-primary/20 bg-card/90 shadow-sm dark:border-primary/30">
                        <CardContent className="space-y-5 p-6">
                            <h2 className="text-lg font-semibold">Contact Channels</h2>

                            <div className="space-y-4">
                                {contactPageData.channels.map((channel, index) => (
                                    <div key={channel.label} className="rounded-2xl border border-primary/20 bg-muted/20 p-4 dark:border-primary/25">
                                        <div className="text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                {index === 0 ? <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" /> : index === 1 ? <Phone className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" /> : <MapPin className="h-3.5 w-3.5 text-primary" />}
                                                {channel.label}
                                            </span>
                                        </div>
                                        <div className="mt-1 font-medium">
                                            {channel.href === "#" ? (
                                                channel.value
                                            ) : (
                                                <a href={channel.href} className="hover:underline">
                                                    {channel.value}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                                <div className="text-sm font-medium">Best reasons to contact us</div>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    {contactPageData.faqs.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
            <Footer />
        </div>
    );
}