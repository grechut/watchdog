import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice, addDeviceListener } from '../actions';
import Video from '../components/Video';
import DetectorConfig from '../components/DetectorConfig';

import detectors from '../lib/detectors';

class Device extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(fetchDevice(this.props.params.deviceUuid));
  }

  render() {
    const { device, dispatch } = this.props;
    const { owner, listenersCount, isOwner, localStream } = device;

    if (!device.owner) return null;

    console.log('Detectors', detectors);

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
          <button
            onClick={() => dispatch(addDeviceListener())}
            className="btn btn-success"
          >
            Listen to this device
          </button>
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
  const { device } = state;

  return {
    device,
  };
}

export default connect(mapStateToProps)(Device);
