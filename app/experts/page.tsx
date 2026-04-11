// app/experts/page.tsx
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { expertsPageData } from "@/lib/site-content/public-pages";

export default function ExpertsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                <section className="space-y-6">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                        {expertsPageData.eyebrow}
                    </Badge>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            {expertsPageData.title}
                        </h1>
                        <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                            {expertsPageData.description}
                        </p>
                    </div>

                    {/* <div className="grid gap-3 sm:grid-cols-3">
                        {expertsPageData.highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border bg-muted/20 px-4 py-4 text-sm text-muted-foreground"
                            >
                                {item}
                            </div>
                        ))}
                    </div> */}
                </section>

                <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {expertsPageData.experts.map((expert) => (
                        <Card key={expert.name} className="border-border/60 shadow-sm">
                            <CardContent className="space-y-5 p-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={expert.image} alt={expert.name} />
                                        <AvatarFallback>
                                            {expert.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold">
                                            {expert.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {expert.profession}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm leading-7 text-muted-foreground">
                                    {expert.about}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border bg-muted/20 p-4">
                                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Orders
                                        </div>
                                        <div className="mt-1 font-semibold">{expert.orders}</div>
                                    </div>
                                    <div className="rounded-2xl border bg-muted/20 p-4">
                                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Rating
                                        </div>
                                        <div className="mt-1 font-semibold">{expert.rating}</div>
                                    </div>
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