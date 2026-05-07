import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import { storageProvider } from "@/lib/storage"
import {
    AVATAR_IMAGES_BUCKET,
    MAX_AVATAR_FILE_SIZE_BYTES,
    buildUserAvatarStoragePath,
    getAvatarFileExtension,
    getUserAvatarUrl,
    isAllowedAvatarMimeType,
    isStoredAvatarPath,
} from "@/lib/user-avatar"
import UserModel from "@/model/User"

export async function POST(request: Request) {
    let uploadedRef: { bucket: string; path: string; provider: "supabase" | "r2" } | null = null

    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const avatarFile = formData.get("avatar")

        if (!(avatarFile instanceof File)) {
            return NextResponse.json(
                { success: false, message: "Please choose an image to upload" },
                { status: 400 }
            )
        }

        if (avatarFile.size === 0) {
            return NextResponse.json(
                { success: false, message: "The selected file is empty" },
                { status: 400 }
            )
        }

        if (avatarFile.size > MAX_AVATAR_FILE_SIZE_BYTES) {
            return NextResponse.json(
                { success: false, message: "Avatar image must be 5 MB or smaller" },
                { status: 400 }
            )
        }

        if (!isAllowedAvatarMimeType(avatarFile.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only JPG, PNG, WEBP, and GIF avatar images are supported",
                },
                { status: 400 }
            )
        }

        await dbConnect()

        const user = await UserModel.findById(session.user._id)

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }

        const previousAvatar = user.avatar
        const extension = getAvatarFileExtension(avatarFile.name, avatarFile.type)

        uploadedRef = await storageProvider.upload({
            bucket: AVATAR_IMAGES_BUCKET,
            path: buildUserAvatarStoragePath({
                userId: String(user._id),
                extension,
            }),
            body: Buffer.from(await avatarFile.arrayBuffer()),
            contentType: avatarFile.type,
            cacheControl: "31536000",
        })

        user.avatar = uploadedRef.path
        await user.save()

        if (typeof previousAvatar === "string" && isStoredAvatarPath(previousAvatar)) {
            try {
                await storageProvider.deleteFile({
                    provider: uploadedRef.provider,
                    bucket: AVATAR_IMAGES_BUCKET,
                    path: previousAvatar,
                })
            } catch {
                // best-effort cleanup of replaced avatar
            }
        }

        return NextResponse.json({
            success: true,
            message: "Avatar updated successfully",
            avatar: getUserAvatarUrl({
                userId: String(user._id),
                avatar: user.avatar,
                version: user.updatedAt.getTime(),
            }),
        })
    } catch (error) {
        if (uploadedRef) {
            try {
                await storageProvider.deleteFile(uploadedRef)
            } catch {
                // best-effort cleanup of failed upload
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update avatar",
            },
            { status: 500 }
        )
    }
}