"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
    CheckCircle2,
    ChevronRight,
    Globe,
    Headphones,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    ShieldCheck,
    Upload,
    Zap,
    type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { GradientCta } from "@/components/landing/gradient-cta";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { contactPageData } from "@/lib/site-content/public-pages";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const channelIconMap: Record<string, LucideIcon> = {
    phone: Phone,
    mail: Mail,
    whatsapp: MessageCircle,
    globe: Globe,
};

const assignmentTypes = [
    "Essay / Report",
    "Research Paper",
    "Dissertation",
    "Presentation (PPT)",
    "Case Study",
    "Other",
];

export default function ContactPage() {
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [assignmentType, setAssignmentType] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const payload = new FormData();
        payload.set("source", "contact-form");
        payload.set("name", (data.get("full-name") as string) || "");
        payload.set("email", (data.get("email") as string) || "");
        payload.set("whatsappNumber", (data.get("whatsapp") as string) || "");
        payload.set("assignmentType", assignmentType);
        payload.set("deadline", (data.get("deadline") as string) || "");
        payload.set("message", (data.get("message") as string) || "");

        const file = (form.elements.namedItem("contact-upload") as HTMLInputElement)?.files?.[0];
        if (file) {
            payload.set("attachment", file);
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/public/inquiries", {
                method: "POST",
                body: payload,
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || "Something went wrong. Please try again.");
                return;
            }

            toast.success("Message sent! We'll get back to you shortly.");
            setIsSubmitted(true);
            form.reset();
            setFileName(null);
            setAssignmentType("");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <HeroBanner
                align="split"
                title={contactPageData.title}
                description={contactPageData.description}
                trustBadges={[
                    { icon: Headphones, label: "24/7 Support" },
                    { icon: ShieldCheck, label: "100% Confidential" },
                    { icon: MessageCircle, label: "Fast Response" },
                ]}
                media={
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/happy1-horz.jpg"
                            alt="A friendly academic support session"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                }
            />

            <main className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
                <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <Card className="border-primary/15 bg-card/90 dark:border-primary/25">
                        <CardContent className="p-6 sm:p-8">
                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-7 w-7" />
                                    </div>
                                    <h2 className="text-lg font-bold">Message sent!</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Thanks for reaching out. Our team will get back to you shortly.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-2 h-10 rounded-md text-sm font-semibold"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold">Send Us a Message</h2>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Fill out the form below and our team will get back to you shortly.
                                    </div>

                                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="full-name">Full Name</Label>
                                                <Input id="full-name" name="full-name" placeholder="Enter your full name" disabled={isSubmitting} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" placeholder="Enter your email address" disabled={isSubmitting} required />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                                <Input id="whatsapp" name="whatsapp" type="tel" placeholder="Enter your WhatsApp number" disabled={isSubmitting} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="assignment-type">Assignment Type</Label>
                                                <Select value={assignmentType} onValueChange={setAssignmentType}>
                                                    <SelectTrigger id="assignment-type" className="w-full">
                                                        <SelectValue placeholder="Select assignment type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {assignmentTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deadline">Deadline</Label>
                                            <Input id="deadline" name="deadline" type="date" disabled={isSubmitting} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message / Requirements</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us about your assignment, subject, requirements, and any specific instructions..."
                                                className="min-h-[120px]"
                                                disabled={isSubmitting}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contact-upload">Upload Brief / Rubric (Optional)</Label>
                                            <label
                                                htmlFor="contact-upload"
                                                className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition-colors hover:border-primary"
                                            >
                                                <Upload className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {fileName ?? "Drag & drop your file here, or click to browse"}
                                                </span>
                                            </label>
                                            <input
                                                id="contact-upload"
                                                name="contact-upload"
                                                type="file"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                                                className="sr-only"
                                                disabled={isSubmitting}
                                                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <Button type="submit" className="h-11 rounded-md text-sm font-semibold sm:w-auto" disabled={isSubmitting}>
                                                <span className="inline-flex items-center gap-2">
                                                    {isSubmitting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Send className="h-4 w-4" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </span>
                                            </Button>
                                            <div className="text-xs text-muted-foreground">
                                                Your information is secure and will never be shared.
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Get in Touch</h2>
                        {contactPageData.channels.map((channel) => {
                            const Icon = channelIconMap[channel.icon];
                            return (
                                <Card key={channel.label} className="border-primary/15 bg-card/90 dark:border-primary/25">
                                    <CardContent className="flex items-start gap-3 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold">{channel.label}</div>
                                            {channel.href.startsWith("http") || channel.href.startsWith("mailto") || channel.href.startsWith("tel") ? (
                                                <a href={channel.href} className="block truncate text-sm hover:underline">
                                                    {channel.value}
                                                </a>
                                            ) : (
                                                <div className="truncate text-sm">{channel.value}</div>
                                            )}
                                            <div className="text-xs text-muted-foreground">{channel.sublabel}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        <Card className="border-0">
                            <CardContent className="space-y-3 p-5">
                                <div className="flex items-center gap-2 font-semibold">
                                    <Zap className="h-4 w-4" />
                                    Need Urgent Help?
                                </div>
                                <div className="text-sm">
                                    Our experts are ready 24/7 to assist you with urgent deadlines and complex tasks.
                                </div>
                                <Button asChild variant="default" className="h-10 w-full rounded-md text-sm font-semibold">
                                    <a
                                        href={CONTACT_INFO.whatsappLink}
                                        className="inline-flex items-center justify-center gap-2"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat on WhatsApp Now
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section>
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold">Quick Answers</h2>
                            <div className="text-sm text-muted-foreground">
                                Find fast answers to the most common questions.
                            </div>
                        </div>
                        <Button variant="outline" className="h-10 rounded-md px-4 text-sm font-semibold" asChild>
                            <Link href="/#faq">View All FAQs</Link>
                        </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {contactPageData.quickAnswers.map((question) => (
                            <Link
                                key={question}
                                href="/#faq"
                                className="flex items-center justify-between rounded-lg border border-primary/15 bg-card/85 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary dark:border-primary/25"
                            >
                                {question}
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <SectionHeading
                            eyebrow="Global Support"
                            align="left"
                            title="We Support Students Worldwide"
                            description="No matter where you are, our expert team is here to support your academic journey."
                            className="mb-6"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            {contactPageData.supportRegions.map((region) => (
                                <div
                                    key={region}
                                    className="flex items-center gap-3 rounded-lg border border-primary/15 bg-card/85 px-4 py-3 dark:border-primary/25"
                                >
                                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                    <span className="text-sm font-medium">{region}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                        <Image
                            src="/team-laptop.jpg"
                            alt="Our support team assisting a student"
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                </section>

                <GradientCta
                    data={{
                        title: "Ready to Get Started?",
                        description: "Submit your brief today and get a free, no-obligation brief check from our experts.",
                        primaryCta: { label: "Get Free Brief Check", href: "/contact" },
                        icon: "sparkles",
                    }}
                />
            </main>

            <Footer />
        </div>
    );
}
