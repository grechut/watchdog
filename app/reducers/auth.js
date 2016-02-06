import Constants from '../constants';

const initialState = {
  uid: null,
  name: null,
  avatarUrl: null,
  email: null,
  state: Constants.AUTH_SIGNED_OUT,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.AUTH_SIGN_IN_PENDING:
      return {
        ...state,
        uid: null,
        name: null,
        avatarUrl: null,
        email: null,
        state: Constants.AUTH_SIGN_IN_PENDING,
      };
    case Constants.AUTH_SIGN_IN:
      const authData = action.payload.authData;
      return {
        ...state,
        uid: authData.uid,
        name: authData.google.displayName,
        email: authData.google.email,
        avatarUrl: authData.google.profileImageURL,
        state: Constants.AUTH_SIGNED_IN,
      };
    case Constants.AUTH_SIGN_OUT:
      return {
        ...state,
        uid: null,
        name: null,
        avatarUrl: null,
        email: null,
        state: Constants.AUTH_SIGNED_OUT,
      };
    default:
      return state;
  }
}
