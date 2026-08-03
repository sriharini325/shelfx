const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BorrowRecord = sequelize.define('BorrowRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  bookId: { type: DataTypes.UUID, allowNull: false },
  borrowedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  returnedAt: { type: DataTypes.DATE, allowNull: true },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
    defaultValue: 'borrowed',
  },
  fineAmount: { type: DataTypes.INTEGER, defaultValue: 0 },
  fineApplied: { type: DataTypes.BOOLEAN, defaultValue: false },
  finePaid: { type: DataTypes.BOOLEAN, defaultValue: false },
  reminderSent: { type: DataTypes.BOOLEAN, defaultValue: false },
  overdueNoticeSent: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'borrow_records',
});

module.exports = BorrowRecord;
