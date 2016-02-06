import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-mdl/lib/Button';
import DeviceActions from '../actions/device';
import PageActions from '../actions/page';

class NewDevice extends Component {
  componentDidMount() {
    this.props.dispatch(PageActions.updateTitle('Add a device'));
  }

  render() {
    const { dispatch } = this.props;

    return (
      <div className="app">
        <Button raised accent ripple
          onClick={() => dispatch(DeviceActions.createDevice())}
          className="btn btn-success"
        >
          Use this device as a camera
        </Button>
      </div>
    );
  }
}

NewDevice.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(NewDevice);
