import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createDevice, updateTitle } from '../actions';
import Button from 'react-mdl/lib/Button';

class NewDevice extends Component {
  componentDidMount() {
    this.props.dispatch(updateTitle('Add a device'));
  }

  render() {
    const { dispatch } = this.props;

    return (
      <div className="app">
        <Button raised accent ripple
          onClick={() => dispatch(createDevice())}
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
