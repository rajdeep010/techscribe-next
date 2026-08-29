"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, ClipboardCheck, Loader2, Lock, Upload } from "lucide-react";

const assignmentTypes = [
    "Essay / Report",
    "Research Paper",
    "Dissertation",
    "Presentation (PPT)",
    "Case Study",
    "Referencing / Editing",
    "Other",
];

const countryCodes = [
    { value: "+91", label: "IN (+91)" },
    { value: "+1", label: "US (+1)" },
    { value: "+44", label: "UK (+44)" },
    { value: "+61", label: "AU (+61)" },
    { value: "+353", label: "IE (+353)" },
];

export function OrderForm() {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [countryCode, setCountryCode] = React.useState("+91");
    const [assignmentType, setAssignmentType] = React.useState("");
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const whatsappNumber = `${countryCode}${(data.get("whatsapp-number") as string) || ""}`.trim();
        const deadline = (data.get("deadline") as string) || "";

        const payload = new FormData();
        payload.set("source", "order-form");
        payload.set("whatsappNumber", whatsappNumber);
        payload.set("assignmentType", assignmentType);
        payload.set("deadline", deadline);
        payload.set(
            "message",
            `Free brief check requested for ${assignmentType || "an assignment"}${deadline ? ` (deadline: ${deadline})` : ""}.`
        );
        const file = (form.elements.namedItem("brief-upload") as HTMLInputElement)?.files?.[0];
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

            toast.success("Request received! We'll get back to you shortly.");
            setIsSubmitted(true);
            form.reset();
            setFileName(null);
            setAssignmentType("");
            setCountryCode("+91");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-10 text-center shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-bold">Request received!</h2>
                <p className="text-sm text-muted-foreground">
                    Thanks for reaching out. Our team will contact you on WhatsApp shortly.
                </p>
                <Button variant="outline" className="mt-2 h-10 rounded-md text-sm font-semibold" onClick={() => setIsSubmitted(false)}>
                    Submit another request
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold sm:text-xl">Get a Free Assignment Brief Check</h2>
                    <div className="mt-1 text-sm text-muted-foreground">
                        Share your brief and our experts will review it.
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="whatsapp-number" className="text-sm text-muted-foreground">
                        WhatsApp Number
                    </Label>
                    <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-[110px]" aria-label="Country code">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {countryCodes.map((code) => (
                                    <SelectItem key={code.value} value={code.value}>
                                        {code.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            id="whatsapp-number"
                            name="whatsapp-number"
                            type="tel"
                            placeholder="WhatsApp number"
                            className="flex-1"
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="assignment-type" className="text-sm text-muted-foreground">
                        Assignment Type
                    </Label>
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

                <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm text-muted-foreground">
                        Deadline
                    </Label>
                    <Input id="deadline" name="deadline" type="date" disabled={isSubmitting} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brief-upload" className="text-sm text-muted-foreground">
                        Upload Brief / Rubric{" "}
                        <span className="text-xs">(PDF, DOCX, PPT — max 20MB)</span>
                    </Label>
                    <label
                        htmlFor="brief-upload"
                        className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition-colors hover:border-primary"
                    >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {fileName ?? "Click to upload your brief or rubric"}
                        </span>
                    </label>
                    <input
                        id="brief-upload"
                        name="brief-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        className="sr-only"
                        disabled={isSubmitting}
                        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                </div>

                <Button type="submit" className="h-11 w-full rounded-md text-sm font-semibold" disabled={isSubmitting}>
                    <span className="inline-flex items-center gap-2">
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Submit for Free Review
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </span>
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    100% Confidential & Secure
                </div>
            </form>
        </div>
    );
}
