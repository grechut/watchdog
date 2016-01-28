import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-mdl/lib/Button';

import { addDeviceListener, fetchDevice, updateTitle } from '../actions';
import Video from '../components/Video';
import DetectorConfig from '../components/DetectorConfig';
import detectors from '../lib/detectors';

class Device extends Component {
  componentDidMount() {
    this.props.dispatch(updateTitle('Home'));
    this.props.dispatch(fetchDevice(this.props.params.deviceUuid));
  }

  render() {
    const { device, dispatch } = this.props;
    const { owner, listenersCount, isOwner, localStream } = device;

    if (!device.owner) { return null; }

    return (
      <div className="app">
        <Video src={localStream} />
        <h3>Owner: {owner}</h3>
        <h4>Listeners: {listenersCount}</h4>

        {isOwner ?
          Object.keys(detectors).map(key =>
            <DetectorConfig key={key} detector={detectors[key]} />
          )
        :
          <Button raised accent ripple
            onClick={() => dispatch(addDeviceListener())}
            className="btn btn-success"
          >
            Listen to this device
          </Button>
        }
      </div>
    );
  }
}

Device.propTypes = {
  device: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    device: state.device,
  };
}

export default connect(mapStateToProps)(Device);
