"use client"

import dynamic from "next/dynamic"

const BlogWriter = dynamic(
    () => import("@/components/admin/blog-writer").then((mod) => mod.BlogWriter),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading editor...</div>
            </div>
        ),
    }
)

export function BlogWriterShell() {
    return <BlogWriter />
}