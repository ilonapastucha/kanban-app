import { connect } from 'react-redux';
import Lane from './Lane';
import { compose } from 'redux';
import { createLaneRequest, fetchLanes, deleteLaneRequest, updateLaneRequest, editLane, moveBetweenLanes, removeFromLane, pushToLane, } from './LaneActions';
import { createNoteRequest } from '../Note/NoteActions';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../Kanban/itemTypes';

const mapStateToProps = (state, ownProps) => ({
  laneNotes: ownProps.lane.notes.map(noteId => state.notes[noteId])
});

const mapDispatchToProps = {
  editLane,
  deleteLane: deleteLaneRequest,
  updateLane: updateLaneRequest,
  addNote: createNoteRequest,
  createLane: createLaneRequest,
  moveBetweenLanes,
  removeFromLane,
  pushToLane,
  fetchLanes,
};

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const { id: noteId, laneId: sourceLaneId } = sourceProps;
 
    if (!targetProps.lane.notes.length) {
      targetProps.moveBetweenLanes(
        targetProps.lane.id,
        noteId,
        sourceLaneId,
      );
    }
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DropTarget(ItemTypes.NOTE, noteTarget, (dragConnect) => ({
    connectDropTarget: dragConnect.dropTarget()
  }))
)(Lane);
