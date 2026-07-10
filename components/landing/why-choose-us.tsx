import { ShieldCheck, Clock, Users, FileCheck, Sparkles, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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

const reasonImages = [
    "/help1-vert.jpg",
    "/help2-vert.jpg",
    "/help4-vert.jpg",
    "/help5-vert.jpg",
    "/happy2-horz.jpg",
    "/help7-horz.jpg",
];

export function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-background/95 px-4 py-8 shadow-[0_14px_34px_-22px_hsl(var(--primary)/0.7),0_6px_14px_-10px_hsl(var(--primary)/0.35)] sm:px-6 dark:border-primary/30 dark:bg-card/95 dark:shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.85),0_8px_18px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Why We&apos;re the #1 Assignment Help Provider</h2>
                <div className="mt-2 text-lg text-muted-foreground">
                    Trusted by over 50,000+ students worldwide for delivering excellence, every time.
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reasons.map((reason, index) => (
                    <Card
                        key={reason.title}
                        className="border-primary/15 bg-card/85 transition-shadow hover:shadow-lg dark:border-primary/25"
                    >
                        <CardContent className="space-y-3">
                            <div className="relative overflow-hidden rounded-xl">
                                <Image
                                    src={reasonImages[index % reasonImages.length]}
                                    alt={reason.title}
                                    width={720}
                                    height={450}
                                    className="h-42 w-full object-cover"
                                />
                                <div className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border backdrop-blur-sm ${index % 3 === 0
                                    ? "border-primary/25 bg-primary/20"
                                    : index % 3 === 1
                                        ? "border-emerald-500/25 bg-emerald-500/20 dark:border-emerald-400/30"
                                        : "border-cyan-500/25 bg-cyan-500/20 dark:border-cyan-400/30"
                                    }`}>
                                    <reason.icon className={`h-5 w-5 ${index % 3 === 0
                                        ? "text-primary"
                                        : index % 3 === 1
                                            ? "text-emerald-700 dark:text-emerald-300"
                                            : "text-cyan-700 dark:text-cyan-300"
                                        }`} />
                                </div>
                            </div>

                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-semibold">{reason.title}</h3>
                                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.text}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}