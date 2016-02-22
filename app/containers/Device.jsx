import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import IncidentActions from '../actions/incidents';
import PageActions from '../actions/page';
import PushNotificationActions from '../actions/push-notification';
import PeerActions from '../actions/peer';

import PushNotificationSwitch from '../components/PushNotificationSwitch';
import IncidentList from '../components/IncidentList';
import DeviceConnectionStatus from '../components/DeviceConnectionStatus';
import Video from '../components/Video';

class Device extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceUuid;

    dispatch(PageActions.updateTitle('Home'));
    dispatch(DeviceActions.bindToDevice(deviceId));
    dispatch(IncidentActions.bindToIncidents(deviceId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params, devices } = nextProps;
    const deviceId = params.deviceUuid;
    const device = devices[deviceId];

    // TODO: don't try to connect if already connecting/connected (properly)
    if (device && device.online && !this.connecting) {
      this.connecting = true;
      dispatch(PeerActions.connectToDevice(device.uid));
    }
  }

  componentWillUnmount() {
    const deviceId = this.props.params.deviceUuid;
    DeviceActions.unbindFromDevice(deviceId);
    IncidentActions.unbindFromIncidents(deviceId);
  }

  render() {
    const deviceId = this.props.params.deviceUuid;
    const { dispatch, auth, devices, incidents, pushNotification } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    const incidentsForDevice = incidents[device.uid] || {};
    const isSubscribed = _.includes(
      device.pushNotificationEndpoints,
      auth.uid
    );

    return (
      <div className="app">
        <DeviceConnectionStatus online={device.online} />
        <Video src={device.remoteStream} />
        <PushNotificationSwitch
          deviceId={device.uid}
          checked={isSubscribed}
          disabled={!pushNotification.enabled}
          onChange={() =>
            dispatch(PushNotificationActions.toggleSubscriptionForDevice(device.uid))
          }
        />
        <IncidentList incidents={incidentsForDevice} />
      </div>
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
