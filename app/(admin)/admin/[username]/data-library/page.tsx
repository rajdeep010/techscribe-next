import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AdminDataLibrary } from "@/components/admin/admin-data-library";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle-button";
import { formatBytes } from "@/lib/assignments/files";
import dbConnect from "@/lib/dbConnect";
import AssignmentFileModel from "@/model/AssignmentFile";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

function serializeAssignmentFile(file: any) {
    return {
        id: String(file._id),
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        sizeLabel: formatBytes(file.sizeBytes),
        status: file.status,
        storageProvider: file.storageProvider,
        bucket: file.bucket,
        storagePath: file.storagePath,
        isVisibleToUser: Boolean(file.isVisibleToUser),
        createdAt: new Date(file.createdAt).toISOString(),
        markedForDeletionAt: file.markedForDeletionAt
            ? new Date(file.markedForDeletionAt).toISOString()
            : null,
        deleteAfter: file.deleteAfter ? new Date(file.deleteAfter).toISOString() : null,
        downloadUrl: `/api/files/${String(file._id)}/download`,
        assignment: {
            id: String(file.assignment?._id ?? ""),
            title: file.assignment?.title ?? "Untitled assignment",
            status: file.assignment?.status ?? "submitted",
        },
        owner: {
            id: String(file.ownerUser?._id ?? ""),
            name: file.ownerUser?.name ?? "",
            username: file.ownerUser?.username ?? "",
            email: file.ownerUser?.email ?? "",
        },
    };
}

export default async function AdminDataLibraryPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || !session.user.username) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect(`/u/${session.user.username}`);
    }

    if (session.user.username !== username) {
        redirect(`/admin/${session.user.username}/data-library`);
    }

    await dbConnect();

    const files = await AssignmentFileModel.find({
        status: { $ne: "deleted" },
    })
        .populate("assignment", "title status")
        .populate("ownerUser", "name username email")
        .sort({ createdAt: -1 })
        .lean();

    const initialFiles = files.map(serializeAssignmentFile);

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <h1 className="text-lg font-semibold">Data Library</h1>
                    </div>
                    <div className="px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
                    <AdminDataLibrary initialFiles={initialFiles} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}