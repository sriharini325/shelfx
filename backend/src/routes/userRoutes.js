const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  updateProfile, changePassword, myBorrowedBooks, myHistory, myFines,
} = require('../controllers/userController');

const router = express.Router();

router.use(requireAuth);
router.patch('/profile', updateProfile);
router.post('/change-password', changePassword);
router.get('/borrowed', myBorrowedBooks);
router.get('/history', myHistory);
router.get('/fines', myFines);

module.exports = router;
