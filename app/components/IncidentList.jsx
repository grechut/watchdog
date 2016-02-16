import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';

class IncidentList extends React.Component {
  render() {
    const { incidents } = this.props;
    const list = (
      <List>
        {Object.keys(incidents).map((id) =>
          <ListItem key={id} twoLine>
            <ListItemContent subtitle={incidents[id].message}>
              {moment(incidents[id].triggeredAt).format('HH:mm:ss')}
            </ListItemContent>
          </ListItem>
        )}
      </List>
    );
    const message = (
      <List>
        <ListItem>
          <ListItemContent>
            No incidents
          </ListItemContent>
        </ListItem>
      </List>
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
