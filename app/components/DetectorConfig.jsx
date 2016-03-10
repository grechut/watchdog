import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Card, CardTitle, CardText } from 'react-mdl/lib/Card';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import Switch from 'react-mdl/lib/Switch';

export default function DetectorConfig(props) {
  if (_.isEmpty(props.detector)) { return null; }

  const { name, isRunning } = props.detector;

  return (
    <Card shadow={2}>
      <CardTitle>{name}</CardTitle>
      <CardText>
        <Grid>
          <Cell col={3} />
          <Cell col={3}>
            <Switch disabled ripple checked={isRunning}>Status</Switch>
          </Cell>
        </Grid>
      </CardText>
    </Card>
  );
}

DetectorConfig.propTypes = {
  detector: PropTypes.object,
};
