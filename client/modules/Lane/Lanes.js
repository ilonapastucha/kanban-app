import React from 'react';
import Lane from './LaneContainer.js';
import PropTypes from 'prop-types';
import styles from './Lane.css';

const Lanes = ({ lanes }) => {
  return (
    <div className={styles.Lanes}>{lanes.map(lane =>
      <Lane className="lane" key={lane.id} lane={lane} />
    )}</div>
  );
};

Lanes.propTypes = {
  lanes: PropTypes.array,
};

export default Lanes;