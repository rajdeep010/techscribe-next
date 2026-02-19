import { BookOpen, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
    {
        icon: BookOpen,
        title: "Fill Out Order Form",
        text: "Share your requirements in minutes.",
    },
    {
        icon: CreditCard,
        title: "Make Payment",
        text: "Secure checkout with multiple options.",
    },
    {
        icon: CheckCircle2,
        title: "Get Complete Work",
        text: "Receive polished work on time.",
    },
];

export function HowItWorks() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">How Our Assignment Service Works</h2>
                <p className="text-muted-foreground">Fast, simple, and transparent from start to finish.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step) => (
                    <Card key={step.title}>
                        <CardContent className="space-y-3 p-6">
                            <step.icon className="h-8 w-8 text-primary" />
                            <div className="text-lg font-medium">{step.title}</div>
                            <p className="text-sm text-muted-foreground">{step.text}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-6">
                <Button size="lg">Book a Service</Button>
            </div>
        </section>
    );
}