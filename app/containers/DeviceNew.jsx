/* eslint react/prefer-stateless-function: "off" */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-mdl/lib/Button';

import DeviceActions from '../actions/devices';

import LayoutContainer from './LayoutContainer';

class DeviceNew extends Component {
  render() {
    const { dispatch } = this.props;

    return (
      <LayoutContainer title="Add a device">
        <div className="app">
          <Button raised accent ripple
            onClick={() => dispatch(DeviceActions.createDevice())}
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
