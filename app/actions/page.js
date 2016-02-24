import Constants from '../constants';

const Actions = {
  updateTitle(title) {
    return (dispatch) => {
      dispatch({
        type: Constants.PAGE_TITLE_SET,
        payload: { title },
      });
    };
  },
};

export default Actions;
