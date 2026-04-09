import { notFound } from "next/navigation"
import type { JSONContent } from "@tiptap/core"

import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Badge } from "@/components/ui/badge"
import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/model/Blog"

const EMPTY_DOC: JSONContent = {
    type: "doc",
    content: [{ type: "paragraph" }],
}

function formatDate(value?: Date | string | null) {
    if (!value) {
        return "Recently updated"
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value))
}

function getReadingTimeFromJson(content?: JSONContent) {
    const words: string[] = []

    function walk(node?: JSONContent) {
        if (!node) {
            return
        }

        if (typeof node.text === "string" && node.text.trim()) {
            words.push(...node.text.trim().split(/\s+/))
        }

        if (Array.isArray(node.content)) {
            for (const child of node.content) {
                walk(child)
            }
        }
    }

    walk(content)

    const minutes = Math.max(1, Math.ceil(words.filter(Boolean).length / 200))
    return `${minutes} min read`
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ blogId: string }>
}) {
    const { blogId } = await params

    await dbConnect()

    const blog = await BlogModel.findOne({
        _id: blogId,
        status: "published",
    })
        .select("title excerpt contentJson publishedAt updatedAt")
        .lean()

    if (!blog) {
        notFound()
    }

    const content = (blog.contentJson as JSONContent | undefined) ?? EMPTY_DOC

    return (
        <div className="relative overflow-hidden border-b">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <main>
                    <section className="mx-auto flex max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
                        <div className="w-full space-y-1 rounded-3xl">
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                                {blog.title || "Untitled blog"}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span>{formatDate(blog.publishedAt ?? blog.updatedAt)}</span>
                                <span>•</span>
                                <span>{getReadingTimeFromJson(content)}</span>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto mb-4 flex max-w-5xl px-4 py-2 sm:px-6 lg:py-2">
                        <div className="w-full rounded-3xl border border-border/60 bg-card/60 shadow-sm">
                            <SimpleEditor content={content} editable={false} />
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    )
}