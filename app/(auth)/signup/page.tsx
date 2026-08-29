"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthBrandPanel } from "@/components/common/auth-brand-panel";

const signupHighlights = [
    "Plagiarism Free",
    "On-Time Delivery",
    "Expert Writers",
    "Money Back",
];

type SignupFormState = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialFormState: SignupFormState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function updateField<K extends keyof SignupFormState>(
        field: K,
        value: SignupFormState[K]
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");

        if (!acceptTerms) {
            setErrorMessage("You must accept the terms and privacy policy");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Signup failed");
                return;
            }

            toast.success("Signup successful. Verify your email to continue.");
            router.push(`/verify?email=${encodeURIComponent(data.email)}`);
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:block lg:w-1/2">
                <AuthBrandPanel
                    title="Start Your Academic Success Journey"
                    description="Access expert tutors, get personalized help, and achieve the grades you deserve with our proven platform."
                >
                    <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-6">
                        {signupHighlights.map((item) => (
                            <div key={item} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-left">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-300" />
                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </AuthBrandPanel>
            </div>

            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Get started with your free account today
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="rajdeep010"
                                value={formData.username}
                                onChange={(event) => updateField("username", event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(event) => updateField("email", event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(event) => updateField("password", event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Use at least 8 characters with uppercase, lowercase, and a number.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={(event) =>
                                    updateField("confirmPassword", event.target.value)
                                }
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                                disabled={isSubmitting}
                            />
                            <Label
                                htmlFor="terms"
                                className="cursor-pointer text-sm font-normal leading-relaxed"
                            >
                                I agree to the{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </Label>
                        </div>

                        {errorMessage ? (
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        ) : null}

                        <Button type="submit" className="h-11 w-full rounded-md text-sm font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}