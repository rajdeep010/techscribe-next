"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function maskEmail(email: string) {
    if (!email.includes("@")) {
        return email;
    }

    const [name, domain] = email.split("@");

    if (name.length <= 2) {
        return `${name[0] ?? ""}***@${domain}`;
    }

    return `${name.slice(0, 2)}***@${domain}`;
}

function VerifyPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialEmail = useMemo(
        () => searchParams.get("email")?.trim().toLowerCase() ?? "",
        [searchParams]
    );

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        setEmail(initialEmail);
    }, [initialEmail]);

    async function handleVerify(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");

        if (!email.trim()) {
            setErrorMessage("Email is required");
            return;
        }

        if (!code.trim()) {
            setErrorMessage("Verification code is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Verification failed");
                return;
            }

            toast.success(data.message || "Account verified successfully");
            router.push("/login");
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleResendOtp() {
        setErrorMessage("");

        if (!email.trim()) {
            setErrorMessage("Enter your email to resend the code");
            return;
        }

        setIsResending(true);

        try {
            const response = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Unable to resend code");
                return;
            }

            toast.success(data.message || "A new verification code has been sent");
        } catch {
            setErrorMessage("Something went wrong while resending the code");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:block lg:w-1/2">
                <div className="relative h-full w-full bg-linear-to-br from-slate-100 via-sky-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="max-w-md space-y-6 text-center">
                            <div className="inline-flex rounded-full border border-sky-200 bg-white/70 px-4 py-1 text-sm font-medium text-sky-700 backdrop-blur dark:border-sky-900 dark:bg-slate-900/60 dark:text-sky-300">
                                Email Verification
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                                Confirm your account before continuing
                            </h2>
                            <p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Enter the one-time verification code sent to your email to activate your account and continue to sign in.
                            </p>
                            <div className="grid gap-4 pt-4 text-left">
                                <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Delivery target
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        {email ? maskEmail(email) : "your email inbox"}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Code validity
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        10 minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter the OTP sent to your email address to complete signup.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleVerify}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={isSubmitting || isResending}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Verification code</Label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                disabled={isSubmitting || isResending}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Use the 6-digit code from your email.
                            </p>
                        </div>

                        {errorMessage ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                {errorMessage}
                            </p>
                        ) : null}

                        <Button
                            type="submit"
                            className="h-11 w-full rounded-md text-sm font-semibold"
                            disabled={isSubmitting || isResending}
                        >
                            {isSubmitting ? "Verifying..." : "Verify Account"}
                        </Button>
                    </form>

                    <div className="mt-4 space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 w-full rounded-md text-sm font-semibold"
                            onClick={handleResendOtp}
                            disabled={isSubmitting || isResending}
                        >
                            {isResending ? "Sending new code..." : "Resend OTP"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already verified?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VerifyPageFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="text-sm text-muted-foreground">Loading verification page...</div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<VerifyPageFallback />}>
            <VerifyPageContent />
        </Suspense>
    );
}