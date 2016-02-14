import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';
import PushNotificationActions from '../actions/push-notification';
import IncidentActions from '../actions/incidents';

// Owner part
import Video from '../components/Video';

// Listener part
import firebase from '../lib/firebase';
import PushNotificationSwitch from '../components/PushNotificationSwitch';
import DetectorConfig from '../components/DetectorConfig';
import IncidentList from '../components/IncidentList';
import detectors from '../lib/detectors';

class Device extends Component {
  componentDidMount() {
    const { dispatch, params } = this.props;
    const deviceId = params.deviceUuid;

    dispatch(PageActions.updateTitle('Home'));
    dispatch(DeviceActions.fetchDevice(deviceId));

    // TODO: Convert to action
    const incidentsRef = firebase.child(`incidents/${deviceId}`).orderByKey().limitToLast(10);

    incidentsRef.on('child_added', (incidentSnapshot) => {
      const device = { uid: deviceId };
      const incident = {
        [incidentSnapshot.key()]: incidentSnapshot.val(),
      };

      dispatch(IncidentActions.addIncident(device, incident));
    });
  }

  render() {
    const deviceId = this.props.params.deviceUuid;
    const { dispatch, auth, devices, incidents, pushNotification } = this.props;
    const device = devices[deviceId];

    if (!device) { return null; }

    const incidentsForDevice = incidents[device.uid] || {};
    const isSubscribed = _.includes(
      device.pushNotificationEndpoints,
      auth.uid
    );

    return (
      <div className="app">
        <Video src={device.localStream} />
        <h3>ID: {device.uid}</h3>

        {device.isOwner ?
          Object.keys(detectors).map(key =>
            <DetectorConfig key={key} detector={detectors[key]} />
          )
        :
          <div>
            <PushNotificationSwitch
              deviceId={device.uid}
              checked={isSubscribed}
              disabled={!pushNotification.enabled}
              onChange={() =>
                dispatch(PushNotificationActions.toggleSubscriptionForDevice(device.uid))
              }
            />
          <IncidentList incidents={incidentsForDevice} />
          </div>
        }
      </div>
    );
  }
}

Device.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  auth: PropTypes.object,
  devices: PropTypes.object,
  incidents: PropTypes.object,
  pushNotification: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
    incidents: state.incidents,
    pushNotification: state.pushNotification,
  };
}

export default connect(mapStateToProps)(Device);
