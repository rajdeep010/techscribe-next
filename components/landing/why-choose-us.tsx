import { ShieldCheck, Clock, Users, FileCheck, Sparkles, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
    { icon: ShieldCheck, title: "Plagiarism-Free", text: "Original work guaranteed with reports." },
    { icon: Clock, title: "On-Time Delivery", text: "Strict deadlines, always met." },
    { icon: Users, title: "Verified Experts", text: "Top-rated subject specialists." },
    { icon: FileCheck, title: "Quality Assurance", text: "Multi-step review process." },
    { icon: Sparkles, title: "Custom Solutions", text: "Tailored to your requirements." },
    { icon: Headphones, title: "24/7 Support", text: "Always here for your queries." },
];

export function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Why We’re #1 Assignment Help Provider</h2>
                <p className="text-muted-foreground">Trusted by thousands of students globally.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reasons.map((reason) => (
                    <Card key={reason.title}>
                        <CardContent className="space-y-3 p-6">
                            <reason.icon className="h-8 w-8 text-primary" />
                            <div className="text-lg font-medium">{reason.title}</div>
                            <p className="text-sm text-muted-foreground">{reason.text}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}