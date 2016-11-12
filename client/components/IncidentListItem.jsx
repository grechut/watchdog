import React, { PropTypes } from 'react';
import moment from 'moment';

export default function IncidentListItem(props) {
  const { incident } = props;

  return (
    <li>
      <span>{moment(incident.triggeredAt).fromNow()}: <b>{incident.message}</b></span>
    </li>
  );
}

IncidentListItem.propTypes = {
  incident: PropTypes.object,
};
