import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 sm:px-6 md:grid-cols-2 md:pt-16">
            <div className="space-y-5">
                <p className="text-sm font-medium text-primary">Trusted Assignment Help</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Professional Assignment Assistance for Students Worldwide
                </h1>
                <p className="text-muted-foreground">
                    Work with verified experts, get on-time delivery, and achieve top grades with
                    tailored academic support.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button size="lg">Get Free Quote</Button>
                    <Button size="lg" variant="outline">View Samples</Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>⭐ 4.9/5</span>
                    <span>20k+ Orders Completed</span>
                    <span>24/7 Support</span>
                </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-6 text-center text-muted-foreground">
                <div className="text-sm uppercase tracking-wide">Form Section</div>
                <div className="mt-2 text-lg font-medium text-foreground">Request a Quote</div>
                <div className="mt-4 h-48 rounded-lg border border-dashed bg-background" />
            </div>
        </section>
    );
}