import React, { Component, PropTypes } from 'react';

export default class DeviceConnectionStatus extends Component {
  render() {
    const { connected } = this.props;

    return (
      <p>Device is {connected ? 'online' : 'offline'}</p>
    );
  }
}

DeviceConnectionStatus.propTypes = {
  connected: PropTypes.bool,
};
