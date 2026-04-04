import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { requireAdminSession } from "@/lib/auth/admin";
import SupportTicketModel from "@/model/SupportTicket";

export async function GET() {
    try {
        const auth = await requireAdminSession();

        if (!auth.ok) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: auth.status }
            );
        }

        await dbConnect();

        const tickets = await SupportTicketModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        const serializedTickets = tickets.map((ticket: any) => ({
            id: String(ticket._id),
            userId: ticket.userId,
            username: ticket.username,
            email: ticket.email,
            role: ticket.role,
            subject: ticket.subject,
            category: ticket.category,
            message: ticket.message,
            status: ticket.status,
            createdAt: new Date(ticket.createdAt).toISOString(),
            updatedAt: new Date(ticket.updatedAt).toISOString(),
        }));

        return NextResponse.json({
            success: true,
            tickets: serializedTickets,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to fetch support tickets" },
            { status: 500 }
        );
    }
}