import React, { Component, PropTypes } from 'react';

export default class DeviceConnectionStatus extends Component {
  render() {
    const { online } = this.props;

    return (
      <p>Device is {online ? 'online' : 'offline'}</p>
    );
  }
}

DeviceConnectionStatus.propTypes = {
  online: PropTypes.bool,
};
