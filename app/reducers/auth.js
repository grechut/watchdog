import Constants from '../constants';
import firebase from '../lib/firebase';

const initialState = authDataToState(firebase.getAuth());

function authDataToState(authData) {
  return {
    uid: authData ? authData.uid : null,
    name: authData ? authData.google.displayName : null,
    avatarUrl: authData ? authData.google.profileImageURL : null,
    email: authData ? authData.google.email : null,
    state: authData ? Constants.AUTH_SIGNED_IN : Constants.AUTH_SIGNED_OUT,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.AUTH_SIGN_IN_PENDING:
      return {
        ...state,
        ...authDataToState(null),
        state: Constants.AUTH_SIGN_IN_PENDING,
      };
    case Constants.AUTH_SIGN_IN:
      const authData = action.payload.authData;
      return {
        ...state,
        ...authDataToState(authData),
      };
    case Constants.AUTH_SIGN_OUT:
      return {
        ...state,
        ...authDataToState(null),
      };
    default:
      return state;
  }
}
