import React, { PropTypes, Component } from 'react';

export default class Device extends Component {
  render() {
    const { device } = this.props;

    return (
        <div>
          <h1>{device.mac}</h1>
          <h3>{device.id}</h3>
        </div>
    );
  }
}

Device.propTypes = {
    device: PropTypes.object.isRequired
};
