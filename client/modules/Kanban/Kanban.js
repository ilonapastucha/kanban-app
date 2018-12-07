import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createLaneRequest, deleteLane, updateLane, editLane, fetchLanes } from '../Lane/LaneActions';
import { createNoteRequest } from '../Note/NoteActions';
import Lanes from '../Lane/Lanes';
import styles from '../Lane/Lane.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const mapDispatchToProps = {
  editLane,
  deleteLane,
  updateLane,
  addNote: createNoteRequest,
  createLane: createLaneRequest,
};

const Kanban = (props) => (
  <div>
    <button className={styles.AddLane}
    onClick={() => props.createLane({
      name: 'New lane',
    })}
    >Add lane</button>
    <Lanes lanes={props.lanes} />
  </div>
);

Kanban.need = [() => { return fetchLanes(); }];

const mapStateToProps = state => ({
  lanes: Object.values(state.lanes)
});


Kanban.propTypes = {
  lanes: PropTypes.array,
  createLane: PropTypes.func,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragDropContext(HTML5Backend)
)(Kanban);
