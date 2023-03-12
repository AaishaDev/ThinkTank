const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    // .put( notesController.updateNote)
    // .delete( notesController.deleteNote);

router.put('/:id/favorite',notesController.markFavorite);
router.put('/:id/edit',notesController.editNote);
router.delete('/:id/delete',notesController.deleteNote);
router.get('/username',notesController.username);


module.exports = router;
