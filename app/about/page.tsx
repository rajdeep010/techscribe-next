import Link from "next/link";
import { ShieldCheck, Sparkles, Target } from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { aboutPageData } from "@/lib/site-content/public-pages";

const icons = [Target, Sparkles, ShieldCheck];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                        {aboutPageData.eyebrow}
                    </Badge>
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {aboutPageData.title}
                        </h1>
                        <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                            {aboutPageData.description}
                        </p>
                    </div>

                    {/* <div className="grid gap-3 sm:grid-cols-3">
                        {aboutPageData.highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border bg-muted/20 px-4 py-4 text-sm text-muted-foreground"
                            >
                                {item}
                            </div>
                        ))}
                    </div> */}
                </section>

                <section className="mt-14 grid gap-6 md:grid-cols-3">
                    {aboutPageData.values.map((value, index) => {
                        const Icon = icons[index] || Sparkles;

                        return (
                            <Card key={value.title} className="border-border/60 shadow-sm">
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-muted/30">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">{value.title}</h2>
                                        <p className="text-sm leading-7 text-muted-foreground">
                                            {value.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="mt-14 rounded-3xl border bg-muted/20 p-8">
                    <div className="max-w-3xl space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Built for modern assignment workflows
                        </h2>
                        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                            The platform direction is already moving toward private uploads,
                            reviewer assignment, storage governance, and clearer task handling.
                            The public pages should reflect that same clarity instead of generic marketing copy.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild className="rounded-xl">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/reviews">Read Reviews</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}