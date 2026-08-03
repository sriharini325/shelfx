const { Book, BorrowRecord, Library, User } = require('../models');
const { addDays, toDateOnly } = require('../utils/dateMath');
const { sendMail, emailTemplates } = require('../services/emailService');

const LOAN_PERIOD_DAYS = Number(process.env.LOAN_PERIOD_DAYS) || 10;

async function borrowBook(req, res) {
  const { bookId } = req.body;
  const book = await Book.findByPk(bookId, { include: [{ model: Library, as: 'library' }] });

  if (!book) return res.status(404).json({ message: 'Book not found.' });
  if (!book.isAvailable) {
    return res.status(409).json({
      message: 'This copy is currently unavailable.',
      expectedAvailableDate: book.expectedAvailableDate,
    });
  }

  const dueDate = toDateOnly(addDays(new Date(), LOAN_PERIOD_DAYS));

  const record = await BorrowRecord.create({
    userId: req.user.id,
    bookId: book.id,
    dueDate,
    status: 'borrowed',
  });

  book.isAvailable = false;
  book.expectedAvailableDate = dueDate;
  await book.save();

  res.status(201).json({ record, dueDate });
}

async function returnBook(req, res) {
  const { recordId } = req.body;

  const record = await BorrowRecord.findByPk(recordId, {
    include: [{ model: Book, as: 'book', include: [{ model: Library, as: 'library' }] }, { model: User, as: 'user' }],
  });

  if (!record) return res.status(404).json({ message: 'Borrow record not found.' });
  if (record.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You cannot return a book you did not borrow.' });
  }
  if (record.status === 'returned') {
    return res.status(400).json({ message: 'This book has already been returned.' });
  }

  record.returnedAt = new Date();
  record.status = 'returned';
  await record.save();

  const book = record.book;
  book.isAvailable = true;
  book.expectedAvailableDate = null;
  await book.save();

  await sendMail({
    to: record.user.email,
    subject: `Return confirmed — ${book.title}`,
    html: emailTemplates.returnConfirmation({
      userName: record.user.name,
      bookTitle: book.title,
      returnedDate: toDateOnly(record.returnedAt),
      libraryName: book.library.name,
    }),
  });

  res.json({ record });
}

module.exports = { borrowBook, returnBook };
