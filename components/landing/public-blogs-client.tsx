"use client"

import Link from "next/link"
import { useDeferredValue } from "react"
import { ArrowRight, BookOpenText, Clock3, Search, Sparkles, X } from "lucide-react"

import { usePublicBlogs } from "@/context/PublicBlogsProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function stripHtml(value: string) {
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function formatDate(value?: string | null) {
    if (!value) {
        return "Recently updated"
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(value))
}

function getReadingTime(value: string) {
    const words = stripHtml(value).split(" ").filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min read`
}

export function PublicBlogsClient() {
    const { blogs, searchQuery, setSearchQuery, isLoading, error } = usePublicBlogs()

    const deferredQuery = useDeferredValue(searchQuery)
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    const filteredBlogs = normalizedQuery
        ? blogs.filter((blog) => blog.title.toLowerCase().includes(normalizedQuery))
        : blogs

    const featuredBlog = filteredBlogs[0]
    const otherBlogs = filteredBlogs.slice(1)

    return (
        <>
            <section className="relative overflow-hidden border-b">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.03))]" />
                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
                    <div className="max-w-4xl space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Public library
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                                Essays, guides, and editorial insights from the TechScribe team.
                            </h1>

                            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                Browse practical blog posts written inside TechScribe.
                                Filter by title and open every published article in a clean, public reading view.
                            </p>
                        </div>

                        <div className="flex max-w-2xl flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    inputMode="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Filter blog titles"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    data-1p-ignore="true"
                                    data-lpignore="true"
                                    className="h-12 rounded-full border-border/60 bg-background/90 pl-11 pr-4 backdrop-blur"
                                />
                            </div>

                            {searchQuery ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 rounded-full px-5"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur">
                                <BookOpenText className="h-4 w-4" />
                                {filteredBlogs.length} published post{filteredBlogs.length === 1 ? "" : "s"}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur">
                                <Clock3 className="h-4 w-4" />
                                Fresh editorial updates
                            </div>
                            {normalizedQuery ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur">
                                    Filter: "{searchQuery.trim()}"
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
                {error ? (
                    <Card className="mb-6 border-destructive/30 bg-destructive/5">
                        <CardContent className="p-4 text-sm text-destructive">
                            {error}
                        </CardContent>
                    </Card>
                ) : null}

                {featuredBlog ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-sm font-medium text-primary">
                                    {normalizedQuery ? "Top result" : "Featured post"}
                                </div>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                    {normalizedQuery
                                        ? "Start with the best title match"
                                        : "Start with the latest published article"}
                                </h2>
                            </div>
                        </div>

                        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm border-b">
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_36%)]" />

                                <div className="relative bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,253,250,0.95),rgba(239,246,255,0.94))] px-4 py-8 text-slate-900 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9),rgba(22,163,74,0.62))] dark:text-white">
                                    <div className="space-y-5 px-6 lg:px-12">
                                        <Badge className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/12 dark:text-white dark:hover:bg-white/12">
                                            Featured
                                        </Badge>

                                        <h3 className="max-w-5xl text-3xl font-semibold tracking-tight sm:text-4xl">
                                            {featuredBlog.title}
                                        </h3>

                                        <p className="max-w-4xl text-sm leading-7 text-slate-700 sm:text-base dark:text-white/80">
                                            {featuredBlog.excerpt || "Open this article to read the full post."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-white/70">
                                            <span>{formatDate(featuredBlog.publishedAt)}</span>
                                            <span>•</span>
                                            <span>{getReadingTime(featuredBlog.contentHtml)}</span>
                                        </div>

                                        <Button
                                            asChild
                                            variant="secondary"
                                            className="rounded-full border border-slate-200/70 bg-white/85 px-5 text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/12 dark:text-white dark:hover:bg-white/18"
                                        >
                                            <Link href={`/blogs/${featuredBlog.id}`}>
                                                Read article
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {otherBlogs.length > 0 ? (
                            <div className="space-y-5 pt-4">
                                <div>
                                    <div className="text-sm font-medium text-primary">More posts</div>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                        Explore the rest of the published library
                                    </h2>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {otherBlogs.map((blog) => (
                                        <Card
                                            key={blog.id}
                                            className="border-border/60 bg-card/80 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                                        >
                                            <CardContent className="space-y-5 p-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <Badge variant="outline" className="rounded-full">
                                                            {formatDate(blog.publishedAt)}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {getReadingTime(blog.contentHtml)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-semibold tracking-tight">
                                                        {blog.title}
                                                    </h3>

                                                    <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                                                        {blog.excerpt || "Open this article to read the full post."}
                                                    </p>
                                                </div>

                                                <Button asChild variant="outline" className="w-full rounded-full">
                                                    <Link href={`/blogs/${blog.id}`}>
                                                        Open post
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <Card className="border-dashed border-border/70 bg-muted/20">
                        <CardContent className="flex flex-col items-start gap-4 p-8">
                            <Badge variant="outline" className="rounded-full">
                                {normalizedQuery ? "No matching posts" : "Nothing published yet"}
                            </Badge>
                            <div className="max-w-xl space-y-2">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {normalizedQuery
                                        ? "No published blog matches your filter yet."
                                            : isLoading
                                                ? "Loading published blogs..."
                                                : "Public blog posts will appear here once an article is published."}
                                </h2>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {normalizedQuery
                                        ? "Try another title filter or clear it to browse every published post."
                                            : isLoading
                                                ? "Please wait while the latest posts are loaded."
                                                : "Drafts stay inside the admin area until you change a post to published."}
                                </p>
                            </div>
                            {normalizedQuery ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full"
                                        onClick={() => setSearchQuery("")}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear filter
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                )}
            </section>
        </>
    )
}