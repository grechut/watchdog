import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice, addDeviceListener, notify } from '../actions';
import { Btn } from '../components/Btn';

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
    const { owner, listeners, isOwner } = device;

    return (
      <div className='app'>
        <h1>Owner: {owner}</h1>
        <h4>Listeners: {listeners.map(x => <p>{x}</p>)}</h4>

        { isOwner ?
          <Btn onClick={() => dispatch(notify('Some notification'))}
            text="Fire notification" />
          :
          <Btn onClick={() => dispatch(addDeviceListener())}
            text="Listen to this device" /> }
      </div>
    );
  }
}

Device.propTypes = {
  device: PropTypes.object
};

function mapStateToProps(state) {
  const { device } = state;

  return {
    device
  };
}

export default connect(mapStateToProps)(Device);
