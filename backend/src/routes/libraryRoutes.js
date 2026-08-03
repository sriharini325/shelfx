const express = require('express');
const { listLibraries, getLibrary, nearbyLibraries } = require('../controllers/libraryController');

const router = express.Router();

router.get('/nearby', nearbyLibraries);
router.get('/', listLibraries);
router.get('/:id', getLibrary);

module.exports = router;
