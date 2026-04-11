// app/contact/page.tsx
import Link from "next/link";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactPageData, publicServices } from "@/lib/site-content/public-pages";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                        {contactPageData.eyebrow}
                    </Badge>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {contactPageData.title}
                        </h1>
                        <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                            {contactPageData.description}
                        </p>
                    </div>
                </section>

                <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-6 md:grid-cols-2">
                        {publicServices.map((service) => (
                            <Card key={service.title} className="border-border/60 shadow-sm">
                                <CardContent className="space-y-4 p-6">
                                    <h2 className="text-lg font-semibold">{service.title}</h2>
                                    <p className="text-sm leading-7 text-muted-foreground">
                                        {service.description}
                                    </p>
                                    <Button asChild variant="outline" className="rounded-xl">
                                        <Link href={service.href}>Ask About This Service</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="space-y-5 p-6">
                            <h2 className="text-lg font-semibold">Contact Channels</h2>

                            <div className="space-y-4">
                                {contactPageData.channels.map((channel) => (
                                    <div key={channel.label} className="rounded-2xl border bg-muted/20 p-4">
                                        <div className="text-sm text-muted-foreground">
                                            {channel.label}
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

                            <div className="rounded-2xl border bg-muted/20 p-4">
                                <div className="text-sm font-medium">Best reasons to contact us</div>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    {contactPageData.faqs.map((item) => (
                                        <li key={item}>{item}</li>
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