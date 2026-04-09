import mongoose from "mongoose"
import { NextResponse } from "next/server"

import { requireAdminSession } from "@/lib/auth/admin"
import dbConnect from "@/lib/dbConnect"
import { deriveBlogMetaFromContent } from "@/lib/blog"
import { blogUpsertSchema } from "@/lib/validations/blog"
import BlogModel from "@/model/Blog"

function serializeBlog(blog: any) {
    return {
        id: String(blog._id),
        title: blog.title ?? "Untitled blog",
        excerpt: blog.excerpt ?? "",
        contentJson: blog.contentJson ?? {
            type: "doc",
            content: [{ type: "paragraph" }],
        },
        contentHtml: blog.contentHtml ?? "",
        autosaveEnabled: Boolean(blog.autosaveEnabled),
        status: blog.status ?? "draft",
        createdAt: new Date(blog.createdAt).toISOString(),
        updatedAt: new Date(blog.updatedAt).toISOString(),
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ blogId: string }> }
) {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        const { blogId } = await params

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json(
                { success: false, message: "Invalid blog id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const blog = await BlogModel.findById(blogId).lean()

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            blog: serializeBlog(blog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch blog",
            },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ blogId: string }> }
) {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        const { blogId } = await params

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json(
                { success: false, message: "Invalid blog id" },
                { status: 400 }
            )
        }

        await dbConnect()

        const existingBlog = await BlogModel.findById(blogId)

        if (!existingBlog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            )
        }

        const body = await request.json()
        const parsed = blogUpsertSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsed.error.issues[0]?.message || "Invalid blog payload",
                },
                { status: 400 }
            )
        }

        const { title, excerpt } = deriveBlogMetaFromContent(parsed.data.contentJson)

        existingBlog.title = title
        existingBlog.excerpt = excerpt
        existingBlog.contentJson = parsed.data.contentJson
        existingBlog.contentHtml = parsed.data.contentHtml
        existingBlog.autosaveEnabled = parsed.data.autosaveEnabled
        existingBlog.status = parsed.data.status

        if (parsed.data.status === "published" && !existingBlog.publishedAt) {
            existingBlog.publishedAt = new Date()
        }

        if (parsed.data.status === "draft") {
            existingBlog.publishedAt = null
        }

        await existingBlog.save()

        return NextResponse.json({
            success: true,
            message: "Blog updated successfully",
            blog: serializeBlog(existingBlog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update blog",
            },
            { status: 500 }
        )
    }
}