import mongoose from "mongoose"
import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import BlogModel from "@/model/Blog"

function serializePublicBlog(blog: any) {
    return {
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        contentJson: blog.contentJson ?? {
            type: "doc",
            content: [{ type: "paragraph" }],
        },
        contentHtml: blog.contentHtml ?? "",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
        updatedAt: new Date(blog.updatedAt).toISOString(),
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ blogId: string }> }
) {
    try {
        const { blogId } = await params

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json(
                { success: false, message: "Invalid blog id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const blog = await BlogModel.findOne({
            _id: blogId,
            status: "published",
        })
            .select("title excerpt contentJson contentHtml publishedAt updatedAt")
            .lean()

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            blog: serializePublicBlog(blog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch public blog",
            },
            { status: 500 }
        )
    }
}