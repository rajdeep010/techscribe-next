"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserProvider";
import { toast } from "sonner";

export function ProfileSettings() {
    const { user, updateUser } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: "I own a computer.",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user in context
            updateUser({
                name: formData.name,
                email: formData.email,
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-3xl">
            <CardContent className="px-8 py-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter your name"
                            className="max-w-md"
                        />
                        <p className="text-sm text-muted-foreground">
                            This is your public display name. It can be your real name or a
                            pseudonym. You can only change this once every 30 days.
                        </p>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Select
                            value={formData.email}
                            onValueChange={(value) => setFormData({ ...formData, email: value })}
                        >
                            <SelectTrigger id="email" className="max-w-md">
                                <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={formData.email}>
                                    {formData.email}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            You can manage verified email addresses in your email settings.
                        </p>
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({ ...formData, bio: e.target.value })
                            }
                            placeholder="Tell us about yourself"
                            className="resize-none max-w-md"
                            rows={4}
                        />
                        <p className="text-sm text-muted-foreground">
                            You can @mention other users and organizations to link to them.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating profile..." : "Update profile"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}