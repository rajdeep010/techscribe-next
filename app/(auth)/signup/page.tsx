"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
                <div className="relative h-full w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                        <div className="max-w-md space-y-6 text-center">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                                Start Your Academic Success Journey
                            </h2>
                            <div className="text-lg text-slate-600 dark:text-slate-400">
                                Access expert tutors, get personalized help, and achieve the grades you deserve with our proven platform.
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
                                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">✓</div>
                                    <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">Plagiarism Free</div>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
                                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">✓</div>
                                    <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">On-Time Delivery</div>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
                                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">✓</div>
                                    <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">Expert Writers</div>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
                                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">✓</div>
                                    <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">Money Back</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t"></div>
                        <span className="px-4 text-xs text-muted-foreground">OR</span>
                        <div className="flex-1 border-t"></div>
                    </div>

                    {/* <div className="space-y-3">
                        <Button variant="outline" className="w-full" size="lg" type="button">
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </div> */}

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