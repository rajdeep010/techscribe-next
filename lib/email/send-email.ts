import "server-only";
import nodemailer from "nodemailer";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || CONTACT_INFO.brandName;

if (!EMAIL_FROM || !EMAIL_PASS) {
    throw new Error(
        "Email credentials are missing. Set EMAIL_FROM and EMAIL_PASS in server-only env."
    );
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS,
    },
});

type SendEmailAttachment = {
    filename: string;
    content: Buffer;
    contentType?: string;
};

type SendEmailOptions = {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: SendEmailAttachment[];
};

export async function sendEmail({
    to,
    subject,
    html,
    text,
    attachments,
}: SendEmailOptions): Promise<string> {
    try {
        const info = await transporter.sendMail({
            from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
            to,
            subject,
            html,
            text,
            attachments,
        });

        console.log('✅ Email sent:', info.messageId);
        return info.messageId;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Error sending email: ${message}`);
    }
}