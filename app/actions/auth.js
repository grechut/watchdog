import Firebase from 'firebase';
import Constants from '../constants';

const ref = new Firebase(process.env.FIREBASE_URL);

const Actions = {
  listen() {
    return (dispatch, getState) => {
      const state = getState();

      ref.onAuth((authData) => {
        if (authData) {
          dispatch({
            type: Constants.AUTH_SIGN_IN,
            payload: { authData },
          });
        } else {
          if (state.auth.state !== Constants.AUTH_SIGNED_OUT) {
            dispatch({
              type: Constants.AUTH_SIGN_OUT,
              payload: { authData },
            });
          }
        }
      });
    };
  },

  signIn() {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_IN_PENDING,
      });

      ref.authWithOAuthPopup('google', (error) => {
        if (error) {
          dispatch({
            type: Constants.AUTH_SIGN_IN_FAILURE,
            payload: { error },
          });
        }
      }, {
        scope: 'email',
      });
    };
  },

  signOut() {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_OUT,
      });
      ref.unauth();
    };
  },
};

export default Actions;
