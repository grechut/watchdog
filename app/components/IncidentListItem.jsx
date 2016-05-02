import React, { PropTypes } from 'react';
import { ListItem, ListItemContent } from 'react-mdl/lib/List';
// import moment from 'moment';

export default function IncidentListItem(props) {
  const { incident } = props;

  return (
    <ListItem>
      <ListItemContent subtitle={incident.message} icon={icon(incident.code)}>
        {/* Right now we're double displaying date
          moment(incident.triggeredAt).format('HH:mm:ss')*/}
      </ListItemContent>
    </ListItem>
  );
}

function icon(code) {
  switch (code) {
    case 'motion_started':
    case 'noise_started':
      return 'alarm';
    case 'motion_stopped':
    case 'noise_stopped':
      return 'alarm_off';
    default:
      return null;
  }
}

IncidentListItem.propTypes = {
  incident: PropTypes.object,
};
