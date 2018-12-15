import Lane from '../models/lane';
import Note from '../models/note';
import uuid from 'uuid';
import { resolve } from 'path';
import { rejects } from 'assert';

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addLane(req, res) {
  if (!req.body.name) {
    res.status(403).end();
  }

  const newLane = new Lane(req.body);

  newLane.id = uuid();
  newLane.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(saved);
  });
}

export function getLanes(req, res) {
  Lane.find().exec((err, lanes) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ lanes });
  });
}

export function deleteLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }
    const notes = lane.notes;
    notes.forEach(note => {
      Note.findByIdAndRemove(note._id).exec(() => {
      });
    });

    lane.remove(() => {
      res.status(200).end();
    });
  });
}

export function editLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
       res.status(500).send(err);
     }
     lane.name = req.body.name;
     lane.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json(saved);
    });
  })
}

const removeFromSourceLane = (laneId, noteId) => new Promise((resolve, rejects) => {
  Lane.findOne({ id: laneId }).exec((err, lane) => {
    if (err) {
      rejects(err);
    }
    lane.notes = lane.notes.filter(n => n.id !== noteId);
    lane.save((err, saved) => {
      if (err) {
        rejects(err);
      }
      resolve();
    });
  })
})

const addToTargetLane = (laneId, noteId) => new Promise((resolve, rejects) => {
  Lane.findOne({ id: laneId }).exec((err, lane) => {
    if (err) {
      rejects(err);
    }
    Note.findOne({ id: noteId }).exec((err, note) => {
      if (err) {
        rejects(err);
      }
      lane.notes.push(note)
      lane.save((err, saved) => {
        if (err) {
          rejects(err);
        }
      resolve();
      })
    });
  })
})

export const moveNote = (req, res) => {
  const noteId = req.params.noteId;
  const sourceLaneId = req.body.sourceId;
  const targetLaneId = req.body.targetId;

  removeFromSourceLane(sourceLaneId, noteId)
    .then (() => addToTargetLane(targetLaneId, noteId))
    .then (() => {
      res.status(200).end();
    })
    .catch((err) => {
      res.status(500).send(err)
    })
}