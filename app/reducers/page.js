import Constants from '../constants';

const initialState = {
  title: 'Home',
};

function page(state = initialState, action) {
  switch (action.type) {
    case Constants.UPDATE_TITLE:
      return Object.assign({}, state, {
        title: action.payload.title,
      });
    default:
      return state;
  }
}

export default page;
