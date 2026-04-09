import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Plus, PlusCircle, Sparkles } from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ThemeToggle } from "@/components/common/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/model/Blog"
import { AdminBlogsClient } from "@/components/admin/admin-blogs-client"

type AdminBlogListItem = {
    id: string
    title: string
    excerpt: string
    status: "draft" | "published"
    publishedAt: string | null
    updatedAt: string | null
}

export default async function AdminBlogsPage({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params

    const session = await getServerSession(authOptions)

    if (!session?.user?._id || !session.user.username) {
        redirect("/login")
    }

    if (session.user.role !== "admin") {
        redirect(`/u/${session.user.username}`)
    }

    if (session.user.username !== username) {
        redirect(`/admin/${session.user.username}/blogs`)
    }

    await dbConnect()

    const blogs = await BlogModel.find({})
        .sort({ updatedAt: -1 })
        .select("title excerpt status publishedAt updatedAt")
        .lean()

    const serializedBlogs: AdminBlogListItem[] = blogs.map((blog: any) => ({
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        status: blog.status === "published" ? "published" : "draft",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : null,
    }))

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Blogs</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.02),transparent_55%)]" />
                        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
                            <div className="max-w-3xl space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Publishing workspace
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Manage drafts and published stories
                                    </h2>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Search by title, jump back into editing, and open live posts only when they are published.
                                    </p>
                                </div>
                            </div>

                            <Button asChild className="h-11 rounded-md px-4">
                                <Link href={`/admin/${username}/write`}>
                                    <PlusCircle className="h-12 w-12" />
                                    New blog
                                </Link>
                            </Button>
                        </div>
                    </section>

                    <AdminBlogsClient username={username} blogs={serializedBlogs} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}