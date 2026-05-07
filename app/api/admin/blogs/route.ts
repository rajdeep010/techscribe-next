import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

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

export async function GET() {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        await dbConnect()

        const blogs = await BlogModel.find({})
            .sort({ updatedAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            blogs: blogs.map(serializeBlog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch blogs",
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const auth = await requireAdminSession()

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            )
        }

        if (!auth.session.user._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        await dbConnect()

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

        const blog = await BlogModel.create({
            title,
            excerpt,
            contentJson: parsed.data.contentJson,
            contentHtml: parsed.data.contentHtml,
            autosaveEnabled: parsed.data.autosaveEnabled,
            author: auth.session.user._id,
            status: parsed.data.status,
            publishedAt: parsed.data.status === "published" ? new Date() : null,
        })

        revalidatePath("/blogs")

        if (blog.status === "published") {
            revalidatePath(`/blogs/${String(blog._id)}`)
        }

        return NextResponse.json({
            success: true,
            message: "Blog created successfully",
            blog: serializeBlog(blog),
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to create blog",
            },
            { status: 500 }
        )
    }
}