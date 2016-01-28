import { UPDATE_TITLE } from '../actions';

const initialState = {
  title: 'Home',
};

function page(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TITLE:
      return Object.assign({}, state, {
        title: action.payload.title,
      });
    default:
      return state;
  }
}

export default page;
