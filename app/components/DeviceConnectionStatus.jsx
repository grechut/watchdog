import React, { PropTypes } from 'react';

export default function DeviceConnectionStatus(props) {
  const { online } = props;

  return (
    <h6>Device is {online ? 'online' : 'offline'}</h6>
  );
}

DeviceConnectionStatus.propTypes = {
  online: PropTypes.bool,
};
