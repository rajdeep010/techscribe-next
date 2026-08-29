import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { getDashboardStats, getAssignmentVolumeSeries } from "@/lib/admin/analytics";

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        const [stats, assignmentVolume] = await Promise.all([
            getDashboardStats(),
            getAssignmentVolumeSeries(90),
        ]);

        return NextResponse.json({ success: true, stats, assignmentVolume });
    } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load dashboard stats" },
            { status: 500 }
        );
    }
}
