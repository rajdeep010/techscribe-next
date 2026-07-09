import { notFound } from "next/navigation"
import type { JSONContent } from "@tiptap/core"
import Link from "next/link"
import { ArrowUpRight, BookOpenText, CalendarDays } from "lucide-react"

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

type BlogDetailRecord = {
    title?: string | null
    excerpt?: string | null
    contentJson?: JSONContent
    publishedAt?: Date | string | null
    updatedAt?: Date | string | null
}

type BlogSidebarRecord = {
    _id: unknown
    title?: string | null
    excerpt?: string | null
    publishedAt?: Date | string | null
    updatedAt?: Date | string | null
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

    let blog: BlogDetailRecord | null = null
    let allBlogs: BlogSidebarRecord[] = []

    try {
        blog = await BlogModel.findOne({
            _id: blogId,
            status: "published",
        })
            .select("title excerpt contentJson publishedAt updatedAt")
            .lean<BlogDetailRecord | null>()

        allBlogs = await BlogModel.find({ status: "published" })
            .sort({ publishedAt: -1, updatedAt: -1 })
            .select("_id title excerpt publishedAt updatedAt")
            .lean<BlogSidebarRecord[]>()
    } catch {
        notFound()
    }

    if (!blog) {
        notFound()
    }

    const content = (blog.contentJson as JSONContent | undefined) ?? EMPTY_DOC
    const sidebarBlogs = allBlogs.filter((item) => String(item._id) !== blogId)

    return (
        <div className="relative overflow-hidden border-b">
            {/* <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" /> */}

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <main>
                    <section className="mx-auto max-w-7xl px-2 py-8 sm:px-2 lg:py-10">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
                            <div className="space-y-4 rounded-3xl border border-primary/20 bg-card/90 p-0 dark:border-primary/30 sm:p-5">
                                {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:border-primary/35 dark:bg-primary/15">
                                    <BookOpenText className="h-3.5 w-3.5" />
                                    Now Reading
                                </div> */}

                                {/* <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
                                    {blog.title || "Untitled blog"}
                                </h1> */}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground justify-end">
                                    <span className="inline-flex items-center gap-1.5 text-xs">
                                        <CalendarDays className="h-3 w-3 text-emerald-600 dark:text-emerald-300" />
                                        {formatDate(blog.publishedAt ?? blog.updatedAt)}
                                    </span>
                                    <span>•</span>
                                    <span className="text-xs">{getReadingTimeFromJson(content)}</span>
                                </div>

                                {/* {blog.excerpt ? (
                                    <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                                        {blog.excerpt}
                                    </p>
                                ) : null} */}

                                <div className="rounded-3xl border border-border/60 bg-card/60 shadow-sm">
                                    <SimpleEditor content={content} editable={false} />
                                </div>
                            </div>

                            <aside className="space-y-3">
                                <div className="px-1">
                                    {/* <h2 className="text-lg font-semibold tracking-tight">More published blogs</h2> */}
                                    {/* <p className="text-sm text-muted-foreground">Click any post to load it on the left.</p> */}
                                </div>

                                <div className="max-h-screen space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {sidebarBlogs.map((item) => {
                                        const itemId = String(item._id)

                                        return (
                                            <Link
                                                key={itemId}
                                                href={`/blogs/${itemId}`}
                                                className="block rounded-2xl border border-border/60 bg-card/85 p-4 transition-all duration-200 hover:border-cyan-500/35 hover:bg-card"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Badge variant="outline" className="rounded-full text-[11px]">
                                                            {formatDate(item.publishedAt ?? item.updatedAt)}
                                                        </Badge>
                                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-5">
                                                        {item.title || "Untitled blog"}
                                                    </h3>
                                                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                                                        {item.excerpt || "Open to read the complete article."}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    })}

                                    {sidebarBlogs.length === 0 ? (
                                        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
                                            No other published blogs available yet.
                                        </div>
                                    ) : null}
                                </div>
                            </aside>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    )
}