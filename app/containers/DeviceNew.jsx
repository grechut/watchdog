/* eslint react/prefer-stateless-function: "off" */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-mdl/lib/Button';
import Textfield from 'react-mdl/lib/Textfield';

import DeviceActions from 'actions/devices';

import LayoutContainer from 'containers/LayoutContainer';

class DeviceNew extends Component {

  constructor(props) {
    super(props);

    this.state = {
      deviceName: 'Room',
    };
  }

  createDevice() {
    const { dispatch } = this.props;

    dispatch(DeviceActions.createDevice(this.state.deviceName));
  }

  render() {
    return (
      <LayoutContainer title="Add a device">
        <div className="app">

          <Textfield
            onChange={ (e) => { this.setState({ deviceName: e.target.value }); } }
            label="Device name"
            floatingLabel
          />

          <br />

          <Button raised accent ripple
            onClick={this.createDevice.bind(this)}
            className="btn btn-success"
          >
            Use this device as a camera
          </Button>
        </div>
      </LayoutContainer>
    );
  }
}

DeviceNew.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(DeviceNew);
