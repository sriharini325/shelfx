const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ShelfX Library <no-reply@shelfx.app>',
      to,
      subject,
      html,
    });
  } catch (err) {
    // Email failures should never crash a borrow/return flow — log and move on.
    console.error(`[emailService] Failed to send "${subject}" to ${to}:`, err.message);
  }
}

function layout(title, bodyHtml) {
  return `
  <div style="font-family: Arial, sans-serif; background:#0b0f1a; padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#111827;border-radius:12px;overflow:hidden;border:1px solid #1f2a44;">
      <div style="background:linear-gradient(135deg,#0b1220,#1e3a8a);padding:20px 24px;">
        <span style="color:#60a5fa;font-size:20px;font-weight:bold;letter-spacing:1px;">ShelfX</span>
      </div>
      <div style="padding:24px;color:#e5e7eb;">
        <h2 style="color:#93c5fd;margin-top:0;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;background:#0b1220;color:#6b7280;font-size:12px;">
        ShelfX Library Network — this is an automated message.
      </div>
    </div>
  </div>`;
}

const emailTemplates = {
  dueReminder: ({ userName, bookTitle, dueDate, libraryName }) => layout(
    'Your book is due tomorrow',
    `<p>Hi ${userName},</p>
     <p>This is a reminder that <strong>${bookTitle}</strong> (borrowed from <strong>${libraryName}</strong>)
     is due on <strong>${dueDate}</strong> — that's tomorrow.</p>
     <p>Please return it on time to avoid a late fine of ₹200.</p>`
  ),
  returnConfirmation: ({ userName, bookTitle, returnedDate, libraryName }) => layout(
    'Return confirmed',
    `<p>Hi ${userName},</p>
     <p>We've received your return of <strong>${bookTitle}</strong> at <strong>${libraryName}</strong>
     on <strong>${returnedDate}</strong>. Thanks for returning it!</p>`
  ),
  overdueWarning: ({ userName, bookTitle, dueDate, daysLate }) => layout(
    'Your book is overdue',
    `<p>Hi ${userName},</p>
     <p><strong>${bookTitle}</strong> was due on <strong>${dueDate}</strong> and is now
     <strong>${daysLate} day(s)</strong> overdue.</p>
     <p>Please return it as soon as possible. A late fine may apply.</p>`
  ),
  fineNotice: ({ userName, bookTitle, dueDate, fineAmount, daysLate }) => layout(
    'Late fine applied',
    `<p>Hi ${userName},</p>
     <p>A late fine has been applied to your account for <strong>${bookTitle}</strong>,
     which was due on <strong>${dueDate}</strong> and is now <strong>${daysLate} day(s)</strong> overdue.</p>
     <table style="width:100%;border-collapse:collapse;margin-top:12px;">
       <tr><td style="padding:6px 0;color:#9ca3af;">Fine amount</td><td style="text-align:right;color:#f87171;font-weight:bold;">₹${fineAmount}</td></tr>
     </table>
     <p style="margin-top:16px;">Please return the book and settle the fine at your library, or via
     your ShelfX profile.</p>`
  ),
};

module.exports = { sendMail, emailTemplates };
