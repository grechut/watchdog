import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeviceActions from '../actions/device';
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
    const { device, dispatch, pushNotification } = this.props;
    const { owner, listeners, isOwner, localStream } = device;
    const deviceId = device.uid;
    const pushNotificationEndpoints = device.listeners.pushNotificationEndpoints;

    if (!deviceId) { return null; }

    return (
      <div className="app">
        <Video src={localStream} />
        <h3>Owner: {owner}</h3>
        <h4>Listeners: {listeners.pushNotificationEndpoints.length}</h4>

        {isOwner ?
          Object.keys(detectors).map(key =>
            <DetectorConfig key={key} detector={detectors[key]} />
          )
        :
          <PushNotificationSwitch
            deviceId={deviceId}
            checked={_.includes(pushNotificationEndpoints, pushNotification.endpoint)}
            disabled={!pushNotification.enabled}
            onChange={() => dispatch(PushNotificationActions.toggleSubscriptionForDevice(deviceId))}
          />
        }
      </div>
    );
  }
}

Device.propTypes = {
  device: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  pushNotification: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    device: state.device,
    pushNotification: state.pushNotification,
  };
}

export default connect(mapStateToProps)(Device);
