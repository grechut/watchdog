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
    const { info, isFetching } = this.props;
    return (
      <div className='app'>
        {(!isFetching && info) &&
          <Device info={info} />}
      </div>
    );
  }
}

App.propTypes = {
  info: PropTypes.object,
  isFetching: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { device } = state;
  const { isFetching, info } = device;

  return {
    isFetching,
    info
  };
}

export default connect(mapStateToProps)(App);
