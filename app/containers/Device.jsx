import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import IncidentActions from '../actions/incidents';
import PageActions from '../actions/page';
import PushNotificationActions from '../actions/push-notification';

import firebase from '../lib/firebase';
import PushNotificationSwitch from '../components/PushNotificationSwitch';
import IncidentList from '../components/IncidentList';
import DeviceConnectionStatus from '../components/DeviceConnectionStatus';

import Peer from 'simple-peer';


class Device extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceUuid;

    dispatch(PageActions.updateTitle('Home'));
    dispatch(DeviceActions.bindToDevice(deviceId));
    dispatch(IncidentActions.bindToIncidents(deviceId));

    // Initiate WebRTC connection
    // TODO change it to some custom ID received via presence system
    const otherPeerId = deviceId;
    const peer = new Peer({ initiator: true, trickle: false });
    const signalingRef = firebase.child(`webrtc/messages/${otherPeerId}`);

    peer.on('connect', () => {
      console.log('WebRTC: connect');
    });

    peer.on('error', (error) => {
      console.warn('WebRTC: error', error);
    });

    peer.on('signal', (data) => {
      console.log('WebRTC: signal', data);

      // Send signaling data to the other peer
      const messageRef = signalingRef.push();
      messageRef.set(data);
    });

    peer.on('stream', (stream) => {
      console.log('WebRTC: stream', stream);
    });

    // TODO: call peer.signal(data) on incoming sidata from the other peer
    // Listen to signaling messages from the other peer
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
        <div>
          <DeviceConnectionStatus connected={device.connected} />
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
