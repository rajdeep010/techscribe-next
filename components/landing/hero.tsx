import { Button } from "@/components/ui/button";
import { OrderForm } from "../common/order-form";
import { heroData } from "@/lib/template-data";

export function Hero() {
    const { eyebrow, title, description, primaryCta, secondaryCta, stats, showForm } = heroData;

    return (
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-4 sm:px-6 md:grid-cols-2 md:pt-4">
            <div className="space-y-5">
                <p className="text-sm font-medium text-primary">{eyebrow}</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
                <p className="text-muted-foreground">{description}</p>
                <div className="flex flex-wrap gap-3">
                    <Button size="lg" asChild>
                        <a href={primaryCta.href}>{primaryCta.label}</a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href={secondaryCta.href}>{secondaryCta.label}</a>
                    </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{stats.rating}</span>
                    <span>{stats.orders}</span>
                    <span>{stats.support}</span>
                </div>
            </div>

            {showForm && <OrderForm />}
        </section>
    );
}