import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import { Card, CardText } from 'react-mdl/lib/Card';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import IncidentActions from '../actions/incidents';
import PageActions from '../actions/page';
import PushNotificationActions from '../actions/push-notification';
import PeerActions from '../actions/peer';

import Video from '../components/Video';
import IncidentList from '../components/IncidentList';

import DeviceConnectionStatus from '../components/DeviceConnectionStatus';
import PushNotificationSwitch from '../components/PushNotificationSwitch';
import DetectorConfig from '../components/DetectorConfig';

import LayoutContainer from './LayoutContainer';

import detectors from '../lib/detectors';

class Device extends Component {
  componentDidMount() {
    const { dispatch, params, devices } = this.props;
    const deviceId = params.deviceId;
    const device = devices[deviceId];

    dispatch(PageActions.updateTitle(`Device: ${device.name}`));
    dispatch(DeviceActions.bindToDevice(deviceId));
    dispatch(IncidentActions.bindToIncidents(deviceId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params, devices } = nextProps;
    const deviceId = params.deviceId;
    const device = devices[deviceId];

    // TODO: don't try to connect if already connecting/connected (properly)
    if (device && device.online && !this.connecting) {
      this.connecting = true;
      dispatch(PeerActions.connectToDevice(device.uid));
    }
  }

  componentWillUnmount() {
    const deviceId = this.props.params.deviceId;
    DeviceActions.unbindFromDevice(deviceId);
    IncidentActions.unbindFromIncidents(deviceId);
  }

  render() {
    const deviceId = this.props.params.deviceId;
    const { dispatch, auth, devices, incidents, pushNotification } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    const incidentsForDevice = incidents[device.uid] || {};
    const isSubscribed = _.includes(
      device.pushNotificationEndpoints,
      auth.uid
    );

    return (
      <LayoutContainer yolo="Szimek">
        <Grid>
          <Cell col={12} shadow={2} align="middle">
            <Video src={device.remoteStream} />
          </Cell>

          <Cell component={Card} col={12} shadow={2} align="middle">
            <IncidentList incidents={incidentsForDevice} />
          </Cell>

          { /* TODO: move to separate settings page */ }
          <Cell component={Card} col={12} shadow={2} align="middle">
            <Grid component={CardText} noSpacing>
              <Cell component="h4" col={12}>Settings</Cell>
              <Cell col={12}>
                <DeviceConnectionStatus online={device.online} />
                <PushNotificationSwitch
                  deviceId={device.uid}
                  checked={isSubscribed}
                  disabled={!pushNotification.enabled}
                  onChange={() =>
                    dispatch(PushNotificationActions.toggleSubscriptionForDevice(device.uid))
                  }
                />
                {Object.keys(detectors).map(key =>
                  <DetectorConfig key={key} detector={detectors[key]} />
                )}
              </Cell>
            </Grid>
          </Cell>
        </Grid>
      </LayoutContainer>
    );
  }
}

Device.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  auth: PropTypes.object,
  devices: PropTypes.object,
  incidents: PropTypes.object,
  pushNotification: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
    incidents: state.incidents,
    pushNotification: state.pushNotification,
  };
}

export default connect(mapStateToProps)(Device);
