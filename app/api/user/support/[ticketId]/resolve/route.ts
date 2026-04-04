import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import SupportTicketModel from "@/model/SupportTicket";

export async function PATCH(
    _request: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const ticket = await SupportTicketModel.findOne({
            _id: ticketId,
            userId: session.user._id,
        });

        if (!ticket) {
            return NextResponse.json(
                { success: false, message: "Ticket not found" },
                { status: 404 }
            );
        }

        if (ticket.status === "resolved") {
            return NextResponse.json(
                { success: false, message: "Ticket is already resolved" },
                { status: 400 }
            );
        }

        ticket.status = "resolved";
        ticket.resolvedAt = new Date();
        await ticket.save();

        return NextResponse.json({
            success: true,
            message: "Ticket marked as resolved",
            ticket: {
                id: ticket._id.toString(),
                status: ticket.status,
                resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
                updatedAt: ticket.updatedAt.toISOString(),
            },
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to resolve ticket" },
            { status: 500 }
        );
    }
}