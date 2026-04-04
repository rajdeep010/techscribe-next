import { ShieldCheck, Clock, Users, FileCheck, Sparkles, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
    {
        icon: ShieldCheck,
        title: "100% Plagiarism-Free",
        text: "Every assignment is crafted from scratch with original research. We provide detailed plagiarism reports from trusted tools to ensure authenticity and academic integrity."
    },
    {
        icon: Clock,
        title: "On-Time Delivery",
        text: "We understand the importance of deadlines. Our experts work efficiently to deliver your assignments well before the due date, giving you time for revisions if needed."
    },
    {
        icon: Users,
        title: "Verified Subject Experts",
        text: "Our team consists of PhD holders, researchers, and industry professionals with proven expertise in their fields. Each expert is verified and rated by students."
    },
    {
        icon: FileCheck,
        title: "Multi-Level Quality Assurance",
        text: "Every assignment goes through rigorous quality checks including proofreading, formatting, and accuracy verification to ensure it meets the highest academic standards."
    },
    {
        icon: Sparkles,
        title: "Customized Solutions",
        text: "No generic templates. Each assignment is tailored to your specific requirements, guidelines, and academic level. We follow your university's formatting and citation style."
    },
    {
        icon: Headphones,
        title: "24/7 Customer Support",
        text: "Our dedicated support team is available round the clock to answer your queries, provide updates, and assist you at every step of the process via chat, email, or phone."
    },
];

export function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Why We're the #1 Assignment Help Provider</h2>
                <div className="mt-2 text-lg text-muted-foreground">
                    Trusted by over 50,000+ students worldwide for delivering excellence, every time.
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reasons.map((reason) => (
                    <Card key={reason.title} className="transition-shadow hover:shadow-lg">
                        <CardContent className="space-y-3 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <reason.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">{reason.title}</h3>
                            <div className="text-sm leading-relaxed text-muted-foreground">{reason.text}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}