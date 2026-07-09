import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { reviewsPageData } from "@/lib/site-content/public-pages";
import { MessageSquareQuote, Star, TrendingUp } from "lucide-react";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6 rounded-3xl border border-primary/15 bg-gradient-to-br from-cyan-500/8 via-background to-primary/8 p-6 dark:border-primary/25 dark:from-cyan-400/10 dark:to-primary/10 sm:p-8">
                    <Badge variant="outline" className="rounded-full border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
                        {reviewsPageData.eyebrow}
                    </Badge>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {reviewsPageData.title}
                        </h1>
                        <p className="text-base leading-6 text-muted-foreground sm:text-lg sm:leading-7">
                            {reviewsPageData.description}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {reviewsPageData.metrics.map((metric, index) => (
                            <Card key={metric.label} className="border-primary/20 bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-primary/30">
                                <CardContent className="p-6">
                                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary dark:border-primary/35 dark:bg-primary/15">
                                        {index === 0 ? <Star className="h-4 w-4" /> : index === 1 ? <TrendingUp className="h-4 w-4" /> : <MessageSquareQuote className="h-4 w-4" />}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {metric.label}
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold">
                                        {metric.value}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {reviewsPageData.testimonials.map((item, index) => (
                        <Card key={`${item.name}-${item.role}`} className="border-primary/20 bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-primary/30">
                            <CardContent className="space-y-5 p-6">
                                <div className="flex items-center gap-1.5 text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    <span className={index % 2 === 0 ? "text-emerald-600 dark:text-emerald-300" : "text-cyan-600 dark:text-cyan-300"}>
                                        &ldquo;
                                    </span>
                                    {item.quote}
                                    <span className={index % 2 === 0 ? "text-emerald-600 dark:text-emerald-300" : "text-cyan-600 dark:text-cyan-300"}>
                                        &rdquo;
                                    </span>
                                </p>
                                <div className="border-t pt-4">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">{item.role}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </main>
            <Footer />
        </div>
    );
}