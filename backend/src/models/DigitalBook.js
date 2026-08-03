const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Legally available online books (public domain / openly licensed / publisher
// preview links) — search + "read online" only, no borrowing workflow.
const DigitalBook = sequelize.define('DigitalBook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: true },
  coverUrl: { type: DataTypes.STRING, allowNull: true },
  source: { type: DataTypes.STRING, allowNull: false }, // e.g. "Project Gutenberg", "Open Library"
  license: { type: DataTypes.STRING, allowNull: true }, // e.g. "Public Domain", "CC-BY"
  readOnlineUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'digital_books',
});

module.exports = DigitalBook;
