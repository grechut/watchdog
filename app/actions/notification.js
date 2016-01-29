import axios from 'axios';
import Constants from '../constants';

const Actions = {
  notify(message) {
    return (dispatch, getState) => {
      dispatch({ type: Constants.NOTIFY });

      const deviceUuid = getState().device.owner;

      return axios.post('/api/notify', {
        deviceUuid,
        message,
      });
      // TODO shall we react to post in any way ? Maybe error display ?
    };
  },
};

export default Actions;
