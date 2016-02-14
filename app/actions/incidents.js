import Constants from '../constants';

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
};

export default Actions;
