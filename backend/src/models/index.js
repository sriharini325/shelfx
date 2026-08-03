const sequelize = require('../config/db');
const User = require('./User');
const Library = require('./Library');
const Book = require('./Book');
const BorrowRecord = require('./BorrowRecord');
const DigitalBook = require('./DigitalBook');

// Library <-> Book
Library.hasMany(Book, { foreignKey: 'libraryId', as: 'books', onDelete: 'CASCADE' });
Book.belongsTo(Library, { foreignKey: 'libraryId', as: 'library' });

// User <-> BorrowRecord <-> Book
User.hasMany(BorrowRecord, { foreignKey: 'userId', as: 'borrowRecords' });
BorrowRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Book.hasMany(BorrowRecord, { foreignKey: 'bookId', as: 'borrowRecords' });
BorrowRecord.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

module.exports = {
  sequelize,
  User,
  Library,
  Book,
  BorrowRecord,
  DigitalBook,
};
