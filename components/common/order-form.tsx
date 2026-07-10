"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Paperclip, Plus, Minus } from "lucide-react";

export function OrderForm() {
    const [pages, setPages] = React.useState(1);
    const [words, setWords] = React.useState(250);

    const handlePagesChange = (increment: boolean) => {
        const newPages = increment ? pages + 1 : Math.max(1, pages - 1);
        setPages(newPages);
        setWords(newPages * 250);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Temporary function - will be replaced with context
        console.log("Form submitted");
    };

    return (
        <div className="w-full rounded-2xl border bg-card px-6 py-2 shadow-lg sm:p-8">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">AI-Free Assignment Help From 5000+ Real Experts</h2>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        ✓ Guaranteed Grade or Refund
                    </span>
                    <span className="flex items-center gap-1">✓ No AI</span>
                    <span className="flex items-center gap-1">✓ 24/7 Support</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Service Type Radio */}
                <RadioGroup defaultValue="writing" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="writing" id="writing" />
                        <Label htmlFor="writing" className="cursor-pointer font-normal">
                            Writing
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="technical" id="technical" />
                        <Label htmlFor="technical" className="cursor-pointer font-normal">
                            Technical
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online-class" id="online-class" />
                        <Label htmlFor="online-class" className="cursor-pointer font-normal">
                            Online Class
                        </Label>
                    </div>
                </RadioGroup>

                {/* Email and Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Input type="email" placeholder="Email" required />
                    </div>
                    <div className="flex gap-2">
                        <Select defaultValue="+91">
                            <SelectTrigger className="w-[110px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+1">US (+1)</SelectItem>
                                <SelectItem value="+44">UK (+44)</SelectItem>
                                <SelectItem value="+91">IN (+91)</SelectItem>
                                <SelectItem value="+61">AU (+61)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="tel" placeholder="Phone no." className="flex-1" />
                    </div>
                </div>

                {/* Subject and Deadline */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Input placeholder="Subject/Course Code" />
                    </div>
                    <div className="space-y-2">
                        <Input type="datetime-local" placeholder="Deadline" />
                    </div>
                </div>

                {/* Pages Counter */}
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Pages</Label>
                    <div className="flex items-center gap-4 rounded-lg border">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePagesChange(false)}
                            disabled={pages <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-lg font-semibold">{pages}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{words} words</div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePagesChange(true)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Description and File Upload */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2 md:col-span-1">
                        <Textarea
                            placeholder="Description (Write/Attach)"
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary">
                            <Paperclip className="h-6 w-6 text-muted-foreground" />
                            <span className="mt-2 text-sm text-muted-foreground">Attach file</span>
                        </div>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <Label
                        htmlFor="terms"
                        className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
                    >
                        I accept the T&C, agree to receive offers & updates
                    </Label>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="h-11 w-full rounded-md text-sm font-semibold">
                    Do My Assignment
                </Button>
            </form>
        </div>
    );
}