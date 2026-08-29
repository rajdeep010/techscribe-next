import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import InquiryModel from "@/model/Inquiry";
import { inquirySchema, MAX_INQUIRY_ATTACHMENT_BYTES } from "@/lib/validations/inquiry";
import { sendEmail } from "@/lib/email/send-email";
import { newInquiryAdminEmail, inquiryReceivedUserEmail } from "@/lib/email/templates";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const raw = {
            name: (formData.get("name") as string) || undefined,
            email: (formData.get("email") as string) || undefined,
            whatsappNumber: (formData.get("whatsappNumber") as string) || "",
            assignmentType: (formData.get("assignmentType") as string) || undefined,
            deadline: (formData.get("deadline") as string) || undefined,
            message: (formData.get("message") as string) || "",
            source: (formData.get("source") as string) || "contact-form",
        };

        const parsed = inquirySchema.safeParse(raw);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0]?.message || "Invalid submission" },
                { status: 400 }
            );
        }

        const file = formData.get("attachment");
        const hasFile = file instanceof File && file.size > 0;

        if (hasFile && (file as File).size > MAX_INQUIRY_ATTACHMENT_BYTES) {
            return NextResponse.json(
                { success: false, message: "Attachment is too large (max 20MB)" },
                { status: 400 }
            );
        }

        await dbConnect();

        const inquiry = await InquiryModel.create({
            name: parsed.data.name || "",
            email: parsed.data.email || "",
            whatsappNumber: parsed.data.whatsappNumber,
            assignmentType: parsed.data.assignmentType || "",
            deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
            message: parsed.data.message,
            source: parsed.data.source,
            hadAttachment: hasFile,
            status: "new",
        });

        // Email delivery is best-effort: the inquiry is already saved and
        // visible to the admin even if sending fails (e.g. SMTP not configured).
        try {
            const attachments = hasFile
                ? [
                    {
                        filename: (file as File).name,
                        content: Buffer.from(await (file as File).arrayBuffer()),
                        contentType: (file as File).type || undefined,
                    },
                ]
                : undefined;

            const adminEmail = newInquiryAdminEmail({
                name: parsed.data.name,
                email: parsed.data.email,
                whatsappNumber: parsed.data.whatsappNumber,
                assignmentType: parsed.data.assignmentType,
                deadline: parsed.data.deadline,
                message: parsed.data.message,
                source: parsed.data.source,
                hadAttachment: hasFile,
            });

            await sendEmail({
                to: CONTACT_INFO.adminNotifyEmail,
                subject: adminEmail.subject,
                html: adminEmail.html,
                text: adminEmail.text,
                attachments,
            });

            if (parsed.data.email) {
                const userEmail = inquiryReceivedUserEmail(parsed.data.name);
                await sendEmail({
                    to: parsed.data.email,
                    subject: userEmail.subject,
                    html: userEmail.html,
                    text: userEmail.text,
                });
            }
        } catch (emailError) {
            console.error("Failed to send inquiry emails:", emailError);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Thanks! We received your request and will get back to you shortly.",
                inquiryId: inquiry._id.toString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Inquiry submission error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong while submitting your request" },
            { status: 500 }
        );
    }
}
