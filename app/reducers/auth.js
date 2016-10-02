import firebase from '../lib/firebase';
import Constants from '../constants';

const initialState = userToState(firebase.auth().currentUser);

function userToState(user) {
  return {
    uid: user ? user.uid : null,
    name: user ? user.providerData[0].displayName : null,
    avatarUrl: user ? user.providerData[0].photoURL : null,
    email: user ? user.providerData[0].email : null,
    state: user ? Constants.AUTH_SIGNED_IN : Constants.AUTH_SIGNED_OUT,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.AUTH_SIGN_IN_PENDING:
      return {
        ...state,
        ...userToState(null),
        state: Constants.AUTH_SIGN_IN_PENDING,
      };
    case Constants.AUTH_SIGN_IN: {
      const user = action.payload.user;
      return {
        ...state,
        ...userToState(user),
      };
    }
    case Constants.AUTH_SIGN_OUT:
      return {
        ...state,
        ...userToState(null),
      };
    default:
      return state;
  }
}
