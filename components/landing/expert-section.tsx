import Image from "next/image";
import { ArrowRight, Award, ShieldCheck, Star, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { expertsData } from "@/lib/template-data";
import Link from "next/link";



export function ExpertsSection() {
    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-background/95 px-4 py-8 shadow-[0_14px_34px_-22px_hsl(var(--primary)/0.7),0_6px_14px_-10px_hsl(var(--primary)/0.35)] sm:px-6 dark:border-primary/30 dark:bg-card/95 dark:shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.85),0_8px_18px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Top Assignment Experts</h2>
                    <div className="text-muted-foreground">
                        Work with specialists from top universities worldwide.
                    </div>
                </div>
                <Button variant="outline" className="hidden h-11 rounded-md px-5 text-sm font-semibold sm:inline-flex" asChild>
                    <Link href="/experts" className="inline-flex items-center gap-2">
                        View All Experts
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {expertsData.map((expert, index) => (
                    <Card key={expert.name} className="overflow-hidden border-primary/20 bg-card/90 dark:border-primary/25">
                        <CardHeader className="flex flex-row gap-4 items-center">
                            <Image
                                src={expert.image}
                                alt={expert.name}
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
                            <div>
                                <div className="font-semibold">{expert.name}</div>
                                <div className="text-sm text-muted-foreground">{expert.profession}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${index % 2 === 0
                                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300"
                                }`}>
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Verified Expert
                            </div>
                            <div className="text-sm text-muted-foreground">{expert.about}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{expert.rating}</span>
                                <span className="text-muted-foreground">• {expert.orders} orders</span>
                                <Award className="ml-auto h-4 w-4 text-primary" />
                            </div>
                            <Button className="h-11 w-full rounded-md text-sm font-semibold" asChild>
                                <Link href={`/contact?expert=${encodeURIComponent(expert.name)}`} className="inline-flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Hire Expert
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}