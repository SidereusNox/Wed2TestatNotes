const noteController = require('../controllers/NoteController');
const express = require('express');
const router = express.Router();

router.get('/', noteController.renderOverviewScreen);
router.get('/create', noteController.renderCreateNoteScreen);
router.post('/save/:id', noteController.saveChanges);
router.post('/save', noteController.saveChanges);
router.get('/edit/:id', noteController.renderEditNoteScreen);

module.exports = router;