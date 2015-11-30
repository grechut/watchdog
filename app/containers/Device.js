import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice, addDeviceListener } from '../actions';

class Device extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(fetchDevice(this.props.params.deviceUuid));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.deviceUuid !== this.props.params.deviceUuid) {
      this.props.dispatch(fetchDevice(this.props.params.deviceUuid));
    }
  }

  render() {
    const { info, dispatch } = this.props;
    if (!info) return null;

    return (
      <div className='app'>
        <h1>Owner: {info.owner}</h1>
        <h4>Listeners: {info.listeners.map(x => <p>{x}</p>)}</h4>

        <button onClick={() => dispatch(addDeviceListener(this.props.params.deviceUuid))}
          className="btn btn-success">
          Listen to thid device
        </button>
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
  const { isFetching, info } = device;
  const { path } = routing;

  return {
    isFetching,
    info,
    path
  };
}

export default connect(mapStateToProps)(Device);
