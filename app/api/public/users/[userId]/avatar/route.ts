import { NextResponse } from "next/server"
import { Types } from "mongoose"

import dbConnect from "@/lib/dbConnect"
import { storageProvider } from "@/lib/storage"
import { AVATAR_IMAGES_BUCKET, DEFAULT_AVATAR_URL, isStoredAvatarPath } from "@/lib/user-avatar"
import UserModel from "@/model/User"

const AVATAR_URL_TTL_SECONDS = 60 * 60

export async function GET(
    request: Request,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await context.params

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.redirect(DEFAULT_AVATAR_URL)
        }

        await dbConnect()

        const user = await UserModel.findById(userId).select("avatar").lean()
        const avatar = user?.avatar

        if (!avatar) {
            return NextResponse.redirect(DEFAULT_AVATAR_URL)
        }

        const avatarValue = String(avatar)

        if (!isStoredAvatarPath(avatarValue)) {
            if (avatarValue.startsWith("/")) {
                return NextResponse.redirect(new URL(avatarValue, request.url))
            }

            return NextResponse.redirect(avatarValue)
        }

        const signed = await storageProvider.createSignedDownloadUrl({
            provider: "supabase",
            bucket: AVATAR_IMAGES_BUCKET,
            path: avatarValue,
            expiresInSeconds: AVATAR_URL_TTL_SECONDS,
            download: false,
        })

        return NextResponse.redirect(signed.url)
    } catch {
        return NextResponse.redirect(DEFAULT_AVATAR_URL)
    }
}