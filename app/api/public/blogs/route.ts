import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/model/Blog"

function serializePublicBlog(blog: any) {
    return {
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        contentHtml: blog.contentHtml ?? "",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        updatedAt: new Date(blog.updatedAt).toISOString(),
    }
}

export async function GET() {
    try {
        await dbConnect()

        const blogs = await BlogModel.find({ status: "published" })
            .sort({ publishedAt: -1, updatedAt: -1 })
            .select("title excerpt contentHtml publishedAt updatedAt")
            .lean()

        return NextResponse.json({
            success: true,
            blogs: blogs.map(serializePublicBlog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch public blogs",
            },
            { status: 500 }
        )
    }
}