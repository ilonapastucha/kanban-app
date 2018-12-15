import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';
import * as LaneController from '../controllers/lane.controller';

const router = new Router();

// Add a new Note
router.route('/notes').post(NoteController.addNote);

// Delete a note by noteId
router.route('/notes/:noteId').delete(NoteController.deleteNote);

//Edit Note
router.route('/notes/:noteId').put(NoteController.editNote);

router.route('/notes/:noteId/move').put(LaneController.moveNote); 

export default router;

