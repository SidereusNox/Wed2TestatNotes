const noteController = require('../controllers/NoteController');
const express = require('express');
const router = express.Router();

router.get('/', noteController.renderOverviewScreen);
router.get('/sortByFinishDate', noteController.sortByFinishDate);
router.get('/sortByCreateDate', noteController.sortByCreateDate);
router.get('/sortByImportance', noteController.sortByImportance);
router.get('/create', noteController.renderCreateNoteScreen);
router.get('/modify', noteController.renderModifyNoteScreen);

module.exports = router;