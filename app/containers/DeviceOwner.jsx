import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';
import VideoStreamActions from '../actions/video-stream';

import DetectorConfig from '../components/DetectorConfig';
import Video from '../components/Video';

import detectors from '../lib/detectors';

class DeviceOwner extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceUuid;

    dispatch(PageActions.updateTitle('Home'));
    dispatch(DeviceActions.fetchDevice(deviceId));
    dispatch(DeviceActions.syncConnected(deviceId));
    dispatch(VideoStreamActions.getLocalVideoStream(deviceId));
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
