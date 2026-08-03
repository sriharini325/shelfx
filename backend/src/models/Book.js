const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// A "Book" here represents one physical copy located on a specific rack in a
// specific library — this is what lets us show rack number, book number and
// per-copy availability. Multiple copies of the same title/author are simply
// multiple rows.
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, allowNull: true },
  genre: { type: DataTypes.STRING, allowNull: true },
  coverUrl: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  rackNumber: { type: DataTypes.STRING, allowNull: false },
  bookNumber: { type: DataTypes.STRING, allowNull: false }, // per-copy accession/barcode number
  libraryId: { type: DataTypes.UUID, allowNull: false },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  // Set automatically when a copy is borrowed (= borrow date + loan period).
  // Used to show "expected availability date" on search results when a copy
  // is checked out.
  expectedAvailableDate: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  tableName: 'books',
  indexes: [
    { fields: ['title'] },
    { fields: ['author'] },
    { unique: true, fields: ['library_id', 'book_number'] },
  ],
});

module.exports = Book;
