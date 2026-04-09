import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/", "/login", "/signup", "/verify", "/blogs"]

function isPublicPath(pathname: string) {
    return (
        PUBLIC_PATHS.some(
            (path) => pathname === path || pathname.startsWith(path + "/")
        ) || pathname.startsWith("/p/")
    )
}

function isAuthPage(pathname: string) {
    return (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/verify" ||
        pathname.startsWith("/verify/")
    )
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    if (token && isAuthPage(pathname)) {
        if (token.role === "admin" && token.username) {
            return NextResponse.redirect(new URL(`/admin/${token.username}`, request.url))
        }

        if (token.username) {
            return NextResponse.redirect(new URL(`/u/${token.username}`, request.url))
        }

        return NextResponse.redirect(new URL("/", request.url))
    }

    if (isPublicPath(pathname)) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/admin")) {
        if (token.role !== "admin") {
            return NextResponse.redirect(
                new URL(token.username ? `/u/${token.username}` : "/", request.url)
            )
        }
    }

    if (pathname.startsWith("/u/")) {
        if (token.role === "admin") {
            return NextResponse.redirect(
                new URL(token.username ? `/admin/${token.username}` : "/", request.url)
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}