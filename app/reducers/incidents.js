import Constants from '../constants';

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.INCIDENT_ADD: {
      const device = action.payload.device;
      const incident = action.payload.incident;

      return {
        ...state,
        [device.uid]: {
          ...incident,
          ...state[device.uid],
        },
      };
    }

    default:
      return state;
  }
}
