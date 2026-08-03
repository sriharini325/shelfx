const express = require('express');
const { randomQuote, searchBooks, getBook } = require('../controllers/bookController');

const router = express.Router();

router.get('/quote', randomQuote);
router.get('/search', searchBooks);
router.get('/:id', getBook);

module.exports = router;
