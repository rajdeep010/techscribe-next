"use client";

import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type LoginFormState = {
    identifier: string;
    password: string;
};

const initialFormState: LoginFormState = {
    identifier: "",
    password: "",
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormState>(initialFormState);
    // const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField<K extends keyof LoginFormState>(
        field: K,
        value: LoginFormState[K]
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");

        if (!formData.identifier.trim()) {
            setErrorMessage("Email or username is required");
            return;
        }

        if (!formData.password.trim()) {
            setErrorMessage("Password is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await signIn("credentials", {
                identifier: formData.identifier,
                password: formData.password,
                redirect: false,
            });

            if (!result || result.error) {
                setErrorMessage(result?.error || "Invalid credentials");
                return;
            }

            const session = await getSession();
            const username = session?.user?.username;

            toast.success("Signed in successfully");

            if (username) {
                router.replace(`/u/${username}`);
                router.refresh();
                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="identifier">Email or Username</Label>
                            <Input
                                id="identifier"
                                type="text"
                                placeholder="name@example.com or rajdeep010"
                                value={formData.identifier}
                                onChange={(event) => updateField("identifier", event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(event) => updateField("password", event.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                                disabled={isSubmitting}
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm font-normal"
                            >
                                Remember me for 30 days
                            </Label>
                        </div> */}

                        {errorMessage ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                {errorMessage}
                            </p>
                        ) : null}

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t"></div>
                        <span className="px-4 text-xs text-muted-foreground">OR</span>
                        <div className="flex-1 border-t"></div>
                    </div>

                    <div className="space-y-3">
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
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2">
                <div className="relative h-full w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                        <div className="max-w-md space-y-6 text-center">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                                Join 50,000+ Students Worldwide
                            </h2>
                            <div className="text-lg text-slate-600 dark:text-slate-400">
                                Get expert help with your assignments, achieve better grades, and unlock your academic potential.
                            </div>
                            <div className="flex items-center justify-center gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">4.9★</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Rating</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">50k+</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Students</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}