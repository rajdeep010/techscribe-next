import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import SupportTicketModel from "@/model/SupportTicket";
import { supportTicketSchema } from "@/lib/validations/support";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const tickets = await SupportTicketModel.find({
            userId: session.user._id,
        })
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
            resolvedAt: ticket.resolvedAt
                ? new Date(ticket.resolvedAt).toISOString()
                : null,
        }));

        return NextResponse.json({
            success: true,
            tickets: serializedTickets,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to load your support tickets" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?._id || !session.user.username || !session.user.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const parsed = supportTicketSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsed.error.issues[0]?.message || "Invalid support request",
                },
                { status: 400 }
            );
        }

        const ticket = await SupportTicketModel.create({
            userId: session.user._id,
            username: session.user.username,
            email: session.user.email,
            role: session.user.role ?? "user",
            subject: parsed.data.subject,
            category: parsed.data.category,
            message: parsed.data.message,
            status: "open",
            resolvedAt: null,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Support request submitted successfully",
                ticketId: ticket._id.toString(),
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to submit support request" },
            { status: 500 }
        );
    }
}