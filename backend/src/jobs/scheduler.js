const cron = require('node-cron');
const { Op } = require('sequelize');
const { BorrowRecord, Book, User, Library } = require('../models');
const { sendMail, emailTemplates } = require('../services/emailService');
const { toDateOnly, daysBetween, addDays } = require('../utils/dateMath');

const LATE_FINE_FLAT = Number(process.env.LATE_FINE_FLAT) || 200;

// 1) Due-date reminder — one day before due date, once per record.
async function sendDueReminders() {
  const tomorrow = toDateOnly(addDays(new Date(), 1));

  const records = await BorrowRecord.findAll({
    where: { status: 'borrowed', dueDate: tomorrow, reminderSent: false },
    include: [
      { model: User, as: 'user' },
      { model: Book, as: 'book', include: [{ model: Library, as: 'library' }] },
    ],
  });

  for (const record of records) {
    await sendMail({
      to: record.user.email,
      subject: `Reminder: "${record.book.title}" is due tomorrow`,
      html: emailTemplates.dueReminder({
        userName: record.user.name,
        bookTitle: record.book.title,
        dueDate: record.dueDate,
        libraryName: record.book.library.name,
      }),
    });
    record.reminderSent = true;
    await record.save();
  }

  if (records.length) console.log(`[scheduler] Sent ${records.length} due-date reminder(s).`);
}

// 2) Overdue detection — flip status, send warning, apply flat ₹200 fine once.
async function processOverdueBooks() {
  const today = new Date();
  const todayStr = toDateOnly(today);

  const records = await BorrowRecord.findAll({
    where: {
      status: { [Op.in]: ['borrowed', 'overdue'] },
      dueDate: { [Op.lt]: todayStr },
    },
    include: [
      { model: User, as: 'user' },
      { model: Book, as: 'book', include: [{ model: Library, as: 'library' }] },
    ],
  });

  for (const record of records) {
    const wasAlreadyOverdue = record.status === 'overdue';
    record.status = 'overdue';

    const daysLate = daysBetween(new Date(record.dueDate), today);

    if (!record.overdueNoticeSent) {
      await sendMail({
        to: record.user.email,
        subject: `Overdue: "${record.book.title}"`,
        html: emailTemplates.overdueWarning({
          userName: record.user.name,
          bookTitle: record.book.title,
          dueDate: record.dueDate,
          daysLate,
        }),
      });
      record.overdueNoticeSent = true;
    }

    if (!record.fineApplied) {
      record.fineAmount = LATE_FINE_FLAT;
      record.fineApplied = true;

      await sendMail({
        to: record.user.email,
        subject: `Late fine applied — "${record.book.title}"`,
        html: emailTemplates.fineNotice({
          userName: record.user.name,
          bookTitle: record.book.title,
          dueDate: record.dueDate,
          fineAmount: record.fineAmount,
          daysLate,
        }),
      });
    }

    await record.save();
    if (!wasAlreadyOverdue) console.log(`[scheduler] Marked record ${record.id} overdue, fine applied.`);
  }
}

function startScheduler() {
  // Every day at 08:00 — due-date reminders.
  cron.schedule('0 8 * * *', () => {
    sendDueReminders().catch((err) => console.error('[scheduler] sendDueReminders error:', err));
  });

  // Every day at 00:30 — overdue sweep + fines.
  cron.schedule('30 0 * * *', () => {
    processOverdueBooks().catch((err) => console.error('[scheduler] processOverdueBooks error:', err));
  });

  console.log('[scheduler] Cron jobs registered: due reminders @08:00, overdue sweep @00:30.');
}

module.exports = { startScheduler, sendDueReminders, processOverdueBooks };
