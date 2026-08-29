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
import { AuthBrandPanel } from "@/components/common/auth-brand-panel";
import {
    Eye,
    EyeOff,
    Headphones,
    Lock,
    Mail,
    MessageCircle,
    Star,
    Users,
} from "lucide-react";

type LoginFormState = {
    identifier: string;
    password: string;
};

const initialFormState: LoginFormState = {
    identifier: "",
    password: "",
};

const heroStats = [
    { icon: Users, value: "2500+", label: "Students" },
    { icon: Star, value: "4.8/5", label: "Rating" },
    { icon: Headphones, value: "24/7", label: "Support" },
];

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormState>(initialFormState);
    const [showPassword, setShowPassword] = useState(false);
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
            setErrorMessage("Email or WhatsApp number is required");
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
            const role = session?.user?.role;

            toast.success("Signed in successfully");

            if (username && role === "admin") {
                router.replace(`/admin/${username}`);
                router.refresh();
                return;
            }

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
            <div className="hidden lg:block lg:w-1/2">
                <AuthBrandPanel
                    title={
                        <>
                            Your Academic Success,
                            <br />
                            <span className="text-violet-300">Our Priority</span>
                        </>
                    }
                    description="Trusted academic support for international students."
                >
                    <div className="flex items-center justify-center gap-8 border-t border-white/15 pt-6">
                        {heroStats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center text-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="mt-2 text-lg font-bold">{stat.value}</div>
                                <div className="text-xs text-white/70">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </AuthBrandPanel>
            </div>

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
                            <Label htmlFor="identifier">Email or WhatsApp Number</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="name@example.com or WhatsApp number"
                                    className="pl-9"
                                    value={formData.identifier}
                                    onChange={(event) => updateField("identifier", event.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
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
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="px-9"
                                    value={formData.password}
                                    onChange={(event) => updateField("password", event.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" disabled={isSubmitting} />
                            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                                Remember me for 30 days
                            </Label>
                        </div>

                        {errorMessage ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                {errorMessage}
                            </p>
                        ) : null}

                        <Button type="submit" className="h-11 w-full rounded-md text-sm font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/5 p-4 dark:bg-primary/10">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Headphones className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Need help signing in?</div>
                            <div className="text-xs text-muted-foreground">
                                Our support team is here to help you 24/7.
                            </div>
                            <Link href="/contact" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                                Contact Support
                                <MessageCircle className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
