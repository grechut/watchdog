import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createDevice } from '../actions';

class NewDevice extends React.Component {
  render() {
    const { dispatch } = this.props;

    return (
      <div className="app">
        <button onClick={() => dispatch(createDevice())}
          className="btn btn-success"
        >
          New device
        </button>
      </div>
    );
  }
}

NewDevice.propTypes = {
  dispatch: PropTypes.func,
};


export default connect()(NewDevice);
