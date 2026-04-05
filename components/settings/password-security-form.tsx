"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
    KeyRound,
    Loader2,
    LockKeyhole,
    MailCheck,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordSecurityFormProps = {
    email: string;
    title?: string;
    description?: string;
};

export function PasswordSecurityForm({
    email,
    title = "Update your password securely",
    description = "Confirm your current password, receive a one-time OTP by email, and verify the change before your password is updated.",
}: PasswordSecurityFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [isConfirmingChange, setIsConfirmingChange] = useState(false);

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
        <div className="flex flex-1 flex-col gap-6">
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="bg-linear-to-r from-sky-500/15 via-cyan-500/10 to-emerald-500/15 px-8 py-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm font-medium backdrop-blur">
                                <ShieldCheck className="h-4 w-4" />
                                Account Security
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight">
                                {title}
                            </h2>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                Security rule
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                After a successful password change, you will be signed out and asked to log in again.
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-border/60 shadow-sm">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold tracking-tight">
                                Request password change OTP
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Enter your current password and the new password you want to use.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleRequestOtp}>
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    disabled={isRequestingOtp || isConfirmingChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    disabled={isRequestingOtp || isConfirmingChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm new password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    disabled={isRequestingOtp || isConfirmingChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
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

                <Card className="border-border/60 shadow-sm">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold tracking-tight">
                                Confirm password update
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Enter the 6-digit OTP sent to {email}.
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
                                    placeholder="Enter 6-digit OTP"
                                    value={otpCode}
                                    onChange={(event) =>
                                        setOtpCode(
                                            event.target.value.replace(/\D/g, "").slice(0, 6)
                                        )
                                    }
                                    disabled={!otpSent || isRequestingOtp || isConfirmingChange}
                                    required
                                />
                            </div>

                            {errorMessage ? (
                                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                                    {errorMessage}
                                </p>
                            ) : null}

                            <Button
                                type="submit"
                                className="w-full"
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