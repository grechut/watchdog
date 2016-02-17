import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';
import IncidentListItem from '../components/IncidentListItem';

class IncidentList extends React.Component {
  render() {
    const { incidents } = this.props;
    const list = (
      <List>
        {Object.keys(incidents).map((id) =>
          <ListItem key={id} twoLine>
            <IncidentListItem incident={incidents[id]} />
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
