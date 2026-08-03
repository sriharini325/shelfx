const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const admin = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Libraries
router.post('/libraries', admin.createLibrary);
router.patch('/libraries/:id', admin.updateLibrary);
router.delete('/libraries/:id', admin.deleteLibrary);

// Books (author, rack, book number, availability all live on Book)
router.get('/books', admin.listAllBooks);
router.post('/books', admin.createBook);
router.patch('/books/:id', admin.updateBook);
router.delete('/books/:id', admin.deleteBook);

// Digital library
router.post('/digital-books', admin.createDigitalBook);
router.patch('/digital-books/:id', admin.updateDigitalBook);
router.delete('/digital-books/:id', admin.deleteDigitalBook);

// Borrowing records & users
router.get('/borrow-records', admin.listBorrowRecords);
router.patch('/borrow-records/:id/mark-paid', admin.markFinePaid);
router.get('/users', admin.listUsers);

module.exports = router;
