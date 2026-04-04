"use client";

import { useState } from "react";
import { LifeBuoy, Loader2, Mail, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function SupportForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "general",
        message: "",
    });

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/user/support", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to submit support request");
                return;
            }

            setFormData({
                subject: "",
                category: "general",
                message: "",
            });

            toast.success("Support request submitted successfully");
        } catch {
            toast.error("Failed to submit support request");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Hi, I'm having trouble with my account. I can't log in and I keep getting an error message. Can you please help me resolve this issue? Thank you!
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="bg-linear-to-r from-sky-500/15 via-cyan-500/10 to-emerald-500/15 px-8 py-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
                                <LifeBuoy className="h-4 w-4" />
                                Help & Support
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Need help with something?
                            </h1>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                Send a support request and your message will be saved for the admin team to review.
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                When to expect a response?
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground font-sm">
                                Admins will review your request and respond via email. 
                                <br />Please allow up to 48 hours for a response, though we often reply much faster!
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquareText className="h-5 w-5" />
                        Submit Support Request
                    </CardTitle>
                    <CardDescription>
                        Share enough detail so the team can help you quickly.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(event) =>
                                        setFormData({ ...formData, subject: event.target.value })
                                    }
                                    placeholder="Short summary of the issue"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            category: value as "general" | "billing" | "technical" | "account",
                                        })
                                    }
                                >
                                    <SelectTrigger id="category" className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="billing">Billing</SelectItem>
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="account">Account</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(event) =>
                                    setFormData({ ...formData, message: event.target.value })
                                }
                                placeholder="Describe the issue, what happened, and what you expected."
                                className="min-h-40 resize-none rounded-2xl"
                                rows={7}
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                Your request will be stored and shown to admins later.
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 rounded-xl px-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending request...
                                    </>
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}