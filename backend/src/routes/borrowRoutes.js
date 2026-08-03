const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { borrowBook, returnBook } = require('../controllers/borrowController');

const router = express.Router();

router.use(requireAuth);
router.post('/', borrowBook);
router.post('/return', returnBook);

module.exports = router;
