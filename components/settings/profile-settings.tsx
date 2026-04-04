"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
    AtSign,
    BadgeCheck,
    Globe,
    Link2,
    Loader2,
    MapPin,
    PencilLine,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function ProfileSettings() {
    const { data: session, update } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        about: "",
        location: "",
        linkedin: "",
        profile: "",
    });

    useEffect(() => {
        if (!session?.user) return;

        setFormData({
            name: session.user.name ?? "",
            username: session.user.username ?? "",
            email: session.user.email ?? "",
            about: session.user.about ?? "",
            location: session.user.location ?? "",
            linkedin: session.user.linkedin ?? "",
            profile: session.user.profile ?? "",
        });
    }, [session]);

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    about: formData.about,
                    location: formData.location,
                    linkedin: formData.linkedin,
                    profile: formData.profile,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to update profile");
                return;
            }

            await update({
                user: {
                    name: formData.name,
                    about: formData.about,
                    location: formData.location,
                    linkedin: formData.linkedin,
                    profile: formData.profile,
                },
            });

            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    }

    const displayName = formData.name || formData.username || "User";
    const avatarFallback = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                                <AvatarImage src={session?.user?.profile ?? ""} alt={displayName} />
                                <AvatarFallback className="text-lg font-semibold">
                                    {avatarFallback}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-3xl font-semibold tracking-tight text-white">{displayName}</h2>
                                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                                        {session?.user?.role === "admin" ? "Admin" : "User"}
                                    </Badge>
                                    {session?.user?.isVerified ? (
                                        <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600">
                                            <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="rounded-full px-3 py-1">
                                            Pending verification
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-sm text-white/90">
                                    Manage your public profile, professional links, and account identity.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Username
                                </div>
                                <div className="mt-1 font-medium">@{formData.username || "user"}</div>
                            </div>
                            <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Role
                                </div>
                                <div className="mt-1 font-medium capitalize">
                                    {session?.user?.role ?? "user"}
                                </div>
                            </div>
                            <div className="rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur col-span-2 sm:col-span-1">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Status
                                </div>
                                <div className="mt-1 font-medium">
                                    {session?.user?.isVerified ? "Active" : "Pending"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Account Identity</CardTitle>
                        <CardDescription>
                            Read-only account information tied to authentication and routing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4">
                                <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium">Username</div>
                                    <div className="text-sm text-muted-foreground break-all">
                                        @{formData.username || "user"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4">
                                <AtSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium">Email Address</div>
                                    <div className="text-sm text-muted-foreground break-all">
                                        {formData.email || "Not available"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4">
                                <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium">Verification</div>
                                    <div className="text-sm text-muted-foreground">
                                        {session?.user?.isVerified
                                            ? "Your account is verified and active."
                                            : "Your account verification is still pending."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Need update?</p>
                            <p className="text-sm text-muted-foreground">
                                If any read-only field needs update then try to contact support or your administrator. Account identity fields are locked to ensure consistency across authentication, routing, and user mentions.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <PencilLine className="h-5 w-5" />
                            Public Profile
                        </CardTitle>
                        <CardDescription>
                            Update the information visible across your workspace and profile surfaces.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(event) =>
                                            setFormData({ ...formData, name: event.target.value })
                                        }
                                        placeholder="Enter your display name"
                                        className="h-11 rounded-xl"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This is the main name shown around the product.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(event) =>
                                                setFormData({ ...formData, location: event.target.value })
                                            }
                                            placeholder="City, Country"
                                            className="h-11 rounded-xl pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="about">About</Label>
                                <Textarea
                                    id="about"
                                    value={formData.about}
                                    onChange={(event) =>
                                        setFormData({ ...formData, about: event.target.value })
                                    }
                                    placeholder="Write a short introduction about yourself, your expertise, or your working style."
                                    className="min-h-32 resize-none rounded-2xl"
                                    rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Keep it concise and useful. This is a good place for a professional summary.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <div className="relative">
                                        <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="linkedin"
                                            value={formData.linkedin}
                                            onChange={(event) =>
                                                setFormData({ ...formData, linkedin: event.target.value })
                                            }
                                            placeholder="https://linkedin.com/in/..."
                                            className="h-11 rounded-xl pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profile">Portfolio / Profile URL</Label>
                                    <div className="relative">
                                        <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="profile"
                                            value={formData.profile}
                                            onChange={(event) =>
                                                setFormData({ ...formData, profile: event.target.value })
                                            }
                                            placeholder="https://your-portfolio.com"
                                            className="h-11 rounded-xl pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Your changes will update both the database and the active session.
                                </p>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-11 rounded-xl px-6"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating profile...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}