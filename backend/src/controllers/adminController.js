const { Book, Library, BorrowRecord, User, DigitalBook } = require('../models');

/* ---------------------------- Libraries ---------------------------- */

async function createLibrary(req, res) {
  const library = await Library.create(req.body);
  res.status(201).json({ library });
}

async function updateLibrary(req, res) {
  const library = await Library.findByPk(req.params.id);
  if (!library) return res.status(404).json({ message: 'Library not found.' });
  await library.update(req.body);
  res.json({ library });
}

async function deleteLibrary(req, res) {
  const library = await Library.findByPk(req.params.id);
  if (!library) return res.status(404).json({ message: 'Library not found.' });
  await library.destroy();
  res.status(204).send();
}

/* ------------------------------ Books ------------------------------- */
// Covers author, rack number, book number, availability — a "Book" row IS
// a physical copy, so editing rack/book number/availability is just a
// normal update on this resource. Libraries without an external API are
// managed the exact same way: through this manual CRUD.

async function createBook(req, res) {
  const book = await Book.create(req.body);
  res.status(201).json({ book });
}

async function updateBook(req, res) {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  await book.update(req.body);
  res.json({ book });
}

async function deleteBook(req, res) {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  await book.destroy();
  res.status(204).send();
}

async function listAllBooks(req, res) {
  const books = await Book.findAll({ include: [{ model: Library, as: 'library' }], order: [['title', 'ASC']] });
  res.json({ books });
}

/* -------------------------- Digital books --------------------------- */

async function createDigitalBook(req, res) {
  const book = await DigitalBook.create(req.body);
  res.status(201).json({ book });
}

async function updateDigitalBook(req, res) {
  const book = await DigitalBook.findByPk(req.params.id);
  if (!book) return res.status(404).json({ message: 'Digital book not found.' });
  await book.update(req.body);
  res.json({ book });
}

async function deleteDigitalBook(req, res) {
  const book = await DigitalBook.findByPk(req.params.id);
  if (!book) return res.status(404).json({ message: 'Digital book not found.' });
  await book.destroy();
  res.status(204).send();
}

/* ---------------------- Borrowing records / users --------------------- */

// Shows which user currently has each book — the admin "who has what" view.
async function listBorrowRecords(req, res) {
  const { status } = req.query;
  const where = status ? { status } : {};

  const records = await BorrowRecord.findAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'username', 'email', 'phone'] },
      { model: Book, as: 'book', include: [{ model: Library, as: 'library' }] },
    ],
    order: [['borrowedAt', 'DESC']],
  });

  res.json({ records });
}

async function listUsers(req, res) {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ users: users.map((u) => u.toSafeJSON()) });
}

// Admin can mark a fine as paid (e.g. after cash payment at the desk).
async function markFinePaid(req, res) {
  const record = await BorrowRecord.findByPk(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  record.finePaid = true;
  await record.save();
  res.json({ record });
}

module.exports = {
  createLibrary, updateLibrary, deleteLibrary,
  createBook, updateBook, deleteBook, listAllBooks,
  createDigitalBook, updateDigitalBook, deleteDigitalBook,
  listBorrowRecords, listUsers, markFinePaid,
};
