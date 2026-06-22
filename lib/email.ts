import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@run-travel.com";
const BASE_URL = process.env.NEXTAUTH_URL || "https://cape-town-marathon-2027.vercel.app";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via Resend.
 * Falls back to console.log if Resend is not configured.
 */
async function sendEmail({ to, subject, html, text }: EmailParams): Promise<void> {
  if (!resend) {
    console.log("[EMAIL MOCK] To:", to, "Subject:", subject);
    console.log("[EMAIL MOCK] HTML preview (first 500 chars):", html.slice(0, 500));
    return;
  }

  try {
    await resend.emails.send({
      from: `RUN & Travel <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || stripHtml(html),
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Email Templates ───────────────────────────────────────

/**
 * T-1: Trainer application approved
 */
export async function sendTrainerApplicationApprovedEmail({
  to,
  trainerName,
  dashboardUrl,
}: {
  to: string;
  trainerName: string;
  dashboardUrl: string;
}): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Trainer Application is Approved</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #262626; }
    .logo { font-size: 24px; font-weight: 700; color: #14b8a6; letter-spacing: -0.5px; }
    .tagline { font-size: 13px; color: #a3a3a3; margin-top: 4px; }
    .content { padding: 30px 0; }
    .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #d4d4d4; margin-bottom: 16px; }
    .highlight { color: #14b8a6; font-weight: 600; }
    .button { display: inline-block; background: linear-gradient(135deg, #14b8a6, #0d9488); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #2dd4bf, #14b8a6); }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #262626; font-size: 12px; color: #737373; }
    .steps { background: #171717; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .step-number { width: 28px; height: 28px; background: #14b8a6; color: #0a0a0a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .step-text { font-size: 14px; color: #d4d4d4; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RUN & Travel</div>
      <div class="tagline">Cape Town Marathon 2027</div>
    </div>
    <div class="content">
      <div class="title">🎉 Welcome to the Team, ${escapeHtml(trainerName)}!</div>
      <div class="text">
        Your trainer application has been <span class="highlight">approved</span>. We're excited to have you as part of our elite coaching team for the Cape Town Marathon 2027.
      </div>
      <div class="text">Here's what to do next:</div>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-text"><strong>Complete your profile</strong> — Add your bio, photo, credentials, and specialties</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-text"><strong>Submit for review</strong> — Our team will verify your profile before it goes live</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text"><strong>Start coaching</strong> — Once published, runners can book sessions with you</div>
        </div>
      </div>
      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="button">Go to Trainer Dashboard</a>
      </div>
      <div class="text" style="font-size: 13px; color: #a3a3a3;">
        If you have any questions, reply to this email or contact us via Telegram.
      </div>
    </div>
    <div class="footer">
      © 2027 RUN & Travel — Cape Town Marathon<br>
      Africa's first Abbott World Marathon Major
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to,
    subject: "🎉 Your Trainer Application is Approved — Cape Town Marathon 2027",
    html,
  });
}

/**
 * T-1: Trainer application rejected
 */
export async function sendTrainerApplicationRejectedEmail({
  to,
  name,
  reason,
  reapplyUrl,
}: {
  to: string;
  name: string;
  reason: string;
  reapplyUrl: string;
}): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #262626; }
    .logo { font-size: 24px; font-weight: 700; color: #14b8a6; }
    .content { padding: 30px 0; }
    .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #d4d4d4; margin-bottom: 16px; }
    .reason-box { background: #451a03; border: 1px solid #92400e; border-radius: 12px; padding: 16px; margin: 20px 0; color: #fcd34d; }
    .button { display: inline-block; background: #404040; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #262626; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RUN & Travel</div>
    </div>
    <div class="content">
      <div class="title">Application Update</div>
      <div class="text">Hi ${escapeHtml(name)},</div>
      <div class="text">
        Thank you for your interest in joining our coaching team. After careful review, we have decided not to move forward with your application at this time.
      </div>
      <div class="reason-box">
        <strong>Reason:</strong> ${escapeHtml(reason)}
      </div>
      <div class="text">
        If you believe this decision was made in error or if your circumstances have changed, you're welcome to reapply in the future.
      </div>
      <div style="text-align: center;">
        <a href="${reapplyUrl}" class="button">Back to Trainers Page</a>
      </div>
    </div>
    <div class="footer">
      © 2027 RUN & Travel — Cape Town Marathon
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to,
    subject: "Your Trainer Application — Cape Town Marathon 2027",
    html,
  });
}

/**
 * T-3: Trainer moderation status change (approve/reject/suspend)
 */
export async function sendTrainerModerationEmail({
  to,
  trainerName,
  oldStatus,
  newStatus,
  reason,
  actionUrl,
}: {
  to: string;
  trainerName: string;
  oldStatus: string;
  newStatus: string;
  reason?: string;
  actionUrl: string;
}): Promise<void> {
  const statusColors: Record<string, string> = {
    PUBLISHED: "#14b8a6",
    REJECTED: "#ef4444",
    SUSPENDED: "#f59e0b",
    PENDING: "#3b82f6",
    DRAFT: "#6b7280",
  };

  const statusMessages: Record<string, string> = {
    PUBLISHED: "Your profile is now live! Runners can find and book you.",
    REJECTED: "Your profile needs changes before it can be published.",
    SUSPENDED: "Your profile has been temporarily suspended.",
    PENDING: "Your profile is under review.",
    DRAFT: "Your profile is in draft mode.",
  };

  const color = statusColors[newStatus] || "#6b7280";
  const message = statusMessages[newStatus] || "Your profile status has been updated.";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #262626; }
    .logo { font-size: 24px; font-weight: 700; color: #14b8a6; }
    .content { padding: 30px 0; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0; }
    .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 8px; }
    .text { font-size: 15px; line-height: 1.7; color: #d4d4d4; margin-bottom: 16px; }
    .reason-box { background: #171717; border-left: 4px solid ${color}; border-radius: 0 12px 12px 0; padding: 16px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, ${color}, ${color}dd); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #262626; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RUN & Travel</div>
    </div>
    <div class="content">
      <div class="title">Profile Status Update</div>
      <div class="text">Hi ${escapeHtml(trainerName)},</div>
      <div class="text">Your trainer profile status has been updated:</div>
      <div class="status-badge" style="background: ${color}22; color: ${color}; border: 1px solid ${color}44;">
        ${oldStatus} → ${newStatus}
      </div>
      <div class="text" style="font-weight: 500;">${message}</div>
      ${reason ? `<div class="reason-box"><strong>Admin note:</strong> ${escapeHtml(reason)}</div>` : ""}
      <div style="text-align: center;">
        <a href="${actionUrl}" class="button">View Your Profile</a>
      </div>
    </div>
    <div class="footer">
      © 2027 RUN & Travel — Cape Town Marathon
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to,
    subject: `Profile ${newStatus} — Cape Town Marathon 2027`,
    html,
  });
}

/**
 * T-2: Revision status change (approved/rejected)
 */
export async function sendTrainerRevisionStatusEmail({
  to,
  trainerName,
  status,
  moderationNote,
  profileUrl,
  dashboardUrl,
}: {
  to: string;
  trainerName: string;
  status: "APPROVED" | "REJECTED";
  moderationNote?: string | null;
  profileUrl?: string;
  dashboardUrl?: string;
}): Promise<void> {
  const isApproved = status === "APPROVED";
  const color = isApproved ? "#14b8a6" : "#ef4444";
  const title = isApproved ? "Revision Approved! 🎉" : "Revision Needs Changes";
  const message = isApproved
    ? "Your profile changes have been reviewed and approved. They are now live on your public profile."
    : "Your profile revision was not approved. Please review the feedback below and submit a new revision.";
  const actionUrl = isApproved ? profileUrl : dashboardUrl;
  const buttonText = isApproved ? "View Updated Profile" : "Edit Profile & Resubmit";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #262626; }
    .logo { font-size: 24px; font-weight: 700; color: #14b8a6; }
    .content { padding: 30px 0; }
    .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #d4d4d4; margin-bottom: 16px; }
    .reason-box { background: #171717; border-left: 4px solid ${color}; border-radius: 0 12px 12px 0; padding: 16px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, ${color}, ${color}dd); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #262626; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RUN & Travel</div>
    </div>
    <div class="content">
      <div class="title">${title}</div>
      <div class="text">Hi ${escapeHtml(trainerName)},</div>
      <div class="text">${message}</div>
      ${moderationNote ? `<div class="reason-box"><strong>Feedback:</strong> ${escapeHtml(moderationNote)}</div>` : ""}
      ${actionUrl ? `<div style="text-align: center;"><a href="${actionUrl}" class="button">${buttonText}</a></div>` : ""}
    </div>
    <div class="footer">
      © 2027 RUN & Travel — Cape Town Marathon
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to,
    subject: `${title} — Cape Town Marathon 2027`,
    html,
  });
}

/**
 * T-5: Admin notification on trainer submit
 */
export async function sendTrainerSubmissionNotificationEmail({
  to,
  trainerName,
  trainerEmail,
  submittedAt,
  adminUrl,
}: {
  to: string;
  trainerName: string;
  trainerEmail: string;
  submittedAt: Date;
  adminUrl: string;
}): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #262626; }
    .logo { font-size: 24px; font-weight: 700; color: #14b8a6; }
    .content { padding: 30px 0; }
    .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #d4d4d4; margin-bottom: 16px; }
    .info-box { background: #171717; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #262626; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #a3a3a3; font-size: 13px; }
    .value { color: #ffffff; font-weight: 500; }
    .button { display: inline-block; background: linear-gradient(135deg, #14b8a6, #0d9488); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding-top: 30px; border-top: 1px solid #262626; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RUN & Travel Admin</div>
    </div>
    <div class="content">
      <div class="title">New Trainer Submission</div>
      <div class="text">A trainer has submitted their profile for review.</div>
      <div class="info-box">
        <div class="info-row">
          <span class="label">Trainer</span>
          <span class="value">${escapeHtml(trainerName)}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">${escapeHtml(trainerEmail)}</span>
        </div>
        <div class="info-row">
          <span class="label">Submitted</span>
          <span class="value">${submittedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
      </div>
      <div style="text-align: center;">
        <a href="${adminUrl}" class="button">Review in Admin Panel</a>
      </div>
    </div>
    <div class="footer">
      © 2027 RUN & Travel — Cape Town Marathon
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to,
    subject: `🔔 New Trainer Submission: ${trainerName}`,
    html,
  });
}

// ─── Helpers ─────────────────────────────────────────────

function escapeHtml(text: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  // Server-side fallback
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
