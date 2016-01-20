import React, { PropTypes } from 'react';
import _ from 'lodash';

export default class DetectorConfig extends React.Component {

  render() {
    if (_.isEmpty(this.props.detector)) { return null; }

    let { name, isRunning } = this.props.detector;

    return (
      <div>
        <h3>{name}</h3>
        <span>
          Running: { isRunning ?
            <i className="em em-white_check_mark"></i>
            : <i className="em em-heavy_multiplication_x"></i> }
        </span>
      </div>
    );
  }
}

DetectorConfig.propTypes = {
  detector: PropTypes.object,
};
