const { Op } = require('sequelize');
const { DigitalBook } = require('../models');

async function searchDigitalBooks(req, res) {
  const { q = '' } = req.query;
  const where = q
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { author: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : {};

  const results = await DigitalBook.findAll({ where, order: [['title', 'ASC']], limit: 200 });
  res.json({ results });
}

module.exports = { searchDigitalBooks };
