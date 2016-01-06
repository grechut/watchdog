import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice, addDeviceListener, notify } from '../actions';
import Video from '../components/Video';

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

    return (
      <div className="app">
        <h3>Owner: {owner}</h3>
        <h4>Listeners: {listenersCount}</h4>
        <Video src={localStream} />

        { isOwner ?
          <button onClick={() => dispatch(notify('Some notification'))}
            className="btn btn-success"
            disabled={listenersCount === 0}
          >
            Fire notification
          </button>
          :
          <button onClick={() => dispatch(addDeviceListener())}
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
