"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    LockKeyhole,
    MailCheck,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordSecurityFormProps = {
    email: string;
    title?: string;
    description?: string;
};

export function PasswordSecurityForm({
    email,
    title = "Protect your account with a verified password change",
    description = "Use your current password, request a one-time code, and complete the update through a secure email verification flow.",
}: PasswordSecurityFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [isConfirmingChange, setIsConfirmingChange] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordChecks = useMemo(
        () => [
            {
                label: "At least 8 characters",
                passed: newPassword.length >= 8,
            },
            {
                label: "Passwords match",
                passed:
                    confirmPassword.length > 0 && newPassword === confirmPassword,
            },
            {
                label: "Different from current password",
                passed:
                    currentPassword.length > 0 &&
                    newPassword.length > 0 &&
                    currentPassword !== newPassword,
            },
        ],
        [confirmPassword, currentPassword, newPassword]
    );

    async function handleRequestOtp(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setIsRequestingOtp(true);

        try {
            const response = await fetch("/api/account/password/request-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Failed to send OTP");
                return;
            }

            setOtpSent(true);
            toast.success(data.message || "OTP sent to your email");
        } catch {
            setErrorMessage("Something went wrong while sending the OTP");
        } finally {
            setIsRequestingOtp(false);
        }
    }

    async function handleConfirmPasswordChange(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setErrorMessage("");

        if (!otpCode.trim()) {
            setErrorMessage("OTP is required");
            return;
        }

        setIsConfirmingChange(true);

        try {
            const response = await fetch("/api/account/password/confirm-change", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: otpCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Failed to confirm password change");
                return;
            }

            toast.success(data.message || "Password updated successfully");
            await signOut({ callbackUrl: "/login" });
        } catch {
            setErrorMessage("Something went wrong while confirming the OTP");
        } finally {
            setIsConfirmingChange(false);
        }
    }

    return (
        <div className="relative flex flex-1 flex-col gap-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.12),transparent_35%)]" />

            <Card className="overflow-hidden border-white/50 bg-background/80 shadow-[0_20px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/12 via-cyan-500/8 to-emerald-500/12" />
                    <div className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-background/75 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
                                <Sparkles className="h-4 w-4 text-sky-500" />
                                Security Center
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    {title}
                                </h2>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    {description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        Step 1
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        Verify current password
                                    </div>
                                </div>
                                <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        Step 2
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        Receive email OTP
                                    </div>
                                </div>
                                <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        Step 3
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        Confirm and sign in again
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:w-[340px]">
                            <div className="rounded-2xl border bg-background/85 px-4 py-4 shadow-sm backdrop-blur">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    Session protection
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    After success, the active session is closed to protect account access.
                                </p>
                            </div>

                            <div className="rounded-2xl border bg-background/85 px-4 py-4 shadow-sm backdrop-blur">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <MailCheck className="h-4 w-4 text-sky-500" />
                                    Email verification
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    The one-time code is sent to your registered email address.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                <Card className="border-white/50 bg-background/85 shadow-[0_20px_70px_-36px_rgba(15,23,42,0.3)] backdrop-blur">
                    <CardContent className="p-6 sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Request a verification code
                                </h3>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Confirm your current password and choose the new one you want to activate.
                                </p>
                            </div>

                            <div className="hidden rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
                                Password update
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleRequestOtp}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="currentPassword">Current password</Label>
                                    <InputGroup className="h-12 rounded-2xl border-border/70 bg-background/70">
                                        <InputGroupInput
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(event) =>
                                                setCurrentPassword(event.target.value)
                                            }
                                            disabled={isRequestingOtp || isConfirmingChange}
                                            required
                                            placeholder="Enter your current password"
                                            className="px-4"
                                        />
                                        <InputGroupButton
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="mr-1"
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Hide current password"
                                                    : "Show current password"
                                            }
                                            onClick={() =>
                                                setShowCurrentPassword((value) => !value)
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </InputGroupButton>
                                    </InputGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New password</Label>
                                    <InputGroup className="h-12 rounded-2xl border-border/70 bg-background/70">
                                        <InputGroupInput
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(event) =>
                                                setNewPassword(event.target.value)
                                            }
                                            disabled={isRequestingOtp || isConfirmingChange}
                                            required
                                            placeholder="Choose a stronger password"
                                            className="px-4"
                                        />
                                        <InputGroupButton
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="mr-1"
                                            aria-label={
                                                showNewPassword
                                                    ? "Hide new password"
                                                    : "Show new password"
                                            }
                                            onClick={() => setShowNewPassword((value) => !value)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </InputGroupButton>
                                    </InputGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                                    <InputGroup className="h-12 rounded-2xl border-border/70 bg-background/70">
                                        <InputGroupInput
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(event) =>
                                                setConfirmPassword(event.target.value)
                                            }
                                            disabled={isRequestingOtp || isConfirmingChange}
                                            required
                                            placeholder="Re-enter the new password"
                                            className="px-4"
                                        />
                                        <InputGroupButton
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="mr-1"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword((value) => !value)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </InputGroupButton>
                                    </InputGroup>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {passwordChecks.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border bg-muted/30 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2
                                                className={
                                                    item.passed
                                                        ? "h-4 w-4 text-emerald-500"
                                                        : "h-4 w-4 text-muted-foreground"
                                                }
                                            />
                                            <span
                                                className={
                                                    item.passed
                                                        ? "text-sm font-medium text-foreground"
                                                        : "text-sm text-muted-foreground"
                                                }
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errorMessage ? (
                                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                    {errorMessage}
                                </p>
                            ) : null}

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-2xl"
                                disabled={isRequestingOtp || isConfirmingChange}
                            >
                                {isRequestingOtp ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : otpSent ? (
                                    <>
                                        <MailCheck className="mr-2 h-4 w-4" />
                                        Resend OTP
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Send OTP
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-white/50 bg-background/85 shadow-[0_20px_70px_-36px_rgba(15,23,42,0.3)] backdrop-blur">
                    <CardContent className="p-6 sm:p-7">
                        <div className="mb-6 space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                                <MailCheck className="h-3.5 w-3.5" />
                                OTP verification
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Confirm the password update
                                </h3>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Enter the 6-digit code sent to{" "}
                                    <span className="font-medium text-foreground">{email}</span>.
                                </p>
                            </div>
                        </div>

                        <div className="mb-5 rounded-2xl border bg-muted/30 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Security notice
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Once the code is verified, the password is updated immediately and
                                you will be redirected to log in again.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleConfirmPasswordChange}>
                            <div className="space-y-2">
                                <Label htmlFor="otpCode">Email OTP</Label>
                                <Input
                                    id="otpCode"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(event) =>
                                        setOtpCode(
                                            event.target.value.replace(/\D/g, "").slice(0, 6)
                                        )
                                    }
                                    disabled={!otpSent || isRequestingOtp || isConfirmingChange}
                                    required
                                    className="h-14 rounded-2xl border-border/70 bg-background/70 px-4 text-center font-mono text-xl tracking-[0.45em]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The code field becomes active after the OTP request succeeds.
                                </p>
                            </div>

                            {errorMessage ? (
                                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                    {errorMessage}
                                </p>
                            ) : null}

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-2xl"
                                disabled={!otpSent || isRequestingOtp || isConfirmingChange}
                            >
                                {isConfirmingChange ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating password...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole className="mr-2 h-4 w-4" />
                                        Confirm and update password
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}