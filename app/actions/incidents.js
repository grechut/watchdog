import Constants from '../constants';
import firebase from '../lib/firebase';

// TODO: convert ref to a function
const Actions = {
  addIncident(device, incident) {
    return {
      type: Constants.INCIDENT_ADD,
      payload: {
        device,
        incident,
      },
    };
  },

  bindToIncidents(deviceId) {
    return (dispatch) => {
      incidentsRef(deviceId).on('child_added', (snapshot) => {
        const device = { uid: deviceId };
        const incident = {
          [snapshot.key()]: snapshot.val(),
        };

        dispatch(this.addIncident(device, incident));
      });

      return incidentsRef;
    };
  },

  unbindFromIncidents(deviceId) {
    incidentsRef(deviceId).off('child_added');
  },
};

function incidentsRef(deviceId) {
  return firebase
    .child(`incidents/${deviceId}`)
    .orderByKey()
    .limitToLast(10);
}

export default Actions;
