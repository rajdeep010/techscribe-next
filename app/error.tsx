"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
            <div className="max-w-md space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                <p className="text-sm text-muted-foreground">
                    We hit an unexpected error loading this page. This is usually temporary — please try again.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button onClick={reset} className="h-10 rounded-md px-5 text-sm font-semibold">
                        <span className="inline-flex items-center gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Try Again
                        </span>
                    </Button>
                    <Button variant="outline" className="h-10 rounded-md px-5 text-sm font-semibold" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
