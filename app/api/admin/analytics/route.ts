import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { getAnalyticsSummary } from "@/lib/admin/analytics";

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
        }

        const summary = await getAnalyticsSummary();

        return NextResponse.json({ success: true, summary });
    } catch (error) {
        console.error("Failed to load analytics summary:", error);
        return NextResponse.json(
            { success: false, message: "Failed to load analytics summary" },
            { status: 500 }
        );
    }
}
