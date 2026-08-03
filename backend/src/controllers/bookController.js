const { Op } = require('sequelize');
const { Book, Library } = require('../models');

const QUOTES = [
  { text: 'A room without books is like a body without a soul.', author: 'Marcus Tullius Cicero' },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
  { text: 'Until I feared I would lose it, I never loved to read. One does not love breathing.', author: 'Harper Lee' },
  { text: 'Books are a uniquely portable magic.', author: 'Stephen King' },
  { text: 'The reading of all good books is like conversation with the finest people of past centuries.', author: 'René Descartes' },
  { text: 'A book is a dream that you hold in your hand.', author: 'Neil Gaiman' },
  { text: 'Once you learn to read, you will be forever free.', author: 'Frederick Douglass' },
];

function randomQuote(req, res) {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json({ quote });
}

// Search by title or author across all libraries, grouping copies so the
// user sees each library/rack/book-number/availability combination.
async function searchBooks(req, res) {
  const { q = '', libraryId } = req.query;

  const where = {};
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { author: { [Op.iLike]: `%${q}%` } },
    ];
  }
  if (libraryId) where.libraryId = libraryId;

  const books = await Book.findAll({
    where,
    include: [{ model: Library, as: 'library' }],
    order: [['title', 'ASC']],
    limit: 100,
  });

  res.json({ results: books });
}

async function getBook(req, res) {
  const book = await Book.findByPk(req.params.id, { include: [{ model: Library, as: 'library' }] });
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  res.json({ book });
}

module.exports = { randomQuote, searchBooks, getBook };
