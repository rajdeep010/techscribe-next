import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Target } from "lucide-react";

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
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-emerald-500/8 to-cyan-500/8 p-6 dark:border-primary/30 dark:from-primary/12 dark:via-emerald-400/10 dark:to-cyan-400/10 sm:p-8">
                    <Badge variant="outline" className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
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
                        const accent =
                            index % 3 === 0
                                ? "border-primary/25 bg-primary/10 text-primary"
                                : index % 3 === 1
                                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                                    : "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300";

                        return (
                            <Card key={value.title} className="border-primary/20 bg-card/90 shadow-sm dark:border-primary/25">
                                <CardContent className="space-y-4 p-6">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${accent}`}>
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

                <section className="mt-14 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-background to-primary/8 p-8 dark:border-cyan-400/30 dark:from-cyan-400/10 dark:to-primary/10">
                    <div className="max-w-3xl space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Built for modern assignment workflows
                        </h2>
                        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                            The platform direction is already moving toward private uploads,
                            reviewer assignment, storage governance, and clearer task handling.
                            The public pages should reflect that same clarity instead of generic marketing copy.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2 relative z-50">
                            <Button asChild className="h-11 rounded-md px-5 text-sm font-semibold">
                                <Link href="/contact" className="inline-flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Contact Us
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-11 rounded-md px-5 text-sm font-semibold">
                                <Link href="/reviews" className="inline-flex items-center gap-2">
                                    Read Reviews
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}