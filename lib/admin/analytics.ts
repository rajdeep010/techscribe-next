import "server-only";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import AssignmentModel from "@/model/Assignment";
import InquiryModel from "@/model/Inquiry";
import RevenueModel from "@/model/Revenue";

export type Trend = "up" | "down";

export type ChangeStat = {
    value: number;
    change: string;
    trend: Trend;
};

function daysAgo(days: number, from: Date = new Date()) {
    return new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
}

/** { current period, previous period of equal length } for a rolling N-day window ending now. */
function rollingWindow(days: number) {
    const now = new Date();
    const start = daysAgo(days, now);
    const previousStart = daysAgo(days, start);
    return { now, start, previousStart };
}

export function computeChange(current: number, previous: number): { change: string; trend: Trend } {
    if (previous === 0) {
        if (current === 0) return { change: "0%", trend: "up" };
        return { change: "+100%", trend: "up" };
    }

    const pct = ((current - previous) / previous) * 100;
    const rounded = Math.round(pct * 10) / 10;
    const sign = rounded >= 0 ? "+" : "";
    return { change: `${sign}${rounded}%`, trend: rounded >= 0 ? "up" : "down" };
}

async function sumRevenue(start: Date, end: Date): Promise<number> {
    const result = await RevenueModel.aggregate<{ _id: null; total: number }>([
        { $match: { receivedAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total ?? 0;
}

export type DashboardStats = {
    totalRevenue: ChangeStat;
    newCustomers: ChangeStat;
    activeAccounts: ChangeStat;
    assignmentVolume: ChangeStat;
};

/** Top-line dashboard cards: rolling 30-day window vs the prior 30 days. */
export async function getDashboardStats(): Promise<DashboardStats> {
    await dbConnect();
    const { now, start, previousStart } = rollingWindow(30);

    const [
        revenueNow,
        revenuePrev,
        newCustomers,
        newCustomersPrev,
        activeAccounts,
        activeAccountsPrev,
        assignmentsNow,
        assignmentsPrev,
    ] = await Promise.all([
        sumRevenue(start, now),
        sumRevenue(previousStart, start),
        UserModel.countDocuments({ createdAt: { $gte: start, $lte: now } }),
        UserModel.countDocuments({ createdAt: { $gte: previousStart, $lt: start } }),
        UserModel.countDocuments({ isVerified: true, createdAt: { $lte: now } }),
        UserModel.countDocuments({ isVerified: true, createdAt: { $lte: start } }),
        AssignmentModel.countDocuments({ createdAt: { $gte: start, $lte: now } }),
        AssignmentModel.countDocuments({ createdAt: { $gte: previousStart, $lt: start } }),
    ]);

    return {
        totalRevenue: { value: revenueNow, ...computeChange(revenueNow, revenuePrev) },
        newCustomers: { value: newCustomers, ...computeChange(newCustomers, newCustomersPrev) },
        activeAccounts: { value: activeAccounts, ...computeChange(activeAccounts, activeAccountsPrev) },
        assignmentVolume: { value: assignmentsNow, ...computeChange(assignmentsNow, assignmentsPrev) },
    };
}

export type DailyPoint = { date: string; value: number };

/** Daily assignment-submission volume for the trailing `days` days (gaps filled with 0). */
export async function getAssignmentVolumeSeries(days = 90): Promise<DailyPoint[]> {
    await dbConnect();
    const start = daysAgo(days);
    start.setHours(0, 0, 0, 0);

    const results = await AssignmentModel.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: start } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
    ]);

    const byDay = new Map(results.map((row) => [row._id, row.count]));
    const series: DailyPoint[] = [];

    for (let i = days; i >= 0; i -= 1) {
        const d = daysAgo(i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        series.push({ date: label, value: byDay.get(key) ?? 0 });
    }

    return series;
}

async function dailyInquiryCounts(days: number): Promise<number[]> {
    const start = daysAgo(days - 1);
    start.setHours(0, 0, 0, 0);

    const results = await InquiryModel.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: start } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
    ]);

    const byDay = new Map(results.map((row) => [row._id, row.count]));
    const series: number[] = [];

    for (let i = days - 1; i >= 0; i -= 1) {
        const key = daysAgo(i).toISOString().slice(0, 10);
        series.push(byDay.get(key) ?? 0);
    }

    return series;
}

function monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
    return date.toLocaleDateString("en-US", { month: "short" });
}

