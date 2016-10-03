import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';
import { CardText } from 'react-mdl/lib/Card';

import IncidentListItem from '../components/IncidentListItem';

function IncidentList(props) {
  const { incidents } = props;
  const incidentIds = Object.keys(incidents);
  const emptyList = (
    <List>
      <ListItem>
        <ListItemContent>
          None yet.
        </ListItemContent>
      </ListItem>
    </List>
  );
  const nonEmptyList = (
    <List>
      {incidentIds.map(id =>
        <IncidentListItem key={id} incident={incidents[id]} />
      )}
    </List>
  );
  const list = incidentIds.length ? nonEmptyList : emptyList;

  return (
    <Grid component={CardText}>
      <Cell component="h4" col={12}>Incidents</Cell>
      <Cell col={12}>
        <div className="incident-list">
          {list}
        </div>
      </Cell>
    </Grid>
  );
}

IncidentList.propTypes = {
  incidents: PropTypes.object.isRequired,
};

export default connect()(IncidentList);
