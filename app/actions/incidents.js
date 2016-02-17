import Constants from '../constants';
import firebase from '../lib/firebase';

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
      const incidentsRef = firebase.child(`incidents/${deviceId}`).orderByKey().limitToLast(10);

      incidentsRef.on('child_added', (snapshot) => {
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
    const incidentsRef = firebase.child(`incidents/${deviceId}`).orderByKey().limitToLast(10);
    incidentsRef.off('child_added');
  },
};

export default Actions;
