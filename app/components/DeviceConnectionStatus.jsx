import React, { Component, PropTypes } from 'react';

export default class DeviceConnectionStatus extends Component {
  render() {
    const { online } = this.props;

    return (
      <h6>Device is {online ? 'online' : 'offline'}</h6>
    );
  }
}

DeviceConnectionStatus.propTypes = {
  online: PropTypes.bool,
};
