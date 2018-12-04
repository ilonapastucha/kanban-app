import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';

const router = new Router();

// Add a new Note
router.route('/notes').post(NoteController.addNote);

// Delete a note by noteId
router.route('/note/:noteId').delete(NoteController.deleteNote);

//Edit Note
router.route('/notes/:noteId').put(NoteController.editNote);

export default router;