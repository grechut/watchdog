import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';
import PushNotificationActions from '../actions/push-notification';

// Owner part
import Video from '../components/Video';

// Listener part
import PushNotificationSwitch from '../components/PushNotificationSwitch';
import DetectorConfig from '../components/DetectorConfig';
import detectors from '../lib/detectors';

class Device extends Component {
  componentDidMount() {
    this.props.dispatch(PageActions.updateTitle('Home'));
    this.props.dispatch(DeviceActions.fetchDevice(this.props.params.deviceUuid));
  }

  render() {
    const deviceId = this.props.params.deviceUuid;
    const { dispatch, auth, devices, pushNotification } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    const isSubscribed = _.includes(
      device.pushNotificationEndpoints,
      auth.uid
    );

    return (
      <div className="app">
        <Video src={device.localStream} />
        <h3>ID: {device.uid}</h3>

        {device.isOwner ?
          Object.keys(detectors).map(key =>
            <DetectorConfig key={key} detector={detectors[key]} />
          )
        :
          <PushNotificationSwitch
            deviceId={device.uid}
            checked={isSubscribed}
            disabled={!pushNotification.enabled}
            onChange={() =>
              dispatch(PushNotificationActions.toggleSubscriptionForDevice(device.uid)
            )}
          />
        }
      </div>
    );
  }
}

Device.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  auth: PropTypes.object,
  devices: PropTypes.object,
  pushNotification: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
    pushNotification: state.pushNotification,
  };
}

export default connect(mapStateToProps)(Device);
