import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { PublicBlogsClient } from "@/components/landing/public-blogs-client"
import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/model/Blog"

export type PublicBlogListItem = {
    id: string
    title: string
    excerpt: string
    contentHtml: string
    publishedAt: string | null
    updatedAt: string
}

export default async function BlogsPage() {
    await dbConnect()

    const blogs = await BlogModel.find({ status: "published" })
        .sort({ publishedAt: -1, updatedAt: -1 })
        .select("title excerpt contentHtml publishedAt updatedAt")
        .lean()

    const serializedBlogs: PublicBlogListItem[] = blogs.map((blog: any) => ({
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        contentHtml: blog.contentHtml ?? "",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        updatedAt: new Date(blog.updatedAt).toISOString(),
    }))

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main>
                <PublicBlogsClient blogs={serializedBlogs} />
            </main>

            <Footer />
        </div>
    )
}