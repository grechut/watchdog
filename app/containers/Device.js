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
    const { info, dispatch, isOwner } = this.props;
    if (!info) return null;

    return (
      <div className='app'>
        <h1>Owner: {info.owner}</h1>
        <h4>Listeners: {info.listeners.map(x => <p>{x}</p>)}</h4>

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
  info: PropTypes.object,
  isFetching: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { device, routing } = state;
  const { isFetching, info, isOwner } = device;

  return {
    isFetching,
    info,
    isOwner
  };
}

export default connect(mapStateToProps)(Device);
