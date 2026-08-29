import "server-only";
import { CONTACT_INFO } from "@/lib/site-content/contact-info";

const BRAND_GRADIENT = "linear-gradient(135deg,#2e1065,#5b21b6,#7c3aed)";

function baseEmailShell(title: string, content: string, eyebrow = "Notification") {
  return `
    <div style="margin:0;padding:0;background:#f4f1fb;font-family:Arial,Helvetica,sans-serif;color:#1e1b2e;">
      <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border:1px solid #e6e1f7;border-radius:20px;overflow:hidden;box-shadow:0 12px 30px -18px rgba(91,33,182,0.45);">
          <div style="padding:28px 28px 24px 28px;background:${BRAND_GRADIENT};">
            <div style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.75);">
              ${CONTACT_INFO.brandName}
            </div>
            <div style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#c4b5fd;margin-top:10px;">
              ${eyebrow}
            </div>
            <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.3;color:#ffffff;">
              ${title}
            </h1>
          </div>
          <div style="padding:28px;">
            ${content}
          </div>
          <div style="padding:16px 28px;background:#faf9ff;border-top:1px solid #eee9fb;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
              ${CONTACT_INFO.brandName} &middot; ${CONTACT_INFO.supportEmail} &middot; ${CONTACT_INFO.phoneDisplay}
            </p>
          </div>
        </div>
        <p style="margin:16px 8px 0 8px;font-size:12px;line-height:1.6;color:#8b8698;text-align:center;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `;
}

function otpBlock(code: string) {
  return `
    <div style="margin:24px 0;padding:18px 20px;border-radius:16px;background:#f3effc;border:1px solid #d9cdf5;text-align:center;">
      <div style="font-size:32px;letter-spacing:10px;font-weight:700;color:#5b21b6;">
        ${code}
      </div>
    </div>
  `;
}

export function userOtpEmail(username: string, verifyCode: string) {
  const subject = `Verify your ${CONTACT_INFO.brandName} account`;
  const html = baseEmailShell(
    "Verify your account",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Use the verification code below to complete your signup.
      </p>
      ${otpBlock(verifyCode)}
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#4b5563;">
        This code is valid for 10 minutes.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
        If the code expires, use the resend OTP option from the verification page.
      </p>
    `,
    "Account Verification"
  );

  const text = [
    `Hi ${username},`,
    "",
    "Use the verification code below to complete your signup:",
    "",
    verifyCode,
    "",
    "This code is valid for 10 minutes.",
  ].join("\n");

  return { subject, html, text };
}

export function accountVerifiedEmail(username: string) {
  const subject = `Your ${CONTACT_INFO.brandName} account is verified`;
  const html = baseEmailShell(
    "Account verified",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Your account has been verified successfully. You can now sign in and access your dashboard.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
        Thanks for joining ${CONTACT_INFO.brandName}.
      </p>
    `,
    "Account Verification"
  );

  const text = [
    `Hi ${username},`,
    "",
    "Your account has been verified successfully.",
    "You can now sign in and access your dashboard.",
  ].join("\n");

  return { subject, html, text };
}

export function passwordChangeOtpEmail(username: string, code: string) {
  const subject = `Confirm your ${CONTACT_INFO.brandName} password change`;
  const html = baseEmailShell(
    "Confirm your password change",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        We received a request to update your password. Use the OTP below to confirm the change.
      </p>
      ${otpBlock(code)}
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#4b5563;">
        This code is valid for 10 minutes.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
        If you did not request this change, do not share this code and keep your current password unchanged.
      </p>
    `,
    "Account Security"
  );

  const text = [
    `Hi ${username},`,
    "",
    "We received a request to update your password.",
    "Use the OTP below to confirm the change:",
    "",
    code,
    "",
    "This code is valid for 10 minutes.",
  ].join("\n");

  return { subject, html, text };
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:14px;color:#1e1b2e;vertical-align:top;">${value}</td>
    </tr>
  `;
}

export type InquiryEmailDetails = {
  name?: string;
  email?: string;
  whatsappNumber: string;
  assignmentType?: string;
  deadline?: string;
  message: string;
  source: "contact-form" | "order-form";
  hadAttachment: boolean;
};

export function newInquiryAdminEmail(inquiry: InquiryEmailDetails) {
  const sourceLabel =
    inquiry.source === "order-form" ? "Free Brief Check (Hero form)" : "Contact page form";

  const subject = `New lead: ${inquiry.name || inquiry.whatsappNumber} (${sourceLabel})`;

  const html = baseEmailShell(
    "You've got a new lead",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        A visitor just submitted the <strong>${sourceLabel}</strong>. Details below:
      </p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee9fb;">
        ${detailRow("Name", inquiry.name || "&mdash;")}
        ${detailRow("WhatsApp", inquiry.whatsappNumber)}
        ${detailRow("Email", inquiry.email || "&mdash;")}
        ${detailRow("Assignment Type", inquiry.assignmentType || "&mdash;")}
        ${detailRow("Deadline", inquiry.deadline || "&mdash;")}
        ${detailRow("Attachment", inquiry.hadAttachment ? "Yes (attached to this email)" : "No")}
      </table>
      <p style="margin:20px 0 6px 0;font-size:13px;color:#6b7280;">Message</p>
      <div style="padding:14px 16px;border-radius:12px;background:#f8f7fc;border:1px solid #eee9fb;font-size:14px;line-height:1.7;white-space:pre-wrap;">${inquiry.message}</div>
      <p style="margin:20px 0 0 0;font-size:13px;line-height:1.7;color:#6b7280;">
        Reply on WhatsApp: <a href="https://wa.me/${inquiry.whatsappNumber.replace(/\D/g, "")}" style="color:#5b21b6;">${inquiry.whatsappNumber}</a>
      </p>
    `,
    "New Website Inquiry"
  );

  const text = [
    `New lead from ${sourceLabel}`,
    "",
    `Name: ${inquiry.name || "-"}`,
    `WhatsApp: ${inquiry.whatsappNumber}`,
    `Email: ${inquiry.email || "-"}`,
    `Assignment Type: ${inquiry.assignmentType || "-"}`,
    `Deadline: ${inquiry.deadline || "-"}`,
    `Attachment: ${inquiry.hadAttachment ? "Yes" : "No"}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");

  return { subject, html, text };
}

export function inquiryReceivedUserEmail(name?: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const subject = `We received your request — ${CONTACT_INFO.brandName}`;

  const html = baseEmailShell(
    "We've got your request",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        ${greeting}
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Thanks for reaching out to ${CONTACT_INFO.brandName}. Our team has received your details and
        one of our academic experts will get back to you shortly, usually within a few hours.
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        If your request is urgent, you can also chat with us directly on WhatsApp.
      </p>
      <div style="margin:24px 0;text-align:center;">
        <a href="${CONTACT_INFO.whatsappLink}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:${BRAND_GRADIENT};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
          Chat on WhatsApp
        </a>
      </div>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
        Talk soon,<br />The ${CONTACT_INFO.brandName} Team
      </p>
    `,
    "Request Received"
  );

  const text = [
    greeting,
    "",
    `Thanks for reaching out to ${CONTACT_INFO.brandName}. Our team has received your details and will get back to you shortly.`,
    "",
    `Chat on WhatsApp: ${CONTACT_INFO.whatsappLink}`,
    "",
    `The ${CONTACT_INFO.brandName} Team`,
  ].join("\n");

  return { subject, html, text };
}
