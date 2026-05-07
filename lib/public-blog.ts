import dbConnect from "@/lib/dbConnect"
import type { PublicBlogListItem } from "@/lib/public-blog-types"
import BlogModel from "@/model/Blog"

function serializePublicBlog(blog: any): PublicBlogListItem {
    return {
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        contentHtml: blog.contentHtml ?? "",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        updatedAt: new Date(blog.updatedAt).toISOString(),
    }
}

export async function getPublicBlogs(): Promise<PublicBlogListItem[]> {
    await dbConnect()

    const blogs = await BlogModel.find({ status: "published" })
        .sort({ publishedAt: -1, updatedAt: -1 })
        .select("title excerpt contentHtml publishedAt updatedAt")
        .lean()

    return blogs.map(serializePublicBlog)
}