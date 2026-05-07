import { NextResponse } from "next/server"

import { getPublicBlogs } from "@/lib/public-blog"

export async function GET() {
    try {
        const blogs = await getPublicBlogs()

        return NextResponse.json({
            success: true,
            blogs,
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