const express = require('express');
const { searchDigitalBooks } = require('../controllers/digitalBookController');

const router = express.Router();

router.get('/search', searchDigitalBooks);

module.exports = router;