/** Monthly document counts for the trailing `months` months, matched on `dateField`. */
async function monthlyCountSeries(
    model: typeof AssignmentModel,
    dateField: string,
    months: number,
    extraMatch: Record<string, unknown> = {}
): Promise<{ name: string; value: number }[]> {
    const start = new Date();
    start.setMonth(start.getMonth() - (months - 1), 1);
    start.setHours(0, 0, 0, 0);

    const results = await model.aggregate<{ _id: string; count: number }>([
        { $match: { ...extraMatch, [dateField]: { $gte: start } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m", date: `$${dateField}` },
                },
                count: { $sum: 1 },
            },
        },
    ]);

    const byMonth = new Map(results.map((row) => [row._id, row.count]));
    const series: { name: string; value: number }[] = [];

    for (let i = months - 1; i >= 0; i -= 1) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        series.push({ name: monthLabel(d), value: byMonth.get(monthKey(d)) ?? 0 });
    }

    return series;
}

async function monthlyRevenueSeries(months: number): Promise<{ date: string; value: number }[]> {
    const start = new Date();
    start.setMonth(start.getMonth() - (months - 1), 1);
    start.setHours(0, 0, 0, 0);

    const results = await RevenueModel.aggregate<{ _id: string; total: number }>([
        { $match: { receivedAt: { $gte: start } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$receivedAt" } },
                total: { $sum: "$amount" },
            },
        },
    ]);

    const byMonth = new Map(results.map((row) => [row._id, row.total]));
    const series: { date: string; value: number }[] = [];

    for (let i = months - 1; i >= 0; i -= 1) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        series.push({ date: monthLabel(d), value: byMonth.get(monthKey(d)) ?? 0 });
    }

    return series;
}

export type AnalyticsSummary = {
    newLeads: ChangeStat & { sparkline: number[] };
    reviewersAssigned: ChangeStat;
    revenue: ChangeStat;
    projectsWon: ChangeStat;
    leadsBySource: { name: string; value: number; color: string }[];
    assignmentsByMonth: { name: string; value: number }[];
    revenueByMonth: { date: string; value: number }[];
};

const SOURCE_LABELS: Record<string, { name: string; color: string }> = {
    "contact-form": { name: "Contact Page", color: "#7c3aed" },
    "order-form": { name: "Free Brief Check", color: "#06b6d4" },
};

/** Everything the Analytics page needs, computed in one pass. */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await dbConnect();
    const { now, start: start30, previousStart: prevStart30 } = rollingWindow(30);
    const { start: start180, previousStart: prevStart180 } = rollingWindow(180);

    const [
        leadsNow,
        leadsPrev,
        leadsSparkline,
        reviewersAssignedNow,
        reviewersAssignedPrev,
        revenueNow,
        revenuePrev,
        projectsWonNow,
        projectsWonPrev,
        leadsBySourceAgg,
        assignmentsByMonth,
        revenueByMonth,
    ] = await Promise.all([
        InquiryModel.countDocuments({ createdAt: { $gte: start30, $lte: now } }),
        InquiryModel.countDocuments({ createdAt: { $gte: prevStart30, $lt: start30 } }),
        dailyInquiryCounts(7),
        AssignmentModel.countDocuments({
            assignedReviewer: { $ne: null },
            assignmentLockedAt: { $gte: start30, $lte: now },
        }),
        AssignmentModel.countDocuments({
            assignedReviewer: { $ne: null },
            assignmentLockedAt: { $gte: prevStart30, $lt: start30 },
        }),
        sumRevenue(start180, now),
        sumRevenue(prevStart180, start180),
        AssignmentModel.countDocuments({ status: "completed", completedAt: { $gte: start180, $lte: now } }),
        AssignmentModel.countDocuments({ status: "completed", completedAt: { $gte: prevStart180, $lt: start180 } }),
        InquiryModel.aggregate<{ _id: string; count: number }>([
            { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
        monthlyCountSeries(AssignmentModel, "createdAt", 6),
        monthlyRevenueSeries(6),
    ]);

    const leadsBySource = leadsBySourceAgg.map((row) => {
        const meta = SOURCE_LABELS[row._id] ?? { name: row._id, color: "#a855f7" };
        return { name: meta.name, value: row.count, color: meta.color };
    });

    return {
        newLeads: { value: leadsNow, ...computeChange(leadsNow, leadsPrev), sparkline: leadsSparkline },
        reviewersAssigned: { value: reviewersAssignedNow, ...computeChange(reviewersAssignedNow, reviewersAssignedPrev) },
        revenue: { value: revenueNow, ...computeChange(revenueNow, revenuePrev) },
        projectsWon: { value: projectsWonNow, ...computeChange(projectsWonNow, projectsWonPrev) },
        leadsBySource,
        assignmentsByMonth,
        revenueByMonth,
    };
}
