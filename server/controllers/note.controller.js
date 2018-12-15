import Note from '../models/note';
import uuid from 'uuid';
import Lane from '../models/lane';

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    return res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    Lane.findOne({ id: laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.noteId }).exec((err, note) => {
    const noteId = req.params.noteId;

    if (!note || !noteId || note === 'null') {
      res.status(400).end();
      return;
    }

    if (err) {
      res.status(500).send(err);
    }

    Lane.findOne({ notes: note._id })
      .then(lane => {
        const updatedNotes = lane.notes.filter(note => note.id !== noteId);
        lane.update({ notes: updatedNotes }, error => {
          if (error) {
            res.status(500).send(error);
          }
        });
      })
      .then(() => {
        note.remove();
      })
      .then(() => {
        res.status(200).end();
      });
  });
}

export function editNote(req, res) {
  Note.findOne({ id: req.params.noteId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.task = req.body.task;
    note.save((error, saved) => {
      if (err) {
        res.status(500).send(error);
      }
      res.json(saved);
    });
  });
}