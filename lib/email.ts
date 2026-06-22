import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  if (!resend) {
    console.warn("[Email] Resend not configured — email not sent");
    return false;
  }

  try {
    await resend.emails.send({
      from: "Cape Town Marathon 2027 <noreply@capetownmarathon2027.com>",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return false;
  }
}

export async function sendTrainerApplicationApprovedEmail(params: {
  to: string;
  trainerName: string | null;
  dashboardUrl: string;
}): Promise<boolean> {
  const { to, trainerName, dashboardUrl } = params;
  return sendEmail({
    to,
    subject: "Your Trainer Application Approved — Cape Town Marathon 2027",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #ff6b35; font-size: 28px; margin: 0;">🎉 Congratulations!</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          Hello <strong style="color: #ffffff;">${trainerName || "Trainer"}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          Your application to become a trainer for <strong style="color: #ff6b35;">Cape Town Marathon 2027</strong> has been approved.
        </p>
        <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 16px 0; color: #8b8b9a;">You can now complete your trainer profile in the dashboard:</p>
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6b35, #ff8c5a); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Go to Dashboard →
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #5a5a6a;">
          Complete your profile, add photos, set your availability, and submit for review to appear on our public trainer listing.
        </p>
        <hr style="border: none; border-top: 1px solid #1e1e2e; margin: 32px 0;">
        <p style="color: #5a5a6a; font-size: 12px; text-align: center;">
          Cape Town Marathon 2027 — RUN & Travel Platform<br>
          <span style="color: #ff6b35;">Africa's First Abbott World Marathon Major</span>
        </p>
      </div>
    `,
  });
}

export async function sendTrainerApplicationRejectedEmail(params: {
  to: string;
  trainerName: string | null;
  reason: string;
}): Promise<boolean> {
  const { to, trainerName, reason } = params;
  return sendEmail({
    to,
    subject: "Update on Your Trainer Application — Cape Town Marathon 2027",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #8b8b9a; font-size: 24px; margin: 0;">Application Update</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          Hello <strong style="color: #ffffff;">${trainerName || "Applicant"}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          Thank you for your interest in becoming a trainer for Cape Town Marathon 2027.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          After careful review, we are unable to approve your application at this time.
        </p>
        <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; color: #5a5a6a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Reason</p>
          <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.5;">${reason}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #5a5a6a;">
          If you have questions or would like to reapply in the future, please contact us through the website.
        </p>
        <hr style="border: none; border-top: 1px solid #1e1e2e; margin: 32px 0;">
        <p style="color: #5a5a6a; font-size: 12px; text-align: center;">
          Cape Town Marathon 2027 — RUN & Travel Platform
        </p>
      </div>
    `,
  });
}

export async function sendTrainerStatusChangeEmail(params: {
  to: string;
  trainerName: string | null;
  oldStatus: string;
  newStatus: string;
  reason?: string;
  actionUrl: string;
}): Promise<boolean> {
  const { to, trainerName, oldStatus, newStatus, reason, actionUrl } = params;

  const statusColors: Record<string, string> = {
    PUBLISHED: "#00d4aa", REJECTED: "#ff4444", SUSPENDED: "#ff8800",
    PENDING: "#4a9eff", DRAFT: "#8b8b9a",
  };
  const statusEmoji: Record<string, string> = {
    PUBLISHED: "✅", REJECTED: "❌", SUSPENDED: "🚫",
    PENDING: "⏳", DRAFT: "📝",
  };

  return sendEmail({
    to,
    subject: `${statusEmoji[newStatus] || "🔔"} Your Trainer Profile Status: ${newStatus}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: ${statusColors[newStatus] || "#ffffff"}; font-size: 24px; margin: 0;">
            ${statusEmoji[newStatus] || ""} Profile Status Update
          </h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #8b8b9a;">
          Hello <strong style="color: #ffffff;">${trainerName || "Trainer"}</strong>,
        </p>
        <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #5a5a6a;">Previous</span>
            <span style="color: #8b8b9a;">${oldStatus}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #5a5a6a;">Current</span>
            <span style="color: ${statusColors[newStatus] || "#ffffff"}; font-weight: 700;">${newStatus}</span>
          </div>
          ${reason ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1e1e2e;"><span style="color: #5a5a6a; display: block; margin-bottom: 8px;">Reason</span><span style="color: #ffffff;">${reason}</span></div>` : ""}
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${actionUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff6b35, #ff8c5a); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">View Dashboard →</a>
        </div>
        <hr style="border: none; border-top: 1px solid #1e1e2e; margin: 32px 0;">
        <p style="color: #5a5a6a; font-size: 12px; text-align: center;">Cape Town Marathon 2027 — RUN & Travel Platform<br><span style="color: #ff6b35;">Africa's First Abbott World Marathon Major</span></p>
      </div>
    `,
  });
}
