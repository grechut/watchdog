import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDevice } from '../actions';
import Device from '../components/Device';

let hackyDeviceId = 'id1';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDevice(hackyDeviceId));
  }

  render() {
    const { device, isFetching } = this.props;
    return (
      <div>
        {(!isFetching && device) &&
          <Device device={device} />}
      </div>
    );
  }
}

App.propTypes = {
  device: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { devices } = state;
  const { isFetching, device } = devices;

  return {
    isFetching,
    device
  };
}

export default connect(mapStateToProps)(App);
