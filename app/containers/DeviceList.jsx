import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import { FABButton, Icon } from 'react-mdl/lib';
import { Link } from 'react-router';
import DeviceActions from '../actions/devices';
import firebase from '../lib/firebase';

class DeviceList extends React.Component {
  componentDidMount() {
    const { dispatch, auth } = this.props;

    // TODO:
    // - convert to action
    // - move to onEnter/aync-props
    // Fetch user's devices from Firebase
    firebase.child(`users/${auth.uid}/devices`).on('child_added', (userDeviceSnapshot) => {
      const deviceId = userDeviceSnapshot.key();

      firebase.child(`devices/${deviceId}`).once('value', (deviceSnapshot) => {
        const device = deviceSnapshot.val();
        console.log('Received device:', device);
        dispatch(DeviceActions.receiveDevice(device));
      });
    });
  }

  componentWillUnmount() {
    // TODO:
    // - convert to action
    // - move to onLeave
    const { auth } = this.props;
    firebase.child(`users/${auth.uid}/devices`).off('child_added');
  }

  render() {
    const { dispatch, devices } = this.props;

    // TODO: convert to component
    return (
      <div>
        {(() => {
          if (Object.keys(devices).length) {
            return (
              <ul className="demo-list-item mdl-list">
                {Object.values(devices).map((device) =>
                  (
                    <li className="mdl-list__item" key={device.uid}>
                      <span className="mdl-list__item-primary-content">
                        <Link to={`/devices/${device.uid}`}>{device.name}</Link>
                      </span>
                    </li>
                  )
                )}
              </ul>
            );
          }

          return (
            <div>You don't have any devices yet.</div>
          );
        })()}

        <FABButton colored ripple onClick={() => dispatch(routeActions.push('/devices/new'))}>
          <Icon name="add" />
        </FABButton>
      </div>
    );
  }
}

DeviceList.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  devices: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
  };
}

export default connect(mapStateToProps)(DeviceList);
