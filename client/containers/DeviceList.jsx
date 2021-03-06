import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';
import { FABButton, Icon } from 'react-mdl/lib';
import { Link } from 'react-router';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import LayoutContainer from '../containers/LayoutContainer';

class DeviceList extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

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
    const ownedDeviceId = localStorage.getItem('WATCHDOG_OWNED_DEVICE_ID');
    const hasValidOwnedDevice = Object.keys(devices).indexOf(ownedDeviceId) !== -1;

    const emptyList = (
      <List>
        <ListItem>
          <ListItemContent>
            You don&apos;t have any devices yet.
          </ListItemContent>
        </ListItem>
      </List>
    );
    const nonEmptyList = (
      <List>
        {_.values(devices).map(device => (
          <ListItem key={device.uid}>
            <ListItemContent>
              <Link to={`/devices/${device.uid}`}>
                { device.uid === ownedDeviceId ?
                    `${device.name} (this device)`
                    : device.name
                }
              </Link>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    );

    return (
      <LayoutContainer title="Devices">
        <Grid>
          <Cell col={12}>
            {Object.keys(devices).length ? nonEmptyList : emptyList}

            { !hasValidOwnedDevice ?
              <FABButton
                colored
                ripple
                onClick={() => dispatch(routeActions.push('/devices/new'))}
                className="device-add"
              >
                <Icon name="add" />
              </FABButton>
              : null }
          </Cell>
        </Grid>
      </LayoutContainer>
    );
  }
}

DeviceList.propTypes = {
  dispatch: PropTypes.func,
  devices: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    devices: state.devices,
  };
}

export default connect(mapStateToProps)(DeviceList);
