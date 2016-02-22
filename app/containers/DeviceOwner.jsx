import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';
import PeerActions from '../actions/peer';
import VideoStreamActions from '../actions/video-stream';

import DetectorConfig from '../components/DetectorConfig';
import Video from '../components/Video';

import detectors from '../lib/detectors';

class DeviceOwner extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceUuid;

    dispatch(PageActions.updateTitle('Home'));
    dispatch(DeviceActions.bindToDevice(deviceId));
    dispatch(DeviceActions.syncOnlineStatus(deviceId));
    dispatch(VideoStreamActions.getLocalVideoStream(deviceId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params, devices } = nextProps;
    const deviceId = params.deviceUuid;
    const device = devices[deviceId];

    // TODO: figure out how to wait for device, video stream and don't listen if already
    // listening in a clean way
    if (device && device.online && device.localStream && !this.listening) {
      this.listening = true;
      dispatch(PeerActions.listen(deviceId));
    }
  }

  render() {
    const deviceId = this.props.params.deviceUuid;
    const { devices } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    return (
      <div className="app">
        <Video src={device.localStream} />
        <h3>ID: {device.uid}</h3>

        {Object.keys(detectors).map(key =>
          <DetectorConfig key={key} detector={detectors[key]} />
        )}
      </div>
    );
  }
}

DeviceOwner.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  devices: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    devices: state.devices,
  };
}

export default connect(mapStateToProps)(DeviceOwner);
