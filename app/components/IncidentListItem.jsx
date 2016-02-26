import React, { Component, PropTypes } from 'react';
import { ListItemContent } from 'react-mdl/lib/List';
import moment from 'moment';

export default class IncidentListItem extends Component {
  icon(code) {
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

  render() {
    const { incident } = this.props;

    return (
      <ListItemContent subtitle={incident.message} icon={this.icon(incident.code)}>
        {moment(incident.triggeredAt).format('HH:mm:ss')}
      </ListItemContent>
    );
  }
}

IncidentListItem.propTypes = {
  incident: PropTypes.object,
};
