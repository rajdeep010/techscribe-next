import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { reviewsPageData } from "@/lib/site-content/public-pages";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                        {reviewsPageData.eyebrow}
                    </Badge>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {reviewsPageData.title}
                        </h1>
                        <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                            {reviewsPageData.description}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {reviewsPageData.metrics.map((metric) => (
                            <Card key={metric.label} className="border-border/60 shadow-sm">
                                <CardContent className="p-6">
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
                    {reviewsPageData.testimonials.map((item) => (
                        <Card key={`${item.name}-${item.role}`} className="border-border/60 shadow-sm">
                            <CardContent className="space-y-5 p-6">
                                <p className="text-sm leading-7 text-muted-foreground">
                                    "{item.quote}"
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