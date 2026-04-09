"use client"

import Link from "next/link"
import { useDeferredValue, useState } from "react"
import { ExternalLink, FilePenLine, Globe, Plus, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type AdminBlogListItem = {
    id: string
    title: string
    excerpt: string
    status: "draft" | "published"
    publishedAt: string | null
    updatedAt: string | null
}

function formatDate(value?: string | null) {
    if (!value) {
        return "Recently updated"
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value))
}

function getStatusVariant(status: string) {
    if (status === "published") {
        return "default"
    }

    return "secondary"
}

export function AdminBlogsClient({
    username,
    blogs,
}: {
    username: string
    blogs: AdminBlogListItem[]
}) {
    const [query, setQuery] = useState("")
    const deferredQuery = useDeferredValue(query)
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    const filteredBlogs = normalizedQuery
        ? blogs.filter((blog) => blog.title.toLowerCase().includes(normalizedQuery))
        : blogs

    return (
        <>
            <section className="rounded-[1.75rem] border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full max-w-2xl items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                inputMode="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Filter blogs by title"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                data-1p-ignore="true"
                                data-lpignore="true"
                                className="h-11 rounded-full border-border/60 bg-background pl-11 pr-4"
                            />
                        </div>

                        {query ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-full px-4"
                                onClick={() => setQuery("")}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                            {filteredBlogs.length} result{filteredBlogs.length === 1 ? "" : "s"}
                        </Badge>
                        {normalizedQuery ? <span>for "{query.trim()}"</span> : <span>all blogs</span>}
                    </div>
                </div>
            </section>

            {filteredBlogs.length === 0 ? (
                <Card className="border-dashed border-border/70 bg-muted/20">
                    <CardHeader>
                        <CardTitle>{normalizedQuery ? "No matching blogs" : "No blogs yet"}</CardTitle>
                        <CardDescription>
                            {normalizedQuery
                                ? "Try a different title filter or clear it to see every post."
                                : "Create your first post and it will appear here for editing and publishing."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {!normalizedQuery ? (
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href={`/admin/${username}/write`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Start writing
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setQuery("")}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear filter
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {filteredBlogs.map((blog) => {
                        const isPublished = blog.status === "published"

                        return (
                            <Card
                                key={blog.id}
                                className="group overflow-hidden border-border/60 bg-card/90 px-6 py-8 shadow-sm transition-transform duration-200 hover:shadow-md hover:outline hover:outline-1 hover:outline-primary/40"
                            >
                                <CardHeader className="gap-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <Badge
                                            variant={getStatusVariant(blog.status)}
                                            className="rounded-full px-3 py-1"
                                        >
                                            {isPublished ? "Published" : "Draft"}
                                        </Badge>

                                        <div className="text-xs text-muted-foreground">
                                            {formatDate(blog.publishedAt ?? blog.updatedAt)}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl tracking-tight">
                                            {blog.title || "Untitled blog"}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3 max-w-2xl text-sm leading-6">
                                            {blog.excerpt || "No excerpt yet. The editor content will generate it automatically."}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-wrap gap-2 pt-0">
                                    <Button asChild className="rounded-md px-5 py-4">
                                        <Link href={`/admin/${username}/write?id=${blog.id}`}>
                                            <FilePenLine className="h-6 w-6" />
                                            Edit
                                        </Link>
                                    </Button>

                                    {isPublished ? (
                                        <Button asChild variant="outline" className="rounded-md px-5 py-4">
                                            <Link href={`/blogs/${blog.id}`}>
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Open public view
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="rounded-md px-5 py-4">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Publish to view live
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </>
    )
}