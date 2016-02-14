import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class IncidentList extends React.Component {
  render() {
    const { incidents } = this.props;
    const list = (
      <ul className="mdl-list">
        {Object.keys(incidents).map((id) =>
          <li className="mdl-list__item" key={id}>{incidents[id].message}</li>
        )}
      </ul>
    );
    const message = (
      <div>No incidents...</div>
    );

    return (
      <div>
        {Object.keys(incidents).length ? list : message}
      </div>
    );
  }
}

IncidentList.propTypes = {
  incidents: PropTypes.object,
};

export default connect()(IncidentList);
