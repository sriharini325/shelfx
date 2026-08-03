const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Library = sequelize.define('Library', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  contactPhone: { type: DataTypes.STRING, allowNull: true },
  openingHours: { type: DataTypes.STRING, allowNull: true },
  hasApiIntegration: { type: DataTypes.BOOLEAN, defaultValue: false },
  // when a library has no API, admins maintain its inventory manually — this
  // flag just documents that in the dashboard; manual CRUD works either way.
}, {
  tableName: 'libraries',
});

module.exports = Library;
