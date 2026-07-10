import { Button } from "@/components/ui/button";
import { OrderForm } from "../common/order-form";
import { heroData } from "@/lib/template-data";
import { ArrowRight, Clock3, MessageCircle, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

export function Hero() {
    const { eyebrow, title, description, primaryCta, secondaryCta, stats, showForm } = heroData;
    const titleParts = title.split("Assignment Help");

    return (
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-4 sm:px-6 md:grid-cols-2 md:pt-4">
            <div className="space-y-5">
                <div className="text-sm font-medium text-primary">{eyebrow}</div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    {titleParts.length === 2 ? (
                        <>
                            {titleParts[0]}
                            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300">
                                Assignment Help
                            </span>
                            {titleParts[1]}
                        </>
                    ) : (
                        title
                    )}
                </h1>
                <div className="text-muted-foreground">{description}</div>
                <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                        <Link href={primaryCta.href} className="inline-flex items-center gap-2">
                            {primaryCta.label}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-11 rounded-md px-5 text-sm font-semibold" asChild>
                        <Link href={secondaryCta.href} className="inline-flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            {secondaryCta.label}
                        </Link>
                    </Button>
                </div>
                <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{stats.rating}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                        <span className="text-foreground">{stats.orders}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                        <span className="text-foreground">{stats.support}</span>
                    </li>
                </ul>
            </div>

            {showForm && <OrderForm />}
        </section>
    );
}