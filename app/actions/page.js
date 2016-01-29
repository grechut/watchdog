import Constants from '../constants';

const Actions = {
  updateTitle(title) {
    return (dispatch) => {
      dispatch({
        type: Constants.UPDATE_TITLE,
        payload: {
          title,
        },
      });
    };
  },
};

export default Actions;
