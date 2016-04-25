import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import DeviceActions from 'actions/devices';
import MediaStreamActions from 'actions/media-stream';
import PeerActions from 'actions/peer';

import Video from 'components/Video';

import LayoutContainer from 'containers/LayoutContainer';

class DeviceOwner extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceId;

    dispatch(DeviceActions.bindToDevice(deviceId));
    dispatch(DeviceActions.syncOnlineStatus(deviceId));
    dispatch(MediaStreamActions.getLocalMediaStream(deviceId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params, devices } = nextProps;
    const deviceId = params.deviceId;
    const device = devices[deviceId];

    // TODO: figure out how to wait for device, video stream and don't listen if already
    // listening in a clean way
    if (device && device.online && device.localStream && !this.listening) {
      this.listening = true;
      dispatch(PeerActions.listen(deviceId));
    }
  }

  render() {
    const deviceId = this.props.params.deviceId;
    const { devices } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    return (
      <LayoutContainer title={`Device: ${device.name} (${device.uid})`}>
        <Grid>
          <Cell col={12} shadow={2} align="middle">
            <Video src={device.localStream} />
          </Cell>
        </Grid>
      </LayoutContainer>
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
