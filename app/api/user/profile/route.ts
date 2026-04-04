import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { profileUpdateSchema } from "@/lib/validations/user";

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const parsed = profileUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsed.error.issues[0]?.message || "Invalid profile data",
                },
                { status: 400 }
            );
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user._id,
            {
                $set: {
                    name: parsed.data.name,
                    about: parsed.data.about,
                    location: parsed.data.location,
                    linkedin: parsed.data.linkedin,
                    profile: parsed.data.profile,
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name ?? "",
                about: updatedUser.about ?? "",
                location: updatedUser.location ?? "",
                linkedin: updatedUser.linkedin ?? "",
                profile: updatedUser.profile ?? "",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update profile" },
            { status: 500 }
        );
    }
}