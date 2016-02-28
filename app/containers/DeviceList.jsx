import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';
import { FABButton, Icon } from 'react-mdl/lib';
import { Link } from 'react-router';
import _ from 'lodash';
import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';

class DeviceList extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(PageActions.updateTitle('Devices'));
    // TODO: move to onEnter/aync-props
    dispatch(DeviceActions.bindToDevices());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    // TODO: move to onLeave
    dispatch(DeviceActions.unbindFromDevices());
  }

  render() {
    const { dispatch, devices } = this.props;
    const emptyList = (
      <List>
        <ListItem>
          <ListItemContent>
            You don't have any devices yet.
          </ListItemContent>
        </ListItem>
      </List>
    );
    const nonEmptyList = (
      <List>
        {_.values(devices).map((device) =>
          (
            <ListItem key={device.uid}>
              <ListItemContent>
                <Link to={`/devices/${device.uid}`}>{device.name}</Link>
              </ListItemContent>
            </ListItem>
          )
        )}
      </List>
    );

    return (
      <Grid>
        <Cell col={12}>
          {Object.keys(devices).length ? nonEmptyList : emptyList}

          <FABButton
            colored
            ripple
            onClick={() => dispatch(routeActions.push('/devices/new'))}
            className="device-add"
          >
            <Icon name="add" />
          </FABButton>
        </Cell>
      </Grid>
    );
  }
}

DeviceList.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  devices: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
  };
}

export default connect(mapStateToProps)(DeviceList);
