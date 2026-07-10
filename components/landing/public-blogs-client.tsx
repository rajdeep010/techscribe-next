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

    const allBlogs = filteredBlogs

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="relative mb-7 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 via-cyan-500/8 to-emerald-500/8 p-4 dark:border-primary/30 dark:from-primary/12 dark:via-cyan-400/10 dark:to-emerald-400/10 sm:p-5">
                <div
                    className="pointer-events-none absolute -right-12 -top-16 hidden h-56 w-56 opacity-10 lg:block"
                    style={{
                        backgroundImage: "url('/undraw_blogging_38kl.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                    }}
                />
                <div
                    className="pointer-events-none absolute -left-16 -bottom-20 hidden h-60 w-60 opacity-8 lg:block"
                    style={{
                        backgroundImage: "url('/undraw_writing-online_x665.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                    }}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        Blog library
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5">
                            <BookOpenText className="h-4 w-4 text-primary" />
                            {filteredBlogs.length} post{filteredBlogs.length === 1 ? "" : "s"}
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5">
                            <Clock3 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                            Updated regularly
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            inputMode="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search blog titles"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            data-1p-ignore="true"
                            data-lpignore="true"
                            className="h-11 rounded-full border-border/70 bg-background/90 pl-11 pr-4 mt-2"
                        />
                    </div>

                    {searchQuery ? (
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-md px-5 text-sm font-semibold"
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    ) : null}
                </div>

                {normalizedQuery ? (
                    <div className="text-sm text-muted-foreground">
                        Filter active: &ldquo;{searchQuery.trim()}&rdquo;
                    </div>
                ) : null}
            </div>

            <section>
                {error ? (
                    <Card className="mb-6 border-destructive/30 bg-destructive/5">
                        <CardContent className="p-4 text-sm text-destructive">
                            {error}
                        </CardContent>
                    </Card>
                ) : null}

                {allBlogs.length > 0 ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-sm font-medium text-primary">
                                    {normalizedQuery ? "Top result" : "Latest posts"}
                                </div>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                    {normalizedQuery
                                        ? "Best matches for your search"
                                        : "Browse the newest published articles"}
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {allBlogs.map((blog, index) => {
                                const isLatest = index === 0 && !normalizedQuery

                                return (
                                    <Card
                                        key={blog.id}
                                        className={`bg-card/85 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${isLatest
                                            ? "border-primary/35 bg-gradient-to-br from-primary/10 via-cyan-500/8 to-emerald-500/8 dark:border-primary/45 dark:from-primary/15 dark:via-cyan-400/12 dark:to-emerald-400/12"
                                            : "border-primary/15 dark:border-primary/25"
                                            }`}
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

                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-xl font-semibold tracking-tight">
                                                        {blog.title}
                                                    </h3>
                                                    {/* <PenSquare className={`mt-0.5 h-5 w-5 shrink-0 ${toneClass}`} /> */}
                                                </div>

                                                {isLatest ? (
                                                    <Badge className="rounded-full border border-primary/30 bg-primary/12 text-primary hover:bg-primary/12 dark:border-primary/40 dark:bg-primary/20">
                                                        Latest
                                                    </Badge>
                                                ) : null}

                                                <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                                                    {blog.excerpt || "Open this article to read the full post."}
                                                </p>
                                            </div>

                                            <Button asChild variant="outline" className="h-11 w-full rounded-md text-sm font-semibold">
                                                <Link href={`/blogs/${blog.id}`}>
                                                    Open post
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
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
                                    className="h-11 rounded-md px-5 text-sm font-semibold"
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
        </section>
    )
}