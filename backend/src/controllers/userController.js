const { User, BorrowRecord, Book, Library } = require('../models');
const bcrypt = require('bcryptjs');

async function updateProfile(req, res) {
  const { name, username, phone, email, avatarUrl } = req.body;
  const user = req.user;

  if (name) user.name = name;
  if (username) user.username = username;
  if (phone) user.phone = phone;
  if (email) user.email = email;
  if (avatarUrl) user.avatarUrl = avatarUrl;

  await user.save();
  res.json({ user: user.toSafeJSON() });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated.' });
}

async function myBorrowedBooks(req, res) {
  const records = await BorrowRecord.findAll({
    where: { userId: req.user.id, status: ['borrowed', 'overdue'] },
    include: [
      { model: Book, as: 'book', include: [{ model: Library, as: 'library' }] },
    ],
    order: [['dueDate', 'ASC']],
  });
  res.json({ borrowed: records });
}

async function myHistory(req, res) {
  const records = await BorrowRecord.findAll({
    where: { userId: req.user.id },
    include: [
      { model: Book, as: 'book', include: [{ model: Library, as: 'library' }] },
    ],
    order: [['borrowedAt', 'DESC']],
  });
  res.json({ history: records });
}

async function myFines(req, res) {
  const records = await BorrowRecord.findAll({
    where: { userId: req.user.id, fineAmount: { [require('sequelize').Op.gt]: 0 } },
    include: [{ model: Book, as: 'book' }],
    order: [['dueDate', 'DESC']],
  });
  const totalOutstanding = records
    .filter((r) => !r.finePaid)
    .reduce((sum, r) => sum + r.fineAmount, 0);

  res.json({ fines: records, totalOutstanding });
}

module.exports = { updateProfile, changePassword, myBorrowedBooks, myHistory, myFines };
