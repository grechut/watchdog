import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice, addDeviceListener, notify } from '../actions';

class Device extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(fetchDevice(this.props.params.deviceUuid));
  }

  render() {
    const { device, dispatch } = this.props;
    if (!device.owner) return null;
    const { owner, listenersCount, isOwner } = device;

    return (
      <div className="app">
        <h1>Owner: {owner}</h1>
        <h4>Listeners: {listenersCount}</h4>

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
