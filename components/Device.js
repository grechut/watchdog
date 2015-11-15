import React, { PropTypes, Component } from 'react';

export default class Device extends Component {
  render() {
    const { info } = this.props;

    return (
        <div>
          <h1>MAC: {info.mac}</h1>
          <h3>ID: {info.id}</h3>
          <div id="stream">
            <p>Here video stream</p>
          </div>
        </div>
    );
  }
}

Device.propTypes = {
    info: PropTypes.object.isRequired
};
