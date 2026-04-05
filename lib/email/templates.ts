import "server-only";

function baseEmailShell(title: string, content: string) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
          <div style="padding:24px 24px 8px 24px;background:linear-gradient(135deg,#eff6ff,#f8fafc);border-bottom:1px solid #e2e8f0;">
            <div style="font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">
              TechScribe
            </div>
            <h1 style="margin:12px 0 0 0;font-size:28px;line-height:1.2;color:#0f172a;">
              ${title}
            </h1>
          </div>
          <div style="padding:24px;">
            ${content}
          </div>
        </div>
        <p style="margin:16px 8px 0 8px;font-size:12px;line-height:1.6;color:#64748b;text-align:center;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `;
}

export function userOtpEmail(username: string, verifyCode: string) {
  const subject = "Verify your TechScribe account";
  const html = baseEmailShell(
    "Verify your account",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Use the verification code below to complete your signup.
      </p>
      <div style="margin:24px 0;padding:18px 20px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
        <div style="font-size:32px;letter-spacing:10px;font-weight:700;color:#1d4ed8;">
          ${verifyCode}
        </div>
      </div>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#475569;">
        This code is valid for 10 minutes.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
        If the code expires, use the resend OTP option from the verification page.
      </p>
    `
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
  const subject = "Your TechScribe account is verified";
  const html = baseEmailShell(
    "Account verified",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Your account has been verified successfully. You can now sign in and access your dashboard.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
        Thanks for joining TechScribe.
      </p>
    `
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
  const subject = "Confirm your TechScribe password change";
  const html = baseEmailShell(
    "Confirm your password change",
    `
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        Hi ${username},
      </p>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;">
        We received a request to update your password. Use the OTP below to confirm the change.
      </p>
      <div style="margin:24px 0;padding:18px 20px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
        <div style="font-size:32px;letter-spacing:10px;font-weight:700;color:#1d4ed8;">
          ${code}
        </div>
      </div>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#475569;">
        This code is valid for 10 minutes.
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
        If you did not request this change, do not share this code and keep your current password unchanged.
      </p>
    `
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